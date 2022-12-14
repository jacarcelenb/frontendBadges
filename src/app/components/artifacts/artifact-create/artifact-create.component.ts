import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ArtifactService } from 'src/app/services/artifact.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AlertService } from 'src/app/services/alert.service';
import { newStorageRefForArtifact } from 'src/app/utils/parsers';
import { parseArtifactNameForStorage } from 'src/app/utils/parsers';
import { ArtifactController } from 'src/app/controllers/artifact.controller';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-artifact-create',
  templateUrl: './artifact-create.component.html',
  styleUrls: ['./artifact-create.component.scss'],
})
export class ArtifactCreateComponent implements OnInit {
  @Input() experiment_id: number;
  task_id?: string = null;
  @Output() saveModal: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('closeArtifactCreateModal') closeCreateArtifactModal: ElementRef;
  artifactForm: FormGroup;
  selectedFileArtifact: FileList;
  progressBarValueArtifact = '';
  artifactTypes = [];
  artifactClasses = [];
  artifactPurposes = [];
  showsoftware = false;
  showscript = false;
  change_language = false;
  public maskTime = [/[0-9]/, /\d/, ':', /[0-5]/, /\d/, ':', /[0-5]/, /\d/];
  Option: string;
  constructor(
    private formBuilder: FormBuilder,
    private _artifactService: ArtifactService,
    private afStorage: AngularFireStorage,
    private _alertService: AlertService,
    private artifactController: ArtifactController,
    private _translateService: TranslateService,
  ) { }
  ngOnInit(): void {
    this.ValidateLanguage();
    this._translateService.onLangChange.subscribe(() => {
      this.ValidateLanguage()
    });
  }
  active: boolean = false;
  show(task_id: string = null): void {
    this.task_id = task_id;
    this.active = true;
    this.initForm();
    this.loadArtifactOptions();
  }
  async loadArtifactOptions() {
    const [types, classes, purposes] = await Promise.all([
      this._artifactService.getTypes().toPromise(),
      this._artifactService.getClasses().toPromise(),
      this._artifactService.getPurposes().toPromise(),
    ]);

    this.artifactTypes = types.response;
    this.artifactClasses = classes.response;
    this.artifactPurposes = purposes.response;
  }

  ValidateLanguage() {
    if (this._translateService.instant('LANG_SPANISH_EC') == "Espa??ol (Ecuador)") {
      this.change_language = false;
    } else {
      this.change_language = true;
    }
  }
  close() {
    this.closeCreateArtifactModal.nativeElement.click();
    this.progressBarValueArtifact = '';
  }
  initForm() {
    this.artifactForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      file_content: ['', [Validators.required]],
      file_format: ['', [Validators.required]],
      file_size: [null, [Validators.required]],
      file_url: [null, [Validators.required]],
      file_location_path: [null, [Validators.required]],
      credential_access: this.formBuilder.group({
        user: [null],
        password: [null],
      }),
      evaluation: this.formBuilder.group({
        time_complete_execution: [null, [Validators.required]],
        time_short_execution: [null, [Validators.required]],
        is_accessible: [false],
      }),
      reproduced: this.formBuilder.group({
        substantial_evidence_reproduced: [false],
        respects_reproduction:[false],
        tolerance_framework_reproduced: [false],
      }),
      replicated: this.formBuilder.group({
        substantial_evidence_replicated: [false],
        respects_replication:[false],
        tolerance_framework_replicated: [false],
      }),
      artifact_class: ['', [Validators.required]],
      artifact_type: ['', [Validators.required]],
      description_sistematic_script: [''],
      description_sistematic_software: [''],
      executed_scripts: [false],
      executed_software: [false],
      data_manipulation: [false],
      norms_standards: [false],
      artifact_purpose: ['', [Validators.required]],
      artifact_use: ['', [Validators.required]],
    });
  }


  chooseOption() {
    this.Option = this.artifactForm.value.artifact_use
  }

  showDataScripts() {
    let value = false;
    for (let index = 0; index < this.artifactPurposes.length; index++) {

      if (this.artifactPurposes[index]._id == this.artifactForm.value.artifact_purpose && this.artifactPurposes[index].name == "Script") {
        value = true;
      }

    }
    this.showscript = value;
  }
  showDataSoftware() {
    let value = false;
    for (let index = 0; index < this.artifactTypes.length; index++) {

      if (this.artifactTypes[index]._id == this.artifactForm.value.artifact_type && this.artifactTypes[index].name == "Software") {
        value = true;
      }
    }
    this.showsoftware = value;
  }
  save() {
    const artifact = this.artifactForm.value;
    artifact.task = this.task_id;
    artifact.experiment = this.experiment_id;
    artifact.maturity_level = this.showMaturityLevel(this.getArtifactPurposesById(artifact.artifact_purpose))
    this._artifactService.create(artifact).subscribe(() => {
      this._alertService.presentSuccessAlert(this._translateService.instant("CREATE_ARTIFACT"));
      this.saveModal.emit(null);
      this.close();

    });
  }

  showMaturityLevel(value): string {
    let resp = ""
    if (value == "Script") {
      resp = "Operational"
    }
    if (value == "Dataset") {
      resp = "Operational"
    }
    if (value == "Charla") {
      resp = "Descriptive"
    }
    if (value == "Requisito") {
      resp = "Descriptive"
    }
    if (value == "Reclutamiento") {
      resp = "Descriptive"
    }
    if (value == "Instrucci??n") {
      resp = "Operational"
    }
    if (value == "Reclutamiento") {
      resp = "Descriptive"
    }
    if (value == "Formaci??n") {
      resp = "Descriptive"
    }
    if (value == "Reportes") {
      resp = "Descriptive"
    }
    if (value == "Modelo UML") {
      resp = "Operational"
    }
    if (value == "Gr??ficos estad??sitcos") {
      resp = "Operational"
    }
    if (value == "Subcaracter??sticas de calidad") {
      resp = "Operational"
    }
    return resp
  }
  getArtifactPurposesById(id: any): string {
    let resp = ""
    for (let index = 0; index < this.artifactPurposes.length; index++) {
      if (id == this.artifactPurposes[index]._id) {
        resp = this.artifactPurposes[index].name
      }

    }
    return resp
  }
  chooseFileArtifact(event) {
    this.selectedFileArtifact = event.target.files;
    if (this.selectedFileArtifact.item(0)) {
      console.log(this.selectedFileArtifact.item(0));
      var re = /(?:\.([^.]+))?$/;
      const currentFile = this.selectedFileArtifact.item(0);
      let [, extension] = re.exec(currentFile.name);
      extension = extension.toUpperCase();

      this.artifactForm.get('file_format').setValue(extension);
      this.artifactForm.get('file_size').setValue(currentFile.size);

      this.uploadArtifact();
    }
  }
  uploadArtifact() {
    const artifact_name = parseArtifactNameForStorage(
      this.selectedFileArtifact.item(0).name,
    );
    const storage_ref = newStorageRefForArtifact(
      'artifact',
      artifact_name
    );

    const onPercentageChanges = (percentage: string) => {
      this.progressBarValueArtifact = percentage;
    }

    this.artifactController.uploadArtifactToStorage(
      storage_ref,
      this.selectedFileArtifact.item(0),
      { onPercentageChanges },
      (storage_ref, file_url) => {
        this.artifactForm.get('file_url').setValue(file_url);
        this.artifactForm.get('file_location_path').setValue(storage_ref);
      },
    );
  }
}
