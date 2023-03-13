import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common'
import { ExperimentsListDto } from 'src/app/models/dto/ExperimentsListDto';
import { GroupService } from 'src/app/services/group.service';
import { group } from 'console';

@Component({
  selector: 'app-experiment-dashboard',
  templateUrl: './experiment-dashboard.component.html',
  styleUrls: ['./experiment-dashboard.component.scss']
})
export class ExperimentDashboardComponent implements OnInit {
  @Input() experiment: ExperimentsListDto;
  @Input() experiment_id: string;
  groups: any[]
  data: any;
  details_option: any
  basicData: any;
  value2: number = 1;
  constructor(private location: Location,
    private acRoute: ActivatedRoute,
    private groupService: GroupService) { }

  ngOnInit(): void {
    this.experiment_id = this.acRoute.parent.snapshot.paramMap.get('id');
    this.getGroups()

    this.basicData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
          {
              label: 'My First dataset',
              backgroundColor: '#42A5F5',
              data: [65, 59, 80, 81, 56, 55, 40]
          },
          {
              label: 'My Second dataset',
              backgroundColor: '#FFA726',
              data: [28, 48, 40, 19, 86, 27, 90]
          }
      ]
  };
  }

  getGroups() {
    this.groupService.get({
      experiment: this.experiment_id,
      ___populate: 'group_type'
    }).subscribe((data: any) => {
      this.groups = data.response
      console.log(this.groups)

      this.data = {
        labels: [this.groups[0].group_type.name, 'Experimental'],
        datasets: [
          {
            data: [this.groups[0].numParticipants, 0],
            backgroundColor: [
              "#66BB6A",
              "#FFA726"
            ],
            hoverBackgroundColor: [
              "#81C784",
              "#FFB74D"
            ]
          }
        ]
      };
    })
  }

  gotoDetails() {

  }
}
