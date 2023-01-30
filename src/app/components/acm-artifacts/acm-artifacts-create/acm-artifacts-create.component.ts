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
import { BadgeService } from 'src/app/services/badge.service';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-acm-artifacts-create',
  templateUrl: './acm-artifacts-create.component.html',
  styleUrls: ['./acm-artifacts-create.component.scss']
})
export class AcmArtifactsCreateComponent implements OnInit {
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
  artifactACM = [];
  all_standards = [];
  showsoftware = false;
  showscript = false;
  artifacts = [];
  change_language = false;
  public maskTime = [/[0-9]/, /\d/, ':', /[0-5]/, /\d/, ':', /[0-5]/, /\d/];
  evaluationsBadges: any = [];
  constructor(
    private formBuilder: FormBuilder,
    private _artifactService: ArtifactService,
    private _alertService: AlertService,
    private evaluatioService: EvaluationService,
    private artifactController: ArtifactController,
    private _badgeService: BadgeService,
    private _translateService: TranslateService,
  ) { }
  ngOnInit(): void {
    this.getStandards();
    this.getEvaluationsBadges();
    this.getArtifacts();
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
    const [types, classes, purposes, acms] = await Promise.all([
      this._artifactService.getTypes().toPromise(),
      this._artifactService.getClasses().toPromise(),
      this._artifactService.getPurposes().toPromise(),
      this._artifactService.getACM().toPromise(),
    ]);

    this.artifactTypes = types.response;
    this.artifactClasses = classes.response;
    this.artifactPurposes = purposes.response;
    this.artifactACM = acms.response;
  }

  ValidateLanguage() {
    if (this._translateService.instant('LANG_SPANISH_EC') == "Español (Ecuador)") {
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
      artifact_acm: ['', [Validators.required]],
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
        respects_reproduction: [false],
        tolerance_framework_reproduced: [false],
      }),
      replicated: this.formBuilder.group({
        substantial_evidence_replicated: [false],
        respects_replication: [false],
        tolerance_framework_replicated: [false],
      }),
      artifact_class: [''],
      artifact_type: [''],
      description_sistematic_script: [''],
      description_sistematic_software: [''],
      executed_scripts: [false],
      executed_software: [false],
      data_manipulation: [false],
      norms_standards: [false],
      artifact_purpose: [''],
    });
  }

  getArtifacts() {
    this._artifactService.get({
      experiment: this.experiment_id,
      is_acm: true,
      ___populate: 'artifact_class,artifact_type,artifact_purpose,task'
    }).subscribe((data) => {
      this.artifacts = data.response;
    });
  }


  verificateDuplicate(name): boolean {
    let replicated = false;
    for (let index = 0; index < this.artifacts.length; index++) {
      if (this.artifacts[index].name === name && this.artifacts[index].experiment == this.experiment_id) {
        replicated = true;
      }
    }
    return replicated
  }
  getArtifactClass(classArtifact): string {
    let value = ""
    for (let index = 0; index < this.artifactClasses.length; index++) {
      if (this.artifactClasses[index].name == classArtifact) {
        value = this.artifactClasses[index]._id;
      }
    }
    return value
  }
  getArtifactPurpose(artifact): string {
    let value = ""
    for (let index = 0; index < this.artifactPurposes.length; index++) {
      if (this.artifactPurposes[index].name == artifact) {
        value = this.artifactPurposes[index]._id;
      }
    }
    return value
  }
  getArtifactType(artifact): string {
    let value = ""
    for (let index = 0; index < this.artifactTypes.length; index++) {
      if (this.artifactTypes[index].name == artifact) {
        value = this.artifactTypes[index]._id;
      }
    }
    return value
  }

  getEvaluationsBadges() {
    this.evaluatioService.get({ status: "success" }).subscribe((data: any) => {
      this.evaluationsBadges = data.response

    })
  }

  getStandards() {
    this._badgeService.getStandards({}).subscribe((data: any) => {
      this.all_standards = data.response
    });
  }

  findNameArtifact(id: any): string {
    let data = ""
    for (let index = 0; index < this.artifactACM.length; index++) {
      if (this.artifactACM[index]._id == id) {
        data = this.artifactACM[index].name
      }

    }
    return data
  }

  findMaturityArtifact(id: any): string {
    let data = ""
    for (let index = 0; index < this.artifactACM.length; index++) {
      if (this.artifactACM[index]._id == id) {
        data = this.artifactACM[index].maturity_level
      }
    }
    return data
  }

  createEvaluationArtifact(name: string) {
    if (name == "Archivo Inventario") {
      this.calculateValueParameter("inventario_artefacto")
    } else if (name == "Archivo README") {
      this.calculateValueParameter("archivo_readme")
    }
    else if (name == "Archivo contact") {
      this.calculateValueParameter("archivo_contact")
    }
    else if (name == "Archivo requirements") {
      this.calculateValueParameter("archivo_requirements")
    }
    else if (name == "Archivo status") {
      this.calculateValueParameter("archivo_status")
    }
    else if (name == "Archivo license") {
      this.calculateValueParameter("archivo_license")
    }
    else if (name == "Archivo install") {
      this.calculateValueParameter("archivo_install")
    }
    else if (name == "Archivo decision") {
      this.calculateValueParameter("archivo_decision")
    }
  }

  calculateValueParameter(standard: string) {
    let id = ""

    for (let i = 0; i < this.all_standards.length; i++) {
      if (this.all_standards[i].name == standard) {
        id = this.all_standards[i]._id
      }
    }
    this.createStandard(id);

  }

  VerifyParameter(standard): boolean {
    let evaluated = false;
    for (let index = 0; index < this.evaluationsBadges.length; index++) {
      if (this.evaluationsBadges[index].standard == standard && this.evaluationsBadges[index].status == "success" && this.evaluationsBadges[index].experiment == this.experiment_id) {
        evaluated = true
      }

    }
    return evaluated
  }

  createStandard(id: string) {
    if (this.VerifyParameter(id) == false) {
      this.evaluatioService.createEvaluation({
        status: 'success',
        experiment: this.experiment_id,
        standard: id
      }).subscribe((data: {}) => { })
    } else {
      console.log("the parameter has been evaluated before.....P")
    }
  }


  save() {
    const credential_access = {
      user: null,
      password: null,

    }
    const evaluation = {
      time_complete_execution: "0:00:00",
      time_short_execution: "0:00:00",
      is_accessible: false
    }
    const artifact = this.artifactForm.value;
    artifact.artifact_class = this.getArtifactClass("Entrada")
    artifact.artifact_type = this.getArtifactType("Documentos")
    artifact.artifact_purpose = this.getArtifactPurpose("Requisito")
    artifact.experiment = this.experiment_id;
    artifact.is_acm = true;
    artifact.file_content = artifact.file_content
    artifact.name = this.findNameArtifact(artifact.artifact_acm)
    artifact.data_manipulation = false;
    artifact.evaluation = evaluation;
    artifact.credential_access = credential_access
    artifact.maturity_level =this.findMaturityArtifact(artifact.artifact_acm)
      this.createEvaluationArtifact(artifact.name)
      this._artifactService.create(artifact).subscribe(() => {
        this._alertService.presentSuccessAlert(this._translateService.instant('CREATE_ARTIFACT'));
        this.saveModal.emit(null);
        this.close();
      });


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
