import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ArtifactController } from 'src/app/controllers/artifact.controller';
import { AlertService } from 'src/app/services/alert.service';
import { ArtifactService } from 'src/app/services/artifact.service';
import { BadgeService } from 'src/app/services/badge.service';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { formatDate } from 'src/app/utils/formatters';
import { parseArtifactNameForStorage, newStorageRefForArtifact } from 'src/app/utils/parsers';
import { FileSaverService } from 'ngx-filesaver';
import * as JSZip from 'jszip';
import * as JSZipUtils from '../../../../assets/script/jszip-utils.js';
import { AuthService } from '../../../services/auth.service';
import { TokenStorageService } from '../../../services/token-storage.service';
import { ExperimenterService } from '../../../services/experimenter.service';
import { ExperimentService } from '../../../services/experiment.service';

@Component({
  selector: 'app-paper',
  templateUrl: './paper.component.html',
  styleUrls: ['./paper.component.scss'],
})
export class PaperComponent implements OnInit {
  standard_name = "articulo_cientifico";
  @Input() experiment_id: number;
  @Input() standard: string;
  @Output() closeView: EventEmitter<any> = new EventEmitter<any>();
  articleForm: FormGroup;
  progressBarValueArtifact = '';
  selectedFileArticle: FileList;
  evaluationsBadges: any = [];
  id_standard: string;
  userExperiments = [];
  experimentOwner: boolean = false;
  id_experiment: string;
  selectedArtifact: any;
  uploadedArtifacts = [];
  artifactTypes = [];
  artifactClasses = [];
  artifactPurposes = [];
  artifactACM = [];
  file_content: any;
  file_format: any;
  file_size: any;
  file_url: any;
  file_location_path: any;
  evaluations = [];
  selectedFileArtifact: FileList;
  parameterEvaluated: any;
  id_artifact: any;
  change_language = false;

  constructor(
    private formBuilder: FormBuilder,
    private artifactService: ArtifactService,
    private _alertService: AlertService,
    private actRoute: ActivatedRoute,
    private evaluationService: EvaluationService,
    private artifactController: ArtifactController,
    private _badgeService: BadgeService,
    private translateService: TranslateService,
    private fileSaverService: FileSaverService,
    private _authService: AuthService,
    private _experimenterService: ExperimenterService,
    private tokenStorageService: TokenStorageService,
    private experimentService: ExperimentService

  ) {
    this.initForm();
  }
  ngOnInit(): void {
    this.id_experiment = this.actRoute.parent.snapshot.paramMap.get('id');
    this.getBadgesStandards()
    this.getEvaluationsBadges();
    this.loadArtifactOptions();
    this.getUploadedArtifacts();
    this.getUserExperiments()
    this.ValidateLanguage();
    this.translateService.onLangChange.subscribe(() => {
      this.ValidateLanguage()
    });
  }
  initForm() {
    this.articleForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      class: ['Paper', [Validators.required]],
      file_format: ['', [Validators.required]],
      bytes: ['', [Validators.required]],
      storage_ref: ['', [Validators.required]],
      content_description: ['', [Validators.required]],
      url: ['', [Validators.required]],
    });

    this.articleForm.get('name').setValue(
      'Scientific article'
    );
    this.articleForm.get('content_description').setValue(
      'Scientific article'
    );

    // Reset the progress bar and the file selection
    this.progressBarValueArtifact = '';
    this.selectedFileArticle = null;
  }
  close() {
    this.initForm();
    this.closeView.emit(null);
  }

  validateExperimentOwner(experiment_id: string): boolean{
    let experimenterOwner = false;
    for (let index = 0; index < this.userExperiments.length; index++) {

      if (this.userExperiments[index]== experiment_id) {
          experimenterOwner = true;
      }
    }

    return experimenterOwner

  }

  getUserExperiments(){
    this.experimentService.getExperimentsUser().subscribe((data:any)=>{
       this.userExperiments = data.response
       this.experimentOwner = this.validateExperimentOwner(this.id_experiment)

    })
  }

  ValidateLanguage() {
    if (this.translateService.instant('LANG_SPANISH_EC') == "Español (ECU)") {
      this.change_language = false;
    } else {
      this.change_language = true;
    }
  }

  ChangeName(name): string {
    let valor = ""
    for (let index = 0; index < this.artifactACM.length; index++) {
      if (this.artifactACM[index].name == name) {
        valor = this.artifactACM[index].eng_name
      }

    }
    return valor;
  }
  async UrltoBinary(url) {
    try {
      const resultado = await JSZipUtils.getBinaryContent(url)
      return resultado
    } catch (error) {
      return;
    }
  }
  async onDown(fromRemote: boolean,artifact) {
    const fileName = artifact.name + '.' +artifact.file_format.toLowerCase();
    if (fromRemote) {
     let data =this.UrltoBinary(artifact.file_url)
      this.fileSaverService.save(await data, fileName);
    }

  }

  getBadgesStandards() {

    this._badgeService.getStandards({ name: this.standard }).subscribe((data: any) => {
      this.id_standard = data.response[0]._id
    });
  }
  getEvaluationsBadges() {
    this.evaluationService.get({ status: "success" }).subscribe((data: any) => {
      this.evaluationsBadges = data.response


    })
  }

  getUploadedArtifacts() {
    this.artifactService.get({ name: "Artículo científico", is_acm: true, experiment: this.id_experiment  }).subscribe((data: any) => {
      this.uploadedArtifacts = data.response

    })
  }


 getValueEvaluation(){

    this.evaluationService.get({standard: this.id_standard, status: "success", experiment: this.id_experiment}).subscribe((data: any) => {
      this.parameterEvaluated = data.response

    })
  }


  async loadArtifactOptions() {
    const [types, classes, purposes, acms, evaluations] = await Promise.all([
      this.artifactService.getTypes().toPromise(),
      this.artifactService.getClasses().toPromise(),
      this.artifactService.getPurposes().toPromise(),
      this.artifactService.getACM().toPromise(),
      this.evaluationService.get({ status: "success" }).toPromise()
    ]);

    this.artifactTypes = types.response;
    this.artifactClasses = classes.response;
    this.artifactPurposes = purposes.response;
    this.artifactACM = acms.response;
    this.evaluations = evaluations.response;
  }


   // verificar si el parametro ya fue evaluado
   VerifySuccessParameter(): boolean {
    let evaluated = false;
    for (let index = 0; index < this.evaluationsBadges.length; index++) {
      if (this.evaluationsBadges[index].standard == this.id_standard && this.evaluationsBadges[index].status == "success" && this.evaluationsBadges[index].experiment == this.experiment_id) {
        evaluated = true
      }

    }
    return evaluated
  }
  createEvaluationStandard() {
    if (this.VerifySuccessParameter()== false) {
      this.evaluationService.createEvaluation({
        status: 'success',
        experiment: this.id_experiment,
        standard: this.id_standard
      }).subscribe((data: {}) => { })
    }
  }
