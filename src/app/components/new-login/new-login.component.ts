import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-login',
  templateUrl: './new-login.component.html',
  styleUrls: ['./new-login.component.scss']
})
export class NewLoginComponent implements OnInit {
  selectedCity2: any
  countries: any[];
  constructor() { }

  ngOnInit(): void {

    this.countries = [
      {
          name: 'English',
          code: 'US',
          src: "../../../assets/images/united_states_of_america_640.png"
      },
      {
        name: 'Español',
        code: 'ES',
        src: '../../../assets/images/spain_640.png',
    }]


    }

}
