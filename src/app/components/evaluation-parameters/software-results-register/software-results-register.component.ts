import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-software-results-register',
  templateUrl: './software-results-register.component.html',
  styleUrls: ['./software-results-register.component.scss']
})
export class SoftwareResultsRegisterComponent implements OnInit {
  standard_name = "registro_software_resultados";
  isLoading = false;
  @Input() experiment_id: number;
  @Output() closeView: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }
  ngOnInit(): void {
    
  }
  close() {
    this.closeView.emit(null);
  }
}
