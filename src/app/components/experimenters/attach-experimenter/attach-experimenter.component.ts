import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { AlertService } from 'src/app/services/alert.service';
import { ExperimenterService } from 'src/app/services/experimenter.service';

@Component({
  selector: 'app-attach-experimenter',
  templateUrl: './attach-experimenter.component.html',
  styleUrls: ['./attach-experimenter.component.scss']
})
export class AttachExperimenterComponent implements OnInit {
  active = false;
  @ViewChild('closeAttachExperimenter') closeAttachExperimenter: ElementRef;
  @Output() saveModal: EventEmitter<any> = new EventEmitter<any>();

  searchText: string = '';
  keyword = 'email';
  change_language = false;
  data = [];
  roles = [];
  role_id: number;
  experiment_id: string;
  experimenterForm: FormGroup;
  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: '_id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };


  dropdownEnGSettings: IDropdownSettings = {
    singleSelection: false,
    idField: '_id',
    textField: 'eng_name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };
  constructor(
    private _experimenterService: ExperimenterService,
    private _alertService: AlertService,
    private _formBuilder: FormBuilder,
    private _translateService: TranslateService,
  ) {    this.initForm();}
  ngOnInit(): void {

    this.getExperimentRoles();
    this.getExperimenters();
    this.ValidateLanguage();
    this._translateService.onLangChange.subscribe(() => {
      this.ValidateLanguage()
    });
  }
  show(experiment_id: string) {
    this.experiment_id = experiment_id;
    this.active = true;
    this.initForm();
    this.getExperimentRoles();
    this.getExperimenters();
    this.experimenterForm.get('user').setValue('');
    this.experimenterForm.get('experimenter_roles').setValue('');
  }
  initForm() {
    this.experimenterForm = this._formBuilder.group({
      user: ['', Validators.required],
      experimenter_roles: [[], [Validators.required]]
    });

    this.experimenterForm.get('experimenter_roles').valueChanges.subscribe((experimenter_roles) => {
      if (!experimenter_roles.length)
        this.experimenterForm.get('experimenter_roles').setErrors({ required: true });
      else
        this.experimenterForm.get('experimenter_roles').setErrors(null);
    })
  }

  ValidateLanguage() {
    if (this._translateService.instant('LANG_SPANISH_EC') == "Español (ECU)") {
      this.change_language = false;
    } else {
      this.change_language = true;
    }
  }
  save() {
    const experimenter_roles = this.experimenterForm.value.experimenter_roles.map(
      (role) => role._id
    );

    const experimenter = {
      user: this.experimenterForm.value.user,
      experiment: this.experiment_id,
      admin_experiment:true,
      experimenter_roles,
    };

    const onSuccessRegister = (resp: any) => {
      this._alertService.presentSuccessAlert(resp.message);
      this.saveModal.emit(null);
      this.close();
    };

    const onErrorRegister = (err) => {
      let message = err.error?.join(' <br>') ?? "";
      this._alertService.presentErrorAlert(message);
    }

    this._experimenterService.create(experimenter).
    subscribe(onSuccessRegister, onErrorRegister);
  }
  close() {
    this.closeAttachExperimenter.nativeElement.click();
  }

  getExperimenters() {
    this._experimenterService.getUsers({
      email: this.searchText
    }).subscribe((data) => {
      this.data = data.response;
    });
  }
  selectUser(user) {
    this.experimenterForm.get('user').setValue(user._id);
  }
  onClear() {
    this.searchText = '';
    this.experimenterForm.get('user').setValue('');
    this.getExperimenters();
  }
  getExperimentRoles() {
    this._experimenterService.getRoles().subscribe((data: any) => {
      this.roles = data.response;
    });
  }
  onChangeSearch(val: string) {
    this.searchText = val;
    this.getExperimenters();
  }
}
