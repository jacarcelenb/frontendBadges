import { Component, ElementRef, EventEmitter, Input, AfterViewInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-custom-modal',
  templateUrl: './custom-modal.component.html',
  styleUrls: ['./custom-modal.component.scss']
})
export class CustomModalComponent implements AfterViewInit {
  @Input() modal_id: string;
  @Input() modal_title: string;
  @Output() onCloseModal: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('closeCustomModal') closeCustomModal: ElementRef;
  constructor() {}
  ngAfterViewInit(): void {
    const onClickCloseButton = (event) => {
      this.onCloseModal?.emit(null);
    }

    this.closeCustomModal?.nativeElement.addEventListener(
      'click',
      onClickCloseButton,
    );
  }
}
