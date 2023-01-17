import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ArtifactController } from 'src/app/controllers/artifact.controller';
import { AlertService } from 'src/app/services/alert.service';
import { ArtifactService } from 'src/app/services/artifact.service';
import { ArtifactCreateComponent } from '../artifact-create/artifact-create.component';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-artifact-list',
  templateUrl: './artifact-list.component.html',
  styleUrls: ['./artifact-list.component.scss'],
})
export class ArtifactListComponent implements OnInit {
  experiment_id: string;
  change_language = false;
  @ViewChild('appArtifactCreate', { static: false })
  appArtifactCreate: ArtifactCreateComponent;
  pageSize = 3;
  pageSizes = [3, 6, 9];
  page = 1;
   items: MenuItem[];
  menu_type: string;
  count = 0;
  artifacts = [];
  constructor(
    private _artifactService: ArtifactService,
    private _alertService: AlertService,
    private actRoute: ActivatedRoute,
    private _translateService: TranslateService,
    private artifactController: ArtifactController,
    private _router: Router,
  ) { }

  ngOnInit(): void {
    this.experiment_id = this.actRoute.parent.snapshot.paramMap.get('id');
    this.menu_type = this.actRoute.parent.snapshot.paramMap.get("menu");
    this.getArtifacts();
    this.artifactController.init(
      this.experiment_id,
    );

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
      { routerLink: 'experiments/' + this.experiment_id  + "/artifacts_acm" },
      { routerLink: 'experiments/' + this.experiment_id  + "/badges" },
      { routerLink: 'experiments/' + this.experiment_id  + "/labpack" }
  ]

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
  }
  getArtifacts() {
    const params = this.getRequestParams(this.page, this.pageSize);

    this._artifactService.get({
      experiment: this.experiment_id,
      is_acm: false,
      ___populate: 'artifact_class,artifact_type,artifact_purpose,task',
      ...params,
    }).subscribe((data) => {
      this.artifacts = data.response;
      console.log(this.artifacts);
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
    this._router.navigate(['experiment/step/'+this.experiment_id + "/step/menu/tasks"])
  }

  Next(){
    this._router.navigate(['experiment/step/'+this.experiment_id + "/step/menu/artifacts_acm"])
  }
}
