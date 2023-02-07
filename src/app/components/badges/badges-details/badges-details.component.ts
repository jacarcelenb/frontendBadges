import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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
import Swal from 'sweetalert2';
import { MenuItem } from 'primeng/api';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-badges-details',
  templateUrl: './badges-details.component.html',
  styleUrls: ['./badges-details.component.scss'],
})
export class BadgesDetailsComponent implements OnInit {
  experiment_id: string;
  views: string[] = [
    'badges',
    'articulo_cientifico',
    'inventario_artefacto',
    'archivo_readme',
    'guia_instrucciones_descarga',
    'guia_instrucciones_ejecutar',
    'accesibilidad_archivos_datos',
    'ejecucion_software_resultados',
    'manipulacion_datos',
    'registro_software_resultados', // TODO: complete this
    'tiempos_ejecucion_completa',
    'tiempo_ejecucion_corta',
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
    'narrativa_acontecimientos_replicado'

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
  items: MenuItem[];
  menu_type: string;
  taskWithArtifacts: any[] = [];
  taskWithOutArtifacts: any
  @ViewChild("viewButton") viewButton: ElementRef;
  displayedColumns: string[] = ['name', 'image', 'title','type','options'];
  dataSource: MatTableDataSource<any>
  @ViewChild(MatPaginator) paginator: MatPaginator;
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
  ) { }
  ngOnInit(): void {
    this.experiment_id = this.actRoute.parent.snapshot.paramMap.get('id');
    this.menu_type = this.actRoute.parent.snapshot.paramMap.get("menu");
    this.getExperiment()
    this.getEvaluationsBadges();
    this.getArtifacts();
    this.getNumArtifacTasks();
    this.getNumtasks();
    this.getArtifactPurpose();
    this.getArtifactTypes();
    this.getNumArtifactOperational_Task();
    this.getNumTotalArtifactOperational();
    this.getNumArtifactDescriptive_Task();

    this.getNumArtifactProcedural_Task();
    this.getNumTotalArtifactDescriptive();
    this.getNumTotalArtifactOperational();
    this.getNumTotalArtifactProcedural();

    this.getTotalExecutedScripts();
    this.getTotalExecutedSoftware();
    this.getTotalNormStandards();
    this.getNumTrueNormStandards();
    this.getPackage();
    this.getStandardsTypes();
    this.items = [
      { routerLink: 'experiments' },
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/experimenters" },
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/groups" },
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/tasks" },
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/artifacts" },
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/artifacts_acm" },
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/badges" },
      { routerLink: 'experiments/' + this.experiment_id + "/labpack" }
    ];


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
      this.activeView = './badges';
    }
    window.scrollTo(0, 0);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ValidateLanguage() {
    if (this._translateService.instant('LANG_SPANISH_EC') == "Español (Ecuador)") {
      this.change_language = false;
    } else {
      this.change_language = true;
    }
  }
  getExperiment() {
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
        console.log(this.badges_percentages)
        this.functional_standards = this.badges[0].standards
        this.disponible_standards = this.badges[2].standards
        this.reusable_standards = this.badges[1].standards
        this.reproduced_standards = this.badges[3].standards
        this.replicated_standards = this.badges[4].standards
        this.idfunctional = this.badges[0]._id
        this.iddisponible = this.badges[2]._id
        this.idreusable = this.badges[1]._id
        this.idreproduced = this.badges[3]._id
        this.idreplicated = this.badges[4]._id


        this._badgeService.getStandards({}).subscribe((data: any) => {
          this.qualified_standards = data.response
          this.all_standards = data.response


          this.qualified_standards.forEach((a: any) => {
            Object.assign(a, { status: "" })
          });
          this.all_standards.forEach((a: any) => {
            Object.assign(a, { status: "" })
          });

          this.dataSource = new MatTableDataSource<any>(this.all_standards);
          this.dataSource.paginator = this.paginator;
          this.dataSource.paginator._intl = new MatPaginatorIntl()
          this.dataSource.paginator._intl.itemsPerPageLabel = ""


          this.getIdBagdes()

          this.evaluatioService.get({ status: "success" }).subscribe((data: any) => {
            this.evaluationsBadges = data.response
            this.ShowPercentagesBadges()

            this.ValidateLanguage();
            this._translateService.onLangChange.subscribe(() => {
              this.ValidateLanguage()
              this.showStandardList()
            });
          })

        });

      })

    })
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
        if (this.standards_types[index].name == "optional") {
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

  getTotalNormStandards() {
    this.artifactService.count({ experiment: this.experiment_id }).toPromise().then(data => {
      this.total_norm_standards = data.response
    })
  }





  getNumtasks() {
    this.taskService.getNumtasks({
      experiment: this.experiment_id, needsArtifact: true
    }).toPromise().then(data => {
      this.numtasks = data.response;
      console.log(this.numtasks)
    });
  }
  getNumArtifacTasks() {
    this.taskService.getWithArtifacts({
      experiment: this.experiment_id,
      needsArtifact: true,
      ___populate: 'responsible,task_type',
    }).subscribe((data) => {
      let countArtifacts = 0
      console.log(data.response)
     for (let index = 0; index < data.response.length; index++) {
          if (data.response[index].needsArtifact==true &&
            data.response[index].artifacts.length > 0) {
                  countArtifacts += 1
          }
     }
      this.numArtifacTask = countArtifacts
      console.log(this.numArtifacTask)
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
    this.artifactService.get({ maturity_level: "Operational", experiment: this.experiment_id ,
    ___populate: 'experiment task'}).toPromise().then(data => {
      list_artifacts = data.response;
      console.log(list_artifacts)
      for (let index = 0; index < list_artifacts.length; index++) {
        if (list_artifacts[index].task != null) {
          count = count + 1;
        }

      }
      this.NumArtifactOperational = count;
      console.log(this.NumArtifactOperational)
    })
  }
  showStandardType(standard: any): String {
    let value = ""
    if (standard == this.standards_types[0]._id && this.change_language == false) {
      value = "Requerido"
    } else if (standard == this.standards_types[0]._id && this.change_language == true) {
      value = "Required"
    } else if (standard == this.standards_types[1]._id && this.change_language == true) {
      value = "Optional"
    } else {
      value = "Opcional"
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
    this.artifactService.get({ maturity_level: "Descriptive", experiment: this.experiment_id,
    ___populate: 'experiment task' }).toPromise().then(data => {
      list_artifacts = data.response;

      for (let index = 0; index < list_artifacts.length; index++) {
        if (list_artifacts[index].task != null) {
          count = count + 1;
        }

      }
      this.NumArtifactDescriptive = count;
      console.log(this.NumArtifactDescriptive)
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
    this.artifactService.get({ maturity_level: "Procedural", experiment: this.experiment_id,
    ___populate: 'experiment task' }).toPromise().then(data => {
      list_artifacts = data.response;

      for (let index = 0; index < list_artifacts.length; index++) {
        if (list_artifacts[index].task != null)
         {
          count = count + 1;
        }

      }
      this.NumArtifactProcedural = count;
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
    } else {
      console.log("the parameter has been evaluated before.....")
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
    } else {
      console.log("the parameter has been evaluated before.....P")
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
      if (this.artifacts[index].sistematic_description_scripts != null) {
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
    this.artifactService.get({ experiment: this.experiment_id,
    ___populate:"artifact_purpose" }).toPromise().then(data => {
      this.artifacts = data.response
      this.GetValueDisponibleParameter();
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
      if (this.artifacts[index].sistematic_description_software != null) {
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
      if (this.artifacts[index].artifact_purpose.name=="Dataset") {
           counter +=1
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
    if (this.idbadge.nativeElement.value == 0) { //All
      this.reusable_badge = false
      this.functional_badge = false
      this.disponible_badge = false
      this.replicated_badge = false
      this.reproduced_badge = false
      this.qualified_standards = this.all_standards
      this.img_badge = ''
      this.name_badge = ''
      this.title_badge = ''
      this.dataSource = new MatTableDataSource<any>(this.qualified_standards);
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator._intl = new MatPaginatorIntl()
      this.dataSource.paginator._intl.itemsPerPageLabel = ""
    }
    if (this.idbadge.nativeElement.value == this.idfunctional) {// Funcional
      this.qualified_standards = []
      this.reusable_badge = false
      this.functional_badge = true
      this.disponible_badge = false
      this.replicated_badge = false
      this.reproduced_badge = false
      this.img_badge = this.badges[0].image
      this.name_badge = this.badges[0].translation_key
      if (this.change_language == true) {
        this.title_badge = this.badges[0].eng_name
      } else {
        this.title_badge = this.badges[0].name
      }
      this.qualified_standards = this.functional_standards

      this.dataSource = new MatTableDataSource<any>(this.qualified_standards);
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator._intl = new MatPaginatorIntl()
      this.dataSource.paginator._intl.itemsPerPageLabel = ""
    }
    if (this.idbadge.nativeElement.value == this.idreusable) { // Reutilizable
      this.qualified_standards = []
      this.functional_badge = false
      this.disponible_badge = false
      this.reusable_badge = true
      this.replicated_badge = false
      this.reproduced_badge = false
      this.img_badge = this.badges[1].image
      this.name_badge = this.badges[1].translation_key
      if (this.change_language == true) {
        this.title_badge = this.badges[1].eng_name
      } else {
        this.title_badge = this.badges[1].name
      }
      this.qualified_standards = this.reusable_standards

      this.dataSource = new MatTableDataSource<any>(this.qualified_standards);
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator._intl = new MatPaginatorIntl()
      this.dataSource.paginator._intl.itemsPerPageLabel = ""
    }
    if (this.idbadge.nativeElement.value == this.iddisponible) { // Disponible
      this.qualified_standards = []
      this.functional_badge = false
      this.reusable_badge = false
      this.disponible_badge = true
      this.replicated_badge = false
      this.reproduced_badge = false
      this.img_badge = this.badges[2].image
      this.name_badge = this.badges[2].translation_key

      if (this.change_language == true) {
        this.title_badge = this.badges[2].eng_name
      } else {
        this.title_badge = this.badges[2].name
      }
      this.qualified_standards = this.disponible_standards
      this.dataSource = new MatTableDataSource<any>(this.qualified_standards);
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator._intl = new MatPaginatorIntl()
      this.dataSource.paginator._intl.itemsPerPageLabel = ""
    }
    if (this.idbadge.nativeElement.value == this.idreproduced) { // Reproducido
      this.qualified_standards = []
      this.functional_badge = false
      this.reusable_badge = false
      this.disponible_badge = false
      this.replicated_badge = false
      this.reproduced_badge = true
      this.img_badge = this.badges[3].image
      this.name_badge = this.badges[3].translation_key
      if (this.change_language == true) {
        this.title_badge = this.badges[3].eng_name
      } else {
        this.title_badge = this.badges[3].name
      }
      this.qualified_standards = this.reproduced_standards

      this.dataSource = new MatTableDataSource<any>(this.qualified_standards);
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator._intl = new MatPaginatorIntl()
      this.dataSource.paginator._intl.itemsPerPageLabel = ""
    }
    if (this.idbadge.nativeElement.value == this.idreplicated) { // Replicated
      this.qualified_standards = []
      this.functional_badge = false
      this.reusable_badge = false
      this.disponible_badge = false
      this.replicated_badge = true
      this.reproduced_badge = false
      this.img_badge = this.badges[4].image
      this.name_badge = this.badges[4].translation_key
      if (this.change_language == true) {
        this.title_badge = this.badges[4].eng_name
      } else {
        this.title_badge = this.badges[4].name
      }
      this.qualified_standards = this.replicated_standards

      this.dataSource = new MatTableDataSource<any>(this.qualified_standards);
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator._intl = new MatPaginatorIntl()
      this.dataSource.paginator._intl.itemsPerPageLabel = ""
    }
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

    for (let i = 0; i < this.functional_standards.length; i++) {
      for (let j = 0; j < this.optional_parameters.length; j++) {
        if (this.optional_parameters[j]._id == this.functional_standards[i]._id && this.functional_standards[i].status != "success") {
          this.functional_standards[i].value = "😥"
          this.functional_standards[i].status = "pending"
        }
      }
    }

    for (let i = 0; i < this.reusable_standards.length; i++) {
      for (let j = 0; j < this.optional_parameters.length; j++) {
        if (this.optional_parameters[j]._id == this.reusable_standards[i]._id && this.reusable_standards[i].status != "success") {
          this.reusable_standards[i].value = "😥"
          this.reusable_standards[i].status = "pending"
        }
      }
    }


    for (let i = 0; i < this.disponible_standards.length; i++) {
      for (let j = 0; j < this.optional_parameters.length; j++) {
        if (this.optional_parameters[j]._id == this.disponible_standards[i]._id && this.disponible_standards[i].status != "success") {
          this.disponible_standards[i].value = "😥"
          this.disponible_standards[i].status = "pending"
        }
      }
    }

    for (let i = 0; i < this.reproduced_standards.length; i++) {
      for (let j = 0; j < this.optional_parameters.length; j++) {
        if (this.optional_parameters[j]._id == this.reproduced_standards[i]._id && this.reproduced_standards[i].status != "success") {
          this.reproduced_standards[i].value = "😥"
          this.reproduced_standards[i].status = "pending"
        }
      }
    }

    for (let i = 0; i < this.replicated_standards.length; i++) {
      for (let j = 0; j < this.optional_parameters.length; j++) {
        if (this.optional_parameters[j]._id == this.replicated_standards[i]._id && this.replicated_standards[i].status != "success") {
          this.replicated_standards[i].value = "😥"
          this.replicated_standards[i].status = "pending"
        }
      }
    }



  }





  // metodo para mostrar el porcentaje de las insignias
  ShowPercentagesBadges() {
    this.parameter_value = this.bcService.CalculateFuncionalParameterValue(this.experiment,this.functional_standards,this.standard_optional)
    this.reusable_parameter_value = this.bcService.CalculateReusableParemeterValue(this.experiment,this.reusable_standards,this.standard_optional)
    this.disponible_parameter_value =this.bcService.CalculateAvalaibleParemeterValue(this.numArtifacstWithCredentials,this.disponible_standards,this.standard_optional)
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
    let NumArtifactsProcedural = 0
    let NumArtifactsOperational = 0
    let Num_Descriptive = 0
    let relevanceTask = 0
    let totalDataManipulated = 0
    let totalDataAccessiblity = 0


    this.getTotalDescriptionScripts()
    this.getTotalDescriptionSoftware()

    this.totalSoftware = this.bcService.calculateSoftwareTotal(this.numtotalSoftware, this.numdescription_Software, this.parameter_value)
    this.totalScript = this.bcService.calculateScripstTotal(this.numtotalScripts, this.numdescription_Scripts, this.parameter_value)
    this.totalExecScripts = this.bcService.calculateScripstExecutedTotal(this.numtotalScripts, this.numExecScripts, this.parameter_value)
    this.totalExecSoftware = this.bcService.calculateExecutedSoftwareTotal(this.numtotalSoftware, this.numExecSoftware, this.parameter_value)
    NumArtifactsProcedural = this.bcService.calculateNumArtifactProcedural(this.NumArtifactProcedural, this.NumArtifactProcedural, this.parameter_value)
    NumArtifactsOperational = this.bcService.calculateNumArtifactOperational(this.NumArtifactOperational, this.NumArtifactOperational, this.parameter_value)
    Num_Descriptive = this.bcService.calculateNumArtifactDescriptive(this.NumArtifactDescriptive, this.NumArtifactDescriptive, this.parameter_value)
    totalDataManipulated = this.bcService.calculatetotalDataManipulation(this.getTotalData(), this.getTotalManipulatedData(), this.parameter_value);
    totalDataAccessiblity = this.bcService.calculatetotalDataAccesiblity(this.getTotalData(), this.getTotalAccesibleData(), this.parameter_value)
    relevanceTask = this.bcService.calculateRelevantTask(this.numArtifacTask, this.numtasks, this.parameter_value)
    // Evaluar el parametro para cada tipo de artefacto
    if (NumArtifactsOperational > 0) {
      this.calculateValueParameter("artefactos_nivel_operacional")
    }
    if (NumArtifactsProcedural > 0) {
      this.calculateValueParameter("artefactos_nivel_procedimental")
    }
    if (Num_Descriptive > 0) {
      this.calculateValueParameter("artefactos_nivel_descriptivo")
    }

    // Evaluar los parametros de descripciones sistematicas para el software y scripts
    if (this.totalScript > 0) {
      this.calculateValueParameter("descripcion_sistematica_scripts")
    }
    if (this.totalSoftware > 0) {
      this.calculateValueParameter("descripcion_sistematica_software")
    }

    // Evaluar los parametros de ejecuciones para el software y scripts
    if (this.totalExecScripts > 0) {
      this.calculateValueParameter("ejecucion_exitosa_scripts")
    }
    if (this.totalExecSoftware > 0) {
      this.calculateValueParameter("ejecucion_software_resultados")
    }

    // Evaluar el parametro de relevancia de los artefactos
    if (relevanceTask > 0) {
      this.calculateValueParameter("relevancia_artefacto")
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

    for (let i = 0; i < this.evaluationsBadges.length; i++) {
      for (let j = 0; j < this.functional_standards.length; j++) {
        if (this.evaluationsBadges[i].standard == this.functional_standards[j]._id && this.evaluationsBadges[i].status == "success" && this.evaluationsBadges[i].experiment == this.experiment_id) {

          if (this.functional_standards[j]._id == this.findParameterByName("relevancia_artefacto")) {
            this.functional_standards[j].status = "success"
            this.functional_standards[j].value = "" + relevanceTask.toFixed(2)
            this.suma_parameter_value += relevanceTask
          }
          else if (this.functional_standards[j]._id == this.findParameterByName("artefactos_nivel_operacional")) {
            this.functional_standards[j].status = "success"
            this.functional_standards[j].value = "" + NumArtifactsOperational.toFixed(2)
            this.suma_parameter_value += NumArtifactsOperational
          }
          else if (this.functional_standards[j]._id == this.findParameterByName("artefactos_nivel_procedimental")) {
            this.functional_standards[j].status = "success"
            this.functional_standards[j].value = "" + NumArtifactsProcedural.toFixed(2)
            this.suma_parameter_value += NumArtifactsProcedural
          }
          else if (this.functional_standards[j]._id == this.findParameterByName("artefactos_nivel_descriptivo")) {
            this.functional_standards[j].status = "success"
            this.functional_standards[j].value = "" + Num_Descriptive.toFixed(2)
            this.suma_parameter_value += Num_Descriptive
          }
          else if (this.functional_standards[j]._id == this.findParameterByName("descripcion_sistematica_scripts")) {
            this.functional_standards[j].status = "success"
            this.functional_standards[j].value = "" + this.totalScript.toFixed(2)
            this.suma_parameter_value += this.totalScript
          }
          else if (this.functional_standards[j]._id == this.findParameterByName("descripcion_sistematica_software")) {
            this.functional_standards[j].status = "success"
            this.functional_standards[j].value = "" + this.totalSoftware.toFixed(2)
            this.suma_parameter_value += this.totalSoftware
          }
          else if (this.functional_standards[j]._id == this.findParameterByName("ejecucion_exitosa_scripts")) {
            this.functional_standards[j].status = "success"
            this.functional_standards[j].value = "" + this.totalExecScripts.toFixed(2)
            this.suma_parameter_value += this.totalExecScripts
          }
          else if (this.functional_standards[j]._id == this.findParameterByName("ejecucion_software_resultados")) {
            this.functional_standards[j].status = "success"
            this.functional_standards[j].value = "" + this.totalExecSoftware.toFixed(2)
            this.suma_parameter_value += this.totalExecSoftware
          }
          else if (this.functional_standards[j]._id == this.findParameterByName("datos_accesibles")) {
            this.functional_standards[j].status = "success"
            this.functional_standards[j].value = "" + totalDataAccessiblity.toFixed(2)
            this.suma_parameter_value += totalDataAccessiblity
          }
          else if (this.functional_standards[j]._id == this.findParameterByName("manipulacion_datos")) {
            this.functional_standards[j].status = "success"
            this.functional_standards[j].value = "" + totalDataManipulated.toFixed(2)
            this.suma_parameter_value += totalDataManipulated
          }
          else if (this.functional_standards[j]._id == this.findParameterByName("tiempos_ejecucion_completa")) {
            this.functional_standards[j].status = "success"
            this.functional_standards[j].value = "⭐"
            this.suma_parameter_value += 0
          }
          else if (this.functional_standards[j]._id == this.findParameterByName("tiempos_ejecucion_corta")) {
            this.functional_standards[j].status = "success"
            this.functional_standards[j].value = "⭐"
            this.suma_parameter_value += 0
          } else {
            this.functional_standards[j].status = "success"
            this.functional_standards[j].value = "" + this.parameter_value
            this.suma_parameter_value += this.parameter_value
          }

        }
      }
    }


    let functional_value = 0
    functional_value = this.suma_parameter_value


    // calculo del porcentaje de la insignia reutlizable
    let reusable_value = 0
    let NormsStandars = 0
    this.totalScript = this.bcService.calculateScripstTotal(this.numtotalScripts, this.numdescription_Scripts, this.reusable_parameter_value)
    this.totalSoftware = this.bcService.calculateSoftwareTotal(this.numtotalSoftware, this.numdescription_Software, this.reusable_parameter_value)
    this.totalExecScripts = this.bcService.calculateScripstExecutedTotal(this.numtotalScripts, this.numExecScripts, this.reusable_parameter_value)
    this.totalExecSoftware = this.bcService.calculateExecutedSoftwareTotal(this.numtotalSoftware, this.numExecSoftware, this.reusable_parameter_value)
    NumArtifactsProcedural = this.bcService.calculateNumArtifactProcedural(this.NumArtifactProcedural, this.NumArtifactProcedural, this.reusable_parameter_value)
    NumArtifactsOperational = this.bcService.calculateNumArtifactOperational(this.NumArtifactOperational, this.NumArtifactOperational, this.reusable_parameter_value)
    Num_Descriptive = this.bcService.calculateNumArtifactDescriptive(this.NumArtifactDescriptive, this.NumArtifactDescriptive, this.reusable_parameter_value)
    relevanceTask = this.bcService.calculateRelevantTask(this.numArtifacTask, this.numtasks, this.reusable_parameter_value)
    totalDataManipulated = this.bcService.calculatetotalDataManipulation(this.getTotalData(), this.getTotalManipulatedData(), this.reusable_parameter_value);
    totalDataAccessiblity = this.bcService.calculatetotalDataAccesiblity(this.getTotalData(), this.getTotalAccesibleData(), this.reusable_parameter_value)
    NormsStandars = this.bcService.calculateNormsStandards(this.total_norm_standards, this.true_norm_standards, this.reusable_parameter_value)
    if (NormsStandars > 0) {
      this.calculateValueParameter("respeto_normas_estandares")
    }
    this.verifyPackageType();
    for (let i = 0; i < this.evaluationsBadges.length; i++) {
      for (let j = 0; j < this.reusable_standards.length; j++) {
        if (this.evaluationsBadges[i].standard == this.reusable_standards[j]._id && this.evaluationsBadges[i].status == "success" && this.evaluationsBadges[i].experiment == this.experiment_id) {

          if (this.reusable_standards[j]._id == this.findParameterByName("relevancia_artefacto")) {
            this.reusable_standards[j].status = "success"
            this.reusable_standards[j].value = "" + relevanceTask.toFixed(2)
            this.suma_reusable_value += relevanceTask
          }
          else if (this.reusable_standards[j]._id == this.findParameterByName("artefactos_nivel_operacional")) {
            this.reusable_standards[j].status = "success"
            this.reusable_standards[j].value = "" + NumArtifactsOperational.toFixed(2)
            this.suma_reusable_value += NumArtifactsOperational
          }
          else if (this.reusable_standards[j]._id == this.findParameterByName("artefactos_nivel_procedimental")) {
            this.reusable_standards[j].status = "success"
            this.reusable_standards[j].value = "" + NumArtifactsProcedural.toFixed(2)
            this.suma_reusable_value += NumArtifactsProcedural
          }
          else if (this.reusable_standards[j]._id == this.findParameterByName("artefactos_nivel_descriptivo")) {
            this.reusable_standards[j].status = "success"
            this.reusable_standards[j].value = "" + Num_Descriptive.toFixed(2)
            this.suma_reusable_value +=Num_Descriptive
          }
          else if (this.reusable_standards[j]._id == this.findParameterByName("descripcion_sistematica_scripts")) {
            this.reusable_standards[j].status = "success"
            this.reusable_standards[j].value = "" + this.totalScript.toFixed(2)
            this.suma_reusable_value += this.totalScript
          }
          else if (this.reusable_standards[j]._id == this.findParameterByName("descripcion_sistematica_software")) {
            this.reusable_standards[j].status = "success"
            this.reusable_standards[j].value = "" + this.totalSoftware.toFixed(2)
            this.suma_reusable_value += this.totalSoftware
          }
          else if (this.reusable_standards[j]._id == this.findParameterByName("ejecucion_exitosa_scripts")) {
            this.reusable_standards[j].status = "success"
            this.reusable_standards[j].value = "" + this.totalExecScripts.toFixed(2)
            this.suma_reusable_value += this.totalExecScripts
          }
          else if (this.reusable_standards[j]._id == this.findParameterByName("ejecucion_software_resultados")) {
            this.reusable_standards[j].status = "success"
            this.reusable_standards[j].value = "" + this.totalExecSoftware.toFixed(2)
            this.suma_reusable_value += this.totalExecSoftware
          }
          else if (this.reusable_standards[j]._id == this.findParameterByName("datos_accesibles")) {
            this.reusable_standards[j].status = "success"
            this.reusable_standards[j].value = "" + totalDataAccessiblity.toFixed(2)
            this.suma_reusable_value += totalDataAccessiblity
          }
          else if (this.reusable_standards[j]._id == this.findParameterByName("manipulacion_datos")) {
            this.reusable_standards[j].status = "success"
            this.reusable_standards[j].value = "" + totalDataManipulated.toFixed(2)
            this.suma_reusable_value += totalDataManipulated
          }
          else if (this.reusable_standards[j]._id == this.findParameterByName("respeto_normas_estandares")) {
            this.reusable_standards[j].status = "success"
            this.reusable_standards[j].value = "" + NormsStandars.toFixed(2)
            this.suma_reusable_value += NormsStandars
          }
          else if (this.reusable_standards[j]._id == this.findParameterByName("tiempos_ejecucion_completa")) {
            this.reusable_standards[j].status = "success"
            this.reusable_standards[j].value = "⭐"
            this.suma_reusable_value += 0
          }
          else if (this.reusable_standards[j]._id == this.findParameterByName("tiempos_ejecucion_corta")) {
            this.reusable_standards[j].status = "success"
            this.reusable_standards[j].value = "⭐"
            this.suma_reusable_value += 0
          }
          else {
            this.reusable_standards[j].status = "success"
            this.reusable_standards[j].value = "" + this.reusable_parameter_value
            this.suma_reusable_value += this.reusable_parameter_value
          }

        }
      }
    }

    reusable_value = this.suma_reusable_value

    // calculo para el valor de la insignia disponible

    let disponible_value = 0
    let authors_file_submited = false;
    this.verificateRepository();
    this.verificateDOI();
    totalDataManipulated = this.bcService.calculatetotalDataManipulation(this.getTotalData(), this.getTotalManipulatedData(), this.disponible_parameter_value);
    totalDataAccessiblity = this.bcService.calculatetotalDataAccesiblity(this.getTotalData(), this.getTotalAccesibleData(), this.disponible_parameter_value)
    this.totalScript = this.bcService.calculateScripstTotal(this.numtotalScripts, this.numdescription_Scripts, this.disponible_parameter_value)
    this.totalSoftware = this.bcService.calculateSoftwareTotal(this.numtotalSoftware, this.numdescription_Software, this.disponible_parameter_value)
    NumArtifactsOperational = this.bcService.calculateNumArtifactOperational(this.NumArtifactOperational, this.NumArtifactOperational, this.disponible_parameter_value)
    if (this.numArtifacstWithCredentials) {
      this.verificateConfidentialRegistration();
    }

    for (let i = 0; i < this.evaluationsBadges.length; i++) {
        for (let j = 0; j < this.disponible_standards.length; j++) {

          if (this.evaluationsBadges[i].standard == this.disponible_standards[j]._id && this.evaluationsBadges[i].status == "success" && this.evaluationsBadges[i].experiment == this.experiment_id) {
            if (this.disponible_standards[j]._id == this.findParameterByName("doi")) {
              this.disponible_standards[j].status = "success"
              this.disponible_standards[j].value = "" + this.disponible_parameter_value
              this.suma_disponible_value += this.disponible_parameter_value
            }
            else if (this.disponible_standards[j]._id == this.findParameterByName("repositorio_archivos_public")) {
              this.disponible_standards[j].status = "success"
              this.disponible_standards[j].value = "" + this.disponible_parameter_value
              this.suma_disponible_value += this.disponible_parameter_value
            }
            else if (this.disponible_standards[j]._id == this.findParameterByName("registro_confidencial")) {
              this.disponible_standards[j].status = "success"
              this.disponible_standards[j].value = "" + this.disponible_parameter_value
              this.suma_disponible_value += this.disponible_parameter_value
            }
            else if (this.disponible_standards[j]._id == this.findParameterByName("archivo_citation")) {
              this.disponible_standards[j].status = "success"
              this.disponible_standards[j].value = "⭐"
            }
            else if (this.disponible_standards[j]._id == this.findParameterByName("datos_accesibles")) {
              this.disponible_standards[j].status = "success"
              this.disponible_standards[j].value = "" + totalDataAccessiblity.toFixed(2)
              this.suma_disponible_value += totalDataAccessiblity
            }
            else if (this.disponible_standards[j]._id == this.findParameterByName("manipulacion_datos")) {
              this.disponible_standards[j].status = "success"
              this.disponible_standards[j].value = "" + totalDataManipulated.toFixed(2)
              this.suma_disponible_value+= totalDataManipulated
            }
            else if (this.disponible_standards[j]._id == this.findParameterByName("archivo_authors")) {
              this.disponible_standards[j].status = "success"
              this.disponible_standards[j].value = "⭐"
              authors_file_submited = true
            }
            else if (this.disponible_standards[j]._id == this.findParameterByName("descripcion_sistematica_software")) {
              this.disponible_standards[j].status = "success"
              this.disponible_standards[j].value = "" + this.totalSoftware.toFixed(2)
              this.suma_disponible_value += this.totalSoftware
            }
            else if (this.disponible_standards[j]._id == this.findParameterByName("descripcion_sistematica_scripts")) {
              this.disponible_standards[j].status = "success"
              this.disponible_standards[j].value = "" + this.totalScript.toFixed(2)
              this.suma_disponible_value += this.totalScript
            }
            else if (this.disponible_standards[j]._id == this.findParameterByName("artefactos_nivel_operacional")) {
              this.disponible_standards[j].status = "success"
              this.disponible_standards[j].value = "" + NumArtifactsOperational.toFixed(2)
              this.suma_disponible_value += NumArtifactsOperational
            } else {
              this.disponible_standards[j].status = "success"
              this.disponible_standards[j].value = "" + this.disponible_parameter_value
              this.suma_disponible_value += this.disponible_parameter_value
            }

          }
        }
      }

    disponible_value = this.suma_disponible_value


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


    let pos_authors_file = 0
    // validar el campo de author original archivo
    for (let i = 0; i < this.evaluationsBadges.length; i++) {
      for (let j = 0; j < this.reproduced_standards.length; j++) {

        if (this.evaluationsBadges[i].standard == this.reproduced_standards[j]._id && this.evaluationsBadges[i].status == "success" && this.evaluationsBadges[i].experiment == this.experiment_id) {
          if (this.reproduced_standards[j]._id == this.findParameterByName("articulo_cientifico")) {
            this.reproduced_standards[j].status = "success"
            this.reproduced_standards[j].value = "" + this.reproduced_parameter_value.toFixed(2)
            this.suma_reproduced_value += this.reproduced_parameter_value
          }
          else if (this.reproduced_standards[j]._id == this.findParameterByName("pruebas_sustanciales_reproducido")) {
            this.reproduced_standards[j].status = "success"
            this.reproduced_standards[j].value = "" + NumSubstantialArtifacts.toFixed(2)
            this.suma_reproduced_value += NumSubstantialArtifacts
          }
          else if (this.reproduced_standards[j]._id == this.findParameterByName("tolerancia_resultados_reproducido")) {
            this.reproduced_standards[j].status = "success"
            this.reproduced_standards[j].value = "" + ToleranceArtifacts.toFixed(2)
            this.suma_reproduced_value += ToleranceArtifacts
          }
          else if (this.reproduced_standards[j]._id == this.findParameterByName("respetos_trabajos_relacionados_reproducido")) {
            this.reproduced_standards[j].status = "success"
            this.reproduced_standards[j].value = "" + RespectReproducedArtifacts.toFixed(2)
            this.suma_reproduced_value += RespectReproducedArtifacts
          }
          else if (this.reproduced_standards[j]._id == this.findParameterByName("reflexiones_criticas_reproducido")) {
            this.reproduced_standards[j].status = "success"
            this.reproduced_standards[j].value = "⭐"
            this.suma_reproduced_value += 0
          }
          else if (this.reproduced_standards[j]._id == this.findParameterByName("narrativa_acontecimientos_reproducido")) {
            this.reproduced_standards[j].status = "success"
            this.reproduced_standards[j].value = "⭐"
            this.suma_reproduced_value += 0
          }
          else if (this.reproduced_standards[j]._id == this.findParameterByName("archivo_justificacion_reproducido")) {
            this.reproduced_standards[j].status = "success"
            this.reproduced_standards[j].value = "⭐"
            this.suma_reproduced_value += 0
          } else {
            this.reproduced_standards[j].status = "success"
            this.reproduced_standards[j].value = "" + this.reproduced_parameter_value.toFixed(2)
            this.suma_reproduced_value += this.reproduced_parameter_value
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
      this.reproduced_standards[pos_authors_file].value = "" + this.reproduced_parameter_value.toFixed(2)
      this.suma_reproduced_value += this.reproduced_parameter_value
    }


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


    for (let i = 0; i < this.evaluationsBadges.length; i++) {
      for (let j = 0; j < this.replicated_standards.length; j++) {

        if (this.evaluationsBadges[i].standard == this.replicated_standards[j]._id && this.evaluationsBadges[i].status == "success" && this.evaluationsBadges[i].experiment == this.experiment_id) {
          if (this.replicated_standards[j]._id == this.findParameterByName("articulo_cientifico")) {
            this.replicated_standards[j].status = "success"
            this.replicated_standards[j].value = "" + this.replicated_paremeter_value.toFixed(2)
            this.suma_replicated_value += this.replicated_paremeter_value

          } else if (this.replicated_standards[j]._id == this.findParameterByName("pruebas_sustanciales_replicado")) {
            this.replicated_standards[j].status = "success"
            this.replicated_standards[j].value = "" + NumSubstantialReplicated.toFixed(2)
            this.suma_replicated_value += NumSubstantialReplicated
          } else if (this.replicated_standards[j]._id == this.findParameterByName("respeto_trabajos_relacionados_replicado")) {
            this.replicated_standards[j].status = "success"
            this.replicated_standards[j].value = "" + NumRespectReplicated.toFixed(2)
            this.suma_replicated_value += NumRespectReplicated
          }
          else if (this.replicated_standards[j]._id == this.findParameterByName("tolerancia_resultados_replicado")) {
            this.replicated_standards[j].status = "success"
            this.replicated_standards[j].value = "" + NumToleranceReplicated.toFixed(2)
            this.suma_replicated_value += NumToleranceReplicated
          }
          else if (this.replicated_standards[j]._id == this.findParameterByName("reflexiones_critica_replicado")) {
            this.replicated_standards[j].status = "success"
            this.replicated_standards[j].value = "⭐"
            this.suma_replicated_value += 0
          }
          else if (this.replicated_standards[j]._id == this.findParameterByName("solicitud_insignia_replicado")) {
            this.replicated_standards[j].status = "success"
            this.replicated_standards[j].value = "⭐"
            this.suma_replicated_value += 0
          }
          else if (this.replicated_standards[j]._id == this.findParameterByName("narrativa_acontecimientos_replicado")) {
            this.replicated_standards[j].status = "success"
            this.replicated_standards[j].value = "⭐"
            this.suma_replicated_value += 0
          }
          else {
            this.replicated_standards[j].status = "success"
            this.replicated_standards[j].value = "" + this.replicated_paremeter_value.toFixed(2)
            this.suma_replicated_value += this.replicated_paremeter_value
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
      this.replicated_standards[pos_authors_file].value = "" + this.replicated_paremeter_value.toFixed(2)
      this.suma_replicated_value += this.replicated_paremeter_value
    }

    // asignar sumatoria a cada insignia
    for (let index = 0; index < this.badges.length; index++) {
      if (this.badges[index].name == "Reutilizable") {
        this.badges[index].percentage = reusable_value
      }
      else if (this.badges[index].name == "Reproducido") {
        this.badges[index].percentage = this.suma_reproduced_value
      } else if (this.badges[index].name == "Disponible") {
        this.badges[index].percentage = disponible_value
      }
      else if (this.badges[index].name == "Funcional") {
        this.badges[index].percentage = functional_value
      } else {
        this.badges[index].percentage = this.suma_replicated_value
      }
    }


  }
}




