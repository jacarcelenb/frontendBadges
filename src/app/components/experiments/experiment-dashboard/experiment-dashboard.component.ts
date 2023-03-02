import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  details_option: any
  constructor( private location: Location,
    private acRoute: ActivatedRoute,) {}

  ngOnInit(): void {

  }

  gotoDetails(){

  }
}
