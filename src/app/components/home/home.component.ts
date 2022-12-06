import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  name = 'Angular';
  text = ['Hola', 'Hola2', 'Hola3', 'Hola', 'Hola2', 'Hola3']
  constructor() { }



  ngOnInit() {
  }

}
