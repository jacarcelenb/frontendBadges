import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExperimentService } from 'src/app/services/experiment.service';
import { formatDate } from 'src/app/utils/formatters';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { AlertService } from 'src/app/services/alert.service';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { SenderParameterService } from 'src/app/services/sender-parameter.service';
import { BadgeService } from 'src/app/services/badge.service';
import { ExperimenterService } from 'src/app/services/experimenter.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-readme-doc',
  templateUrl: './readme-doc.component.html',
  styleUrls: ['./readme-doc.component.scss']
})
export class ReadmeDocComponent implements OnInit {
  id_experiment: string;
  experiment: any
  date_experiment: any;
  name_experiment: any;
  autor_experiment: any;
  doi_experiment: any;
  doi_value: any;
  id_standard: string;
  standard: any;
  principal_author: any;


  constructor(private experimentService: ExperimentService,
    private actRoute: ActivatedRoute,
    private alertService: AlertService,
    private evaluatioService: EvaluationService,
    private _badgeService: BadgeService,
    private senderService: SenderParameterService,
    private tokenStorage: TokenStorageService,
    ) { }
  @ViewChild('readmefile', { static: false }) el!: ElementRef;
  ngOnInit(): void {
    this.id_experiment = this.actRoute.parent.snapshot.paramMap.get('id');


    this.id_standard = this.senderService.name_standard_readme

    this.getBadgesStandards()
    this.getExperimentById()


  }



  getExperimentById() {
    let fecha = formatDate(new Date(), 'dd/MM/yyyy')
    this.experimentService.get({
      _id: this.id_experiment
    }).subscribe((data: any) => {
      this.experiment = data.response

      this.name_experiment = "Replication Package for " + "''" + this.experiment[0].name + "''"
      this.date_experiment = fecha;
      this.autor_experiment = this.tokenStorage.getUser().full_name + "  email:" + this.tokenStorage.getUser().email
      this.doi_experiment = "https://www.doi.org/" + this.experiment[0].doi_code
      this.doi_value = this.experiment[0].doi_code
    })
  }

    MostrarMensaje() {
      this.alertService.presentSuccessAlert("PDF Readme")
   }

   getBadgesStandards() {

    this._badgeService.getStandards({name:this.id_standard}).subscribe((data: any) => {
    this.standard = data.response[0]._id

    });
  }
  createEvaluationStandard(){
    this.evaluatioService.createEvaluation({
      status: 'success',
      experiment: this.id_experiment,
      standard: this.standard
    }).subscribe((data: {}) => { })
  }



}
