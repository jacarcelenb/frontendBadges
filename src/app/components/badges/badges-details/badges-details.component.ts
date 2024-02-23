import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from 'src/app/services/alert.service';
import { ArtifactService } from 'src/app/services/artifact.service';
import { BadgeService } from 'src/app/services/badge.service';
import { BadgesCalculationsService } from 'src/app/services/badges-calculations.service';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { ExperimentService } from 'src/app/services/experiment.service';
import { LabpackService } from 'src/app/services/labpack.service';
import { TaskService } from 'src/app/services/task.service';
import { MenuItem } from 'primeng/api';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { SelectedBadgeService } from 'src/app/services/selected-badge.service';

@Component({
  selector: 'app-badges-details',
  templateUrl: './badges-details.component.html',
  styleUrls: ['./badges-details.component.scss'],
})
export class BadgesDetailsComponent implements OnInit, AfterViewInit {
  experiment_id: string;
  views: string[] = [
    'badges',
    'articulo_cientifico',
    'inventario_artefacto',
    'archivo_readme',
    'guia_instrucciones_descarga',
    'guia_instrucciones_ejecutar',
    'archivo_decision',
    'archivo_contact',
    'archivo_requirements',
    'archivo_status',
    'archivo_license',
    'archivo_install',
    'artefactos_bien_estructurados',
    'respeto_normas_estandares',
    'registro_entorno_virtual',
    'guia_instalacion',
    'artefactos_comprimidos',
    '30_min_duracion_config_install',
    'archivo_citation',
    'archivo_authors',
    'articulo_cientifico_reproducido',
    'articulo_authors_original',
    'archivo_authors_reproducido',
    'archivo_abstract',
    'resumen_critico_reproducido',
    'reflexiones_criticas_reproducido',
    'narrativa_acontecimientos_reproducido',
    'archivo_justificacion_reproducido',
    'articulo_cientifico_replicado',
    'articulo_authors_replicado',
    'articulo_abstract_replicado',
    'resumen_critico_replicado',
    'reflexiones_critica_replicado',
    'solicitud_insignia_replicado',
    'narrativa_acontecimientos_replicado',
    'descripcion_sistematica_scripts',
    'descripcion_sistematica_software',
    'participant_instructions',
    'design_description',
    'context_description',
    'analysis_scripts',
    'participant_demographic_surveys',
    'training_artifacts',
    'measuring_instruments',
    'conceptual_models',
    'raw_data',
    'curated_data',
    'hardware_technical_requirement'


  ];
  fields: string[] = [
    'manipulacion_datos'
  ];
  activeView: string = './badges';
  experiment: any = [];
  badges: any[];
  badges_percentages: any = [];
  evaluationsBadges: any = [];
  evaluations: any = [];
  evaluationStatus: any;
  qualified_standards: any = [];
  artifact_purpose = [];
  artifacts = [];
  all_standards = [];
  list_standards: any = []
  functional_standards = [];
  disponible_standards = [];
  reusable_standards: any = [];
  reproduced_standards: any = [];
  replicated_standards: any = [];
  standards_types: any = [];
  functional_badge = false;
  reusable_badge = false;
  reproduced_badge = false;
  replicated_badge = false;
  idfunctional: any;
  idreusable: any;
  idreproduced: any;
  idreplicated: any;
  progressBar = ''
  parameter_value: number = 0;
  reusable_parameter_value: number = 0
  disponible_parameter_value: number = 0
  reproduced_parameter_value: number = 0
  replicated_paremeter_value: number = 0
  suma_parameter_value: number = 0;
  standard: string
  NumTotalArtifactOperational: number = 0;
  NumTotalArtifactProcedural: any;
  numArtifacstWithCredentials: number = 0
  @ViewChild("idbadge") idbadge: ElementRef;
  id_standard: string;
  numtasks: any;
  numArtifacTask: any;
  NumTotalArtifactDescriptive: any;
  NumArtifactOperational: any;
  NumArtifactDescriptive: number;
  NumArtifactProcedural: number;
  NumDescriptionScripts: number;
  numtotalScripts: number;
  numdescription_Scripts: number;
  numdescription_Software: number;
  numtotalSoftware: number;
  totalScript: number;
  totalSoftware: number;
  artifact_type: any[] = [];
  numExecScripts: number;
  numExecSoftware: number;
  totalExecScripts: number;
  totalExecSoftware: number;
  totalDataManipulation: number;
  totalDataAccessiblity: number;
  suma_reusable_value: number = 0;
  suma_disponible_value: number = 0;
  suma_reproduced_value: number = 0;
  suma_replicated_value: number = 0;
  list_reusable: any[] = [];
  list_disponible: any[] = [];
  img_badge: any
  name_badge: any
  title_badge: any
  total_norm_standards: number;
  true_norm_standards: number;
  iddisponible: any;
  disponible_badge: boolean;
  labpack: any[] = [];
  numArtifacsNoCredentials: number;
  badges_num: any[] = [];
  data: any[] = [];
  optional_parameters: any[] = [];
  standard_optional: any
  parameter: boolean = false;
  change_language = false;
  completedParameter = false;
  items: MenuItem[];
  menu_type: string;
  taskWithArtifacts: any[] = [];
  taskWithOutArtifacts: any
  ACMArtifacts: any[] = [];
  @ViewChild("viewButton") viewButton: ElementRef;
  displayedColumns: string[] = ['name', 'image', 'title', 'options'];
  dataSource: MatTableDataSource<any>
  @ViewChild(MatPaginator) paginator: MatPaginator;
  actualExperiment: any[];
  completedExperiment: boolean = false;
  completedSteps: MenuItem[];
  completedStepSpanish: MenuItem[];
  userExperiments = [];
  experimentOwner: boolean = false;

