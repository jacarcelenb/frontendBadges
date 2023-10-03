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
import { SelectedBadgeService } from 'src/app/services/selected-badge.service';

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
  artifact_id: string;
  id_task: string;
  id_artifact_acm: any;
  acm_name: any;

  ListStandards = [];
  StandardsBadges = [];
  constructor(
    private formBuilder: FormBuilder,
    private _artifactService: ArtifactService,
    private _alertService: AlertService,
    private evaluatioService: EvaluationService,
    private artifactController: ArtifactController,
    private _badgeService: BadgeService,
    private _translateService: TranslateService,
    private _selectBadge: SelectedBadgeService
  ) { }
  ngOnInit(): void {
    this.getStandards();
    this.getEvaluationsBadges();
    this.loadArtifactOptions();
    this.getArtifacts();
    this.ValidateLanguage();
    this._translateService.onLangChange.subscribe(() => {
      this.ValidateLanguage()
    });


  }

  active: boolean = false;
  show(task_id: string = null): void {
    this.initForm();
    this.artifact_id = task_id;
    this.active = true;
    this.loadArtifactOptions();
    this.getStandardsByBadge();
    if (task_id != null) {
      this.loadArtifact(task_id);
    }
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

  getStandardsByBadge() {
    this._selectBadge.get(
      {
        experiment: this.experiment_id,
        status: true,
        ___populate: 'idbadge'
      }
    ).subscribe((data: any) => {
      for (let index = 0; index < data.response.length; index++) {
        this.ListStandards.push(...data.response[index].idbadge.standards)

      }
      const dataArr = new Set(this.ListStandards);

      let result = [...dataArr];

      for (let i = 0; i < this.artifactACM.length; i++) {
        for (let j = 0; j < result.length; j++) {
          if (this.artifactACM[i].standard == result[j]) {

              this.StandardsBadges.push(this.artifactACM[i])
          }

        }

      }
    })
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
      artifact_acm: ['', [Validators.required]],
      name: [''],
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

  getArtifactACM(artifact): string {
    let value = ""
    for (let index = 0; index < this.artifactACM.length; index++) {
      if (this.artifactACM[index].name == artifact) {
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
      this.id_artifact_acm = data.response[0].artifact_acm
      this.acm_name = data.response[0].name
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
      this.artifactForm.get('artifact_acm').setValue(data.response[0].artifact_acm)
    })
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
    }
  }

  getIdStandard(name: string) {
    let idStandard = ""
    for (let index = 0; index < this.artifactACM.length; index++) {
      if (this.artifactACM[index].name == name) {
        idStandard = this.artifactACM[index].standard
      }

    }
    return idStandard
  }

  getId(name: string) {
    let idStandard = ""
    for (let index = 0; index < this.artifactACM.length; index++) {
      if (this.artifactACM[index].name == name) {
        idStandard = this.artifactACM[index]._id
      }

    }
    return idStandard
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
    artifact.name = this.findNameArtifact(this.artifactForm.value.artifact_acm)
    artifact.data_manipulation = false;
    artifact.evaluation = evaluation;
    artifact.credential_access = credential_access
    artifact.maturity_level = this.findMaturityArtifact(artifact.artifact_acm)
    this.createStandard(this.getIdStandard(artifact.name))
    artifact.task = this.task_id;
    artifact.experiment = this.experiment_id;
    if (this.artifact_id != null && this.artifactForm.value.artifact_acm == this.id_artifact_acm) {
      artifact.task = this.id_task
      this._artifactService.update(this.artifact_id, artifact).subscribe(() => {
        this._alertService.presentSuccessAlert(this._translateService.instant("MSG_UPDATE_ARTIFACT"));
        this.saveModal.emit(null);
        this.close();
        this.loadArtifactOptions()
      });
    } else {
      if (this.ValidateArtifact(artifact.name) == true) {
        this._alertService.presentWarningAlert(this._translateService.instant("MSG_REGISTERED_ARTIFACT"))
      } else {
        if (this.artifact_id != null && this.artifactForm.value.artifact_acm != this.id_artifact_acm) {
          this.deleteArtifact(this.artifact_id, this.acm_name, artifact)
        } else {
          this._artifactService.create(artifact).subscribe(() => {
            this._alertService.presentSuccessAlert(this._translateService.instant("CREATE_ARTIFACT"));
            this.saveModal.emit(null);
            this.close();
            this.loadArtifactOptions()
          });
        }

      }

    }



  }

  deleteArtifact(artifact_id, name, artifact) {
    const onDoneDeleting = () => {
      this.getArtifacts();
      this._artifactService.create(artifact).subscribe(() => {
        this.saveModal.emit(null);
        this.close();
        this.loadArtifactOptions()

      });
    };
    this.artifactController.removeFullArtifact(
      artifact_id,
      onDoneDeleting,
    );
    this.deleteEvaluation(name)

  }

  findParameterByName(name: string): string {
    let id = ""

    for (let i = 0; i < this.all_standards.length; i++) {
      if (this.all_standards[i].description == name) {
        id = this.all_standards[i]._id
      }
    }
    return id
  }

  findIdParameter(parameter): string {
    let id = ""
    for (let i = 0; i < this.evaluationsBadges.length; i++) {
      if (this.evaluationsBadges[i].standard == this.findParameterByName(parameter)) {
        id = this.evaluationsBadges[i]._id
      }
    }
    return id
  }
  deleteEvaluation(artifact) {
    let id = this.findIdParameter(artifact)
    let standard = false
    for (let index = 0; index < this.evaluationsBadges.length; index++) {
      if (id == this.evaluationsBadges[index]._id) {
        standard = true
      }
    }
    if (standard) {
      this.evaluatioService.delete(id).subscribe(data => {
        console.log(data)
        this.getEvaluationsBadges();
      })
    }


  }

  ValidateArtifact(name) {
    let findOne = false
    for (let index = 0; index < this.artifacts.length; index++) {
      if (name == this.artifacts[index].name) {
        findOne = true
      }
    }
    return findOne
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
