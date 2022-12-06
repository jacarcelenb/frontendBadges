import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button-icon',
  templateUrl: './button-icon.component.html',
  styleUrls: ['./button-icon.component.scss']
})
export class ButtonIconComponent implements OnInit {
  @Input() icon: string;
  @Output() press: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {}

  onPress() {
    this.press.emit();
  }

}
