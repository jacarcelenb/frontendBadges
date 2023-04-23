import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-guide',
  templateUrl: './user-guide.component.html',
  styleUrls: ['./user-guide.component.scss']
})
export class UserGuideComponent implements OnInit {
  panelOpenState: boolean = false;
  display: boolean = false;
  stepOption01: boolean = false;
  stepOption02: boolean = false;
  stepOption03: boolean = false;
  stepOption04: boolean = false;
  stepOption05: boolean = false;
  stepOption06: boolean = false;
  stepOption07: boolean = false;
  stepOption08: boolean = false;
  stepOption09: boolean = false;
  stepOption10: boolean = false;
  stepOption11: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

 gotoExperimentFirstOption(){
  this.stepOption03 = false;
  this.stepOption01 = true;
 }

 gotoExperimentSecondOption(){
  this.stepOption03 = true;
  this.stepOption01 = false;
 }

}
