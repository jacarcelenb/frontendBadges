import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ArtifactController } from 'src/app/controllers/artifact.controller';
import { AlertService } from 'src/app/services/alert.service';
import { ArtifactService } from 'src/app/services/artifact.service';
import { BadgeService } from 'src/app/services/badge.service';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { AcmArtifactsCreateComponent } from '../acm-artifacts-create/acm-artifacts-create.component';
import { MenuItem } from 'primeng/api';
import { FileSaverService } from 'ngx-filesaver';
import * as JSZip from 'jszip';
import * as JSZipUtils from '../../../../assets/script/jszip-utils.js';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { formatDate } from 'src/app/utils/formatters';
import { ExperimentService } from 'src/app/services/experiment.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { AuthService } from 'src/app/services/auth.service';
import { ExperimenterService } from 'src/app/services/experimenter.service';

@Component({
  selector: 'app-acm-artifacts-list',
  templateUrl: './acm-artifacts-list.component.html',
  styleUrls: ['./acm-artifacts-list.component.scss']
})
export class AcmArtifactsListComponent implements OnInit {
  experiment_id: string;
  @ViewChild('appArtifactCreate', { static: false })
  appArtifactCreate: AcmArtifactsCreateComponent;
  pageSize = 2;
  userExperiments = [];
  experimentOwner: boolean = false;
  pageSizes = [2, 4, 6, 8, 10];
  page = 1;
  count = 0;
  items: MenuItem[];
  menu_type: string;
  artifacts = [];
  all_standards = [];
  evaluationsBadges: any = [];
  change_language = false;
  artifactACM = [];
  displayedColumns: string[] = ['name', 'content', 'date', 'options'];
  dataSource: MatTableDataSource<any>
  actualExperiment: any[];
  completedExperiment: boolean = false;
  completedSteps: MenuItem[];
  completedStepSpanish: MenuItem[];
  badges: any[];
  selectedbadge: any[];
  @ViewChild("idbadge") idbadge: ElementRef;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  description: any;
  instruction: any;
  eng_instruction: any;
  constructor(
    private _artifactService: ArtifactService,
    private _router: Router,
    private _alertService: AlertService,
    private actRoute: ActivatedRoute,
    private _translateService: TranslateService,
    private artifactController: ArtifactController,
    private _badgeService: BadgeService,
    private evaluatioService: EvaluationService,
    private fileSaverService: FileSaverService,
    private _ExperimentService: ExperimentService,
    private tokenStorageService: TokenStorageService,
    private _authService: AuthService,
    private experimenterService: ExperimenterService,
  ) { }

