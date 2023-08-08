import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExperimentService } from 'src/app/services/experiment.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CreateExperimentDto } from 'src/app/models/Input/CreateExperimentDto';
import { AlertService } from 'src/app/services/alert.service';
import { CountriesService } from 'src/app/services/countries.service';
import type { Country, CountryState } from 'src/interfaces/countries.interfaces';
import type { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { formatDate } from 'src/app/utils/formatters';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/services/auth.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { ExperimenterService } from 'src/app/services/experimenter.service';

@Component({
  selector: 'app-experiment-list',
  templateUrl: './experiment-list.component.html',
  styleUrls: ['./experiment-list.component.scss'],
})
export class ExperimentListComponent implements OnInit, AfterViewInit {
  currentIndex = -1;
  name = '';
  experiments = [];
  ActualExperimenter = [];
  userExperiments = [];
  currentExperiment;
  id_experiment: string;
  Experiment_Id: string;
  stepValue: string;
  page = 1;
  count = 0;
  pageSize = 5;
  pageSizes = [5, 10, 15];
  active: boolean = true;
  styleSelect: boolean = true;
  experimentForm: FormGroup;
  stepMenu: boolean = false;
  selectedExperiment: boolean = false;
  gqmObjectiveForm: FormGroup;
  @ViewChild('closeExperimentCreateModal') closeAddExpenseModal: ElementRef;

  @ViewChild('helpModalOne') helpModalOne:ElementRef;
  subscriptions: Subscription[] = [];
  items: MenuItem[];
  completedSteps: MenuItem[];
  completedStepSpanish: MenuItem[];
  countries: Country[] = [];
  countries_states: CountryState[] = [];
  avaliable_states: CountryState[] = [];
  experiment: CreateExperimentDto = new CreateExperimentDto();
  is_gqm_objective = false;
  show: boolean = true
  isChecked: boolean = false;
  isCheckedSoftware: boolean = false;
  isCheckedSourceCode: boolean = false;
  completedExperiment: boolean = false;

  gqmHints = {
    analyse: "GQM_HINTS_ANALYSE",
    purposeOf: "GQM_HINTS_PURPOSE",
    respectTo: "GQM_HINTS_RESPECT",
    viewPointOf: "GQM_HINTS_VIEWPOINT",
    inTheContextOf: "GQM_HINTS_CONTEXT",
  };
  change_language: boolean = false;
  select_id: any;
  displayedColumns: string[] = ['name', 'country', 'created_date', 'option', 'select'];
  dataSource: any
  oldPathImage: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('profilephoto') profilephoto: ElementRef;
  user = {
    _id:"",
    full_name: "",
  }

  ruta : string = "../../../assets/images/1486564400-account_81513.png"
display: any;
  constructor(
    private _experimentService: ExperimentService,
    private _router: Router,
    private formBuilder: FormBuilder,
    private _alertService: AlertService,
    private _countriesService: CountriesService,
    private _translateService: TranslateService,
    private actRoute: ActivatedRoute,
    private _authService: AuthService,
    private tokenStorageService: TokenStorageService,
    private experimenterService: ExperimenterService,
  ) { }

  ngOnInit(): void {
    this.user = this.tokenStorageService.getUser();
    this.getExperiments();

    this.stepValue = this.actRoute.parent.snapshot.paramMap.get("step");
    this.initForm();
    this.ValidateLanguage();
    this._translateService.onLangChange.subscribe(() => {
      this.ValidateLanguage()
    });


    this.items = [
      { routerLink: 'experiment/step' },
      { routerLink: 'experiments/' + "/experimenters" },
      { routerLink: 'experiments/' + "/groups" },
      { routerLink: 'experiments/' + "/tasks" },
      { routerLink: 'experiments/' + "/artifacts" },
      { routerLink: 'experiments/' + "/artifacts_acm" },
      { routerLink: 'experiments/' + "/badges" },
      { routerLink: 'experiments/' + "/labpack" }
    ];


    this.VerificateSelectedExperiment();


  }

  ngAfterViewInit(): void {
    this.getUser(this.user._id)
  }



  getUser(id_user: any) {
    this.experimenterService.getUsers({ _id: id_user }).subscribe((data: any) => {
      console.log(data.response[0])
      this.oldPathImage = data.response[0].userphoto
      this.VerifyUserHasPhoto()
    })
  }


  VerifyUserHasPhoto() {
    if (this.oldPathImage.length > 0) {
       this.ruta = this.oldPathImage
    } else {
      this.ruta = "../../../assets/images/1486564400-account_81513.png";
    }
  }
  VerificateSelectedExperiment() {
    if (this.tokenStorageService.getIdExperiment()) {
      this.select_id = this.tokenStorageService.getIdExperiment();
      this.completedExperiment = (this.tokenStorageService.getStatusExperiment() == "true")
      this.completedSteps = [
        { routerLink: './', label:"Experiments" },
        { routerLink: this.select_id + "/step/menu/experimenters", label:"Experimenters"},
        { routerLink: this.select_id + "/step/menu/groups", label:"Groups" },
        { routerLink: this.select_id + "/step/menu/tasks", label:"Tasks" },
        { routerLink: this.select_id + "/step/menu/artifacts", label:"Artifacts"},
        { routerLink: this.select_id + "/step/menu/artifacts_acm", label: "ACM Artifacts"},
        { routerLink: this.select_id + "/step/menu/badges", label: "Badges" },
        { routerLink: this.select_id + "/step/menu/labpack", label:"Labpack" },
      ];

      this.completedStepSpanish = [
        { routerLink: './', label:"Experimentos" },
        { routerLink: this.select_id + "/step/menu/experimenters", label: "Experimentadores" },
        { routerLink: this.select_id + "/step/menu/groups", label: "Grupos" },
        { routerLink: this.select_id + "/step/menu/tasks", label: "Tareas" },
        { routerLink: this.select_id + "/step/menu/artifacts", label: "Artefactos"},
        { routerLink: this.select_id + "/step/menu/artifacts_acm", label: "Artefactos ACM"},
        { routerLink: this.select_id + "/step/menu/badges", label:"Insignias" },
        { routerLink: this.select_id + "/step/menu/labpack", label: "Paquete"},
      ];
      console.log(this.select_id)
      console.log(this.completedExperiment)
    }
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  getActualExperimenter(){
   this.experimenterService.get().subscribe((data:any)=>{
      this.ActualExperimenter = data.response
   })
  }

  getUserExperiments(){
    this._experimentService.getExperimentsUser().subscribe((data:any)=>{
       this.userExperiments = data.response
    })
  }

  validateExperimentOwner(experiment_id: string): boolean{
    let experimenterOwner = false;
    for (let index = 0; index < this.userExperiments.length; index++) {

      if (this.userExperiments[index]== experiment_id) {
          experimenterOwner = true;
      }
    }

    return experimenterOwner

  }


  ValidateLanguage() {
    if (this._translateService.instant('LANG_SPANISH_EC') == "Español (ECU)") {
      this.change_language = false;
      console.log(this.change_language)
    } else {
      this.change_language = true;
    }
  }

  showHelpModal(){
    this.helpModalOne.nativeElement.click();
  }

  colapseMenu() {
    this.show = false
  }

  OpenMenu() {
    this.show = true
  }

  logout() {
    this._authService.logout()
  }


  checkStepMenu() {

    this._router.navigate(['experiment/step']);
  }
  hideStepMenu() {
    this._router.navigate(['experiments/']);
  }
  getIdExperiment(experiment) {
    this.completedExperiment = experiment.completed
    this.select_id = experiment._id;
    this.show = false
    this.tokenStorageService.saveExperimentId(this.select_id, this.completedExperiment)
    this.completedSteps = [
      { routerLink: './', label: "Experiments" },
      { routerLink: this.select_id + "/step/menu/experimenters", label: "Experimenters" },
      { routerLink: this.select_id + "/step/menu/groups", label: "Groups" },
      { routerLink: this.select_id + "/step/menu/tasks", label: "Tasks" },
      { routerLink: this.select_id + "/step/menu/artifacts", label: "Artifacts" },
      { routerLink: this.select_id + "/step/menu/artifacts_acm", label: "Artifacts ACM" },
      { routerLink: this.select_id + "/step/menu/badges", label: "Badges" },
      { routerLink: this.select_id + "/step/menu/labpack", label: "Labpack" },
    ];
    this.selectedExperiment = true
    this._alertService.presentSuccessAlert(this._translateService.instant("EXP_SELECTED"))
  }
  Next() {
    if (this.select_id == undefined) {
      this._alertService.presentWarningAlert(this._translateService.instant("MSG_SELECT_EXPERIMENT"))
    } else {
      this._router.navigate(['experiment/step/' + this.select_id + "/step/menu/experimenters"]);
    }

  }

  gotoHome() {
    this._router.navigate(['/home'])
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log(filterValue)
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource)
  }

  gotoExperiments() {
    this._router.navigate(['/experiment/step'])
  }
  selectExperiment(experiment) {
    this.id_experiment = experiment._id;

    this.experimentForm.controls['name'].setValue(experiment.name)
    this.experimentForm.controls['country'].setValue(experiment.country)
    this.experimentForm.controls['doi_code'].setValue(experiment.doi_code)
    if (experiment.objective == null && this.change_language == false) {
      this.experimentForm.controls['objective'].setValue("El experimento no tiene objectivo")
    }
    else if (experiment.objective == null && this.change_language == true) {
      this.experimentForm.controls['objective'].setValue("The experiment doesn't have objective")
    } else {
      this.experimentForm.controls['objective'].setValue(experiment.objective)
    }
    this.experimentForm.controls['description'].setValue(experiment.description)
    this.experimentForm.controls['justification'].setValue(experiment.justification)
    this.isChecked = experiment.has_scripts
    this.isCheckedSoftware = experiment.has_software
    this.isCheckedSourceCode = experiment.has_source_code
    this.experimentForm.controls['created_date'].setValue(formatDate(experiment.created_date))
    this.experimentForm.controls['justification'].setValue(experiment.reason)
    if (experiment.gqm_objective == null) {
      this.gqmObjectiveForm.controls['objective_analyze'].setValue("")
      this.gqmObjectiveForm.controls['with_purpose'].setValue("")
      this.gqmObjectiveForm.controls['with_respect_that'].setValue("")
      this.gqmObjectiveForm.controls['with_viewpoint'].setValue("")
      this.gqmObjectiveForm.controls['in_the_context_of'].setValue("")
    } else {
      this.gqmObjectiveForm.controls['objective_analyze'].setValue(experiment.gqm_objective.objective_analyze)
      this.gqmObjectiveForm.controls['with_purpose'].setValue(experiment.gqm_objective.with_purpose)
      this.gqmObjectiveForm.controls['with_respect_that'].setValue(experiment.gqm_objective.with_respect_that)
      this.gqmObjectiveForm.controls['with_viewpoint'].setValue(experiment.gqm_objective.with_viewpoint)
      this.gqmObjectiveForm.controls['in_the_context_of'].setValue(experiment.gqm_objective.in_the_context_of)
    }


  }
  updateExperiment() {

    const experiment = new CreateExperimentDto();
    experiment.name = this.experimentForm.get('name').value;
    experiment.country = this.experimentForm.get('country').value;
    experiment.country_state = this.experimentForm.get('country_state').value;
    experiment.doi_code = this.experimentForm.get('doi_code').value;
    experiment.description = this.experimentForm.get('description').value;
    experiment.has_scripts = this.isChecked;
    experiment.has_software = this.isCheckedSoftware;
    experiment.has_source_code = this.isCheckedSourceCode;
    experiment.reason = this.experimentForm.get('justification').value;
    experiment.created_date = this.experimentForm.get('created_date').value;


    if (this.is_gqm_objective) {
      experiment.gqm_objective = this.gqmObjectiveForm.value;
      experiment.objective = null;
    } else {
      experiment.objective = this.experimentForm.get('objective').value;
      experiment.gqm_objective = null;
    }
    this._experimentService.update(this.id_experiment, experiment).subscribe((data: any) => {
      this._alertService.presentSuccessAlert(this._translateService.instant("UPDATED_EXPERIMENT"))
      this.getExperiments();
      this.close()

    })
  }

  deleteExperiment(id) {
    this._alertService.presentConfirmAlert(
      this._translateService.instant('WORD_CONFIRM_DELETE'),
      this._translateService.instant('CONFIRM_DELETED_EXPERIMENT'),
      this._translateService.instant('WORD_DELETE'),
      this._translateService.instant('WORD_CANCEL'),
    ).then((status) => {
      if (status.isConfirmed) {
        this._experimentService.delete(id).subscribe((data: any) => {
          this._alertService.presentSuccessAlert(this._translateService.instant("DELETED_EXPERIMENT"))
          this.getExperiments();
        })
      }
    });
  }


  handlePageChange(event) {
    this.page = event;
    this.getExperiments();
  }

  handlePageSizeChange(event) {
    this.pageSize = event.target.value;
    this.page = 1;
    this.getExperiments();
  }

  initForm() {
    this.experimentForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      country: ['', [Validators.required]],
      country_state: ['', [Validators.required]],
      doi_code: null,
      objective: ['', [Validators.required]],
      description: ['', [Validators.required]],
      justification: ['', [Validators.required]],
      has_scripts: [true, [Validators.required]],
      has_software: [true, [Validators.required]],
      has_source_code: [true, [Validators.required]],
      created_date: [Date.now(), Validators.required],
    });

    this.gqmObjectiveForm = this.formBuilder.group({
      objective_analyze: ['', [Validators.required]],
      with_purpose: ['', [Validators.required]],
      with_respect_that: ['', [Validators.required]],
      with_viewpoint: ['', [Validators.required]],
      in_the_context_of: ['', [Validators.required]],
    })

    /** Handle country changes for filter country states */
    this.subscriptions.push(
      this.experimentForm.get('country').valueChanges.subscribe((country) => {
        this.experimentForm.controls.country_state.setValue('');

        this.avaliable_states = this.countries_states.filter(state => {
          return state.country_name.includes(country);
        });
      })
    );
  }
  setIsGQMObjective(is_gqm_objective: boolean) {
    this.is_gqm_objective = is_gqm_objective;
  }
  toggleField(field: string) {
    if (this.experimentForm.controls[field]) {
      const prev = this.experimentForm.controls[field].value;
      this.experimentForm.controls[field].setValue(!prev);
    }
  }
  canSubmitTheForm(): boolean {
    if (this.is_gqm_objective) {
      this.experimentForm.controls.objective.setValidators([]);
      this.experimentForm.controls.objective.updateValueAndValidity();
      return (this.experimentForm.valid && this.gqmObjectiveForm.valid);
    }
    this.experimentForm.controls.objective.setValidators([Validators.required]);
    this.experimentForm.controls.objective.updateValueAndValidity();
    return this.experimentForm.valid;
  }
  getExperiments() {
    const params = this.getRequestParams(this.page, this.pageSize);
    this._experimentService.get({
      ___sort: '-createdAt'
    }).subscribe((data) => {
      this.experiments = data.response;
      this.dataSource = new MatTableDataSource<any>(this.experiments);
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator._intl = new MatPaginatorIntl()
      this.dataSource.paginator._intl.itemsPerPageLabel = ""
    });

    this.getUserExperiments();
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
  setActiveExperiment(experiment, index): void {
    this.currentExperiment = experiment;
    this.currentIndex = index;
  }
  goToDetails(experiment_id: any) {
    this.Experiment_Id = experiment_id;
    if (this.Experiment_Id.length > 0) {
      this.selectedExperiment = true
    } else {
      this.selectedExperiment = false
    }
  }

  showDetails() {
    this._router.navigate(['experiments/' + this.Experiment_Id]);
  }

  close() {
    this.closeAddExpenseModal.nativeElement.click();
  }
  searchName(): void {
    // this.shopService.findByTitle(this.name)
    //   .subscribe(
    //     data => {
    //       this.shops = data.shops;

    //     },
    //     error => {

    //     });
  }

  changeDate(date: any): string {
    return formatDate(date)
  }

  onChangeScripts(checked: boolean) {
    this.isChecked = checked;
  }

  onChangeSoftware(checked: boolean) {
    this.isCheckedSoftware = checked;
  }

  onChangeSourceCode(checked: boolean) {
    this.isCheckedSourceCode = checked;
  }

}
