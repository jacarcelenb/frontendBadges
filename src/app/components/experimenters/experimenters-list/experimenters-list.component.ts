import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { IdentificationController } from 'src/app/controllers/identification.controller';
import { AlertService } from 'src/app/services/alert.service';
import { CountriesService } from 'src/app/services/countries.service';
import { ExperimenterService } from 'src/app/services/experimenter.service';
import { Country } from 'src/interfaces/countries.interfaces';
import { AddExperimenterComponent } from '../add-experimenter/add-experimenter.component';
import { AttachExperimenterComponent } from '../attach-experimenter/attach-experimenter.component';
import { MenuItem } from 'primeng/api';
@Component({
  selector: 'app-experimenters-list',
  templateUrl: './experimenters-list.component.html',
  styleUrls: ['./experimenters-list.component.scss'],
})
export class ExperimentersListComponent implements OnInit {
  @ViewChild('addExperimenterComponent', { static: false })
  addExperimenterComponent: AddExperimenterComponent;
  @ViewChild('attachExperimenterComponent', { static: false })
  attachExperimenterComponent: AttachExperimenterComponent;
  @ViewChild('closeAddExperimenter') closeAddExperimenter: ElementRef;
  experiment_id: string;
  menu_type: string;
  experimenters = [];
  id_experimenter: string;
  id_user: string;
  pageSize = 2;
  pageSizes = [2, 4, 6, 8, 10];
  page = 1;
  count = 0;
  change_language = false;
  active = true;
  items: MenuItem[];

  @Output() saveModal: EventEmitter<any> = new EventEmitter<any>();

