import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-experiment-progress-report',
  templateUrl: './experiment-progress-report.component.html',
  styleUrls: ['./experiment-progress-report.component.scss']
})
export class ExperimentProgressReportComponent implements OnInit {
  @Input() experiment_id: number;

  constructor() { }

  ngOnInit(): void {
  }

}
