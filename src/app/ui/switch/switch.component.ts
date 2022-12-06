import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss']
})
export class SwitchComponent {
  @Input() isChecked: boolean = false;
  switch_id: string = 'switch';
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
  constructor() {
    this.switch_id = `switch-${Math.random() * 100}`;
  }

  toggle(event: any) {
    this.onChange.emit(event.target.checked);
  }

}
