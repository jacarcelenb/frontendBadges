import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common'
import { ExperimentsListDto } from 'src/app/models/dto/ExperimentsListDto';

@Component({
  selector: 'app-experiment-dashboard',
  templateUrl: './experiment-dashboard.component.html',
  styleUrls: ['./experiment-dashboard.component.scss']
})
export class ExperimentDashboardComponent implements OnInit {
  @Input() experiment: ExperimentsListDto;
  @Input() experiment_id: number;

  constructor( private location: Location,) {}

  ngOnInit(): void {

  }

  gotoDetails(){
   this.location.back()
  }
}