  ListStandards = [];
  StandardsBadges = [];
  listBadges: any;
  fullStandards: any[];
  QualifiedStandards: any[];
  numFunctionalParams: number;
  numReusableParams: number;
  numAvailableParams: number;
  numReplicatedParams: number;
  numReproducedParams: number;
  numParams: number;
  messageNumParameters: any;
  constructor(
    private _badgeService: BadgeService,
    private _experimentService: ExperimentService,
    private actRoute: ActivatedRoute,
    private evaluatioService: EvaluationService,
    private taskService: TaskService,
    private artifactService: ArtifactService,
    private labpackService: LabpackService,
    private bcService: BadgesCalculationsService,
    private alertService: AlertService,
    private _translateService: TranslateService,
    private _router: Router,
    private tokenStorageService: TokenStorageService,
    private _selectBadge: SelectedBadgeService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.experiment_id = this.actRoute.parent.snapshot.paramMap.get('id');
    this.menu_type = this.actRoute.parent.snapshot.paramMap.get("menu");
    this.getBadgesExperiment()
    this.getArtifacts();
    this.getNumArtifacTasks();
    this.getNumtasks();
    this.getArtifactPurpose();
    this.getArtifactTypes();
    this.getTaskArtifactsOperational()
    this.getTotalTaskArtifactsOperational()
    this.getTaskArtifactsDescriptive()
    this.getTotalTaskArtifactsDescriptive()
    this.getNumArtifactProcedural_Task()
    this.getTotalExecutedScripts();
    this.getTotalExecutedSoftware();
    this.getTotalNormStandards();
    this.getNumTrueNormStandards();
    this.getPackage();
    this.getStandardsTypes();
    this.getUserExperiments();
    this.ValidateLanguage();
    this._translateService.onLangChange.subscribe(() => {
      this.ValidateLanguage()
    });
    this.items = [
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/badges" },
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/badges" },
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/badges" },
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/badges" },
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/badges" },
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/badges" },
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/badges" },
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/badges" },
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

    this.VerificateSelectedExperiment()
  }

  ngAfterViewInit(): void {
  }


  changeView(view?: string) {

    if (this.views.includes(view)) {

      this.activeView = view;
      if (view == 'articulo_authors_original') {
        this.standard = 'archivo_authors';
      } else {
        this.standard = view;
      }
    }
    else {
      this.activeView = 'none';
    }
    window.scrollTo(0, 0);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

  getActualExperiment() {
    this._experimentService.get({ _id: this.experiment_id }).subscribe((data: any) => {
      this.actualExperiment = data.response
      this.completedExperiment = data.response[0].completed
    })
  }
  getBadgesExperiment() {
    this._experimentService.get({ _id: this.experiment_id }).subscribe((data: any) => {
      this.experiment = data.response
      this._badgeService.getBadges({
        ___populate: 'standards',
      }).subscribe((data: any) => {
        this.badges = data.response
        this.badges.forEach((a: any) => {
          Object.assign(a, { percentage: 0 })
        });
        this.badges_percentages = this.badges
        this.functional_standards = this.validateItems(this.fillBadgeStandards("Funcional", this.badges))
        this.disponible_standards =this.validateItems(this.fillBadgeStandards("Disponible", this.badges))
        this.reusable_standards =this.validateItems(this.fillBadgeStandards("Reutilizable", this.badges))
        this.reproduced_standards = this.fillBadgeStandards("Reproducido", this.badges)
        this.replicated_standards = this.fillBadgeStandards("Replicado", this.badges)
        this.idfunctional = this.findIdBadge("Funcional", this.badges)
        this.iddisponible = this.findIdBadge("Disponible", this.badges)
        this.idreusable = this.findIdBadge("Reutilizable", this.badges)
        this.idreproduced = this.findIdBadge("Reproducido", this.badges)
        this.idreplicated = this.findIdBadge("Replicado", this.badges)
        this._badgeService.getStandards({}).subscribe((data: any) => {

          this.qualified_standards = this.validateItems(data.response)
          this.all_standards = this.validateItems(data.response)
          this.qualified_standards.forEach((a: any) => {
            Object.assign(a, { status: "" })
          });
          this.all_standards.forEach((a: any) => {
            Object.assign(a, { status: "" })
          });
          this.filterBadges(this.all_standards, this.qualified_standards, this.badges)
          this.getIdBagdes()
          this.evaluatioService.get({ status: "success" }).subscribe((data: any) => {
            this.evaluationsBadges = data.response
            this.ShowPercentagesBadges()
            this.showStandardList()

          })
        });
      })
    })


  }

  filterBadges(all_standards, qualified_standards, badges) {
    this._selectBadge.get(
      {
        experiment: this.experiment_id,
        status: true,
        ___populate: 'idbadge'
      }
    ).subscribe((data: any) => {

      this.listBadges = this.findSelectedBadges(badges, data.response)
      for (let index = 0; index < data.response.length; index++) {
        this.ListStandards.push(...data.response[index].idbadge.standards)
      }
      const dataArr = new Set(this.ListStandards);
      this.StandardsBadges = [...dataArr];
      this.fullStandards = this.fillAllStandards(all_standards, this.StandardsBadges)
      this.QualifiedStandards = this.fillAllStandards(qualified_standards, this.StandardsBadges)
      this.dataSource = new MatTableDataSource<any>(this.fullStandards);
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator._intl = new MatPaginatorIntl()
      this.dataSource.paginator._intl.itemsPerPageLabel = ""

    })
  }

  findSelectedBadges(badges, list) {
    let data = [];
    for (let i = 0; i < badges.length; i++) {
      for (let j = 0; j < list.length; j++) {
        if (badges[i]._id == list[j].idbadge._id) {
          data.push(badges[i]);
        }
      }
    }
    return data;
  }


  fillAllStandards(badges, list) {
    let data = [];
    for (let i = 0; i < badges.length; i++) {
      for (let j = 0; j < list.length; j++) {
        if (badges[i]._id == list[j]) {
          data.push(badges[i]);
        }
      }
    }
    return data;
  }

  getBadges2() {
    this._badgeService.getBadges({ ___populate: 'standards' }).toPromise().then(data => {
      this.badges_num = data.response
    })

  }

  getStandardsTypes() {
    this._badgeService.getStandardsTypes({}).toPromise().then(data => {
      this.standards_types = data.response
      for (let index = 0; index < this.standards_types.length; index++) {
        if (this.standards_types[index].name == "recommended") {
          this.standard_optional = this.standards_types[index]._id
        }

      }
      this._badgeService.getStandards({ standard_type: this.standard_optional }).toPromise().then(data => {
        this.optional_parameters = data.response
      });
    })
  }

  getNumTrueNormStandards() {
    this.artifactService.count({ experiment: this.experiment_id, norms_standards: true }).toPromise().then(data => {
      this.true_norm_standards = data.response
    })
  }

  getUserExperiments() {
    this._experimentService.getExperimentsUser().subscribe((data: any) => {
      this.userExperiments = data.response
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


  getTotalNormStandards() {
    this.artifactService.count({ experiment: this.experiment_id }).toPromise().then(data => {
      this.total_norm_standards = data.response
    })
  }



  fillBadgeStandards(name, standards) {
    let list = []
    for (let index = 0; index < standards.length; index++) {
      if (name == standards[index].name) {
        list = standards[index].standards
      }
    }
    return list
  }

  findBadge(name, standards) {
    const badge = {
      image: "",
      title: "",
      translation_key: "",
      name: "",
      eng_name: "",

    }
    for (let index = 0; index < standards.length; index++) {
      if (name == standards[index].name) {
        badge.eng_name = standards[index].eng_name
        badge.name = standards[index].name
        badge.title = standards[index].title
        badge.translation_key = standards[index].translation_key
        badge.image = standards[index].image
      }
    }
    return badge
  }

  findIdBadge(name, standards) {
    let id = ""
    for (let index = 0; index < standards.length; index++) {
      if (name == standards[index].name) {
        id = standards[index]._id
      }
    }

    return id
  }

  getNumtasks() {
    this.taskService.getNumtasks({
      experiment: this.experiment_id, needsArtifact: true
    }).toPromise().then(data => {
      this.numtasks = data.response;
    });
  }
  getNumArtifacTasks() {
    this.taskService.getWithArtifacts({
      experiment: this.experiment_id,
      needsArtifact: true,
      ___populate: 'responsible,task_type',
    }).subscribe((data) => {
      let countArtifacts = 0
      for (let index = 0; index < data.response.length; index++) {
        if (data.response[index].needsArtifact == true &&
          data.response[index].artifacts.length > 0) {
          countArtifacts += 1
        }
      }
      this.numArtifacTask = countArtifacts

    });
  }

  // Obtener el Total de tareas que necesitan artefactos del nivel operacional
  getNumTotalArtifactOperational() {
    let list_artifacts = []
    let count = 0
    this.artifactService.get({
      maturity_level: "Operational", experiment: this.experiment_id,
      ___populate: 'experiment task'
    }).toPromise().then(data => {
      list_artifacts = data.response
      for (let index = 0; index < list_artifacts.length; index++) {
        if (list_artifacts[index].task != null && list_artifacts[index].task[0]?.needsArtifact == true) {
          count = +1
        }
      }
      this.NumTotalArtifactOperational = count;
    })
  }


  getNumArtifactOperational_Task() {
    let list_artifacts = []
    let count = 0
    this.artifactService.get({
      maturity_level: "Operational", experiment: this.experiment_id,
      ___populate: 'experiment task'
    }).toPromise().then(data => {
      list_artifacts = data.response;
      for (let index = 0; index < list_artifacts.length; index++) {
        if (list_artifacts[index].task != null) {
          count = count + 1;
        }

      }
      this.NumArtifactOperational = count;

    })
  }


  getTaskArtifactsOperational() {

    this.taskService.getWithArtifacts({
      experiment: this.experiment_id,
      needsArtifact: true,
      ___populate: 'responsible,task_type',
    }).subscribe((data) => {
      let countArtifacts = 0
      for (let index = 0; index < data.response.length; index++) {
        if (data.response[index].needsArtifact == true &&
          data.response[index].artifacts.length > 0) {
          let artifacts = []
          artifacts = data.response[index].artifacts
          for (let i = 0; i < artifacts.length; i++) {
            if (artifacts[i].maturity_level == "Operational") {
              countArtifacts = countArtifacts + 1
            }
          }

        }
      }
      this.NumArtifactOperational = countArtifacts
    });
  }


  getTotalTaskArtifactsOperational() {

    this.taskService.getWithArtifacts({
      experiment: this.experiment_id,
      ___populate: 'responsible,task_type',
    }).subscribe((data) => {
      let countArtifacts = 0
      for (let index = 0; index < data.response.length; index++) {
        if (data.response[index].artifacts.length > 0) {
          let artifacts = []
          artifacts = data.response[index].artifacts
          for (let i = 0; i < artifacts.length; i++) {
            if (artifacts[i].maturity_level == "Operational") {
              countArtifacts = countArtifacts + 1
            }
          }

        }
      }

      this.NumTotalArtifactOperational = countArtifacts
    });
  }



  getTaskArtifactsDescriptive() {

    this.taskService.getWithArtifacts({
      experiment: this.experiment_id,
      needsArtifact: true,
      ___populate: 'responsible,task_type',
    }).subscribe((data) => {
      let countArtifacts = 0
      for (let index = 0; index < data.response.length; index++) {
        if (data.response[index].artifacts.length > 0) {
          let artifacts = []
          artifacts = data.response[index].artifacts
          for (let i = 0; i < artifacts.length; i++) {
            if (artifacts[i].maturity_level == "Descriptive") {
              countArtifacts = countArtifacts + 1
            }
          }

        }
      }

    });
  }


  getTotalTaskArtifactsDescriptive() {

    this.taskService.getWithArtifacts({
      experiment: this.experiment_id,
      ___populate: 'responsible,task_type',
    }).subscribe((data) => {
      let countArtifacts = 0
      for (let index = 0; index < data.response.length; index++) {
        if (data.response[index].artifacts.length > 0) {
          let artifacts = []
          artifacts = data.response[index].artifacts
          for (let i = 0; i < artifacts.length; i++) {
            if (artifacts[i].maturity_level == "Descriptive") {
              countArtifacts = countArtifacts + 1
            }
          }
          this.NumArtifactDescriptive = countArtifacts
        }
      }

      this.NumTotalArtifactDescriptive = countArtifacts
    });
  }


  getTaskArtifactsProcedural() {

    this.taskService.getWithArtifacts({
      experiment: this.experiment_id,
      needsArtifact: true,
      ___populate: 'responsible,task_type',
    }).subscribe((data) => {
      let countArtifacts = 0
      for (let index = 0; index < data.response.length; index++) {
        if (data.response[index].needsArtifact == true &&
          data.response[index].artifacts.length > 0) {
          let artifacts = []
          artifacts = data.response[index].artifacts
          for (let i = 0; i < artifacts.length; i++) {
            if (artifacts[i].maturity_level == "Procedural") {
              countArtifacts = countArtifacts + 1
            }
          }

        }
      }
      this.NumArtifactProcedural = countArtifacts
    });
  }


  getTotalTaskArtifactsProcedural() {

    this.taskService.getWithArtifacts({
      experiment: this.experiment_id,
      ___populate: 'responsible,task_type',
    }).subscribe((data) => {
      let countArtifacts = 0
      for (let index = 0; index < data.response.length; index++) {
        if (data.response[index].artifacts.length > 0) {
          let artifacts = []
          artifacts = data.response[index].artifacts
          for (let i = 0; i < artifacts.length; i++) {
            if (artifacts[i].maturity_level == "Procedural") {
              countArtifacts = countArtifacts + 1
            }
          }

        }
      }

      this.NumTotalArtifactProcedural = countArtifacts
    });
  }



  findStandardType(standard): String {
    let type = "recommended"
    for (let index = 0; index < this.standards_types.length; index++) {
      if (this.standards_types[index]._id == standard && this.standards_types[index].name == "mandatory") {
        type = "mandatory"
      }
    }
    return type
  }

  showStandardType(standard: any): String {
    let value = ""
    if (this.findStandardType(standard) == "recommended" && this.change_language == false) {
      value = "Recomendado"
    } else if (this.findStandardType(standard) == "recommended" && this.change_language == true) {
      value = "Recommended"
    } else if (this.findStandardType(standard) == "mandatory" && this.change_language == true) {
      value = "Mandatory"
    } else {
      value = "Requerido"
    }
    return value
  }




  // Obtener el Total de tareas que necesitan artefactos del nivel descriptivo
  getNumTotalArtifactDescriptive() {
    let list_artifacts = []
    let count = 0
    this.artifactService.get({
      maturity_level: "Descriptive", experiment: this.experiment_id,
      ___populate: 'experiment task'
    }).toPromise().then(data => {
      list_artifacts = data.response
      for (let index = 0; index < list_artifacts.length; index++) {
        if (list_artifacts[index].task != null && list_artifacts[index].task[0]?.needsArtifact == true) {
          count = +1
        }
      }
      this.NumTotalArtifactDescriptive = count;
    })
  }

  getNumArtifactDescriptive_Task() {
    let list_artifacts = []
    let count = 0
    this.artifactService.get({
      maturity_level: "Descriptive", experiment: this.experiment_id,
      ___populate: 'experiment task'
    }).toPromise().then(data => {
      list_artifacts = data.response;

      for (let index = 0; index < list_artifacts.length; index++) {
        if (list_artifacts[index].task != null) {
          count = count + 1;
        }

      }
      this.NumArtifactDescriptive = count;
    })
  }
  // Obtener el Total de tareas que necesitan artefactos del nivel procedimental
  getNumTotalArtifactProcedural() {
    let list_artifacts = []
    let count = 0
    this.artifactService.get({
      maturity_level: "Procedural", experiment: this.experiment_id,
      ___populate: 'experiment task'
    }).toPromise().then(data => {
      list_artifacts = data.response
      for (let index = 0; index < list_artifacts.length; index++) {
        if (list_artifacts[index].task != null && list_artifacts[index].task[0]?.needsArtifact == true) {
          count = +1
        }
      }
      this.NumTotalArtifactProcedural = count;
    })
  }
  getNumArtifactProcedural_Task() {
    let list_artifacts = []
    let count = 0
    this.artifactService.get({
      maturity_level: "Procedural", experiment: this.experiment_id,
      ___populate: 'experiment task'
    }).subscribe(data => {
      list_artifacts = data.response;
      this.NumArtifactProcedural = list_artifacts.length;
    })
  }

  Back() {

    this._router.navigate(['experiment/step/' + this.experiment_id + "/step/menu/artifacts_acm"]);
  }

  Next() {
    this._router.navigate(['experiment/step/' + this.experiment_id + "/step/menu" + "/labpack"])
  }



  async getPackage() {
    const labpackage = await this.labpackService.get({ experiment: this.experiment_id }).toPromise()
    this.labpack = labpackage.response;
  }

  // verificar si el parametro ya fue evaluado

  createEvaluationStandard() {
    if (this.VerifySuccessParameter() == false) {
      this.evaluatioService.createEvaluation({
        status: 'success',
        experiment: this.experiment_id,
        standard: this.id_standard
      }).subscribe((data: {}) => { })
    }
  }

  GetValueDisponibleParameter() {
    let countif = 0
    let countelse = 0
    for (let index = 0; index < this.artifacts.length; index++) {
      if (this.artifacts[index].credential_access.password == null && this.artifacts[index].credential_access.user == null) {
        countif = countif + 1;
      } else {
        countelse = countelse + 1;
      }
    }
    this.numArtifacstWithCredentials = countelse;
    this.numArtifacsNoCredentials = countif;
  }

  createStandard(id: string) {
    if (this.VerifyParameter(id) == false) {
      this.evaluatioService.createEvaluation({
        status: 'success',
        experiment: this.experiment_id,
        standard: id
      }).subscribe((data: {}) => { })
    }
  }



  verificateDOI() {
    if (this.labpack[0]?.package_doi != null) {
      this.calculateValueParameter("doi")
    }
  }
  verificateRepository() {
    if (this.labpack[0]?.repository != null) {
      this.calculateValueParameter("repositorio_archivos_public")
    }
  }

  verificateConfidentialRegistration() {
    this.calculateValueParameter("registro_confidencial")
  }

  verifyPackageType() {
    if (this.labpack[0]?.package_type != null) {
      this.calculateValueParameter("registro_tipo_paquete")
    }
  }

  calculateValueParameter(standard: string) {
    let id = ""

    for (let i = 0; i < this.all_standards.length; i++) {
      if (this.all_standards[i].name == standard) {
        id = this.all_standards[i]._id
      }
    }

    this.createStandard(id);

  }

  findParameterByName(name: string): string {
    let id = ""

    for (let i = 0; i < this.all_standards.length; i++) {
      if (this.all_standards[i].name == name) {
        id = this.all_standards[i]._id
      }
    }
    return id
  }

  getTotalDescriptionScripts() {
    let total_Scripts = 0
    let Scripts_withDescription = 0
    let data_artifacts = []
    let id = ""

    // obtener id de los scripts
    for (let index = 0; index < this.artifact_purpose.length; index++) {
      if (this.artifact_purpose[index].name == 'Script') {
        id = this.artifact_purpose[index]._id
      }

    }
    // obtener id de los artefactos con script
    for (let index = 0; index < this.artifacts.length; index++) {
      if (this.artifacts[index].artifact_purpose._id == id) {
        total_Scripts = total_Scripts + 1
      }
      if (this.artifacts[index].sistematic_description_scripts == "true" && this.artifacts[index].sistematic_description_scripts?.length > 0) {
        Scripts_withDescription = Scripts_withDescription + 1
      }
    }

    this.numdescription_Scripts = Scripts_withDescription
    this.numtotalScripts = total_Scripts
  }

  getArtifactPurpose() {
    this.artifactService.getPurposes().toPromise().then(data => {
      this.artifact_purpose = data.response
    })
  }

  async getArtifactTypes() {
    const artifact_data = await this.artifactService.getTypes().toPromise()
    this.artifact_type = artifact_data.response
  }

  getArtifacts() {
    this.artifactService.get({
      experiment: this.experiment_id,
      ___populate: "artifact_purpose"
    }).toPromise().then(data => {
      this.artifacts = data.response
      this.GetValueDisponibleParameter();
      this.getACMArtifacts()
    })
  }

  getACMArtifacts() {
    this.artifactService.getACM().toPromise().then(data => {
      this.ACMArtifacts = data.response
      let counter = 0
      for (let index = 0; index < this.ACMArtifacts.length; index++) {
        if (this.ACMArtifacts[index].name.includes("Guía")) {
          counter = counter + 1
        }
      }
      this.NumTotalArtifactProcedural = counter
    })
  }

  async getTotalExecutedScripts() {
    const scripts = await this.artifactService.count({ executed_scripts: true, experiment: this.experiment_id }).toPromise()
    this.numExecScripts = scripts.response

  }
  async getTotalExecutedSoftware() {
    const software = await this.artifactService.count({ executed_software: true, experiment: this.experiment_id }).toPromise()
    this.numExecSoftware = software.response
  }

  async getEvaluationsBadges() {
    const evaluation = await this.evaluatioService.get({ status: "success" }).toPromise()
    this.evaluationsBadges = evaluation.response

  }

  getTotalDescriptionSoftware() {
    let total_software = 0
    let Software_withDescription = 0
    let id = ""

    // obtener id de los software
    for (let index = 0; index < this.artifact_type.length; index++) {
      if (this.artifact_type[index].name == 'Software') {
        id = this.artifact_type[index]._id
      }

    }
    // obtener id de los artefactos con software
    for (let index = 0; index < this.artifacts.length; index++) {

      if (this.artifacts[index].artifact_type == id) {
        total_software = total_software + 1
      }
      if (this.artifacts[index].sistematic_description_software?.length > 0 && this.artifacts[index].sistematic_description_software == "true") {
        Software_withDescription = Software_withDescription + 1
      }
    }

    this.numdescription_Software = Software_withDescription
    this.numtotalSoftware = total_software
  }



  getTotalAccesibleData(): number {
    let accesibledata = 0
    for (let index = 0; index < this.artifacts.length; index++) {
      if (this.artifacts[index].evaluation.is_accessible == true) {
        accesibledata = accesibledata + 1
      }

    }
    return accesibledata
  }

  getTotalManipulatedData(): number {
    let data_manipulation = 0
    for (let index = 0; index < this.artifacts.length; index++) {
      if (this.artifacts[index].data_manipulation == true) {
        data_manipulation = data_manipulation + 1
      }

    }
    return data_manipulation
  }

  getTotalData(): number {
    let counter = 0
    for (let index = 0; index < this.artifacts.length; index++) {
      if (this.artifacts[index].artifact_purpose.name == "Dataset") {
        counter += 1
      }
    }
    return counter
  }

  // verificar si el parametro ya fue evaluado
  VerifySuccessParameter(): boolean {
    let evaluated = false;
    for (let index = 0; index < this.evaluationsBadges.length; index++) {
      if (this.evaluationsBadges[index].standard == this.id_standard && this.evaluationsBadges[index].status == "success" && this.evaluationsBadges[index].experiment == this.experiment_id) {
        evaluated = true
      }

    }
    return evaluated
  }

  VerifyParameter(standard): boolean {
    let evaluated = false;
    for (let index = 0; index < this.evaluationsBadges.length; index++) {
      if (this.evaluationsBadges[index].standard == standard && this.evaluationsBadges[index].status == "success" && this.evaluationsBadges[index].experiment == this.experiment_id) {
        evaluated = true
      }

    }
    return evaluated
  }



  // mostrar los estandares con los filtros
  showStandardList() {
    if (this.idbadge.nativeElement.value == this.idfunctional) {// Funcional
      this.qualified_standards = []
      let badge_value = this.findBadge("Funcional", this.badges)

      this.reusable_badge = false
      this.functional_badge = true
      this.disponible_badge = false
      this.replicated_badge = false
      this.reproduced_badge = false
      this.img_badge = badge_value.image
      this.name_badge = badge_value.translation_key
      if (this.change_language == true) {
        this.title_badge = badge_value.eng_name
      } else {
        this.title_badge = badge_value.name
      }

      this.numParams = this.getCompletedParameters(this.functional_standards)
      this.qualified_standards = this.functional_standards

      this.dataSource = new MatTableDataSource<any>(this.qualified_standards);
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator._intl = new MatPaginatorIntl()
      this.dataSource.paginator._intl.itemsPerPageLabel = ""
    }
    if (this.idbadge.nativeElement.value == this.idreusable) { // Reutilizable
      let badge_value = this.findBadge("Reutilizable", this.badges)
      this.qualified_standards = []
      this.functional_badge = false
      this.disponible_badge = false
      this.reusable_badge = true
      this.replicated_badge = false
      this.reproduced_badge = false
      this.img_badge = badge_value.image
      this.name_badge = badge_value.translation_key
      if (this.change_language == true) {
        this.title_badge = badge_value.eng_name
      } else {
        this.title_badge = badge_value.name
      }

      this.numParams = this.getCompletedParameters(this.reusable_standards)
      this.qualified_standards = this.reusable_standards

      this.dataSource = new MatTableDataSource<any>(this.qualified_standards);
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator._intl = new MatPaginatorIntl()
      this.dataSource.paginator._intl.itemsPerPageLabel = ""
    }
    if (this.idbadge.nativeElement.value == this.iddisponible) { // Disponible
      let badge_value = this.findBadge("Disponible", this.badges)
      this.qualified_standards = []
      this.functional_badge = false
      this.reusable_badge = false
      this.disponible_badge = true
      this.replicated_badge = false
      this.reproduced_badge = false
      this.img_badge = badge_value.image
      this.name_badge = badge_value.translation_key

      if (this.change_language == true) {
        this.title_badge = badge_value.eng_name
      } else {
        this.title_badge = badge_value.name
      }
      this.numParams = this.getCompletedParameters(this.disponible_standards)
      this.qualified_standards = this.disponible_standards
      this.dataSource = new MatTableDataSource<any>(this.qualified_standards);
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator._intl = new MatPaginatorIntl()
      this.dataSource.paginator._intl.itemsPerPageLabel = ""
    }
    if (this.idbadge.nativeElement.value == this.idreproduced) { // Reproducido
      this.qualified_standards = []
      let badge_value = this.findBadge("Reproducido", this.badges)
      this.functional_badge = false
      this.reusable_badge = false
      this.disponible_badge = false
      this.replicated_badge = false
      this.reproduced_badge = true
      this.img_badge = badge_value.image
      this.name_badge = badge_value.translation_key
      if (this.change_language == true) {
        this.title_badge = badge_value.eng_name
      } else {
        this.title_badge = badge_value.name
      }
      this.numParams = this.getCompletedParameters(this.reproduced_standards)
      this.qualified_standards = this.reproduced_standards

      this.dataSource = new MatTableDataSource<any>(this.qualified_standards);
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator._intl = new MatPaginatorIntl()
      this.dataSource.paginator._intl.itemsPerPageLabel = ""
    }
    if (this.idbadge.nativeElement.value == this.idreplicated) { // Replicated
      this.qualified_standards = []
      let badge_value = this.findBadge("Replicado", this.badges)
      this.functional_badge = false
      this.reusable_badge = false
      this.disponible_badge = false
      this.replicated_badge = true
      this.reproduced_badge = false
      this.img_badge = badge_value.image
      this.name_badge = badge_value.translation_key
      if (this.change_language == true) {
        this.title_badge = badge_value.eng_name
      } else {
        this.title_badge = badge_value.name
      }
      this.numParams = this.getCompletedParameters(this.replicated_standards)
      this.qualified_standards = this.replicated_standards

      this.dataSource = new MatTableDataSource<any>(this.qualified_standards);
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator._intl = new MatPaginatorIntl()
      this.dataSource.paginator._intl.itemsPerPageLabel = ""
    }
    this.messageNumParameters = this._translateService.instant("TOTAL_PARAMETERS") + " " + this.numParams;

  }
  getIdBagdes() {

    this.functional_standards.forEach((a: any) => {
      Object.assign(a, { status: "", value: "0.00" })
    });

    this.reusable_standards.forEach((a: any) => {
      Object.assign(a, { status: "", value: "0.00" })
    });

    this.disponible_standards.forEach((a: any) => {
      Object.assign(a, { status: "", value: "0.00" })
    });
    this.replicated_standards.forEach((a: any) => {
      Object.assign(a, { status: "", value: "0.00" })
    });
    this.reproduced_standards.forEach((a: any) => {
      Object.assign(a, { status: "", value: "0.00" })
    });
  }

  // Validar que se muestren los parametros de scripts
  // o software o ambos
  validateItems(list) {
    let filterList = []

    if (!this.experiment[0].has_scripts && this.experiment[0].has_software) {

      for (let index = 0; index < list.length; index++) {
        const element = list[index];
        if (element.name != 'analysis_scripts'
          && element.name != 'descripcion_sistematica_scripts'
          && element.name != 'ejecucion_exitosa_scripts') {
          filterList.push(element);
        }

      }

    } else if (!this.experiment[0].has_software && this.experiment[0].has_scripts) {
      for (let index = 0; index < list.length; index++) {
        const element = list[index];
        if (element.name != 'descripcion_sistematica_software'
          && element.name != 'ejecucion_software_resultados') {
          filterList.push(element);
        }

      }
    }
    else if (!this.experiment[0].has_scripts && !this.experiment[0].has_software) {
      for (let index = 0; index < list.length; index++) {
        const element = list[index];
        if (element.name != 'descripcion_sistematica_software'
          && element.name != 'ejecucion_software_resultados'
          && element.name != 'analysis_scripts'
          && element.name != 'descripcion_sistematica_scripts'
          && element.name != 'ejecucion_exitosa_scripts') {
          filterList.push(element);
        }

      }
    } else {
      filterList = list
    }

    return filterList;
  }

  verificateStateParameter(value) {
    let resp = "pending"
    if (value > 0) {
      resp = "success"
    }
    return resp
  }

  // calcular el numero de parametros completados
  getCompletedParameters(lista) {
    let numParams = 0;
    for (let index = 0; index < lista.length; index++) {
      const element = lista[index];
      if (element.status == 'success') {
        numParams++;
      }

    }
    return numParams;

  }

  // metodo para mostrar el porcentaje de las insignias
  ShowPercentagesBadges() {
    this.parameter_value = this.bcService.CalculateFuncionalParameterValue(this.experiment, this.functional_standards, this.standard_optional)
    this.reusable_parameter_value = this.bcService.CalculateReusableParemeterValue(this.experiment, this.reusable_standards, this.standard_optional)
    this.disponible_parameter_value = this.bcService.CalculateAvalaibleParemeterValue(this.numArtifacstWithCredentials, this.disponible_standards, this.standard_optional)
    this.reproduced_parameter_value = this.bcService.CalculateReproducedParameterValue(this.replicated_standards, this.standard_optional)
    this.replicated_paremeter_value = this.bcService.CalculateReplicatedParameterValue(this.replicated_standards, this.standard_optional)

    let id_author_file = this.findParameterByName("archivo_authors")
    let find_parameter = false
    let author_original_file = 0

    for (let i = 0; i < this.evaluationsBadges.length; i++) {
      for (let j = 0; j < this.qualified_standards.length; j++) {
        if (this.evaluationsBadges[i].standard == this.qualified_standards[j]._id && this.evaluationsBadges[i].status == "success" && this.evaluationsBadges[i].experiment == this.experiment_id) {
          this.qualified_standards[j].status = "success";

          if (this.evaluationsBadges[i].standard == id_author_file) {
            find_parameter = true;
          }
        } else {
          if (this.qualified_standards[j]._id == this.findParameterByName("articulo_authors_original")) {
            author_original_file = j
          }
        }
      }
    }

    if (find_parameter == true) {
      this.qualified_standards[author_original_file].status = "success";
    }

    for (let i = 0; i < this.evaluationsBadges.length; i++) {
      for (let j = 0; j < this.all_standards.length; j++) {
        if (this.evaluationsBadges[i].standard == this.all_standards[j]._id && this.evaluationsBadges[i].status == "success" && this.evaluationsBadges[i].experiment == this.experiment_id) {
          this.all_standards[j].status = "success";
          if (this.evaluationsBadges[i].standard == id_author_file) {
            find_parameter = true;
          }
        } else {
          if (this.all_standards[j]._id == this.findParameterByName("articulo_authors_original")) {
            author_original_file = j
          }
        }
      }
    }

    if (find_parameter == true) {
      this.all_standards[author_original_file].status = "success";
    }
    /**
     * INSIGNIA FUNCIONAL
     */

    let totalDataManipulated = 0
    let totalDataAccessiblity = 0
    this.getTotalDescriptionScripts()
    this.getTotalDescriptionSoftware()
    this.totalSoftware = this.numdescription_Software
    this.totalScript = this.numdescription_Scripts
    this.totalExecScripts = this.numExecScripts
    this.totalExecSoftware = this.numExecSoftware
    totalDataManipulated = this.getTotalManipulatedData()
    totalDataAccessiblity = this.getTotalAccesibleData()


    // Evaluar los parametros de ejecuciones para el software y scripts
    if (this.totalExecScripts > 0 && this.experiment[0].has_scripts) {
      this.calculateValueParameter("ejecucion_exitosa_scripts")
    }
    if (this.totalExecSoftware > 0 && this.experiment[0].has_software) {
      this.calculateValueParameter("ejecucion_software_resultados")
    }

    //Evaluar la accesibilidad de los datos
    if (totalDataAccessiblity > 0) {
      this.calculateValueParameter("datos_accesibles")
    }
    // Evaluar la manipulacion de los datos
    if (totalDataManipulated > 0) {
      this.calculateValueParameter("manipulacion_datos")
    }

    // Evaluar los parametos opcionales
    if (this.bcService.calculateCompletedTime(this.artifacts) == true) {
      this.calculateValueParameter("tiempos_ejecucion_completa")
    }
    if (this.bcService.calculateShortTime(this.artifacts) == true) {
      this.calculateValueParameter("tiempos_ejecucion_corta")
    }
    // Calcular contexto del experimento
    if (this.experiment != undefined) {
      this.calculateValueParameter("context_description")
    }

    let functionalRecommendedParams = 0;
    let functionalMandatoryParams = 0;

    let totalRecommendedParametersFunctional = this.bcService.findOptionalParameters(this.functional_standards, this.standard_optional);
    let totalMandatoryParametersFunctional = this.bcService.findRequiredParameters(this.functional_standards, this.standard_optional);

    for (let i = 0; i < this.evaluationsBadges.length; i++) {
      for (let j = 0; j < this.functional_standards.length; j++) {
        if (this.evaluationsBadges[i].standard == this.functional_standards[j]._id && this.evaluationsBadges[i].status == "success" && this.evaluationsBadges[i].experiment == this.experiment_id) {

          if (this.functional_standards[j]._id == this.findParameterByName("descripcion_sistematica_scripts")) {
            this.functional_standards[j].status = this.verificateStateParameter(this.totalScript)
          }
          else if (this.functional_standards[j]._id == this.findParameterByName("descripcion_sistematica_software")) {
            this.functional_standards[j].status = this.verificateStateParameter(this.totalSoftware)
          }
          else if (this.functional_standards[j]._id == this.findParameterByName("ejecucion_exitosa_scripts")) {
            this.functional_standards[j].status = this.verificateStateParameter(this.totalExecScripts)
          }
          else if (this.functional_standards[j]._id == this.findParameterByName("ejecucion_software_resultados")) {
            this.functional_standards[j].status = this.verificateStateParameter(this.totalExecSoftware)
          }
          else if (this.functional_standards[j]._id == this.findParameterByName("datos_accesibles")) {
            this.functional_standards[j].status = this.verificateStateParameter(totalDataAccessiblity)
          }
          else if (this.functional_standards[j]._id == this.findParameterByName("manipulacion_datos")) {
            this.functional_standards[j].status = this.verificateStateParameter(totalDataManipulated)
          }
          else if (this.functional_standards[j]._id == this.findParameterByName("tiempos_ejecucion_completa")) {
            this.functional_standards[j].status = "success"
          }
          else if (this.functional_standards[j]._id == this.findParameterByName("tiempos_ejecucion_corta")) {
            this.functional_standards[j].status = "success"
          }
          else if (this.functional_standards[j]._id == this.findParameterByName("context_description")) {
            this.functional_standards[j].status = "success"
          }
          else {
            this.functional_standards[j].status = "success"
          }

          if (this.standard_optional == this.functional_standards[j].standard_type) {
            functionalRecommendedParams += 1
          } else {
            functionalMandatoryParams += 1
          }
        }
      }
    }
    let functional_recommended_value = 0
    let functional_mandatory_value = 0
    if (totalRecommendedParametersFunctional == functionalRecommendedParams) {
      functional_recommended_value = 50;
    } else {
      functional_recommended_value = (50 * functionalRecommendedParams) / totalRecommendedParametersFunctional
    }

    if (totalMandatoryParametersFunctional == functionalMandatoryParams) {
      functional_mandatory_value = 50;
    } else {
      functional_mandatory_value = (50 * functionalMandatoryParams) / totalMandatoryParametersFunctional
    }

    let functional_value = 0
    functional_value = (functional_recommended_value + functional_mandatory_value)



    // calculo del porcentaje de la insignia reutlizable
    let reusable_value = 0
    let reusableRecommendedParams = 0;
    let reusablelMandatoryParams = 0;

    let totalRecommendedParametersReusable = this.bcService.findOptionalParameters(this.reusable_standards, this.standard_optional);
    let totalMandatoryParametersReusable = this.bcService.findRequiredParameters(this.reusable_standards, this.standard_optional);
    let reusable_recommended_value = 0
    let reusable_mandatory_value = 0
    this.verifyPackageType();
    for (let i = 0; i < this.evaluationsBadges.length; i++) {
      for (let j = 0; j < this.reusable_standards.length; j++) {
        if (this.evaluationsBadges[i].standard == this.reusable_standards[j]._id && this.evaluationsBadges[i].status == "success" && this.evaluationsBadges[i].experiment == this.experiment_id) {
          if (this.reusable_standards[j]._id == this.findParameterByName("descripcion_sistematica_scripts")) {
            this.reusable_standards[j].status = this.verificateStateParameter(this.totalScript)
          }
          else if (this.reusable_standards[j]._id == this.findParameterByName("descripcion_sistematica_software")) {
            this.reusable_standards[j].status = this.verificateStateParameter(this.totalSoftware)
          }
          else if (this.reusable_standards[j]._id == this.findParameterByName("ejecucion_exitosa_scripts")) {
            this.reusable_standards[j].status = this.verificateStateParameter(this.totalExecScripts)
          }
          else if (this.reusable_standards[j]._id == this.findParameterByName("ejecucion_software_resultados")) {
            this.reusable_standards[j].status = this.verificateStateParameter(this.totalExecSoftware)
          }
          else if (this.reusable_standards[j]._id == this.findParameterByName("datos_accesibles")) {
            this.reusable_standards[j].status = this.verificateStateParameter(totalDataAccessiblity)
          }
          else if (this.reusable_standards[j]._id == this.findParameterByName("manipulacion_datos")) {
            this.reusable_standards[j].status = this.verificateStateParameter(totalDataManipulated)
          }
          else if (this.reusable_standards[j]._id == this.findParameterByName("tiempos_ejecucion_completa")) {
            this.reusable_standards[j].status = "success"
          }
          else if (this.reusable_standards[j]._id == this.findParameterByName("tiempos_ejecucion_corta")) {
            this.reusable_standards[j].status = "success"
          }
          else {
            this.reusable_standards[j].status = "success"
          }

          if (this.standard_optional == this.reusable_standards[j].standard_type) {
            reusableRecommendedParams += 1
          } else {
            reusablelMandatoryParams += 1
          }

        }
      }
    }

    if (totalRecommendedParametersReusable == reusableRecommendedParams) {
      reusable_recommended_value = 50;
    } else {
      reusable_recommended_value = (50 * reusableRecommendedParams) / totalRecommendedParametersReusable
    }

    if (totalMandatoryParametersReusable == reusablelMandatoryParams) {
      reusable_mandatory_value = 50;
    } else {
      reusable_mandatory_value = (50 * reusablelMandatoryParams) / totalMandatoryParametersReusable
    }

    reusable_value = (reusable_recommended_value + reusable_mandatory_value)

    // calculo para el valor de la insignia disponible

    let disponible_value = 0
    let authors_file_submited = false;
    this.verificateRepository();
    this.verificateDOI();

    let availableRecommendedParams = 0;
    let availableMandatoryParams = 0;

    let totalRecommendedParametersAvailable = this.bcService.findOptionalParameters(this.disponible_standards, this.standard_optional);
    let totalMandatoryParametersAvailable = this.bcService.findRequiredParameters(this.disponible_standards, this.standard_optional);
    let available_recommended_value = 0
    let available_mandatory_value = 0


    if (this.numArtifacstWithCredentials > 0) {
      this.verificateConfidentialRegistration();
    }

    for (let i = 0; i < this.evaluationsBadges.length; i++) {
      for (let j = 0; j < this.disponible_standards.length; j++) {

        if (this.evaluationsBadges[i].standard == this.disponible_standards[j]._id && this.evaluationsBadges[i].status == "success" && this.evaluationsBadges[i].experiment == this.experiment_id) {
          if (this.disponible_standards[j]._id == this.findParameterByName("doi")) {
            this.disponible_standards[j].status = "success"
          }
          else if (this.disponible_standards[j]._id == this.findParameterByName("repositorio_archivos_public")) {
            this.disponible_standards[j].status = "success"
          }
          else if (this.disponible_standards[j]._id == this.findParameterByName("registro_confidencial")) {
            this.disponible_standards[j].status = this.verificateStateParameter(this.numArtifacstWithCredentials)
          }
          else if (this.disponible_standards[j]._id == this.findParameterByName("archivo_citation")) {
            this.disponible_standards[j].status = "success"
          }
          else if (this.disponible_standards[j]._id == this.findParameterByName("datos_accesibles")) {
            this.disponible_standards[j].status = this.verificateStateParameter(totalDataAccessiblity)
          }
          else if (this.disponible_standards[j]._id == this.findParameterByName("manipulacion_datos")) {
            this.disponible_standards[j].status = this.verificateStateParameter(totalDataManipulated)
          }
          else if (this.disponible_standards[j]._id == this.findParameterByName("archivo_authors")) {
            this.disponible_standards[j].status = "success"
            authors_file_submited = true
          }
          else if (this.disponible_standards[j]._id == this.findParameterByName("descripcion_sistematica_software")) {
            this.disponible_standards[j].status = this.verificateStateParameter(this.totalSoftware)
          }
          else if (this.disponible_standards[j]._id == this.findParameterByName("descripcion_sistematica_scripts")) {
            this.disponible_standards[j].status = this.verificateStateParameter(this.totalScript)
          }
          else {
            this.disponible_standards[j].status = "success"
          }
          if (this.standard_optional == this.disponible_standards[j].standard_type) {
            availableRecommendedParams += 1
          } else {
            availableMandatoryParams += 1
          }

        }
      }
    }

    if (totalRecommendedParametersAvailable == availableRecommendedParams) {
      available_recommended_value = 50;
    } else {
      available_recommended_value = (50 * availableRecommendedParams) / totalRecommendedParametersAvailable
    }

    if (totalMandatoryParametersAvailable == availableMandatoryParams) {
      available_mandatory_value = 50;
    } else {
      available_mandatory_value = (50 * availableMandatoryParams) / totalMandatoryParametersAvailable
    }

    disponible_value = (available_recommended_value + available_mandatory_value)


    // calcular el valor para la insignia reproducida

    let NumSubstantialArtifacts = 0
    let ToleranceArtifacts = 0
    let RespectReproducedArtifacts = 0
    NumSubstantialArtifacts = this.bcService.CalculateSubstantialArtifacts(this.artifacts) * this.reproduced_parameter_value;
    ToleranceArtifacts = this.bcService.CalculateToleranceArtifacts(this.artifacts) * this.reproduced_parameter_value;
    RespectReproducedArtifacts = this.bcService.CalculateRespectReproducedArtifacts(this.artifacts) * this.reproduced_parameter_value;



    // Evaluar Artefactos con pruebas sustanciales
    if (NumSubstantialArtifacts > 0) {
      this.calculateValueParameter("pruebas_sustanciales_reproducido")
    }
    // Evaluar Artefactos con un margen de tolerancia
    if (ToleranceArtifacts > 0) {
      this.calculateValueParameter("tolerancia_resultados_reproducido")
    }
    // Evaluar Artefactos que evidencian el respeto a la reproduccion
    if (RespectReproducedArtifacts > 0) {
      this.calculateValueParameter("respetos_trabajos_relacionados_reproducido")
    }
    let counterItemsReproduced = 0;

    let pos_authors_file = 0
    // validar el campo de author original archivo
    for (let i = 0; i < this.evaluationsBadges.length; i++) {
      for (let j = 0; j < this.reproduced_standards.length; j++) {

        if (this.evaluationsBadges[i].standard == this.reproduced_standards[j]._id && this.evaluationsBadges[i].status == "success" && this.evaluationsBadges[i].experiment == this.experiment_id) {
          if (this.reproduced_standards[j]._id == this.findParameterByName("articulo_cientifico")) {
            this.reproduced_standards[j].status = "success"
            counterItemsReproduced += 1
          }
          else if (this.reproduced_standards[j]._id == this.findParameterByName("pruebas_sustanciales_reproducido")) {
            this.reproduced_standards[j].status = this.verificateStateParameter(NumSubstantialArtifacts)
            counterItemsReproduced += 1
          }
          else if (this.reproduced_standards[j]._id == this.findParameterByName("tolerancia_resultados_reproducido")) {
            this.reproduced_standards[j].status = this.verificateStateParameter(ToleranceArtifacts)
            counterItemsReproduced += 1
          }
          else if (this.reproduced_standards[j]._id == this.findParameterByName("respetos_trabajos_relacionados_reproducido")) {
            this.reproduced_standards[j].status = this.verificateStateParameter(RespectReproducedArtifacts)
            counterItemsReproduced += 1
          }
          else if (this.reproduced_standards[j]._id == this.findParameterByName("reflexiones_criticas_reproducido")) {
            this.reproduced_standards[j].status = "success"
            counterItemsReproduced += 1
          }
          else if (this.reproduced_standards[j]._id == this.findParameterByName("narrativa_acontecimientos_reproducido")) {
            this.reproduced_standards[j].status = "success"
            counterItemsReproduced += 1
          }
          else if (this.reproduced_standards[j]._id == this.findParameterByName("archivo_justificacion_reproducido")) {
            this.reproduced_standards[j].status = "success"
            counterItemsReproduced += 1
          } else {
            this.reproduced_standards[j].status = "success"
            counterItemsReproduced += 1
          }
        } else {

          if (this.reproduced_standards[j]._id == this.findParameterByName("articulo_authors_original")) {
            pos_authors_file = j
          }

        }
      }
    }

    if (authors_file_submited == true) {
      this.reproduced_standards[pos_authors_file].status = "success"
      counterItemsReproduced += 1
    }

    this.suma_reproduced_value = (counterItemsReproduced * 100) / this.reproduced_standards.length


    /**
     * Calcular el porcentaje de la insignia replicada
     */
    let NumSubstantialReplicated = 0
    let NumToleranceReplicated = 0
    let NumRespectReplicated = 0

    NumSubstantialReplicated = this.bcService.CalculateSubstantialReplicated(this.artifacts) * this.replicated_paremeter_value;
    NumToleranceReplicated = this.bcService.CalculateToleranceReplicated(this.artifacts) * this.replicated_paremeter_value;
    NumRespectReplicated = this.bcService.CalculateRespectReplicated(this.artifacts) * this.replicated_paremeter_value;
    // Evaluar pruebas sustanciales de los artefacto replicados
    if (NumSubstantialReplicated > 0) {
      this.calculateValueParameter("pruebas_sustanciales_replicado")
    }
    // Evaluar respeto de trabajos de los artefactos replicados

    if (NumRespectReplicated > 0) {
      this.calculateValueParameter("respeto_trabajos_relacionados_replicado")
    }

    // Evaluar marco de tolerancia de los artefactos replicados
    if (NumToleranceReplicated > 0) {
      this.calculateValueParameter("tolerancia_resultados_replicado")
    }

    let counterItemsReplicated = 0;

    for (let i = 0; i < this.evaluationsBadges.length; i++) {
      for (let j = 0; j < this.replicated_standards.length; j++) {

        if (this.evaluationsBadges[i].standard == this.replicated_standards[j]._id && this.evaluationsBadges[i].status == "success" && this.evaluationsBadges[i].experiment == this.experiment_id) {
          if (this.replicated_standards[j]._id == this.findParameterByName("articulo_cientifico")) {
            this.replicated_standards[j].status = "success"
            counterItemsReplicated += 1

          } else if (this.replicated_standards[j]._id == this.findParameterByName("pruebas_sustanciales_replicado")) {
            this.replicated_standards[j].status = this.verificateStateParameter(NumSubstantialReplicated)
            counterItemsReplicated += 1
          } else if (this.replicated_standards[j]._id == this.findParameterByName("respeto_trabajos_relacionados_replicado")) {
            this.replicated_standards[j].status = this.verificateStateParameter(NumRespectReplicated)
            counterItemsReplicated += 1
          }
          else if (this.replicated_standards[j]._id == this.findParameterByName("tolerancia_resultados_replicado")) {
            this.replicated_standards[j].status = this.verificateStateParameter(NumToleranceReplicated)
            counterItemsReplicated += 1
          }
          else if (this.replicated_standards[j]._id == this.findParameterByName("reflexiones_critica_replicado")) {
            this.replicated_standards[j].status = "success"
            counterItemsReplicated += 1

          }
          else if (this.replicated_standards[j]._id == this.findParameterByName("solicitud_insignia_replicado")) {
            this.replicated_standards[j].status = "success"
            counterItemsReplicated += 1

          }
          else if (this.replicated_standards[j]._id == this.findParameterByName("narrativa_acontecimientos_replicado")) {
            this.replicated_standards[j].status = "success"
            counterItemsReplicated += 1

          }
          else {
            this.replicated_standards[j].status = "success"
            counterItemsReplicated += 1
          }
        } else {
          if (this.replicated_standards[j]._id == this.findParameterByName("articulo_authors_original")) {
            pos_authors_file = j
          }
        }
      }
    }

    if (authors_file_submited == true) {
      this.replicated_standards[pos_authors_file].status = "success"
      counterItemsReplicated += 1
    }
    this.suma_replicated_value = (counterItemsReplicated * 100) / this.replicated_standards.length

    // asignar sumatoria a cada insignia
    let value_badge = "loading"
    for (let index = 0; index < this.badges.length; index++) {

      if (this.badges[index].name == "Funcional") {
        if (isNaN(functional_value) == true) {
          this.badges[index].percentage = 0
        }
        this.badges[index].percentage = functional_value
      } else if (this.badges[index].name == "Reutilizable") {
        if (isNaN(reusable_value) == true) {
          this.badges[index].percentage = 0 //value_badge
        }
        this.badges[index].percentage = reusable_value
      } else if (this.badges[index].name == "Disponible") {
        if (isNaN(disponible_value) == true) {
          this.badges[index].percentage = 0 //value_badge
        }
        this.badges[index].percentage = disponible_value
      } else if (this.badges[index].name == "Replicado") {
        if (isNaN(this.suma_replicated_value) == true) {
          this.badges[index].percentage = 0 //value_badge
        }
        this.badges[index].percentage = this.suma_replicated_value
      } else {
        if (isNaN(this.suma_reproduced_value) == true) {
          this.badges[index].percentage = 0 //value_badge
        }
        this.badges[index].percentage = this.suma_reproduced_value
      }

    }


  }


  changeValueNan(value): string {
    let resp = ""
    if (isNaN(value) == true) {
      resp = "%"
    } else {
      resp = value.toString()
    }

    return resp
  }
}




