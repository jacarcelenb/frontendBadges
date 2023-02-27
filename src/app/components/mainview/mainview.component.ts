import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mainview',
  templateUrl: './mainview.component.html',
  styleUrls: ['./mainview.component.scss']
})
export class MainviewComponent implements OnInit {

  constructor() { }
  show = true
  ngOnInit(): void {
  }

  colapseMenu() {
    this.show = false
  }

  OpenMenu() {
    this.show = true
  }
}
