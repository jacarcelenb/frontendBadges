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
  //autocomplete
  @ViewChild('autocomplete') autocomplete;
  @Output() saveModal: EventEmitter<any> = new EventEmitter<any>();

  searchText: string = '';
  keyword = 'email';
  change_language = false;
  registered = false;
  data = [];
  allExperimenters = []
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
  ) { this.initForm(); }
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
    this.getExperimentRoles();
    this.getExperimenters();
    this.getAllExperimenters();
    if (this.autocomplete != undefined) {
      this.autocomplete.clear();
    }
    this.experimenterForm.controls['user'].setValue('');
    this.experimenterForm.controls['experimenter_roles'].setValue([]);
  }
  initForm() {
    this.experimenterForm = this._formBuilder.group({
      user: [''],
      experimenter_roles: [[], [Validators.required]]
    });

  }

  getAllExperimenters() {
    this._experimenterService.get({ experiment: this.experiment_id }).subscribe((data: any) => {
      this.allExperimenters = data.response
    }
    )
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
      admin_experiment: true,
      experimenter_roles,
    };

    const onSuccessRegister = (resp: any) => {
      this._alertService.presentSuccessAlert(this._translateService.instant("USER_CONECTED"));
      this.saveModal.emit(null);
      this.close();
    };

    const onErrorRegister = (err) => {
      let message = err.error?.join(' <br>') ?? "";
      this._alertService.presentErrorAlert(message);
    }
    if (this.validateUserId()) {
      this._alertService.presentWarningAlert(this._translateService.instant("WORD_SEARCH_NO_MATCHS_FOUND"));
    } else if (this.ValidateRegisteredExperimenter(this.experimenterForm.value.user)) {
      this._alertService.presentWarningAlert(this._translateService.instant("USER_ALREADY_CONECTED"));
    } else {
      this._experimenterService.create(experimenter).
        subscribe(onSuccessRegister, onErrorRegister);
    }


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

  // Method to validate if the user's id is registered
  validateUserId(): boolean {
    return this.experimenterForm.value.user.length == 0
  }

  // Method to validate if the experimenter is already registered
  ValidateRegisteredExperimenter(user): boolean {
    let registered = false;
    for (let i = 0; i < this.allExperimenters.length; i++) {
      if (this.allExperimenters[i].user == user) {
        registered = true;
      }
    }
    return registered;
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