// metodos para actualizar , ver y eliminar archivo subido

getArtifactPurposesById(id: any): string {
  let resp = ""
  for (let index = 0; index < this.artifactPurposes.length; index++) {
    if (id == this.artifactPurposes[index]._id) {
      resp = this.artifactPurposes[index].name
    }

  }
  return resp
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


changeDate(date: any): string {
  return formatDate(date)
}


deleteArtifactConfirm(artifact) {
  const title = this.translateService.instant('WORD_CONFIRM_DELETE');
  const message = this.translateService.instant('WORD_CONFIRM_DELETE_ARTIFACT');
  const confirmText = this.translateService.instant('WORD_DELETE');
  const cancelText = this.translateService.instant('WORD_CANCEL');
  this._alertService.presentConfirmAlert(
    title,
    message,
    confirmText,
    cancelText,
  ).then((result) => {
    if (result.isConfirmed) {
      this.deleteArtifact(artifact);
    }
  });
}

deleteArtifact(artifact) {
  const onDoneDeleting = () => {
    this.getValueEvaluation();
    this.getUploadedArtifacts();
  };
  this.artifactController.removeFullArtifact(
    artifact._id,
    onDoneDeleting,
  );
  this.deleteEvaluation()
  this.progressBarValueArtifact=''
}

deleteEvaluation() {
  this.evaluationService.delete(this.parameterEvaluated[0]._id).subscribe(data => {
    this.getEvaluationsBadges();
  })

}

save(file_url, file_content) {
  const credential_access = {
    user: null,
    password: null,

  }
  const evaluation = {
    time_complete_execution: "0:00:00",
    time_short_execution: "0:00:00",
    is_accessible: false
  }
  const reproduced = {
    substantial_evidence_reproduced: false,
    respects_reproduction: false,
    tolerance_framework_reproduced: false

  }
  const replicated = {
    substantial_evidence_replicated: false,
    respects_replication: false,
    tolerance_framework_replicated: false

  }
  const artifact = {
    name: 'Artículo científico',
    file_content: 'Artículo científico',
    file_format: this.file_format,
    file_size: this.file_size,
    file_url: file_url,
    file_location_path: file_content,
    artifact_class: this.getArtifactClass("Entrada"),
    artifact_type: this.getArtifactType("Documentos"),
    artifact_purpose: this.getArtifactPurpose("Requisito"),
    sistematic_description_software: null,
    sistematic_description_scripts: null,
    replicated: replicated,
    reproduced: reproduced,
    experiment: this.experiment_id,
    is_acm: true,
    data_manipulation: false,
    evaluation: evaluation,
    credential_access: credential_access,
    maturity_level:"Article",
    executed_scripts: false,
    executed_software: false,
    norms_standards: false,
    task: null
  }

  this.artifactService.create(artifact).subscribe(() => {
    this._alertService.presentSuccessAlert(this.translateService.instant('CREATE_ARTIFACT'));
    this.getUploadedArtifacts();
  });
}

chooseFileArtifact(event) {
  if (this.VerifySuccessParameter() == true) {
    // el parametro ya existe
    //this._alertService.presentWarningAlert("El parametro ha sido completado")
  } else {
    this.selectedFileArtifact = event.target.files;
    if (this.selectedFileArtifact.item(0)) {

      var re = /(?:\.([^.]+))?$/;
      const currentFile = this.selectedFileArtifact.item(0);
      let [, extension] = re.exec(currentFile.name);
      extension = extension.toUpperCase();
      this.file_format = extension;
      this.file_size = currentFile.size

      if (extension === 'PDF') {
        this.uploadArtifact();
      } else {
        this._alertService.presentWarningAlert(this.translateService.instant("MSG_PDF_FILES"))
      }
    }
  }

}

uploadArtifact() {
  const artifact_name = parseArtifactNameForStorage(
    this.selectedFileArtifact.item(0).name,
  );
  const storage_ref = newStorageRefForArtifact(
    'article',
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
      if (this.progressBarValueArtifact == '100') {
        this._alertService.presentSuccessAlert(this.translateService.instant("MSG_UPLOAD_FILE"))
        this.save(file_url, storage_ref)
        this.createEvaluationStandard()
        this.getEvaluationsBadges();
        this.getValueEvaluation();
      }
    },
  );
}


