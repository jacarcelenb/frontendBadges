import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { GroupService } from 'src/app/services/group.service';
import { CreateGroupDto } from 'src/app/models/Input/CreateGroupDto';
import { AlertService } from 'src/app/services/alert.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-group-create',
  templateUrl: './group-create.component.html',
  styleUrls: ['./group-create.component.scss'],
})
export class GroupCreateComponent implements OnInit {
  active: boolean = false;
  groupTypes: [];
  groups = [];
  groupForm: FormGroup;
  group: CreateGroupDto = new CreateGroupDto();
  @Input() experiment_id: number;
  @ViewChild('closeGroupCreateModal') closeCreateGroupModal: ElementRef;
  @Output() saveModal: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private formBuilder: FormBuilder,
    private _groupService: GroupService,
    private _alertService: AlertService,
    private _translateService: TranslateService
  ) { }
  ngOnInit(): void {
    this.init()
    this.getGroupTypes();
    this.initForm();
  }

  show() {
    this.active = true;
    this.init();
    this.getGroupTypes();
    this.initForm();
  }

  init(): void {
    const groups_query = {
      experiment: this.experiment_id,
      participants: true,
      ___populate: 'group_type experiment',
    };

    this._groupService.get(groups_query).subscribe(data => {
      this.groups = data.response;
    });


  }

  initForm() {
    this.groupForm = this.formBuilder.group({
      numParticipants: [0, [Validators.required]],
      description: ['', [Validators.required]],
      group_type: ['', Validators.required],
      experiment: ['', Validators.required],
    });
    this.groupForm.get('experiment').setValue(this.experiment_id);
  }
  getGroupTypes() {
    this._groupService.getTypes().subscribe((data) => {
      this.groupTypes = data.response
    });
  }

  ValidateGroupType(group_type): boolean {
    let findOne = false;
    for (let index = 0; index < this.groups.length; index++) {

      if (group_type == this.groups[index].group_type._id) {
        findOne = true;
      }
    }
    return findOne;
  }
  save() {

    if (this.ValidateGroupType(this.groupForm.value.group_type) == true) {
      this._alertService.presentWarningAlert(this._translateService.instant("MSG_VALIDATE_GROUP"))
    }
    else {
      if (this.groupForm.value.description.trim().length == 0) {
        this._alertService.presentWarningAlert(this._translateService.instant("VALIDATE_DESCRIPTION"))
      } else {
        if (this.groupForm.value.numParticipants > 0) {
          this._groupService.createGroup(this.groupForm.value).subscribe(
            () => {
              this.saveModal.emit(null);
              this.close();
              this.init();
            },
            (err) => {
              let message = '';
              err.error?.forEach((messageErr) => {
                message += messageErr + ' <br>';
              });
              this._alertService.presentErrorAlert(message);
            }
          );
        }else {
          this._alertService.presentWarningAlert(this._translateService.instant("VALIDATE_PARTICIPANTS_NUMBER"))
        }
      }
    }
  }
  close() {
    this.closeCreateGroupModal.nativeElement.click();
  }
}
