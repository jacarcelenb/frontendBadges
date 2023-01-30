import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ArtifactController } from 'src/app/controllers/artifact.controller';
import { AlertService } from 'src/app/services/alert.service';
import { ArtifactService } from 'src/app/services/artifact.service';
import { BadgeService } from 'src/app/services/badge.service';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { AcmArtifactsCreateComponent } from '../acm-artifacts-create/acm-artifacts-create.component';
import { MenuItem } from 'primeng/api';

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
  pageSizes = [2,4, 6, 8,10];
  page = 1;
  count = 0;
  items: MenuItem[];
  menu_type: string;
  artifacts = [];
  all_standards = [];
  evaluationsBadges: any = [];
  change_language = false;
  artifactACM = [];
  constructor(
    private _artifactService: ArtifactService,
    private _router: Router,
    private _alertService: AlertService,
    private actRoute: ActivatedRoute,
    private _translateService: TranslateService,
    private artifactController: ArtifactController,
    private _badgeService: BadgeService,
    private evaluatioService: EvaluationService,
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
      {routerLink: 'experiments'},
      { routerLink:'experiment/step/'+this.experiment_id + "/step/menu/experimenters"},
      { routerLink: 'experiment/step/'+this.experiment_id + "/step/menu/groups" },
      { routerLink: 'experiment/step/'+this.experiment_id + "/step/menu/tasks" },
      { routerLink:  'experiment/step/'+this.experiment_id + "/step/menu/artifacts" },
      { routerLink: 'experiment/step/'+this.experiment_id + "/step/menu/artifacts_acm" },
      { routerLink: 'experiments/' + this.experiment_id  + "/badges" },
      { routerLink: 'experiments/' + this.experiment_id  + "/labpack" }
  ];

  }

  ValidateLanguage() {
    if (this._translateService.instant('LANG_SPANISH_EC') == "Español (Ecuador)") {
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

  loadArtifactOptions() {
    this._artifactService.getACM( {
    }).subscribe((data:any)=>{
      this.artifactACM = data.response;
    })
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
      if (this.all_standards[i].name == name) {
        id = this.all_standards[i]._id
      }
    }
    return id
  }

 getNameStandard( description): string {
  let standard = ""
  for (let index = 0; index < this.all_standards.length; index++) {
    if (this.all_standards[index].description.toLowerCase() == description.toLowerCase()) {
       standard = this.all_standards[index].name
    }

  }
  return standard
 }

  deleteEvaluation(artifact) {
    let value = ""
     value = this.getNameStandard(artifact.name)
    this.evaluatioService.delete(this.findIdParameter(value)).subscribe(data => {
      this.getEvaluationsBadges();
    })
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
    const params = this.getRequestParams(this.page, this.pageSize);

    this._artifactService.get({
      experiment: this.experiment_id,
      is_acm: true,
      ___populate: 'artifact_class,artifact_type,artifact_purpose,task',
      ...params,
    }).subscribe((data) => {
      this.artifacts = data.response;
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

  Back(){
    this._router.navigate(['experiment/step/'+this.experiment_id + "/step/menu/artifacts"])
  }

  Next(){
    this._router.navigate(['experiment/step/'+this.experiment_id + "/step/menu/badges"])
   }

}
