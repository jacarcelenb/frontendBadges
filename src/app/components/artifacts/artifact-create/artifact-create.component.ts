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
import { ExperimentService } from 'src/app/services/experiment.service';


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
  experiment: any = [];
  showsoftware = false;
  showscript = false;
  change_language = false;
  public maskTime = [/[0-9]/, /\d/, ':', /[0-5]/, /\d/, ':', /[0-5]/, /\d/];
  Option: string;
  showDataset = false;
  artifact_id: string;
  id_task: string;
  edicionUpdate = false;
  CheckedReplication = false;
  CheckedReproduction = false;
  CheckedReproQ3: boolean = false;
  CheckedReproQ2: boolean = false;
  CheckedReproQ1: boolean = false;
  CheckedRepliQ1: boolean = false;
  CheckedRepliQ2: boolean = false;
  CheckedRepliQ3: boolean = false;
  CheckedDataManipulation: boolean = false;
  CheckedDataAccesibility: boolean = false;
  CheckedScripts: boolean = false;
  CheckedSoftware: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private _artifactService: ArtifactService,
    private afStorage: AngularFireStorage,
    private _alertService: AlertService,
    private _experimentService: ExperimentService,
    private artifactController: ArtifactController,
    private _translateService: TranslateService,
  ) { }
  ngOnInit(): void {
    this.ValidateLanguage();
    this.getExperiment();
    this._translateService.onLangChange.subscribe(() => {
      this.ValidateLanguage()
    });
  }

  getExperiment() {
    this._experimentService.get({ _id: this.experiment_id }).subscribe((data: any) => {
      this.experiment = data.response
    });
  }
  active: boolean = false;
  show(task_id: string = null, update: boolean = false): void {
    this.initForm();
    this.artifact_id = task_id;
    this.task_id = task_id
    this.active = true;
    this.loadArtifactOptions();
    if (task_id != null && update == true) {
      this.loadArtifact(task_id);
      this.edicionUpdate = true;
    }

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
    if (this._translateService.instant('LANG_SPANISH_EC') == "Español (ECU)") {
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
        time_complete_execution: [null],
        time_short_execution: [null],
        is_accessible: [false],
      }),
      reproduced: this.formBuilder.group({
        substantial_evidence_reproduced: [false],
        respects_reproduction: [false],
        tolerance_framework_reproduced: [false],
      }),
      replicated: this.formBuilder.group({
        substantial_evidence_replicated: [false],
        respects_replication: [false],
        tolerance_framework_replicated: [false],
      }),
      artifact_class: ['', [Validators.required]],
      artifact_type: ['', [Validators.required]],
      sistematic_description_software: [''],
      sistematic_description_scripts: [''],
      executed_scripts: [false],
      executed_software: [false],
      data_manipulation: [false],
      norms_standards: [false],
      artifact_purpose: ['', [Validators.required]],
      artifact_use: [''],
    });
  }







  chooseOption() {
    this.Option = this.artifactForm.value.artifact_use
  }

  showDataScripts() {
    let value = false;
    let valueDatset = false;
    for (let index = 0; index < this.artifactPurposes.length; index++) {

      if (this.artifactPurposes[index]._id == this.artifactForm.value.artifact_purpose && this.artifactPurposes[index].name == "Script") {
        value = true;
        valueDatset = false;
      } else {
        if (this.artifactPurposes[index]._id == this.artifactForm.value.artifact_purpose && this.artifactPurposes[index].name == "Dataset") {
          valueDatset = true;
          value = false;
        }
      }

    }
    this.showscript = value;
    this.showDataset = valueDatset;
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

  loadArtifact(task_id) {
    let user = ""
    let password = ""
    this._artifactService.get({
      _id: task_id,
      experiment: this.experiment_id
    }).subscribe((data: any) => {

      if (data.response[0].credential_access?.user == null) {
        user = ""
      }

      if (data.response[0].credential_access?.password == null) {
        password = ""
      }

      this.id_task = data.response[0].task
      this.artifactForm.get('name').setValue(data.response[0].name)
      this.artifactForm.get('file_content').setValue(data.response[0].file_content)
      this.artifactForm.get('file_format').setValue(data.response[0].file_format)
      this.artifactForm.get('file_size').setValue(data.response[0].file_size)
      this.artifactForm.get('file_url').setValue(data.response[0].file_url)
      this.artifactForm.get('file_location_path').setValue(data.response[0].file_location_path)
      this.artifactForm.get('credential_access.user').setValue(user)
      this.artifactForm.get('credential_access.password').setValue(password)
      this.artifactForm.get('evaluation.time_complete_execution').setValue(data.response[0].evaluation.time_complete_execution)
      this.artifactForm.get('evaluation.time_short_execution').setValue(data.response[0].evaluation.time_short_execution)
      this.artifactForm.get('evaluation.is_accessible').setValue(data.response[0].evaluation.is_accessible)
      this.artifactForm.get('reproduced.substantial_evidence_reproduced').setValue(data.response[0].reproduced.substantial_evidence_reproduced)
      this.artifactForm.get('reproduced.respects_reproduction').setValue(data.response[0].reproduced.respects_reproduction)
      this.artifactForm.get('reproduced.tolerance_framework_reproduced').setValue(data.response[0].reproduced.tolerance_framework_reproduced)
      this.artifactForm.get('replicated.substantial_evidence_replicated').setValue(data.response[0].replicated.substantial_evidence_replicated)
      this.artifactForm.get('replicated.respects_replication').setValue(data.response[0].replicated.respects_replication)
      this.artifactForm.get('replicated.tolerance_framework_replicated').setValue(data.response[0].replicated.tolerance_framework_replicated)
      this.artifactForm.get('artifact_class').setValue(data.response[0].artifact_class)
      this.artifactForm.get('artifact_type').setValue(data.response[0].artifact_type)
      this.artifactForm.get('description_sistematic_script').setValue(data.response[0].description_sistematic_script)
      this.artifactForm.get('description_sistematic_software').setValue(data.response[0].description_sistematic_software)
      this.artifactForm.get('executed_scripts').setValue(data.response[0].executed_scripts)
      this.artifactForm.get('executed_software').setValue(data.response[0].executed_software)
      this.artifactForm.get('data_manipulation').setValue(data.response[0].data_manipulation)
      this.artifactForm.get('norms_standards').setValue(data.response[0].norms_standards)
      this.artifactForm.get('artifact_purpose').setValue(data.response[0].artifact_purpose)
      this.artifactForm.get('artifact_use').setValue(data.response[0].artifact_use)

    })
  }

  save() {
    let experimentProperties = this.ValidateExperimentProperties()
    const artifact = this.artifactForm.value;

    if (experimentProperties == 2 && this.getArtifactPurposesByName("Script") == artifact.artifact_purpose) {
      this._alertService.presentWarningAlert(this._translateService.instant("NO_ARTIFACT_PURPOSE"))
    }
    else if (experimentProperties == 2 && this.getArtifactTypebyName("Software") == artifact.artifact_type) {
      this._alertService.presentWarningAlert(this._translateService.instant("NO_ARTIFACT_TYPE"))
    }
    else if (experimentProperties == 3 && this.getArtifactTypebyName("Software") == artifact.artifact_type) {
      this._alertService.presentWarningAlert(this._translateService.instant("NO_ARTIFACT_TYPE"))
    }
    else if (experimentProperties == 4 && this.getArtifactPurposesByName("Script") == artifact.artifact_purpose) {
      this._alertService.presentWarningAlert(this._translateService.instant("NO_ARTIFACT_PURPOSE"))
    } else {
      artifact.task = this.task_id;
      artifact.experiment = this.experiment_id;
      artifact.maturity_level = this.showMaturityLevel(this.getArtifactPurposesById(artifact.artifact_purpose))
      artifact.reproduced.substantial_evidence_reproduced = this.CheckedReproQ1
      artifact.reproduced.respects_reproduction = this.CheckedReproQ2
      artifact.reproduced.tolerance_framework_reproduced = this.CheckedReproQ3

      artifact.replicated.substantial_evidence_replicated = this.CheckedRepliQ1
      artifact.replicated.respects_replication = this.CheckedRepliQ2
      artifact.tolerance_framework_replicated = this.CheckedRepliQ3
      artifact.evaluation.is_accessible= this.CheckedDataAccesibility
      artifact.data_manipulation = this.CheckedDataManipulation
      artifact.executed_scripts= this.CheckedScripts
      artifact.executed_software = this.CheckedSoftware
      this._artifactService.create(artifact).subscribe(() => {
        this._alertService.presentSuccessAlert(this._translateService.instant("CREATE_ARTIFACT"));
        this.saveModal.emit(null);
        this.close();

      });


    }


  }

  /**
   * // Validar si el experimento posee las caracterisitcas de
      // Scripts
      // Software
      // Codigo Fuente
   */
  ValidateExperimentProperties(
  ) {

    let resp = 0
    if (this.experiment[0].has_scripts == true && this.experiment[0].has_software == true) {
      resp = 1  // el experimento ha registrado scripts y software
    } else if (this.experiment[0].has_scripts == false && this.experiment[0].has_software == false) {
      resp = 2  // el experimento no ha registrado nada
    } else if (this.experiment[0].has_scripts == true && this.experiment[0].has_software == false) {
      resp = 3   // el experimento solo ha registrado scripts
    } else {
      resp = 4  // el experimento solo ha registrado software
    }
    return resp;
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
    if (value == "Instrucción") {
      resp = "Operational"
    }
    if (value == "Reclutamiento") {
      resp = "Descriptive"
    }
    if (value == "Formación") {
      resp = "Descriptive"
    }
    if (value == "Reportes") {
      resp = "Descriptive"
    }
    if (value == "Modelo UML") {
      resp = "Operational"
    }
    if (value == "Gráficos estadísitcos") {
      resp = "Operational"
    }
    if (value == "Subcaracterísticas de calidad") {
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

  getArtifactPurposesByName(name: any): string {
    let resp = ""
    for (let index = 0; index < this.artifactPurposes.length; index++) {
      if (name == this.artifactPurposes[index].name) {
        resp = this.artifactPurposes[index]._id
      }

    }
    return resp
  }
  getArtifactTypebyName(name: any): string {
    let resp = ""
    for (let index = 0; index < this.artifactTypes.length; index++) {
      if (name == this.artifactTypes[index].name) {
        resp = this.artifactTypes[index]._id
      }

    }
    return resp
  }
  chooseFileArtifact(event) {
    this.selectedFileArtifact = event.target.files;
    if (this.selectedFileArtifact.item(0)) {
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

  onChangeReproduction(checked: boolean) {
    this.CheckedReproduction = checked;
  }

  onChangeReplication(checked: boolean) {
    this.CheckedReplication = checked;
  }

  onChangeReproQ3(checked: boolean) {
    this.CheckedReproQ3 = checked;
  }

  onChangeReproQ2(checked: boolean) {
    this.CheckedReproQ2 = checked;
  }
  onChangeReproQ1(checked: boolean) {
    this.CheckedReproQ1 = checked;
  }


  onChangeRepliQ1(checked: boolean) {
    this.CheckedRepliQ1 = checked;
  }

  onChangeRepliQ2(checked: boolean) {
    this.CheckedRepliQ2 = checked;
  }
  onChangeRepliQ3(checked: boolean) {
    this.CheckedRepliQ3 = checked;
  }

  onChangeDataManipulation(checked: boolean) {
   this.CheckedDataManipulation = checked;
  }

  onChangeDataAccesibility(checked: boolean) {
    this.CheckedDataAccesibility = checked;
   }

   onChangeScripts(checked: boolean) {
     this.CheckedScripts = checked;
   }

   onChangeSoftware(checked: boolean){
    this.CheckedSoftware = checked;
   }


}
