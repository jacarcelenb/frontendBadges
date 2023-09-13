import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { BadgeService } from 'src/app/services/badge.service';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { ExperimentService } from 'src/app/services/experiment.service';
import { AuthService } from '../../../services/auth.service';
import { TokenStorageService } from '../../../services/token-storage.service';
import { ExperimenterService } from '../../../services/experimenter.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-min-config',
  templateUrl: './min-config.component.html',
  styleUrls: ['./min-config.component.scss']
})
export class MinConfigComponent implements OnInit {
  @Output() closeView: EventEmitter<any> = new EventEmitter<any>();
  isChecked = false;
  standard_name = "30_min_duracion_config_install";
  @Input() standard: string;
  id_experiment: string;
  experiment: any
  evaluationsBadges: any = [];
  id_standard: string;
  userExperiments = [];
  experimentOwner: boolean = false;

  constructor(
    private actRoute: ActivatedRoute,
    private alertService: AlertService,
    private experimentService: ExperimentService,
    private evaluationService: EvaluationService,
    private _badgeService: BadgeService,
    private _authService: AuthService,
    private tokenStorageService: TokenStorageService,
    private _experimenterService: ExperimenterService,
    private translateService: TranslateService

  ) { }

  ngOnInit(): void {
    this.id_experiment = this.actRoute.parent.snapshot.paramMap.get('id');

    this.getExperiment()
    this.getBadgesStandards()
    this.getEvaluationsBadges();
    this.getUserExperiments()
  }

  getExperiment() {
    this.experimentService.get({ _id: this.id_experiment }).subscribe((data: any) => {
      this.experiment = data.response

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

  getUserExperiments(){
    this.experimentService.getExperimentsUser().subscribe((data:any)=>{
       this.userExperiments = data.response
       this.experimentOwner = this.validateExperimentOwner(this.id_experiment)

    })
  }
  getBadgesStandards() {

    this._badgeService.getStandards({ name: this.standard }).subscribe((data: any) => {
      this.id_standard = data.response[0]._id
    });
  }

  getEvaluationsBadges() {
    this.evaluationService.get({ status: "success" }).subscribe((data: any) => {
      this.evaluationsBadges = data.response


    })
  }

   // verificar si el parametro ya fue evaluado
   VerifySuccessParameter(): boolean {
    let evaluated = false;
    for (let index = 0; index < this.evaluationsBadges.length; index++) {
      if (this.evaluationsBadges[index].standard == this.id_standard && this.evaluationsBadges[index].status == "success" && this.evaluationsBadges[index].experiment == this.id_experiment) {
        evaluated = true
      }

    }
    return evaluated
  }
  createEvaluationStandard() {
    if (this.VerifySuccessParameter()== false) {
      this.evaluationService.createEvaluation({
        status: 'success',
        experiment: this.id_experiment,
        standard: this.id_standard
      }).subscribe((data: {}) => { })
    }
  }

  onChange(checked: boolean) {
    this.isChecked = checked;

    if(this.isChecked==true){
      this.alertService.presentConfirmAlert(
        this.translateService.instant('WORD_CONFIRM_CLICK'),
        this.translateService.instant('CONFIRM_MESSAGE'),
        this.translateService.instant('WORD_ACCEPT'),
        this.translateService.instant('WORD_CANCEL'),
      ).then((status) => {
        if (status.isConfirmed) {
          this.createEvaluationStandard();
        }

      });
    }
  }

  close() {
    this.closeView.emit(null);
  }

}
