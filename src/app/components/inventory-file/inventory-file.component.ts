import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtifactController } from 'src/app/controllers/artifact.controller';
import { ArtifactService } from 'src/app/services/artifact.service';
import { formatDate } from 'src/app/utils/formatters';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { AlertService } from 'src/app/services/alert.service';
import { BadgeService } from 'src/app/services/badge.service';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { SenderParameterService } from 'src/app/services/sender-parameter.service';

@Component({
  selector: 'app-inventory-file',
  templateUrl: './inventory-file.component.html',
  styleUrls: ['./inventory-file.component.scss']
})
export class InventoryFileComponent implements OnInit {
  id_experiment: string;
  id_standard: string;
  standard: string;
  fecha: string;
  evaluationsBadges: any = [];
  artifacts = [];
  badges = [];
  constructor(
    private artifactService: ArtifactService,
    private artifactController: ArtifactController,
    private actRoute: ActivatedRoute,
    private alertService: AlertService,
    private _badgeService: BadgeService,
    private router: Router,
    private evaluatioService: EvaluationService,
    private senderService: SenderParameterService,
  ) { }

  ngOnInit(): void {
    this.id_experiment = this.actRoute.parent.snapshot.paramMap.get('id');
    this.id_standard = this.senderService.name_standard_inventor

    this.getBadgesStandards()
    this.getArtifacts();
    this.getEvaluationsBadges();
    let date = formatDate(new Date(), 'dd-MM-yyyy')
    this.fecha = "Date " + date



  }

  getArtifacts() {

    this.artifactService.get({
      experiment: this.id_experiment,
      is_acm: false,
      ___populate: 'artifact_class,artifact_type,artifact_purpose,task'
    }).subscribe((data) => {
      this.artifacts = data.response;
    });

  }

  VerificarTareaArtefactos(valor: any): string {
    let resultado = ""
    if (valor == null) {
      resultado = "NO"

    } else {
      resultado = "YES"
    }
    return resultado
  }
  DescargarPDF() {
    const DATA = document.getElementById('inventario');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3
    };

    html2canvas(DATA, options).then((canvas) => {

      const img = canvas.toDataURL('image/PNG');
      const bufferX = 15;
      const bufferY = 15;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      return doc;
    }).then((docResult) => {
      docResult.save(`${new Date().toISOString()}_inventory.pdf`);
      this.alertService.presentSuccessAlert("PDF Generado")
      this.createEvaluationStandard()

    });

  }

  getBadgesStandards() {

    this._badgeService.getStandards({ name: this.id_standard }).subscribe((data: any) => {
      this.standard = data.response[0]._id
    });
  }


  getEvaluationsBadges() {
    this.evaluatioService.get({ status: "success" }).subscribe((data: any) => {
      this.evaluationsBadges = data.response


    })
  }
  // verificar si el parametro ya fue evaluado
  VerifySuccessParameter(): boolean {
    let evaluated = false;

    for (let index = 0; index < this.evaluationsBadges.length; index++) {
      if (this.evaluationsBadges[index].standard == this.standard && this.evaluationsBadges[index].status == "success" && this.evaluationsBadges[index].experiment == this.id_experiment) {
        evaluated = true
      }

    }
    return evaluated
  }
  createEvaluationStandard() {
    if (this.VerifySuccessParameter()== false) {
      this.evaluatioService.createEvaluation({
        status: 'success',
        experiment: this.id_experiment,
        standard: this.standard
      }).subscribe((data: {}) => { })
    }
  }


}


