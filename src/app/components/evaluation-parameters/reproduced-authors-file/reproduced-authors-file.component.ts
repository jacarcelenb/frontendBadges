import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtifactController } from 'src/app/controllers/artifact.controller';
import { AlertService } from 'src/app/services/alert.service';
import { BadgeService } from 'src/app/services/badge.service';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { ExperimentService } from 'src/app/services/experiment.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'
import { formatDate } from 'src/app/utils/formatters';
import { newStorageRefForArtifact, parseArtifactNameForStorage } from 'src/app/utils/parsers';
import { ExperimenterService } from 'src/app/services/experimenter.service';
import { LabpackService } from 'src/app/services/labpack.service';
import Swal from 'sweetalert2';
import { ArtifactService } from 'src/app/services/artifact.service';
import { TranslateService } from '@ngx-translate/core';
import { FileSaverService } from 'ngx-filesaver';
import * as JSZip from 'jszip';
import * as JSZipUtils from '../../../../assets/script/jszip-utils.js';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-reproduced-authors-file',
  templateUrl: './reproduced-authors-file.component.html',
  styleUrls: ['./reproduced-authors-file.component.scss']
})
export class ReproducedAuthorsFileComponent implements OnInit {
  @Input() standard: string;
  @Output() closeView: EventEmitter<any> = new EventEmitter<any>();
  id_experiment: string;
  experiment: any
  userExperiments = [];
  experimentOwner: boolean = false;
  evaluationsBadges: any = [];
  progressBarValueArtifact = '';
  selectedFileArtifact: FileList;
  id_standard: string;
  experimenters = [];
  data_labpack: any = [];
  corresponding_author = [];
  list_experimenters = [];
  selected_authors: any = [];
  authors: any = [];
  filter: any = [];
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
  @ViewChild("nameAuthor") nameAuthor: ElementRef;
  @ViewChild("emailAuthor") emailAuthor: ElementRef;
  @ViewChild("closeModal") closeModal: ElementRef;

  artifact: any;
  constructor(private actRoute: ActivatedRoute,
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
    private _authService: AuthService,) { }

  ngOnInit(): void {
    this.id_experiment = this.actRoute.parent.snapshot.paramMap.get('id');

    this.getExperiment()
    this.getExperimenters()
    this.getBadgesStandards()
    this.getEvaluationsBadges();
    this.getCorrespondingAuthor();
    this.getPackage();
    this.loadArtifactOptions();
    this.getUploadedArtifacts();
    this.getUserExperiments()
    this.ValidateLanguage();

    this.translateService.onLangChange.subscribe(() => {
      this.ValidateLanguage()
    });
  }

  ValidateLanguage() {
    if (this.translateService.instant('LANG_SPANISH_EC') == "Español (ECU)") {
      this.change_language = false;
    } else {
      this.change_language = true;
    }
  }

  validateExperimentOwner(experiment_id: string): boolean {
    let experimenterOwner = false;
    for (let index = 0; index < this.userExperiments.length; index++) {

      if (this.userExperiments[index] == experiment_id) {
        experimenterOwner = true;
      }
    }

    return experimenterOwner

  }

