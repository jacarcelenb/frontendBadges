import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-refresh-button',
  templateUrl: './refresh-button.component.html',
  styleUrls: ['./refresh-button.component.scss']
})
export class RefreshButtonComponent {
  clicked = false;
  @Output() refresh: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  refreshClicked() {
    this.clicked = true;
    setTimeout(() => {
      this.clicked = false;
    }, 500);
    this.refresh.emit(null);
  }

}
