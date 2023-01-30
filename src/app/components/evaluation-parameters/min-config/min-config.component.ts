import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { BadgeService } from 'src/app/services/badge.service';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { ExperimentService } from 'src/app/services/experiment.service';

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

  constructor(
    private actRoute: ActivatedRoute,
    private alertService: AlertService,
    private experimentService: ExperimentService,
    private evaluationService: EvaluationService,
    private _badgeService: BadgeService
  ) { }

  ngOnInit(): void {
    this.id_experiment = this.actRoute.parent.snapshot.paramMap.get('id');
    
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
    }else{
      console.log("the parameter has been evaluated before.....")
    }
  }

  onChange(checked: boolean) {
    this.isChecked = checked;
    
    if(this.isChecked==true){
      this.createEvaluationStandard();
    }
  }

  close() {
    this.closeView.emit(null);
  }

}
