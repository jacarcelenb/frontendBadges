import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//import { MenuItem , PrimeIcons } from 'primeng/api';


@Component({
  selector: 'app-step-menu',
  templateUrl: './step-menu.component.html',
  styleUrls: ['./step-menu.component.scss']
})
export class StepMenuComponent implements OnInit {
 // items: MenuItem[];
  select_id: string;
  experiment_id: string;
  hideMenu: boolean = false;
  constructor( private actRoute: ActivatedRoute,) { }

  ngOnInit(): void {
    this.experiment_id = this.actRoute.parent.snapshot.paramMap.get('id')

/**
 *    this.items = [
      {routerLink: 'experiments'},
      { routerLink:'experiment/step/'+this.select_id + "/step/menu/experimenters", disabled: false},
      { routerLink: 'experiments/' + this.select_id + "/groups" },
      { routerLink: 'experiments/' + this.select_id + "/tasks" },
      { routerLink: 'experiments/' + this.select_id + "/artifacts" },
      { routerLink: 'experiments/' + this.select_id + "/artifacts_acm" },
      { routerLink: 'experiments/' + this.select_id + "/badges" },
      { routerLink: 'experiments/' + this.select_id + "/labpack" }
    ];
 */
  }

}
