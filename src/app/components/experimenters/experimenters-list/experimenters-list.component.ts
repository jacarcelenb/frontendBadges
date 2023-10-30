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
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Console } from 'console';
import { ExperimentService } from 'src/app/services/experiment.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { AuthService } from 'src/app/services/auth.service';
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
  userExperiments = [];
  experimentOwner: boolean = false;
  id_experimenter: string;
  id_user: string;
  pageSize = 6;
  pageSizes = [2, 4, 6, 8, 10];
  page = 1;
  count = 0;
  change_language = false;
  active = true;
  items: MenuItem[];
  completedSteps: MenuItem[];
  completedStepSpanish: MenuItem[];
  actualExperiment: any[];
  completedExperiment: boolean = false;


  @Output() saveModal: EventEmitter<any> = new EventEmitter<any>();

  countries: Country[] = [];
  genders = [
    { label: 'Masculino', value: 'Male', eng_Label: 'Male' },
    { label: 'Femenino', value: 'Female', eng_Label: 'Female' },
    { label: 'Otro', value: 'Other', eng_Label: 'Other' },
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

  experimenterDTO = {
    identification: "",
    full_name: "",
    country: "",
    affiliation: "",
    phone: "",
    email: "",
    profile: "",
    website: "",
    experimenter_roles: [],
    experiment: "",
    password: ""
  };
  UserPassword = "";
  UserEmail = "";

  displayedColumns: string[] = ['full_name', 'email', 'roles', 'org', 'option','delete'];
  dataSource: MatTableDataSource<any>

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private _experimenterService: ExperimenterService,
    private actRoute: ActivatedRoute,
    private _translateService: TranslateService,
    private _countriesService: CountriesService,
    private _alertService: AlertService,
    private formBuilder: FormBuilder,
    private _router: Router,
    private _ExperimentService: ExperimentService,
    private identificationController: IdentificationController,
    private tokenStorageService: TokenStorageService,
    private _authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.experiment_id = this.actRoute.parent.snapshot.paramMap.get('id');
    this.menu_type = this.actRoute.parent.snapshot.paramMap.get("menu");
    this.getExperimenters();
    this.getCorrespondingAuthor()
    this.getExperimentRoles();
    this.getUserProfiles();
    this.initForm();
    this.ValidateLanguage();
    this._translateService.onLangChange.subscribe(() => {
      this.ValidateLanguage()
    });

    this.items = [
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/experimenters" },
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/experimenters" },
      { routerLink: 'experiments/' + this.experiment_id + "/groups" },
      { routerLink: 'experiments/' + this.experiment_id + "/tasks" },
      { routerLink: 'experiments/' + this.experiment_id + "/artifacts" },
      { routerLink: 'experiments/' + this.experiment_id  + "/select_badge" },
      { routerLink: 'experiments/' + this.experiment_id + "/artifacts_acm" },
      { routerLink: 'experiments/' + this.experiment_id + "/badges" },
      { routerLink: 'experiments/' + this.experiment_id + "/labpack" }
    ];

    this.completedSteps = [
      { routerLink: '/experiment/step', label: "Experiments" },
      { routerLink: "../experimenters", label: "Experimenters" },
      { routerLink: "../groups", label: "Groups" },
      { routerLink: "../tasks", label: "Tasks" },
      { routerLink: "../artifacts", label: "Artifacts" },
      { routerLink: "../select_badge", label: "ACM Badging" },
      { routerLink: "../artifacts_acm", label: "ACM Artifacts" },
      { routerLink: "../badges", label: "Evaluation Criteria" },
      { routerLink: "../labpack", label: "Labpack" },
    ];

    this.completedStepSpanish = [
      { routerLink: '/experiment/step', label: "Experimentos" },
      { routerLink: "../experimenters", label: "Experimentadores" },
      { routerLink: "../groups", label: "Grupos" },
      { routerLink: "../tasks", label: "Tareas" },
      { routerLink: "../artifacts", label: "Artefactos" },
      { routerLink: "../select_badge", label: "Insignias ACM" },
      { routerLink: "../artifacts_acm", label: "Artefactos ACM" },
      { routerLink: "../badges", label: "Criterios de evaluación" },
      { routerLink: "../labpack", label: "Paquete" },
    ];

    this.VerificateSelectedExperiment();
    this.getUserExperiments();


  }

  showIconExperimenter(experiment_rol): string {
    let icon = "\u2705"
    return icon + experiment_rol;
  }

  getUserExperiments() {
    this._ExperimentService.getExperimentsUser().subscribe((data: any) => {
      this.userExperiments = data.response
       console.log(this.userExperiments)
      this.experimentOwner = this.validateExperimentOwner(this.experiment_id)

    })
  }

  validateExperimentOwner(experiment_id: string): boolean {
    let experimenterOwner = false;
    for (let index = 0; index < this.userExperiments.length; index++) {

      if (this.userExperiments[index] == experiment_id) {
        experimenterOwner = true;
      }
    }

    return experimenterOwner

  }


  ValidateLanguage() {
    if (this._translateService.instant('LANG_SPANISH_EC') == "Español (ECU)") {
      this.change_language = false;
    } else {
      this.change_language = true;
    }
  }

  VerificateSelectedExperiment() {
    if (this.tokenStorageService.getIdExperiment()) {
      this.experiment_id = this.tokenStorageService.getIdExperiment();
      this.completedExperiment = (this.tokenStorageService.getStatusExperiment() == "true")
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
      identification: [''],
      full_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      affiliation: ['', Validators.required],
      experimenter_roles: [[], [Validators.required, Validators.minLength(1)]],
      website: [''],
      phone: [''],
      gender: [''],
      country: [''],
      profile: ['', Validators.required],
      corresponding_autor: [false],

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

  getActualExperiment() {
    this._ExperimentService.get({ _id: this.experiment_id }).subscribe((data: any) => {
      this.actualExperiment = data.response
      this.completedExperiment = this.actualExperiment[0].completed
    })
  }

  getExperimentRoles() {
    this._experimenterService.getRoles().subscribe((data: any) => {
      this.roles = data.response;

    })
  }

  getUserProfiles() {
    this._experimenterService.getUserProfiles().subscribe((data: any) => {
      this.user_profiles = data.response;
    });

  }

  getExperimenters() {
    this._experimenterService.get({
      experiment: this.experiment_id,
      ___populate: 'experimenter_roles,user',
      ___sort: '-createdAt',
      admin_experiment: true
    }).subscribe((resp: any) => {

      this.experimenters = []
      for (let index = 0; index < resp.response.length; index++) {
        const experimenterDTO = {
          experimenter_id: "",
          id: "",
          identification: "",
          full_name: "",
          country: "",
          affiliation: "",
          phone: "",
          email: "",
          profile: "",
          website: "",
          gender: "",
          experimenter_roles: [],
          experiment: "",
          corresponding_autor: false,
          password: ""
        }
        experimenterDTO.experimenter_id = resp.response[index]._id
        experimenterDTO.id = resp.response[index].user._id
        experimenterDTO.full_name = resp.response[index].user.full_name
        experimenterDTO.email = resp.response[index].user.email
        experimenterDTO.country = resp.response[index].user.country
        experimenterDTO.affiliation = resp.response[index].user.affiliation
        experimenterDTO.phone = resp.response[index].user.phone
        experimenterDTO.identification = resp.response[index].user.identification
        experimenterDTO.profile = resp.response[index].user.profile
        experimenterDTO.website = resp.response[index].user.website
        experimenterDTO.gender = resp.response[index].user.gender
        experimenterDTO.experimenter_roles = resp.response[index].experimenter_roles
        experimenterDTO.experiment = resp.response[index].experiment
        experimenterDTO.corresponding_autor = resp.response[index].corresponding_autor
        experimenterDTO.password = resp.response[index].user.password;
        this.experimenters.push(experimenterDTO)

      }

      this.dataSource = new MatTableDataSource<any>(this.experimenters);
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator._intl = new MatPaginatorIntl()
      this.dataSource.paginator._intl.itemsPerPageLabel = ""

    });

    this._experimenterService.get({
      experiment: this.experiment_id,
      admin_experiment: true
    }).subscribe((data) => {

      this.count = data.response.length;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }



  showAttachExperimenter() {
    this.attachExperimenterComponent.show(this.experiment_id);
  }
  showAddExperimenter() {
    this.addExperimenterComponent.show(this._experimenterService.getHeaders()['app-language']);
  }



  handlePageChange(event) {
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
    this.getCorrespondingAuthor();
    this.id_user = experimenter.id;
    this.id_experimenter = experimenter.experimenter_id;
    this.experimenterForm.controls['full_name'].setValue(experimenter.full_name)
    this.experimenterForm.controls['email'].setValue(experimenter.email)
    this.experimenterForm.controls['affiliation'].setValue(experimenter.affiliation)
    this.experimenterForm.controls['experimenter_roles'].setValue(experimenter.experimenter_roles)
    this.experimenterForm.controls["website"].setValue(experimenter.website)
    this.experimenterForm.controls["profile"].setValue(experimenter.profile)
    this.experimenterForm.controls["gender"].setValue(experimenter.gender)
    this.experimenterForm.controls["corresponding_autor"].setValue(experimenter.corresponding_autor)
    this.UserEmail = experimenter.email;
    this.UserPassword = experimenter.password;
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
      gender: this.experimenterForm.value.gender,
    };

    const experimenter_roles = this.experimenterForm.value.experimenter_roles.map(
      (experimenter_role) => experimenter_role._id,
    );
    const experimenter = {
      user: this.id_user,
      experimenter_roles: experimenter_roles,
      experiment: this.experiment_id,
      corresponding_autor: this.experimenterForm.value.corresponding_autor
    };
    if (this.corresponding_author.length > 0 && experimenter.corresponding_autor == true
      && this.corresponding_author[0]._id != this.id_experimenter) {
      this._alertService.presentWarningAlert(this._translateService.instant("VALIDATE_CORRESPONDING_AUTHOR"));

    } else {

      this._experimenterService.updateUser(this.id_user, user).subscribe((data: any) => {

        this._experimenterService.update(this.id_experimenter, experimenter).subscribe((data: any) => {
          this._alertService.presentSuccessAlert(
            this._translateService.instant('UPDATED_EXPERIMENT')
          );
          if (this.UserEmail == user.email) {
            this.getExperimenters()
            this.close();
          } else {
            let newEmail = user.email;
            this._authService.updateUserFirebase({
              email: this.UserEmail,
              newemail: newEmail
            })
              .subscribe((data: any) => {
                this.getExperimenters()
                this.close();

              })
          }

        });
      })
    }



  }

  deleteExperimenter(experimenter) {
    let id_experimenter = experimenter.experimenter_id;
    const experimenterData = {
      user:experimenter.id,
      experimenter_roles:experimenter.experimenter_roles,
      experiment: experimenter.experimenter_id,
      admin_experiment:false,
      corresponding_autor: experimenter.corresponding_autor

    };


    this._alertService.presentConfirmAlert(
      this._translateService.instant('WORD_CONFIRM_DELETE'),
      this._translateService.instant('CONFIRM_DELETED_EXPERIMENTER'),
      this._translateService.instant('WORD_DELETE'),
      this._translateService.instant('WORD_CANCEL'),
    ).then((status) => {
      if (status.isConfirmed) {

          this._experimenterService.update(id_experimenter, experimenterData).subscribe((data: any) => {
            this._alertService.presentSuccessAlert(this._translateService.instant("DELETED_EXPERIMENTER"))
            this.getExperimenters();
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
