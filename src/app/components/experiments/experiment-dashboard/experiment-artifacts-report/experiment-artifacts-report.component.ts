import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { ArtifactService } from 'src/app/services/artifact.service';
import { Chart, registerables } from 'chart.js';
import { TranslateService } from '@ngx-translate/core';
import { TraductionServiceService } from 'src/app/services/traduction-service.service';


Chart.register(...registerables);

@Component({
  selector: 'app-experiment-artifacts-report',
  templateUrl: './experiment-artifacts-report.component.html',
  styleUrls: ['./experiment-artifacts-report.component.scss']
})
export class ExperimentArtifactsReportComponent implements OnInit {
  @Input() experiment_id: number;
  artifacts = [];
  @ViewChild('artifactsByClassReportChart') artifactsByClassReportChart: ElementRef;
  @ViewChild('artifactsTaskReportChart') artifactsTaskReportChart: ElementRef;
  artifactsReport = {
    totalArtifacts: 0,
    artifactsWithTask: 0,
    artifactsWithoutTask: 0,
    artifactsByClass: {},
  };
  constructor(
    private artifactService: ArtifactService,
    private _translateService: TranslateService,
    private traductionService: TraductionServiceService
  ) { }

  ngOnInit(): void {
    this.fetchArtifactsForExperiment();

    this._translateService.onLangChange.subscribe(() => {
      this.drawArtifactsTaskReportChart();
      this.drawArtifactsByClassReportChart();
    });
  }
  fetchArtifactsForExperiment() {
    this.artifactService.get({
      experiment: this.experiment_id,
      ___populate: 'task,artifact_class',
    }).subscribe(
      (data) => {
        this.artifacts = data.response;
        this.getArtifactsReport();
        this.drawArtifactsByClassReportChart();
        this.drawArtifactsTaskReportChart();
      }
    );
  }
  drawArtifactsTaskReportChart() {
    const [
      WITH_TASK_LABEL,
      WITHOUT_TASK_LABEL,
    ] = [
      this._translateService.instant("WORD_WITH_TASK"),
      this._translateService.instant("WORD_WITHOUT_TASK"),
    ];
    Chart.getChart(this.artifactsTaskReportChart.nativeElement)?.destroy();
    new Chart(this.artifactsTaskReportChart.nativeElement, {
      type: 'doughnut',
      data: {
        labels: [WITH_TASK_LABEL, WITHOUT_TASK_LABEL],
        datasets: [{
          data: [
            this.artifactsReport.artifactsWithTask,
            this.artifactsReport.artifactsWithoutTask,
          ],
          backgroundColor: [
            'rgb(54, 162, 235)',
            'rgb(255, 99, 132)',
            'rgb(255, 205, 86)',
          ],
        }]
      },
      options: {
        responsive: true,
      }
    });
  }
  drawArtifactsByClassReportChart() {
    const classes = Object.keys(this.artifactsReport.artifactsByClass);
    const counts = Object.values(this.artifactsReport.artifactsByClass);

    const clases = [this._translateService.instant('ARTIFACT_INPUT_CLASS') , this._translateService.instant('ARTIFACT_OUTPUT_CLASS')]
    Chart.getChart(this.artifactsByClassReportChart.nativeElement)?.destroy();
    new Chart(this.artifactsByClassReportChart.nativeElement, {
      type: 'pie',
      data: {
        labels: clases,
        datasets: [{
          data: counts,
          backgroundColor: [
            'rgb(54, 162, 235)',
            'rgb(255, 99, 132)',
            'rgb(255, 205, 86)',
          ],
        }]
      },
    });
  }
  getArtifactsReport() {
    this.artifactsReport.totalArtifacts = this.artifacts.length;
    this.artifactsReport.artifactsWithTask = this.artifacts.filter(artifact => artifact.task != null).length;
    this.artifactsReport.artifactsWithoutTask = this.artifacts.filter(artifact => artifact.task == null).length;
    this.artifactsReport.artifactsByClass = this.artifacts.reduce((acc, artifact) => {
      const artifactClass = artifact.artifact_class.name;
      if (!acc[artifactClass]) {
        acc[artifactClass] = 1;
      }
      acc[artifactClass] += 1;
      return acc;
    }, {});
  }

}
