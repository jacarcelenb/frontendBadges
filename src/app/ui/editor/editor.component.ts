import { Component, ViewChild, AfterViewInit, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements AfterViewInit {
  @Input() placeholder: string;
  @ViewChild('text_editor') editor!: ElementRef;
  @Output() onChangeText: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngAfterViewInit(): void {
    fromEvent(this.editor.nativeElement, 'keyup')
      .pipe(debounceTime(200))
      .subscribe(() => {
        this.onChangeText.emit(this.editor.nativeElement.value);
      });
  }

}
