import { formatDate } from 'src/app/utils/formatters';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ArtifactController } from 'src/app/controllers/artifact.controller';
import { ArtifactService } from 'src/app/services/artifact.service';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { ExperimentService } from 'src/app/services/experiment.service';
import { ExperimenterService } from 'src/app/services/experimenter.service';
import { newStorageRefForArtifact, parseArtifactNameForStorage } from 'src/app/utils/parsers';
import { AlertService } from 'src/app/services/alert.service';
import { SenderParameterService } from 'src/app/services/sender-parameter.service';
import { BadgeService } from 'src/app/services/badge.service';
import { LabpackService } from 'src/app/services/labpack.service';
import { TranslateService } from '@ngx-translate/core';
import { FileSaverService } from 'ngx-filesaver';
import { AuthService } from '../../../services/auth.service';
import { TokenStorageService } from '../../../services/token-storage.service';
import * as JSZip from 'jszip';
import * as JSZipUtils from '../../../../assets/script/jszip-utils.js';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-readme-file',
  templateUrl: './readme-file.component.html',
  styleUrls: ['./readme-file.component.scss']
})
export class ReadmeFileComponent implements AfterViewInit, OnInit {
  standard_name = "archivo_readme";
  @Input() experiment_id: number;
  @Input() standard: string;
  @Output() closeView: EventEmitter<any> = new EventEmitter<any>();
  experimenters: any[] = [];
  userExperiments = [];
  experimentOwner: boolean = false;
  evaluationsBadges: any = [];
  isLoading: boolean = false;
  id_experiment: string;
  experiment: any
  progressBarValueArtifact = '';
  selectedFile: FileList;
  id_standard: string;
  data_labpack: any = [];
  corresponding_author = [];
  list_directory: any = [];
  filter: any = [];
  data_readme: any = [];
  parameterEvaluated: any;
  artifactClasses = [];
  artifactPurposes = [];
  artifactTypes = [];
  uploadedArtifacts = [];
  selectedFileArtifact: FileList;
  @ViewChild("text_editor") texteditor: ElementRef;
  @ViewChild("namedirectory") namedirectory: ElementRef;
  @ViewChild("CloseModal") CloseModal: ElementRef;
  @ViewChild("closeMainModal") closeMainModal: ElementRef;
  @ViewChild("text_main") text_main: ElementRef;
  file_format: any;
  file_size: any;
  artifactACM = [];
  evaluations = [];
  id_artifact: any;
  change_language = false;
  artifact: any;

  constructor(
    private evaluationService: EvaluationService,
    private artifactService: ArtifactService,
    private artifactController: ArtifactController,
    private experimenterService: ExperimenterService,
    private experimentService: ExperimentService,
    private actRoute: ActivatedRoute,
    private alertService: AlertService,
    private _badgeService: BadgeService,
    private senderService: SenderParameterService,
    private translateService: TranslateService,
    private labpackService: LabpackService,
    private _experimenterService: ExperimenterService,
    private fileSaverService: FileSaverService,
    private _authService: AuthService,
    private tokenStorageService: TokenStorageService,
  ) { }
  ngOnInit(): void {
    this.id_experiment = this.actRoute.parent.snapshot.paramMap.get('id');
    this.senderService.name_standard_readme = this.standard
    this.getEvaluationsBadges();
    this.getBadgesStandards()
    this.getUploadedArtifacts();
    this.getExperiment()
    this.getCorrespondingAuthor();
    this.getPackage();
    this.loadArtifactOptions();
    this.getUserExperiments()
    this.ValidateLanguage();
    this.translateService.onLangChange.subscribe(() => {
      this.ValidateLanguage()
    });
  }
  ngAfterViewInit(): void {
    // TODO: Select experimenter to be principal
    // TODO: Update experimenter principal in experiment
    // TODO: Upload readme file
    this.clean();
  }
  clean() {
    this.experimenters = [];
    this.isLoading = false;
  }

