import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import { Chart, registerables } from 'chart.js';
import { TranslateService } from '@ngx-translate/core';
Chart.register(...registerables);

@Component({
  selector: 'app-experiment-tasks-report',
  templateUrl: './experiment-tasks-report.component.html',
  styleUrls: ['./experiment-tasks-report.component.scss']
})
export class ExperimentTasksReportComponent implements OnInit {
  @Input() experiment_id: number;
  @ViewChild('taskByReponsibleReportChart')
    taskByReponsibleReportChart: ElementRef;
  @ViewChild('taskByTypeReportChart')
    taskByTypeReportChart: ElementRef;
  tasks = [];
  taskReport = {
    byReponsible: [],
    byType: [],
    totalTasks: 0,
    tasksWithArtifacts: 0,
    taskWithoutArtifacts: 0,
    tasksMediaDuration: "00:00:00",
  };

  constructor(
    private taskService: TaskService,
    private _translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    this.fetchTaskForReport();
    this._translateService.onLangChange.subscribe(() => {
      this.drawChartByResponsible();
      this.fetchTaskForReport();
    });
  }
  fetchTaskForReport() {
    this.taskService.getWithArtifacts({
      experiment: this.experiment_id,
      ___populate: 'responsible,task_type'
    }).subscribe(
      (data) => {
        this.tasks = data.response;
        this.getTaskReport();
        this.drawChartByResponsible();
        this.drawChartByType();
      }
    );
  }
  drawChartByResponsible() {
    const responsibles = this.taskReport.byReponsible.map(task => task.responsible);
    const counts = this.taskReport.byReponsible.map(task => task.count);
    Chart.getChart(this.taskByReponsibleReportChart.nativeElement)?.destroy();
    new Chart(this.taskByReponsibleReportChart.nativeElement, {
      type: 'doughnut',
      data: {
        labels: responsibles,
        datasets: [{
          data: counts,
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
  drawChartByType() {
    const types = this.taskReport.byType.map(task => task.type);
    const counts = this.taskReport.byType.map(task => task.count);
    Chart.getChart(this.taskByTypeReportChart.nativeElement)?.destroy();
    new Chart(this.taskByTypeReportChart.nativeElement, {
      type: 'pie',
      data: {
        labels: types,
        datasets: [{
          data: counts,
          backgroundColor: [
            'rgb(255, 205, 86)',
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
          ],
        }]
      },
    });
  }

  getTaskReport() {
    this.taskReport.totalTasks = this.tasks.length;
    this.taskReport.tasksWithArtifacts = this.tasks.filter(task => task.artifacts.length > 0).length;
    this.taskReport.taskWithoutArtifacts = this.tasks.filter(task => task.artifacts.length == 0).length;
    this.taskReport.tasksMediaDuration = this.getMediaDuration(this.tasks);

    this.taskReport.byReponsible = this.getTaskReportByResponsible();
    this.taskReport.byType = this.getTaskReportByType();
  }
  getTaskReportByResponsible() {
    let taskReportByResponsible = [];
    let responsibles = [];
    if (this._translateService.instant('LANG_SPANISH_EC')=="Español (Ecuador)") {
      responsibles = this.tasks.map(task => task.responsible.name);
      responsibles.forEach(responsible => {
        const count = this.tasks.filter(task => task.responsible.name == responsible).length;
        taskReportByResponsible.push({ responsible, count });
      });
    }else{
      responsibles = this.tasks.map(task => task.responsible.eng_name);
      responsibles.forEach(responsible => {
        const count = this.tasks.filter(task => task.responsible.eng_name == responsible).length;
        taskReportByResponsible.push({ responsible, count });
      });
    }
    // Filter unique responsibles
    taskReportByResponsible = taskReportByResponsible.filter((v, i, a) => {
      return a.findIndex(t => (t.responsible === v.responsible)) === i;
    });
    return taskReportByResponsible;
  }
  getTaskReportByType() {
    let taskReportByType = [];
    let types = [];
    if (this._translateService.instant('LANG_SPANISH_EC')=="Español (Ecuador)") {
      types = this.tasks.map(task => task.task_type.name);
      types.forEach(type => {
        const count = this.tasks.filter(task => task.task_type.name == type).length;
        taskReportByType.push({ type, count });
      });
    }else{
      types = this.tasks.map(task => task.task_type.eng_name);
      types.forEach(type => {
        const count = this.tasks.filter(task => task.task_type.eng_name == type).length;
        taskReportByType.push({ type, count });
      });
    }
 
    return taskReportByType;
  }

  getMediaDuration(tasks) {
    return "10:00:00";
  }

}
