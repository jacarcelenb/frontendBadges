import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { BadgeService } from 'src/app/services/badge.service';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { ExperimentService } from 'src/app/services/experiment.service';

@Component({
  selector: 'app-register-install-guide',
  templateUrl: './register-install-guide.component.html',
  styleUrls: ['./register-install-guide.component.scss']
})
export class RegisterInstallGuideComponent implements OnInit {
  @Output() closeView: EventEmitter<any> = new EventEmitter<any>();
  isChecked = false;
  standard_name = "guia_instalacion";
  @Input() standard: string;
  id_experiment: string;
  experiment: any
  evaluationsBadges: any = [];
  id_standard: string;

  constructor(
    private actRoute: ActivatedRoute,
    private alertService: AlertService,
    private experimentService: ExperimentService,
    private evaluationService: EvaluationService,
    private _badgeService: BadgeService)
  { }

  ngOnInit(): void {
    this.id_experiment = this.actRoute.parent.snapshot.paramMap.get('id');
    console.log(this.id_experiment);
    this.getExperiment()
    this.getBadgesStandards()
    this.getEvaluationsBadges();
  }

  getExperiment() {
    this.experimentService.get({ _id: this.id_experiment }).subscribe((data: any) => {
      this.experiment = data.response
      console.log(this.experiment)
    })
  }

  getBadgesStandards() {
    console.log(this.standard)
    this._badgeService.getStandards({ name: this.standard }).subscribe((data: any) => {
      this.id_standard = data.response[0]._id
    });
  }

  getEvaluationsBadges() {
    this.evaluationService.get({ status: "success" }).subscribe((data: any) => {
      this.evaluationsBadges = data.response
      console.log(this.evaluationsBadges)

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
    }else{
      console.log("the parameter has been evaluated before.....")
    }
  }

  onChange(checked: boolean) {
    this.isChecked = checked;
    console.log(this.isChecked);
    if(this.isChecked==true){
      this.createEvaluationStandard();
    }
  }

  close() {
    this.closeView.emit(null);
  }


}