  ValidateLanguage() {
    if (this.translateService.instant('LANG_SPANISH_EC') == "Español (ECU)") {
      this.change_language = false;
    } else {
      this.change_language = true;
    }
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
  cleanList(){
  this.list_directory = []
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
  getPackage() {
    this.labpackService.get({
      experiment: this.id_experiment
      , ___populate: 'package_type,repository'
    }).subscribe((data: any) => {
      this.data_labpack = data.response

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

  getCorrespondingAuthor() {
    this._experimenterService.get({
      experiment: this.id_experiment,
      corresponding_autor: true,
      ___populate: 'experimenter_roles,user'
    }).subscribe((data: any) => {
      this.corresponding_author = data.response

    })
  }

  getExperimenters() {
    this.experimenters = [];
    this.isLoading = true;
    this.experimenterService.get({
      experiment: this.experiment_id
    }).subscribe((data: any) => {
      this.experimenters = data.response;
      this.isLoading = false;
    });
  }
  close() {
    this.clean();
    this.closeView.emit();
  }

  changeDate(date: any): string {
    return formatDate(date)
  }


  getBadgesStandards() {
    this._badgeService.getStandards({ name: this.standard }).subscribe((data: any) => {
      this.id_standard = data.response[0]._id
      this.getValueEvaluation();
    });
  }
  getUploadedArtifacts() {
    this.artifactService.get({ name: "Archivo README", is_acm: true, experiment: this.id_experiment }).subscribe((data: any) => {
      this.uploadedArtifacts = data.response
    })
  }

  getExperiment() {
    this.experimentService.get({ _id: this.id_experiment }).subscribe((data: any) => {
      this.experiment = data.response
    })
  }

  getEvaluationsBadges() {
    this.evaluationService.get({ status: "success" }).subscribe((data: any) => {
      this.evaluationsBadges = data.response


    })
  }

  getValueEvaluation() {

    this.evaluationService.get({ standard: this.id_standard, status: "success", experiment: this.id_experiment }).subscribe((data: any) => {
      this.parameterEvaluated = data.response

    })
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


  getArtifactPurposesById(id: any): string {
    let resp = ""
    for (let index = 0; index < this.artifactPurposes.length; index++) {
      if (id == this.artifactPurposes[index]._id) {
        resp = this.artifactPurposes[index].name
      }

    }
    return resp
  }

  getSelectedDirectory(directory: any) {
    let findElement = false
    for (let index = 0; index < this.data_readme.length; index++) {

      if (this.data_readme[index].directory == directory.directory) {
        findElement = true
      }

    }

    if (findElement == true) {
      this.alertService.presentWarningAlert(this.translateService.instant("MSG_DIRECTORY_SELECT"))

    } else {
      this.data_readme.push(directory)
      this.alertService.presentSuccessAlert(this.translateService.instant("MSG_DIRECTORY_CREATED"))
    }


  }
  saveDirectory() {
    let findElement = false;
    const data = {
      directory: this.namedirectory.nativeElement.value,
      content: this.texteditor.nativeElement.value
    }

    for (let index = 0; index < this.list_directory.length; index++) {
      if (this.list_directory[index].directory == data.directory) {
        findElement = true;
      }
    }

    if (findElement == true) {
      this.alertService.presentWarningAlert(this.translateService.instant("MSG_REGISTER_DIRECTORY"))
      this.namedirectory.nativeElement.value = "";
      this.texteditor.nativeElement.value = "";
      this.CloseModal.nativeElement.click();

    } else {
      if (this.texteditor.nativeElement.value == "" || this.namedirectory.nativeElement.value == "") {
        this.alertService.presentWarningAlert(this.translateService.instant("MSG_FILL_FIELDS"))
      } else {
        this.list_directory.push(data);
        this.alertService.presentSuccessAlert(this.translateService.instant("MSG_DIRECTORY_CREATE"))
        this.namedirectory.nativeElement.value = "";
        this.texteditor.nativeElement.value = "";
        this.CloseModal.nativeElement.click();
      }

    }



  }

  deleteSelectedDirectory(directory) {
    this.list_directory = this.list_directory.filter((item) => item.directory != directory.directory)
  }
  deleteDirectory(directory: any) {
    this.deleteSelectedDirectory(directory)
    Swal.fire(
      this.translateService.instant("MSG_DELETED_PART"),
      this.translateService.instant("MSG_CONFIRM_DELETED"),
      'success'
    )
  }


  save(file_url, file_content,isGenerated) {


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
      name: 'Archivo README',
      file_content: 'Archivo README',
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
      maturity_level: "Descriptive",
      executed_scripts: false,
      executed_software: false,
      norms_standards: false,
      is_generated: isGenerated,
      task: null
    }

    this.artifactService.create(artifact).subscribe(() => {
      this.alertService.presentSuccessAlert(this.translateService.instant('CREATE_ARTIFACT'));
      this.getUploadedArtifacts();
      this.closeMainModal.nativeElement.click();
    });
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
      this.getUploadedArtifacts();
    };
    this.artifactController.removeFullArtifact(
      artifact._id,
      onDoneDeleting,
    );
    this.deleteEvaluation()
    this.progressBarValueArtifact = ''
  }

  deleteEvaluation() {
    this.evaluationService.delete(this.parameterEvaluated[0]._id).subscribe(data => {
      this.getEvaluationsBadges();

    })

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
    if (this.VerifySuccessParameter() == false) {
      this.evaluationService.createEvaluation({
        status: 'success',
        experiment: this.id_experiment,
        standard: this.id_standard
      }).subscribe((data: {}) => { })
    }
  }


  chooseFileArtifact(event) {
    if (this.VerifySuccessParameter() == true) {

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

  cleanProgressBar(){
    this.progressBarValueArtifact = ""
  }
  uploadUpdatedArtifact() {

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
        if (this.progressBarValueArtifact == '100') {
          this.alertService.presentSuccessAlert(this.translateService.instant("MSG_UPLOAD_FILE"))
          this.update(file_url, storage_ref)
        }
      },
    );
  }

  selectArtifact(artifact) {
    this.id_artifact = artifact._id;
    this.cleanProgressBar()
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
      name: 'Archivo README',
      file_content: 'Archivo README',
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
      maturity_level: "Descriptive",
      executed_scripts: false,
      executed_software: false,
      norms_standards: false,

      task: null
    }

    this.artifactService.update(this.id_artifact, artifact).subscribe(() => {
      this.alertService.presentSuccessAlert(this.translateService.instant("MSG_UPDATE_ARTIFACT"));
      this.getUploadedArtifacts();

    });
  }


  showPDF() {

    const doc = new jsPDF();
    let date = new Date();
    let fecha = formatDate(date)

    if (this.data_readme.length > 0) {
      autoTable(doc, {
        body: [
          [
            {
              content: 'README',
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

      if (this.data_labpack[0]?.package_doi == undefined) {
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
                content: 'This is a laboratory package for the experiments reported in the paper.The full compressed package can be found and downloaded here: (' + this.data_labpack[0].package_doi + ').',
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
              content: 'This README file describes the structure of the package and gives basic information on the content of this package.',
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
              content: 'For more detailed instructions on how to install dependencies, please, refer to the INSTALL file.',
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
              content: 'Package Content',
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

      // mostrar los artefactos y sus guias de instalacion

      for (let index = 0; index < this.data_readme.length; index++) {
        autoTable(doc, {
          body: [
            [
              {
                content:  this.data_readme[index].directory,
              }
              ,
            ],
          ],
          styles: {
            halign: 'left',
            fontSize: 11,
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
                content: this.data_readme[index].content,
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
      let blobPDF = new Blob([doc.output()], { type: '.pdf' })
      let fileData = new File([blobPDF], "README.pdf", { type: blobPDF.type })
      this.file_format = blobPDF.type
      this.file_size = blobPDF.size
      this.uploadGenerateArtifact(fileData)
    } else {
      this.alertService.presentWarningAlert(this.translateService.instant("MSG_VALIDATED_README"))
    }


  }

  uploadGenerateArtifact(file) {
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
        this.save(file_url, storage_ref, true);
        this.createEvaluationStandard()
        this.getEvaluationsBadges();
        this.getValueEvaluation();
      },
    );
  }
  getArtifact(artifact) {
    this.artifact = artifact;
    this.data_readme = []
  }

  cleanFields(){
    this.data_readme = []
  }
  GenerateNewFile() {
    if (this.artifact?._id.length > 0) {
      this.deleteArtifact(this.artifact);
      this.showPDF();
    } else {
      this.showPDF();
    }
  }




}