chooseUpdatedArtifact(event) {
    this.selectedFileArtifact = event.target.files;
    if (this.selectedFileArtifact.item(0)) {

      var re = /(?:\.([^.]+))?$/;
      const currentFile = this.selectedFileArtifact.item(0);
      let [, extension] = re.exec(currentFile.name);
      extension = extension.toUpperCase();
      this.file_format = extension;
      this.file_size = currentFile.size

      if (extension === 'PDF') {
        this.uploadUpdatedArtifact();
      } else {
        this._alertService.presentWarningAlert(this.translateService.instant("MSG_PDF_FILES"))
      }
    }
}

uploadUpdatedArtifact() {

  const artifact_name = parseArtifactNameForStorage(
    this.selectedFileArtifact.item(0).name,
  );
  const storage_ref = newStorageRefForArtifact(
    'guide',
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
      if ( this.progressBarValueArtifact == '100') {
        this._alertService.presentSuccessAlert(this.translateService.instant("MSG_UPLOAD_FILE"))
        this.update(file_url, storage_ref)
      }
    },
  );
}

selectArtifact(artifact){
 this.id_artifact = artifact._id;
 this.getValueEvaluation();
 this.progressBarValueArtifact = ""
}
update(file_url, storage_ref) {

  const credential_access = {
    user: null,
    password: null,

  }
  const evaluation = {
    time_complete_execution: "0:00:00",
    time_short_execution: "0:00:00",
    is_accessible: false
  }
  const reproduced = {
    substantial_evidence_reproduced: false,
    respects_reproduction: false,
    tolerance_framework_reproduced: false

  }
  const replicated = {
    substantial_evidence_replicated: false,
    respects_replication: false,
    tolerance_framework_replicated: false

  }
  const artifact = {
    name: 'Artículo científico',
    file_content: 'Artículo científico',
    file_format: this.file_format,
    file_size: this.file_size,
    file_url: file_url,
    file_location_path: storage_ref,
    artifact_class: this.getArtifactClass("Entrada"),
    artifact_type: this.getArtifactType("Documentos"),
    artifact_purpose: this.getArtifactPurpose("Requisito"),
    sistematic_description_software: null,
    sistematic_description_scripts: null,
    replicated: replicated,
    reproduced: reproduced,
    experiment: this.experiment_id,
    is_acm: true,
    data_manipulation: false,
    evaluation: evaluation,
    credential_access: credential_access,
    maturity_level: "Article",
    executed_scripts: false,
    executed_software: false,
    norms_standards: false,
    task: null
  }

  this.artifactService.update(this.id_artifact,artifact).subscribe(() => {
    this._alertService.presentSuccessAlert(this.translateService.instant("MSG_UPDATE_ARTIFACT"));
    this.getUploadedArtifacts();

  });
}
}
