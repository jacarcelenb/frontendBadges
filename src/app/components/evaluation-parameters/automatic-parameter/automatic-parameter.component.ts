import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-automatic-parameter',
  templateUrl: './automatic-parameter.component.html',
  styleUrls: ['./automatic-parameter.component.scss']
})
export class AutomaticParameterComponent implements OnInit {
  @Output() closeView: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }

  close() {
    this.closeView.emit();
  }

}