  ngOnInit(): void {
    this.experiment_id = this.actRoute.parent.snapshot.paramMap.get('id');
    this.menu_type = this.actRoute.parent.snapshot.paramMap.get("menu");
    this.getArtifacts();
    this.getEvaluationsBadges();
    this.getStandards();
    this.artifactController.init(
      this.experiment_id,
    );
    this.loadArtifactOptions()

    this.ValidateLanguage();
    this._translateService.onLangChange.subscribe(() => {
      this.ValidateLanguage()
    });

    this.items = [
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/artifacts_acm" },
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/artifacts_acm" },
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/artifacts_acm" },
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/artifacts_acm" },
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/artifacts_acm" },
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/artifacts_acm" },
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/artifacts_acm" },
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
    this.VerificateSelectedExperiment()
    this.getUserExperiments()
    this.getBadges()


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

  getUserExperiments() {
    this._ExperimentService.getExperimentsUser().subscribe((data: any) => {
      this.userExperiments = data.response

      this.experimentOwner = this.validateExperimentOwner(this.experiment_id)
    })
  }


  VerificateSelectedExperiment() {
    if (this.tokenStorageService.getIdExperiment()) {
      this.experiment_id = this.tokenStorageService.getIdExperiment();
      this.completedExperiment = (this.tokenStorageService.getStatusExperiment() == "true")
    }
  }

  getBadges() {
    this._badgeService.getBadges({
      ___populate: 'standards',
    }).subscribe((data: any) => {
      this.badges = data.response
    });
  }

  showSelectedBadge() {
    this.selectedbadge = [];
    for (let index = 0; index < this.badges.length; index++) {
      if (this.badges[index]._id == this.idbadge.nativeElement.value) {
        this.selectedbadge.push(this.badges[index])
      }
    }
    if (this.change_language) {
      this.description = this.selectedbadge[0].eng_description
      this.instruction = this.selectedbadge[0].eng_instructions
    } else {
      this.description = this.selectedbadge[0].description
      this.instruction = this.selectedbadge[0].instructions
    }
  }


  ValidateLanguage() {
    if (this._translateService.instant('LANG_SPANISH_EC') == "Español (ECU)") {
      this.change_language = false;
    } else {
      this.change_language = true;
    }
  }
  parseBytes(bytes) {
    if (bytes < 1048576) {
      return (bytes / 1024).toFixed(3) + ' KB';
    }
    else if (bytes < 1073741824) {
      return (bytes / 1048576).toFixed(2) + ' MB';
    }
    else {
      return (bytes / 1073741824).toFixed(2) + ' GB';
    }
  }
  openArtifactUploadModal() {
    this.appArtifactCreate.show();
  }

  updateArtifact(artifact) {
    this.appArtifactCreate.show(artifact._id);
  }

  async UrltoBinary(url) {
    try {
      const resultado = await JSZipUtils.getBinaryContent(url)
      return resultado
    } catch (error) {
      return;
    }
  }
  async onDown(fromRemote: boolean, artifact) {
    const fileName = artifact.name + '.' + artifact.file_format.toLowerCase();
    if (fromRemote) {
      this.UrltoBinary(artifact.file_url).then((data) => {
        this.fileSaverService.save(data, fileName);
      })


    }

  }

  loadArtifactOptions() {
    this._artifactService.getACM({
    }).subscribe((data: any) => {
      this.artifactACM = data.response;
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  ChangeName(name): string {
    let valor = name
    for (let index = 0; index < this.artifactACM.length; index++) {
      if (this.artifactACM[index].name.toLowerCase() == name.toLowerCase() && this.change_language == true) {
        valor = this.artifactACM[index].eng_name
      }

    }
    return valor;
  }

  changeDate(date: any): string {
    return formatDate(date)
  }
  deleteArtifactConfirm(artifact) {
    const title = this._translateService.instant('WORD_CONFIRM_DELETE');
    const message = this._translateService.instant('WORD_CONFIRM_DELETE_ARTIFACT');
    const confirmText = this._translateService.instant('WORD_DELETE');
    const cancelText = this._translateService.instant('WORD_CANCEL');
    this._alertService.presentConfirmAlert(
      title,
      message,
      confirmText,
      cancelText,
    ).then((result) => {
      if (result.isConfirmed) {
        this.deleteArtifact(artifact);
      }
    });
  }

  deleteArtifact(artifact) {
    const onDoneDeleting = () => {
      this.getArtifacts();
    };
    this.artifactController.removeFullArtifact(
      artifact._id,
      onDoneDeleting,
    );
    this.deleteEvaluation(artifact)
  }

  getEvaluationsBadges() {
    this.evaluatioService.get({ status: "success" }).subscribe((data: any) => {
      this.evaluationsBadges = data.response

    })
  }

  getStandards() {
    this._badgeService.getStandards({}).subscribe((data: any) => {
      this.all_standards = data.response
    });
  }

  findParameterByName(name: string): string {
    let id = ""

    for (let i = 0; i < this.all_standards.length; i++) {
      if (this.all_standards[i].description == name) {
        id = this.all_standards[i]._id
      }
    }
    return id
  }

  getNameStandard(description): string {
    let standard = ""
    for (let index = 0; index < this.all_standards.length; index++) {
      if (this.all_standards[index].description.toLowerCase() == description.toLowerCase()) {
        standard = this.all_standards[index].name
      }

    }
    return standard
  }

  deleteEvaluation(artifact) {
    let id = this.findIdParameter(artifact.name)
    let standard = false
    for (let index = 0; index < this.evaluationsBadges.length; index++) {
      if (id == this.evaluationsBadges[index]._id) {
        standard = true
      }
    }
    if (standard == true) {
      this.evaluatioService.delete(id).subscribe(data => {
        this.getEvaluationsBadges();
      })
    }


  }
  findIdParameter(parameter): string {
    let id = ""
    for (let i = 0; i < this.evaluationsBadges.length; i++) {
      if (this.evaluationsBadges[i].standard == this.findParameterByName(parameter)) {
        id = this.evaluationsBadges[i]._id
      }
    }
    return id
  }


  getArtifacts() {
    this._artifactService.get({
      experiment: this.experiment_id,
      is_acm: true,
      ___populate: 'artifact_class,artifact_type,artifact_purpose,task',
      ___sort: '-createdAt'
    }).subscribe((data) => {
      this.artifacts = data.response;
      this.dataSource = new MatTableDataSource<any>(this.artifacts);
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator._intl = new MatPaginatorIntl()
      this.dataSource.paginator._intl.itemsPerPageLabel = ""

    });

    this._artifactService.count({
      experiment: this.experiment_id
    }).subscribe((data) => {
      this.count = data.response;
    });
  }
  handlePageChange(event) {
    this.page = event;
    this.getArtifacts();
  }

  handlePageSizeChange(event) {
    this.pageSize = event.target.value;
    this.page = 1;
    this.getArtifacts();
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

  Back() {
    this._router.navigate(['experiment/step/' + this.experiment_id + "/step/menu/select_badge"])
  }

  Next() {
    this._router.navigate(['experiment/step/' + this.experiment_id + "/step/menu/badges"])
  }

}
