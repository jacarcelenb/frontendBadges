import { CreateTaskDto } from './../../../models/Input/CreateTaskDto';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from 'src/app/services/task.service';
import { AlertService } from 'src/app/services/alert.service';
import { ExperimenterService } from 'src/app/services/experimenter.service';
import { formatDate } from 'src/app/utils/formatters';
import { TranslateService } from '@ngx-translate/core';
import { Console } from 'console';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.scss'],
})
export class TaskCreateComponent implements OnInit{
  @Input() experiment_id: string;
  @Output() saveModal: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('closeTaskCreateModal') closeCreateTaskModal: ElementRef;
  @ViewChild("yes") yes: ElementRef;
  @ViewChild("no") no: ElementRef;
  active: boolean = false;
  change_language = false;
  task_id: string = null;
  taskForm: FormGroup;
  taskTypes = [];
  experimenterRoles = [];
  showLevelArtifacts = false;
  roles = [];
  isChecked = false;
  task: CreateTaskDto = new CreateTaskDto();
  actualDate =""
  public maskTime = [/[0-9]/, /\d/, ':', /[0-5]/, /\d/, ':', /[0-5]/, /\d/];
  constructor(
    private formBuilder: FormBuilder,
    private _taskService: TaskService,
    private _alertService: AlertService,
    private _experimenterService: ExperimenterService,
    private _translateService: TranslateService,
  ) {}
  ngOnInit(): void {
    this.ValidateLanguage();
    this._translateService.onLangChange.subscribe(() => {
      this.ValidateLanguage()
    });
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
  }

  ValidateLanguage() {
    if (this._translateService.instant('LANG_SPANISH_EC') == "Español (Ecuador)") {
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
    console.log(this.taskTypes)
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
      this.taskForm.get('duration').setValue(task.duration);
      this.taskForm.get('task_type').setValue(task.task_type);
      this.taskForm.get('responsible').setValue(task.responsible);
      this.taskForm.get('needsArtifact').setValue(task.needsArtifact);
      this.taskForm.get('levelArtifact').setValue(task.levelArtifact);
      this.taskForm.get('description').setValue(task.description);


    });
  }
  initForm() {
    let date = new Date();

    this.taskForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      start_date: [formatDate(date), [Validators.required]],
      end_date: ['', [Validators.required]],
      duration: ['', [Validators.required]],
      needsArtifact: [false],
      levelArtifact: [''],
      responsible: ['', [Validators.required]],
      task_type: ['', [Validators.required]],
    });
  }
  save() {
    const onSuccess = () => {
      this._alertService.presentSuccessAlert(this._translateService.instant("CREATE_TASK"));
      this.saveModal.emit(null);
      this.close();
    };

    const task = this.taskForm.value;
    task.duration = task.duration.replace(/_/ug, '0');
    task.experiment = this.experiment_id;
    task.start_date = formatDate(task.start_date, 'yyyy-MM-dd 00:00:00');
    task.end_date = formatDate(task.end_date, 'yyyy-MM-dd 23:59:59');

    if (this.task_id) {
      this._taskService.update(this.task_id, task).subscribe((data:any)=> {
        this._alertService.presentSuccessAlert(this._translateService.instant("UPDATE_TASK"));
        this.saveModal.emit(null);
        this.close();
      });
    } else {
      this._taskService.create(task).subscribe(onSuccess);
    }
  }
  close() {
    this.closeCreateTaskModal.nativeElement.click();
  }


  onChange(checked: boolean) {
    this.isChecked = checked;
    this.taskForm.value.needsArtifact = this.isChecked
  }


}
