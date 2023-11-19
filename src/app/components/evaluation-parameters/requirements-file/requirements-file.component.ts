import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtifactController } from 'src/app/controllers/artifact.controller';
import { AlertService } from 'src/app/services/alert.service';
import { BadgeService } from 'src/app/services/badge.service';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { ExperimentService } from 'src/app/services/experiment.service';
import { ExperimenterService } from 'src/app/services/experimenter.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { newStorageRefForArtifact, parseArtifactNameForStorage } from 'src/app/utils/parsers';
import jsPDF  from 'jspdf';
import autoTable from 'jspdf-autotable'
import { formatDate } from 'src/app/utils/formatters';
import { LabpackService } from 'src/app/services/labpack.service';
import { TranslateService } from '@ngx-translate/core';
import { ArtifactService } from 'src/app/services/artifact.service';
import { FileSaverService } from 'ngx-filesaver';
import * as JSZip from 'jszip';
import * as JSZipUtils from '../../../../assets/script/jszip-utils.js';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-requirements-file',
  templateUrl: './requirements-file.component.html',
  styleUrls: ['./requirements-file.component.scss']
})
export class RequirementsFileComponent implements OnInit {
  standard_name = "archivo_contact";
  @Input() standard: string;
  @Output() closeView: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild("idsoftware") idsoftware: ElementRef;
  @ViewChild("idhardware") idhardware: ElementRef;
  @ViewChild('closeModal') closeModal: ElementRef;
  id_experiment: string;
  experiment: any
  userExperiments = [];

  experimentOwner: boolean = false;
  evaluationsBadges: any = [];
  progressBarValueArtifact = '';
  selectedFileArtifact: FileList;
  id_standard: string;
  data_labpack: any = [];
  corresponding_author = [];
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
  parameterEvaluated: any;
  id_artifact: any;
  change_language = false;
  artifact: any;
  update_artifact: boolean = false;
  @ViewChild('closeUpdateModal') closeUpdateModal: ElementRef;
  constructor(
    private actRoute: ActivatedRoute,
    private artifactController: ArtifactController,
    private alertService: AlertService,
    private experimentService: ExperimentService,
    private evaluationService: EvaluationService,
    private _badgeService: BadgeService,
    private tokenStorage: TokenStorageService,
    private labpackService: LabpackService,
    private _experimenterService: ExperimenterService,
    private translateService: TranslateService,
    private _artifactService: ArtifactService,
    private fileSaverService: FileSaverService,
    private _authService: AuthService,
    ) { }

  ngOnInit(): void {
    this.id_experiment = this.actRoute.parent.snapshot.paramMap.get('id');

    this.getExperiment()
    this.getBadgesStandards()
    this.getEvaluationsBadges();
    this.getCorrespondingAuthor();
    this.getPackage();
    this.loadArtifactOptions();
    this.getUploadedArtifacts();
    this.ValidateLanguage();
    this.getUserExperiments()
    this.translateService.onLangChange.subscribe(() => {
      this.ValidateLanguage()
    });
  }

