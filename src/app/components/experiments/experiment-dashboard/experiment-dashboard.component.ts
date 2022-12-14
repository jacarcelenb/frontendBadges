import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExperimentsListDto } from 'src/app/models/dto/ExperimentsListDto';

@Component({
  selector: 'app-experiment-dashboard',
  templateUrl: './experiment-dashboard.component.html',
  styleUrls: ['./experiment-dashboard.component.scss']
})
export class ExperimentDashboardComponent implements OnInit {
  @Input() experiment: ExperimentsListDto;
  @Input() experiment_id: number;

  constructor( private router: Router,) {}

  ngOnInit(): void {
    console.log(this.experiment);
    console.log(this.experiment_id);
  }

  gotoDetails(){
    this.router.navigate(['/experiment/step/'+this.experiment_id+'/step/menu/experimenters'])
  }
}