  countries: Country[] = [];
  genders = [
    { label: 'Masculino', value: 'Male', eng_Label: 'Male' },
    { label: 'Femenino', value: 'Female', eng_Label: 'Female' },
  ];
  user_profiles = [];
  us_profile = [];
  corresponding_author = [];
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
    private actRoute: ActivatedRoute,
    private _translateService: TranslateService,
    private _countriesService: CountriesService,
    private _alertService: AlertService,
    private formBuilder: FormBuilder,
    private _router: Router,
    private identificationController: IdentificationController,
  ) { }

  ngOnInit(): void {
    this.experiment_id = this.actRoute.parent.snapshot.paramMap.get('id');
    this.menu_type = this.actRoute.parent.snapshot.paramMap.get("menu");
    console.log(this.menu_type)
    this.getExperimenters();
    this.getCorrespondingAuthor()
    this.ValidateLanguage();
    this.getExperimentRoles();
    this.getUserProfiles();
    this.initForm();
    this.ValidateLanguage();

    this._translateService.onLangChange.subscribe(() => {
      this.ValidateLanguage()
    });

    this.items = [
      { routerLink: 'experiments' },
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/experimenters" },
      { routerLink: 'experiments/' + this.experiment_id + "/groups" },
      { routerLink: 'experiments/' + this.experiment_id + "/tasks" },
      { routerLink: 'experiments/' + this.experiment_id + "/artifacts" },
      { routerLink: 'experiments/' + this.experiment_id + "/artifacts_acm" },
      { routerLink: 'experiments/' + this.experiment_id + "/badges" },
      { routerLink: 'experiments/' + this.experiment_id + "/labpack" }
    ];

  }

  ValidateLanguage() {
    if (this._translateService.instant('LANG_SPANISH_EC') == "Espa??ol (Ecuador)") {
      this.change_language = false;
    } else {
      this.change_language = true;
    }
  }

  roles = [];
  eng_roles = [];
  language: any;

  initForm() {
    this._countriesService.getCountries().subscribe((resp: any) => {
      this.countries = resp.countries;
    });
    this.experimenterForm = this.formBuilder.group({
      identification: ['', Validators.required],
      full_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      affiliation: ['', Validators.required],
      experimenter_roles: [[], [Validators.required, Validators.minLength(1)]],
      website: [''],
      phone: [''],
      country: ['', [Validators.required]],
      profile: ['', Validators.required],
    });

    this.experimenterForm?.get('identification').valueChanges.subscribe((identification) => {
      if (this.identificationController.isValidDNI(identification))
        return this.experimenterForm?.get('identification').setErrors(null);
      if (this.identificationController.isValidDNIEC(identification))
        return this.experimenterForm?.get('identification').setErrors(null);
      this.experimenterForm?.get('identification').setErrors({ invalid: true });
    });

  }

  getCorrespondingAuthor() {
    this._experimenterService.get({
      experiment: this.experiment_id,
      corresponding_autor: true
    }).subscribe((data: any) => {
      this.corresponding_author = data.response
    })
  }

  getExperimentRoles() {
    this._experimenterService.getRoles().subscribe((data: any) => {
      this.roles = data.response;
      console.log(this.roles)
    })
  }

  getUserProfiles() {
    this._experimenterService.getUserProfiles().subscribe((data: any) => {
      this.user_profiles = data.response;
    });

  }

  getExperimenters() {
    const params = this.getRequestParams(this.page, this.pageSize);
    this._experimenterService.get({
      experiment: this.experiment_id,
      ___populate: 'experimenter_roles,user',
      ...params, admin_experiment: true
    }).subscribe((resp: any) => {
      this.experimenters = resp.response;
    });

    this._experimenterService.get({
      experiment: this.experiment_id,
      admin_experiment: true
    }).subscribe((data) => {
      console.log(data)
      this.count = data.response.length;
      console.log(this.count)
    });
  }
  showAttachExperimenter() {
    this.attachExperimenterComponent.show(this.experiment_id);
  }
  showAddExperimenter() {
    this.addExperimenterComponent.show(this._experimenterService.getHeaders()['app-language']);
    console.log(this._experimenterService.getHeaders()['app-language'])
  }



  handlePageChange(event) {
    console.log(event)
    this.page = event;
    this.getExperimenters();
  }
  handlePageSizeChange(event) {
    this.pageSize = event.target.value;
    this.page = 1;
    this.getExperimenters();
  }
  getRequestParams(page, pageSize) {
    // tslint:disable-next-line:prefer-const
    let params = {};

    if (page) {
      params[`___page`] = page;
    }

    if (pageSize) {
      params[`___size`] = pageSize;
    }
    return params;
  }


  selectExperimenter(experimenter) {
    console.log(experimenter)
    this.id_user = experimenter.user._id;
    this.id_experimenter = experimenter._id;
    this.experimenterForm.controls['identification'].setValue(experimenter.user.identification)
    this.experimenterForm.controls['full_name'].setValue(experimenter.user.full_name)
    this.experimenterForm.controls['email'].setValue(experimenter.user.email)
    this.experimenterForm.controls['affiliation'].setValue(experimenter.user.affiliation)
    this.experimenterForm.controls['experimenter_roles'].setValue(experimenter.experimenter_roles)
    this.experimenterForm.controls["website"].setValue(experimenter.user.website)
    this.experimenterForm.controls["phone"].setValue(experimenter.user.phone)
    this.experimenterForm.controls["country"].setValue(experimenter.user.country)
    this.experimenterForm.controls["profile"].setValue(experimenter.user.profile)

  }

  updateExperimenter() {
    const user = {
      identification: this.experimenterForm.value.identification,
      full_name: this.experimenterForm.value.full_name,
      country: this.experimenterForm.value.country,
      affiliation: this.experimenterForm.value.affiliation,
      phone: this.experimenterForm.value.phone,
      email: this.experimenterForm.value.email,
      profile: this.experimenterForm.value.profile,
      website: this.experimenterForm.value.website,
    };

    const experimenter_roles = this.experimenterForm.value.experimenter_roles.map(
      (experimenter_role) => experimenter_role._id,
    );


    const experimenter = {
      user: this.id_user,
      experimenter_roles: experimenter_roles,
      experiment: this.experiment_id,
    };
    this._experimenterService.updateUser(this.id_user, user).subscribe((data: any) => {

      this._experimenterService.update(this.id_experimenter, experimenter).subscribe((data: any) => {
        this._alertService.presentSuccessAlert(
          this._translateService.instant('UPDATED_EXPERIMENT')
        );
        this.close();
        this.getExperimenters()
      });
    })



  }

  deleteExperimenter(experimenter) {
    this._alertService.presentConfirmAlert(
      this._translateService.instant('WORD_CONFIRM_DELETE'),
      this._translateService.instant('CONFIRM_DELETED_EXPERIMENTER'),
      this._translateService.instant('WORD_DELETE'),
      this._translateService.instant('WORD_CANCEL'),
    ).then((status) => {
      if (status.isConfirmed) {
        this._experimenterService.deleteUser(experimenter.user._id).subscribe((data: any) => {
          this._experimenterService.delete(experimenter._id).subscribe((data: any) => {
            this._alertService.presentSuccessAlert(this._translateService.instant("DELETED_EXPERIMENTER"))
            this.getExperimenters();
          })
        })
      }
    });
  }

  Back() {
    this._router.navigate(['experiment/step/']);
  }

  Next() {
    this._router.navigate(['experiment/step/' + this.experiment_id + "/step/menu/groups"])
  }

  close() {
    this.closeAddExperimenter.nativeElement.click();
  }
}
