import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ArtifactController } from 'src/app/controllers/artifact.controller';
import { ArtifactService } from 'src/app/services/artifact.service';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { newStorageRefForArtifact } from 'src/app/utils/parsers';

@Component({
  selector: 'app-execution-time-short',
  templateUrl: './execution-time-short.component.html',
  styleUrls: ['./execution-time-short.component.scss']
})
export class ExecutionTimeShortComponent implements OnInit {
  standard_name = "tiempo_ejecucion_corta";
  @Input() experiment_id: number;
  @Output() closeView: EventEmitter<any> = new EventEmitter<any>();
  
  isLoading: boolean = false;
  constructor(
    private _evaluationService: EvaluationService,
    private _artifactController: ArtifactController,
    private _artifactService: ArtifactService,
  ) { }

  ngOnInit(): void {
  }
  openPDFInNewTab(response: Blob) {
    const file = new Blob([response], { type: 'application/pdf' });
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL);
  }
  close() {
    this.isLoading = false;
    this.closeView.emit();
  }
  createArtifactFromPdf({ storage_ref, url, artifact_size }, pdf: Blob) {
    const new_artifact = {
      name: "Execution time short/complete",
      class: "Report",
      file_format: "pdf",
      bytes: artifact_size,
      content_description: "Execution time short/complete",
      storage_ref,
      url,
      experiment_id: this.experiment_id,
    }
    this._artifactService.createFlexibleArtifact(new_artifact).subscribe(
      () => {
        this.openPDFInNewTab(pdf);
        this.close();
      },
      () => this.close(),
    )
  }
  uploadPdf(pdf: Blob) {
    const artifact_size = pdf.size.toString();
    const storage_ref = newStorageRefForArtifact(
      'report',
      'execution-time-short-complete',
    );
    const onPercentageChanges = (percentage: number) => {};
    this._artifactController.uploadArtifactToStorage(
      storage_ref,
      pdf,
      { onPercentageChanges },
      (storage_ref, url) => {
        this.createArtifactFromPdf(
          {storage_ref, url, artifact_size},
          pdf
        )
      },
    );
  }
  evaluateShortTimeExecution() {
    this.isLoading = true;
    this._evaluationService.evaluateTimesCompleteShortExecution(this.experiment_id)
      .subscribe((resp: any) => {
        this.uploadPdf(resp);
      });
  }

}
