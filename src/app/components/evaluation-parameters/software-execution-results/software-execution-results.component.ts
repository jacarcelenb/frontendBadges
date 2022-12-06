import { Component, EventEmitter, Input,  Output, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { EvaluationService } from 'src/app/services/evaluation.service';

@Component({
  selector: 'app-software-execution-results',
  templateUrl: './software-execution-results.component.html',
  styleUrls: ['./software-execution-results.component.scss']
})
export class SoftwareExecutionResultsComponent implements OnInit {
  standard_name = "ejecucion_software_resultados";
  isLoading = false;
  @Input() experiment_id: number;
  @Output() closeView: EventEmitter<any> = new EventEmitter<any>();

  isChecked = true;
  constructor(
    private _evaluationService: EvaluationService,
    private _alertService: AlertService,
  ) { }

  ngOnInit(): void {
    this.getExecutionScriptOrSoftwareStatus();
  }
  close() {
    this.isLoading = false;
    this.closeView.emit(null);
  }
  getExecutionScriptOrSoftwareStatus() {
    this.isLoading = true;
    this._evaluationService.getStatusFromStandardEvaluation(this.experiment_id, this.standard_name).subscribe(
      (response: any) => {
        this.isLoading = false;
        if (typeof response.data?.status === "boolean") {
          this.isChecked = response.data.status;
        }
      }
    )
  }
  setExecutionScriptOrSoftwareStatus() {
    this.isLoading = true;
    this._evaluationService.setExecutionScriptOrSoftwareStatus(
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
    this.setExecutionScriptOrSoftwareStatus();
  }
}