  getUserExperiments() {
    this.experimentService.getExperimentsUser().subscribe((data: any) => {
      this.userExperiments = data.response
      this.experimentOwner = this.validateExperimentOwner(this.id_experiment)

    })
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
  async onDown(fromRemote: boolean, artifact) {
    const fileName = artifact.name + '.' + artifact.file_format.toLowerCase();
    if (fromRemote) {
      let data = this.UrltoBinary(artifact.file_url)
      this.fileSaverService.save(await data, fileName);
    }

  }


  addAuthor() {
    const author = {
      name: this.nameAuthor.nativeElement.value,
      email: this.emailAuthor.nativeElement.value
    }

    let find = false;

    for (let index = 0; index < this.authors.length; index++) {
      if (this.authors[index].name == author.name) {
        find = true;
      }

    }
    if (find == true) {
      this.alertService.presentWarningAlert(this.translateService.instant("MSG_VALIDATE_AUTHOR"))
      this.cleanAuthorFields();
    } else {
      if (author.name == "" || author.email == "") {
        this.alertService.presentWarningAlert(this.translateService.instant("MSG_FILL_FIELDS"))
      } else {
        this.authors.push(author);
        this.alertService.presentSuccessAlert(this.translateService.instant("MSG_ADD_AUTHOR"))
        this.cleanAuthorFields();
      }
    }

  }
  selectAuthor(author: any) {
    let find = false;

    for (let index = 0; index < this.selected_authors.length; index++) {
      if (this.selected_authors[index].name == author.name) {
        find = true;
      }

    }
    if (find == true) {
      this.alertService.presentWarningAlert(this.translateService.instant("MSG_VALIDATE_AUTHOR_SELECT"))
    } else {
      this.alertService.presentSuccessAlert(this.translateService.instant("MSG_SELECT_AUTHOR"))
      this.selected_authors.push(author);
    }

  }
  deleteAuthor(author: any) {
    this.filter = this.authors.filter((item) => item.name != author.name)
    this.authors = this.filter
    if (this.authors.length == 0) {
      this.selected_authors = []
    }
    Swal.fire(
      this.translateService.instant("MSG_DELETED_PART"),
      this.translateService.instant("MSG_CONFIRM_DELETED"),
      'success'
    )
  }
  cleanFields() {
    this.nameAuthor.nativeElement.value = ""
    this.emailAuthor.nativeElement.value = ""
    this.authors = []
    this.authors = []
  }

  cleanAuthorFields() {
    this.nameAuthor.nativeElement.value = ""
    this.emailAuthor.nativeElement.value = ""
  }

  close() {
    this.closeView.emit();
  }

  getPackage() {
    this.labpackService.get({
      experiment: this.id_experiment
      , ___populate: 'package_type,repository'
    }).subscribe((data: any) => {
      this.data_labpack = data.response

    })
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
    this._experimenterService.get({
      experiment: this.id_experiment,
      ___populate: 'experimenter_roles,user',
      admin_experiment: true
    }).subscribe((resp: any) => {
      let experimenter = []
      this.experimenters = resp.response;

      for (let index = 0; index < this.experimenters.length; index++) {
        // add all authors less the corresponding author
        if (this.experimenters[index].corresponding_autor == false) {
          experimenter = [this.experimenters[index].user.full_name,
          this.experimenters[index].user.email,
          this.experimenters[index].user.phone,];
          this.list_experimenters.push(experimenter);

        }

      }
    });
  }
  getExperiment() {
    this.experimentService.get({ _id: this.id_experiment }).subscribe((data: any) => {
      this.experiment = data.response

    })
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
    this._artifactService.get({ name: "Archivo autores reproducido", is_acm: true, experiment: this.id_experiment }).subscribe((data: any) => {
      this.uploadedArtifacts = data.response

    })
  }


  getValueEvaluation() {

    this.evaluationService.get({ standard: this.id_standard, status: "success", experiment: this.id_experiment }).subscribe((data: any) => {
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
    if (this.VerifySuccessParameter() == false) {
      this.evaluationService.createEvaluation({
        status: 'success',
        experiment: this.id_experiment,
        standard: this.id_standard
      }).subscribe((data: {}) => { })
    }
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
    this.progressBarValueArtifact = ''
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
      name: 'Archivo autores reproducido',
      file_content: 'Archivo autores reproducido',
      author: ['Jorge Carcelen', 'Jack Carcelen'],
      data_main: 0,
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
      this.closeModal.nativeElement.click();
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
          this.save(file_url, storage_ref, false)
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
      name: 'Archivo autores reproducido',
      file_content: 'Archivo autores reproducido',
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

    this._artifactService.update(this.id_artifact, artifact).subscribe(() => {
      this.alertService.presentSuccessAlert(this.translateService.instant("MSG_UPDATE_ARTIFACT"));
      this.getUploadedArtifacts();

    });
  }

  generatePDFfile() {
    const doc = new jsPDF();
    let date = new Date();
    let fecha = formatDate(date)


    autoTable(doc, {
      body: [
        [
          {
            content: 'Reproduced Authors File',
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
        fillColor: '#061E7E'
      }
    });

    autoTable(doc, {
      body: [
        [
          {
            content: 'Reproduced Laboratory Package for "' + this.experiment[0].name + '"',
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
              content: 'The original experiment does not register the doi for the package',
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
              content: 'This is a reproduced laboratory package of the original experiment reported in the paper.The full compressed package of the original experiment can be found and downloaded here: (' + this.data_labpack[0].package_doi + ').',
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
            content: 'This AUTHOR file describes the information from the authors of the experiment.',
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
            content: 'For any additional information, contact the original author of the experiment by e-mail: ' + this.corresponding_author[0].user.full_name + "  " + this.corresponding_author[0].user.email + ".",
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
            content: "Reproduction Authors "

          }


        ],
      ],
      styles: {
        halign: 'left',
        fontSize: 15,
        fontStyle: 'bold',
        textColor: '#000000'
        , overflow: 'linebreak',
        cellPadding: 0

      },
      theme: 'plain',

    });

    for (let index = 0; index < this.authors.length; index++) {

      autoTable(doc, {
        body: [
          [

            {
              content: "Author "

            }


          ],
        ],
        styles: {
          halign: 'left',
          fontSize: 12,
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
              content: this.authors[index].name,

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
              content: "Email: " + this.authors[index].email,

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
    let fileData = new File([blobPDF], "Reproduced_Authors_File.pdf", { type: blobPDF.type })
    this.file_format = blobPDF.type
    this.file_size = blobPDF.size
    this.uploadGenerateArtifact(fileData)

  }

  showPDFDocument() {
    this.generatePDFfile()
    //clean selected authors list
    this.selected_authors = []
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
    this.cleanFields();
  }
  GenerateNewFile() {
    if (this.artifact?._id.length > 0) {
      this.deleteArtifact(this.artifact);
      this.generatePDFfile();
    } else {
      this.generatePDFfile();
    }
  }


}
