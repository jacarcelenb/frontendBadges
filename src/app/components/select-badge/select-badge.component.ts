import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FileSaverService } from 'ngx-filesaver';
import { MenuItem } from 'primeng/api/menuitem';
import { title } from 'process';
import { ArtifactController } from 'src/app/controllers/artifact.controller';
import { AlertService } from 'src/app/services/alert.service';
import { ArtifactService } from 'src/app/services/artifact.service';
import { AuthService } from 'src/app/services/auth.service';
import { BadgeService } from 'src/app/services/badge.service';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { ExperimentService } from 'src/app/services/experiment.service';
import { ExperimenterService } from 'src/app/services/experimenter.service';
import { SelectedBadgeService } from 'src/app/services/selected-badge.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-select-badge',
  templateUrl: './select-badge.component.html',
  styleUrls: ['./select-badge.component.scss']
})
export class SelectBadgeComponent implements OnInit {
  completedExperiment: boolean = false;
  completedSteps: MenuItem[];
  completedStepSpanish: MenuItem[];
  experimentOwner: boolean = false;
  change_language = false;
  all_standards = [];
  experiment_id: string;
  userExperiments = [];
  items: MenuItem[];
  description: any;
  instruction: any;
  badges: any[];
  message: string;
  selectedbadge: any[];
  @ViewChild("idbadge") idbadge: ElementRef;
  @ViewChild("btnClose") btnClose: ElementRef;

  displayedColumns: string[] = ['image', 'title', 'name', 'delete'];
  dataSource: MatTableDataSource<any>
  @ViewChild(MatPaginator) paginator: MatPaginator;
  allbadges: any[];
  constructor(
    private _router: Router,
    private _alertService: AlertService,
    private actRoute: ActivatedRoute,
    private _translateService: TranslateService,
    private _badgeService: BadgeService,
    private _ExperimentService: ExperimentService,
    private tokenStorageService: TokenStorageService,
    private selectedBadgeService: SelectedBadgeService) { }

  ngOnInit(): void {
    this.experiment_id = this.actRoute.parent.snapshot.paramMap.get('id');

    this.getStandards();

    this.ValidateLanguage();
    this._translateService.onLangChange.subscribe(() => {
      this.ValidateLanguage()
    });

    this.items = [
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/select_badge" },
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/select_badge" },
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/select_badge" },
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/select_badge" },
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/select_badge" },
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/select_badge" },
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
    this.getAllBadges();

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

  getStandards() {
    this._badgeService.getStandards({}).subscribe((data: any) => {
      this.all_standards = data.response
    });
  }

  getUserExperiments() {
    this._ExperimentService.getExperimentsUser().subscribe((data: any) => {
      this.userExperiments = data.response

      this.experimentOwner = this.validateExperimentOwner(this.experiment_id)
    })
  }

  getAllBadges() {
    this.selectedBadgeService.get({
      experiment: this.experiment_id,
      status: true,
      ___populate: 'idbadge'
    }).subscribe((data: any) => {
      this.allbadges = data.response;
      this.dataSource = new MatTableDataSource<any>(this.allbadges);
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator._intl = new MatPaginatorIntl()
      this.dataSource.paginator._intl.itemsPerPageLabel = ""
      this.showNumberBadges();
    })
  }

  VerifyDuplicated(): boolean {
    let duplicated = false;
    for (let index = 0; index < this.allbadges.length; index++) {
      if (this.allbadges[index].idbadge._id == this.idbadge.nativeElement.value
        && this.allbadges[index].status == true) {
        duplicated = true;
      }
    }
    return duplicated;
  }

  createBadgeExperiment() {
    if (this.VerifyDuplicated()) {
      this._alertService.presentWarningAlert(this._translateService.instant("DUPLICATE_BADGE"));
    } else {
      this.selectedBadgeService.create({
        idbadge: this.idbadge.nativeElement.value,
        experiment: this.experiment_id,
        status: true

      }).subscribe(() => {
        this._alertService.presentSuccessAlert(this._translateService.instant("BADGE_CREATE_MSG"));
        this.btnClose.nativeElement.click();
        this.getAllBadges();


      })
    }
  }

  DeleteBadgeExperiment(standard) {
    this._alertService.presentConfirmAlert(
      this._translateService.instant("WORD_CONFIRM_DELETE_MSG"),
      this._translateService.instant("DELETE_BADGE"),
      this._translateService.instant("WORD_DELETE"),
      this._translateService.instant("WORD_CANCEL")
    ).then((data) => {
      if (data.isConfirmed) {
        this.selectedBadgeService.update(standard._id, {
          idbadge: standard.idbadge._id,
          experiment: standard.experiment,
          status: false

        }).subscribe(() => {
          this._alertService.presentSuccessAlert(this._translateService.instant("BADGE_DELETE_MSG"));
          this.getAllBadges();

        })

      }
    })

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


  ValidateLanguage() {
    if (this._translateService.instant('LANG_SPANISH_EC') == "Español (ECU)") {
      this.change_language = false;
    } else {
      this.change_language = true;
    }
  }

  Back() {
    this._router.navigate(['experiment/step/' + this.experiment_id + "/step/menu/artifacts"])
  }

  Next() {
    if (this.allbadges.length > 0) {
      this._router.navigate(['experiment/step/' + this.experiment_id + "/step/menu/artifacts_acm"])
    } else {
      this._alertService.presentWarningAlertWithButton(this._translateService.instant("MSG_WARNING_BADGE"))
    }

  }

  showNumberBadges() {
  this.message = "";
    if (this.allbadges.length == 1) {
       this.message = " "+ this._translateService.instant("MSG_SELECT_ONE_BADGE")
    }else if(this.allbadges.length > 1) {
      this.message = " "+this._translateService.instant("MSG_SELECT_BADGEMORE")
      +" "+this.allbadges.length +" "+this._translateService.instant("WORD_BADGES")
    }else {
      this.message =" "+ this._translateService.instant("MSG_SELECT_NO_BADGE")
    }
  }



}
