import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-guide',
  templateUrl: './user-guide.component.html',
  styleUrls: ['./user-guide.component.scss']
})
export class UserGuideComponent implements OnInit {
  panelOpenState: boolean = false;
  display: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

}
