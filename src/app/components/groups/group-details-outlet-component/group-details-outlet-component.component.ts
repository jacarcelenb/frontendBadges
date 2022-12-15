import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-group-details-outlet-component',
  templateUrl: './group-details-outlet-component.component.html',
  styleUrls: ['./group-details-outlet-component.component.scss']
})
export class GroupDetailsOutletComponentComponent implements OnInit {
  group_id: string;
  experiment_id: string;
  group: Record<string, any>;

  constructor(
    private actRoute: ActivatedRoute,
    private _router: Router,
  ) { }

  ngOnInit(): void {
    this.group_id = this.actRoute.snapshot.paramMap.get('group_id');
    this.experiment_id = this.actRoute.snapshot.paramMap.get('experiment_id');
  }

  goToExperimentDetails() {
    if (!this.experiment_id)
      return this._router.navigate(['experiment/step/']);
    this._router.navigate(['experiment/step/'+this.experiment_id + "/step/menu/groups"]);
  }
}
