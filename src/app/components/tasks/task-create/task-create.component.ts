import { CreateTaskDto } from './../../../models/Input/CreateTaskDto';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from 'src/app/services/task.service';
import { AlertService } from 'src/app/services/alert.service';
import { ExperimenterService } from 'src/app/services/experimenter.service';
import { formatDate } from 'src/app/utils/formatters';
import { TranslateService } from '@ngx-translate/core';
import { Console } from 'console';
import { InputTimeComponent } from '../../generic/input-time/input-time.component';



@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.scss'],
})
export class TaskCreateComponent implements OnInit {
  @Input() experiment_id: string;
  @Output() saveModal: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('closeTaskCreateModal') closeCreateTaskModal: ElementRef;
  @ViewChild("yes") yes: ElementRef;
  @ViewChild("no") no: ElementRef;
  active: boolean = false;
  @ViewChild(InputTimeComponent) inputime;
  change_language = false;
  task_id: string = null;
  taskForm: FormGroup;
  taskTypes = [];
  experimenterRoles = [];
  showLevelArtifacts = false;
  roles = [];
  isChecked = false;
  numTasks = 0;
  minDate: string;
  startDate: Date;
  endDate: Date;
  validateDate: boolean = false;
  task: CreateTaskDto = new CreateTaskDto();
  public maskTime = [/[0-9]/, /\d/, ':', /[0-5]/, /\d/, ':', /[0-5]/, /\d/];
  constructor(
    private formBuilder: FormBuilder,
    private _taskService: TaskService,
    private _alertService: AlertService,
    private _experimenterService: ExperimenterService,
    private _translateService: TranslateService,
  ) { }


  ngOnInit(): void {
    this.ValidateLanguage();
    this._translateService.onLangChange.subscribe(() => {
      this.ValidateLanguage()
    });
  }

  getTotalTasks() {
    this._taskService.getNumtasks({ experiment: this.experiment_id }).subscribe(task => {
      this.numTasks = task.response
    })
  }


  show(task_id: string = null): void {
    this.initForm();
    this.active = true;
    this.task_id = task_id;

    this.loadDataForm(() => {
      if (task_id) {
        this.loadTaskEdit(task_id);
      }
    });
    this.getTotalTasks();
  }

  ValidateLanguage() {
    if (this._translateService.instant('LANG_SPANISH_EC') == "Español (ECU)") {
      this.change_language = false;
    } else {
      this.change_language = true;
    }
  }
  async loadDataForm(doneCallback: () => void) {
    const [experimenter_roles, task_types] = await Promise.all([
      this._experimenterService.getRoles().toPromise(),
      this._taskService.getTypes().toPromise(),
    ]);

    this.experimenterRoles = experimenter_roles.response;
    this.taskTypes = task_types.response;
    doneCallback();
  }
  loadTaskEdit(task_id: string) {
    this._taskService.get({
      _id: task_id,
      experiment: this.experiment_id,
    }).subscribe((data) => {
      if (data.response.length === 0) {
        this.task_id = null;
        return;
      }
      const task = data.response[0];
      task.start_date = formatDate(task.start_date);
      task.end_date = formatDate(task.end_date);

      this.taskForm.get('name').setValue(task.name);
      this.taskForm.get('start_date').setValue(task.start_date);
      this.taskForm.get('end_date').setValue(task.end_date);
      this.inputime.SetDate(task.duration);
      this.taskForm.get('task_type').setValue(task.task_type);
      this.taskForm.get('responsible').setValue(task.responsible);
      this.taskForm.get('needsArtifact').setValue(task.needsArtifact);
      this.taskForm.get('levelArtifact').setValue(task.levelArtifact);
      this.taskForm.get('description').setValue(task.description);

      if (this.task_id != null) {
        this.isChecked = task.needsArtifact;
        if (this.isChecked) {
          this.yes.nativeElement.checked = true
        } else {
          this.no.nativeElement.checked = true
        }
      }


    });
  }
  initForm() {
    this.taskForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      duration: [''],
      needsArtifact: [false],
      levelArtifact: [''],
      responsible: ['', [Validators.required]],
      task_type: ['', [Validators.required]],
    });
    this.isChecked = false;
    this.validateDate = false;

  }

  resetDuration(): void {
    this.inputime.SetDate("0:0:0");
  }
  save() {
    const onSuccess = () => {
      this._alertService.presentSuccessAlert(this._translateService.instant("CREATE_TASK"));
      this.saveModal.emit(null);
      this.resetDuration();
      this.close();
    };

    const task = this.taskForm.value;
    task.acronym = this.generateAcronymTask(this.numTasks);
    task.experiment = this.experiment_id;
    task.duration = this.inputime.GetDate();
    task.start_date = formatDate(task.start_date, 'yyyy-MM-dd 00:00:00');
    task.end_date = formatDate(task.end_date, 'yyyy-MM-dd 23:59:59');

    if (this.task_id) {
      if (!this.validateDate) {
        this._taskService.update(this.task_id, task).subscribe((data: any) => {
          this._alertService.presentSuccessAlert(this._translateService.instant("UPDATE_TASK"));
          this.saveModal.emit(null);
          this.resetDuration();
          this.close();
        });
      }else {
        this._alertService.presentWarningAlert(this._translateService.instant("VALIDATE_DATE_01"))
      }
    } else {
      if (!this.validateDate) {
        this._taskService.create(task).subscribe(onSuccess)
      }else {
        this._alertService.presentWarningAlert(this._translateService.instant("VALIDATE_DATE_01"))
      }
    }
  }
  close() {
    this.closeCreateTaskModal.nativeElement.click();
  }


  onChange(checked: boolean) {
    this.isChecked = checked;
    this.taskForm.value.needsArtifact = this.isChecked
  }


  ValidateDate() {
    this.startDate = new Date(formatDate(this.taskForm.value.start_date, 'yyyy-MM-dd'));
    this.endDate = new Date(formatDate(this.taskForm.value.end_date, 'yyyy-MM-dd'));
    if (this.endDate < this.startDate) {
      this.validateDate = true;
    }else {
      this.validateDate = false;
    }
  }


  generateAcronymTask(value: any): string {
    let resp = ""
    if (value <= 10 && value <= 99) {
      resp = "T00" + (value + 1)
    }
    else {
      resp = "T" + (value + 1)
    }
    return resp

  }


}
