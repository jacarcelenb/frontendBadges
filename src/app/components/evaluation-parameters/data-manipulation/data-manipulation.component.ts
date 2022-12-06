import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { EvaluationService } from 'src/app/services/evaluation.service';

@Component({
  selector: 'app-data-manipulation',
  templateUrl: './data-manipulation.component.html',
  styleUrls: ['./data-manipulation.component.scss']
})
export class DataManipulationComponent implements OnInit {
  standard_name = "manipulacion_datos";
  isLoading = false;
  @Input() experiment_id: number;
  @Output() closeView: EventEmitter<any> = new EventEmitter<any>();

  isChecked = false;
  constructor(
    private _evaluationService: EvaluationService,
    private _alertService: AlertService,
  ) { }
  ngOnInit(): void {
    this.getDataManipulationStatus();
  }
  close() {
    this.closeView.emit(null);
  }
  getDataManipulationStatus() {
    this.isLoading = true;
    this._evaluationService.getStatusFromStandardEvaluation(
      this.experiment_id,
      this.standard_name,
    ).subscribe(
      (response: any) => {
        this.isLoading = false;
        if (typeof response.data?.status === "boolean") {
          this.isChecked = response.data.status;
        }
      }
    )
  }
  setDataManipulationStatus() {
    this.isLoading = true;
    this._evaluationService.setDataManipulationStatus(
      this.experiment_id,
      this.standard_name,
      this.isChecked,
    ).subscribe((response: any) => {
        this.isLoading = false;
        this._alertService.presentSuccessAlert(response.message);
        this.close();
      }
    )
  }
  onChange(checked: boolean) {
    this.isChecked = checked;
    this.setDataManipulationStatus();
  }
}
