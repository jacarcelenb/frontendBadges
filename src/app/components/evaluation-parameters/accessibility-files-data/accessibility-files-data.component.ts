import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { ArtifactService } from 'src/app/services/artifact.service';
import { EvaluationService } from 'src/app/services/evaluation.service';

@Component({
  selector: 'app-accessibility-files-data',
  templateUrl: './accessibility-files-data.component.html',
  styleUrls: ['./accessibility-files-data.component.scss']
})
export class AccessibilityFilesDataComponent implements OnInit {
  standard_name = "accesibilidad_archivos_datos";
  isLoading = false;
  @Input() experiment_id: number;
  artifacts: any[] = [];
  @Output() closeView: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private _artifactService: ArtifactService,
    private _evaluationService: EvaluationService,
    private _alertService: AlertService,
  ) {}

  ngOnInit() {
    this.artifacts = [];
    this.getNonAccessibleArtifacts();
  }

  close() {
    this.isLoading = false;
    this.closeView.emit();
  }
  markAsAccessible(artifact_id: number) {
    this.isLoading = true;
    this._artifactService.updateArtifact(artifact_id, {
      is_accessible: false,
    }).subscribe(
      () => {
        this.isLoading = false;
        this.getNonAccessibleArtifacts();
      }
    )
  }
  getNonAccessibleArtifacts() {
    this.isLoading = true;
    this._evaluationService.getNonAccessibleArtifacts(
      this.experiment_id,
      this.standard_name,
    ).subscribe(
      (response: any) => {
        if (response.data) {
          this.artifacts = response.data;
          this.isLoading = false;
          return;
        }

        this._alertService.presentSuccessAlert(response.message);
        this.close();
      }
    )
  }
}
