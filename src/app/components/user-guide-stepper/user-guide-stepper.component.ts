import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-user-guide-stepper',
  templateUrl: './user-guide-stepper.component.html',
  styleUrls: ['./user-guide-stepper.component.scss']
})
export class UserGuideStepperComponent implements OnInit {
  change_language: any;
  currentStep: 0;
 @ViewChild('stepper') stepper
  constructor() { }

  ngOnInit(): void {
  }

  click(){

    this.stepper._selectedIndex = 3 // restar dos
    this.stepper.next()

  }

}