  getPackage() {
    this.labpackService.get({
      experiment: this.id_experiment
      , ___populate: 'package_type,repository'
    }).subscribe((data: any) => {
      this.data_labpack = data.response

    })
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

  getCorrespondingAuthor(){
    this._experimenterService.get({ experiment: this.id_experiment,
      corresponding_autor:true,
      ___populate: 'experimenter_roles,user'}).subscribe((data:any)=>{
        this.corresponding_author = data.response

    })
  }




  getExperiment() {
    this.experimentService.get({ _id: this.id_experiment }).subscribe((data: any) => {
      this.experiment = data.response

    })
  }

  close() {
    this.closeView.emit();
  }

  getBadgesStandards() {
    this._badgeService.getStandards({ name: this.standard }).subscribe((data: any) => {
      this.id_standard = data.response[0]._id
      this.getValueEvaluation();
    });
  }

  getEvaluationsBadges() {
    this.evaluationService.get({ status: "success" }).subscribe((data: any) => {
      this.evaluationsBadges = data.response


    })
  }

  getUploadedArtifacts() {
    this._artifactService.get({ name: "Archivo requirements", is_acm: true, experiment: this.id_experiment  }).subscribe((data: any) => {
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
      this._artifactService.getTypes().toPromise(),
      this._artifactService.getClasses().toPromise(),
      this._artifactService.getPurposes().toPromise(),
      this._artifactService.getACM().toPromise(),
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
      if (this.evaluationsBadges[index].standard == this.id_standard && this.evaluationsBadges[index].status == "success" && this.evaluationsBadges[index].experiment == this.id_experiment) {
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

  generatePDFfile(artifact){
    const doc = new jsPDF({ filters: ["ASCIIHexEncode"] });
    let date = new Date();
    let fecha = formatDate(date)

    autoTable(doc, {
      body: [
        [
          {
            content: 'Requirements File',
            styles: {
              halign: 'left',
              fontSize: 9,
              fontStyle: 'bold',
              textColor: '#ffffff',
            }
          },
          {
            content: fecha,
            styles: {
              halign: 'right',
              fontStyle: 'bold',
              fontSize: 9,
              textColor: '#ffffff'
            }
          }
        ],
      ],
      theme: 'plain',
      styles: {
        fillColor: '#0939B0'
      }
    });

    autoTable(doc, {
      body: [
        [
          {
            content: 'Laboratory Package for "' + this.experiment[0].name + '"',
          }

        ],
      ],
      styles: {
        halign: 'left',
        fontSize: 20,
        fontStyle: 'bold',
        textColor: '#000000'
        , overflow: 'linebreak',
        cellPadding: 0

      },
      theme: 'plain',

    });

    autoTable(doc, {
      body: [
        [

          {
            content: '_____________________________________________',
          }

        ],
      ],
      styles: {
        halign: 'left',
        fontSize: 20,
        textColor: '#000000'
        , overflow: 'linebreak',
        cellPadding: 0

      },
      theme: 'plain',

    });

    if (this.data_labpack[0]?.package_doi== undefined) {
      autoTable(doc, {
        body: [
          [

            {
              content: 'This laboratory package does not have registered DOI.',
            }

          ],
        ],
        styles: {
          halign: 'left',
          fontSize: 11,
          textColor: '#000000'
          , overflow: 'linebreak',
          cellPadding: 0

        },
        theme: 'plain',

      });
    } else {
      autoTable(doc, {
        body: [
          [

            {
              content: 'This is a laboratory package for the experiments reported in the paper.The full compressed package can be found and downloaded here: ('+this.data_labpack[0].package_doi+').',
            }

          ],
        ],
        styles: {
          halign: 'left',
          fontSize: 11,
          textColor: '#000000'
          , overflow: 'linebreak',
          cellPadding: 0

        },
        theme: 'plain',

      });
    }

    autoTable(doc, {
      body: [
        [

          {
            content: 'The software and hardware requirements are described in this file.',
          }

        ],
      ],
      styles: {
        halign: 'left',
        fontSize: 11,
        textColor: '#000000'
        , overflow: 'linebreak',
        cellPadding: 0

      },
      theme: 'plain',

    });

    autoTable(doc, {
      body: [
        [

          {
            content: 'For any additional information, contact the first author by e-mail:  ' + this.corresponding_author[0].user.full_name + "  " + this.corresponding_author[0].user.email + ".",
          }

        ],
      ],
      styles: {
        halign: 'left',
        fontSize: 11,
        textColor: '#000000'
        , overflow: 'linebreak',
        cellPadding: 0

      },
      theme: 'plain',

    });
    autoTable(doc, {
      body: [
        [

          {
            content: '_____________________________________________',
          }

        ],
      ],
      styles: {
        halign: 'left',
        fontSize: 20,
        fontStyle: 'bold',
        textColor: '#000000'
        , overflow: 'linebreak',
        cellPadding: 0

      },
      theme: 'plain',

    });

    autoTable(doc, {
      body: [
        [

          {
            content: 'Requirements',
          }

        ],
      ],
      styles: {
        halign: 'left',
        fontSize: 20,
        fontStyle: 'bold',
        textColor: '#000000'
        , overflow: 'linebreak',
        cellPadding: 0

      },
      theme: 'plain',

    });

    autoTable(doc, {
      body: [
        [

          {
            content: 'Software',
          }

        ],
      ],
      styles: {
        halign: 'left',
        fontSize: 18,
        fontStyle: 'bold',
        textColor: '#000000'
        , overflow: 'linebreak',
        cellPadding: 0

      },
      theme: 'plain',

    });

    autoTable(doc, {
      body: [
        [

          {
            content: this.idsoftware.nativeElement.value ,
          }

        ],
      ],
      styles: {
        halign: 'left',
        fontSize: 11,
        textColor: '#000000'
        , overflow: 'linebreak',
        cellPadding: 0

      },
      theme: 'plain',

    });


    autoTable(doc, {
      body: [
        [

          {
            content: 'Hardware',
          }

        ],
      ],
      styles: {
        halign: 'left',
        fontSize: 18,
        fontStyle: 'bold',
        textColor: '#000000'
        , overflow: 'linebreak',
        cellPadding: 0

      },
      theme: 'plain',

    });

    autoTable(doc, {
      body: [
        [

          {
            content:this.idhardware.nativeElement.value,
          }

        ],
      ],
      styles: {
        halign: 'left',
        fontSize: 11,
        textColor: '#000000'
        , overflow: 'linebreak',
        cellPadding: 0

      },
      theme: 'plain',

    });


    let blobPDF = new Blob([doc.output()], { type: '.pdf' })
    let fileData = new File([blobPDF], "Requirement_File.pdf", { type: blobPDF.type })
    this.file_format = blobPDF.type
    this.file_size = blobPDF.size
    this.uploadGenerateArtifact(fileData, artifact);
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
  this.alertService.presentConfirmAlert(
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

save(file_url, file_content, isGenerated) {


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
    name: 'Archivo requirements',
    file_content: 'Archivo requirements',
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
    experiment: this.id_experiment,
    is_acm: true,
    data_manipulation: false,
    evaluation: evaluation,
    credential_access: credential_access,
    maturity_level: "Descriptive",
    executed_scripts: false,
    executed_software: false,
    norms_standards: false,
    is_generated: isGenerated,
    task: null
  }

  this._artifactService.create(artifact).subscribe(() => {
    this.alertService.presentSuccessAlert(this.translateService.instant('CREATE_ARTIFACT'));
    this.getUploadedArtifacts();
  });
}

chooseFileArtifact(event) {
  if (this.VerifySuccessParameter() == true) {
    // el parametro ya existe
    //this.alertService.presentWarningAlert("El parametro ha sido completado")
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
        this.alertService.presentWarningAlert(this.translateService.instant("MSG_PDF_FILES"))
      }
    }
  }

}

uploadArtifact() {
  const artifact_name = parseArtifactNameForStorage(
    this.selectedFileArtifact.item(0).name,
  );
  const storage_ref = newStorageRefForArtifact(
    'report',
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
        this.alertService.presentSuccessAlert(this.translateService.instant("MSG_UPLOAD_FILE"))
        this.save(file_url, storage_ref,false)
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
        this.alertService.presentWarningAlert(this.translateService.instant("MSG_PDF_FILES"))
      }
    }
}

uploadUpdatedArtifact() {

  const artifact_name = parseArtifactNameForStorage(
    this.selectedFileArtifact.item(0).name,
  );
  const storage_ref = newStorageRefForArtifact(
    'report',
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
        this.alertService.presentSuccessAlert(this.translateService.instant("MSG_UPLOAD_FILE"))
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
    name: 'Archivo requirements',
    file_content: 'Archivo requirements',
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
    experiment: this.id_experiment,
    is_acm: true,
    data_manipulation: false,
    evaluation: evaluation,
    credential_access: credential_access,
    maturity_level: "Descriptive",
    executed_scripts: false,
    executed_software: false,
    norms_standards: false,
    task: null
  }

  this._artifactService.update(this.id_artifact,artifact).subscribe(() => {
    this.alertService.presentSuccessAlert(this.translateService.instant("MSG_UPDATE_ARTIFACT"));
    this.getUploadedArtifacts();
    this.closeUpdateModal.nativeElement.click();

  });
}

  saveData(){

    if (this.idsoftware.nativeElement.value.trim().length== 0 ||  this.idhardware.nativeElement.value.trim().length== 0 ) {
      this.alertService.presentWarningAlert(this.translateService.instant("MSG_FILL_FIELDS"))
    }
    else if(this.idsoftware.nativeElement.value.trim().length== 0 &&  this.idhardware.nativeElement.value.trim().length== 0 ){
      this.alertService.presentWarningAlert(this.translateService.instant("MSG_FILL_FIELDS"))
    }
    else {
      this.alertService.presentSuccessAlert(this.translateService.instant("MSG_CONFIRM_PDF"))
      this.GenerateNewFile();
      this.idhardware.nativeElement.value =""
      this.idsoftware.nativeElement.value =""
      this.closeModal.nativeElement.click();

    }
  }

  uploadGenerateArtifact(file, artifact) {
    const artifact_name = parseArtifactNameForStorage(
      file.name,
    );
    const storage_ref = newStorageRefForArtifact(
      'artifact',
      artifact_name
    );
    const onPercentageChanges = (percentage: string) => { }
    this.artifactController.uploadArtifactToStorage(
      storage_ref,
      file,
      { onPercentageChanges },
      (storage_ref, file_url) => {
        if (this.update_artifact) {
          artifact.file_location_path = storage_ref
          artifact.file_url = file_url
          artifact.file_size = file.size
          this.UpdateArtifacFile(artifact)
        } else {
          this.save(file_url, storage_ref, true);
          this.createEvaluationStandard()
          this.getEvaluationsBadges();
          this.getValueEvaluation();
        }

      },
    );
  }

  UpdateArtifacFile(artifact) {
    this._artifactService.update(artifact._id, artifact).subscribe(() => {
      this.getUploadedArtifacts();
      this.alertService.presentSuccessAlert(this.translateService.instant('ARTIFACT_UPDATE_SUCCESS'))
      this.closeModal.nativeElement.click();
    })
  }
cleanFields(){
  this.idhardware.nativeElement.value =""
  this.idsoftware.nativeElement.value =""
}
  getArtifact(artifact){
    this.artifact = artifact;
    this.cleanFields();
   }
   GenerateNewFile() {
    if (this.artifact?._id.length > 0) {
      this.update_artifact = true;
      this.generatePDFfile(this.artifact);
    } else {
      this.generatePDFfile({});
    }
  }




}
