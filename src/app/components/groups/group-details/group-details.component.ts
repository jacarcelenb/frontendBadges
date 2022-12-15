import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.scss']
})
export class GroupDetailsComponent implements OnInit {
  TabActiveId = 1;
  group_id: string;
  experiment_id: string;
  group: Record<string, any>;

  constructor(
    private actRoute: ActivatedRoute,
    private _router: Router,
    private _groupService: GroupService,
  ) { }

  ngOnInit(): void {
    this.group_id = this.actRoute.parent.snapshot.paramMap.get('group_id');
    this.experiment_id = this.actRoute.parent.snapshot.paramMap.get('experiment_id');
    this.fetchGroupDetails();
  }
  fetchGroupDetails() {
    const query = {
      _id: this.group_id,
      experiment: this.experiment_id,
      participants: true,
      ___populate: 'group_type'
    };

    this._groupService.get(query).subscribe(data => {
      this.group = data.response[0];
    });
  }
  goToExperimentDetails() {
    if (!this.experiment_id)
      return this._router.navigate(['experiments']);
    this._router.navigate(['experiment/step/'+this.experiment_id + "/step/menu/groups"]);
  }
  setActiveTab(value) {
    this.TabActiveId = value;
  }
}
