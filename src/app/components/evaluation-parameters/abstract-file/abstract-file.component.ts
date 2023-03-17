import {
  Component, ElementRef, EventEmitter, Input, OnInit, Output,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ArtifactController } from 'src/app/controllers/artifact.controller';
import { AlertService } from 'src/app/services/alert.service';
import { ArtifactService } from 'src/app/services/artifact.service';
import { ConvertersService } from 'src/app/services/converters.service';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { newStorageRefForArtifact, parseArtifactNameForStorage } from 'src/app/utils/parsers';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable'
import { formatDate } from 'src/app/utils/formatters';
import { BadgeService } from 'src/app/services/badge.service';
import { ActivatedRoute } from '@angular/router';
import { ExperimenterService } from 'src/app/services/experimenter.service';
import { LabpackService } from 'src/app/services/labpack.service';
import { ExperimentService } from 'src/app/services/experiment.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { FileSaverService } from 'ngx-filesaver';
import * as JSZip from 'jszip';
import * as JSZipUtils from '../../../../assets/script/jszip-utils.js';
import { AuthService } from '../../../services/auth.service';
import { TokenStorageService } from '../../../services/token-storage.service';

@Component({
  selector: 'app-abstract-file',
  templateUrl: './abstract-file.component.html',
  styleUrls: ['./abstract-file.component.scss']
})
export class AbstractFileComponent implements OnInit {
  standard_name = "guia_instrucciones_descarga";
  isLoading = false;
  progressBarValueArtifact = '';
  selectedFile: FileList;
  @Input() standard: string;
  @Input() experiment_id: number;

  ActualExperimenter = [];
  experimentOwner: boolean = false;
  @Output() closeView: EventEmitter<any> = new EventEmitter<any>();
  Form: FormGroup;
  evaluationsBadges: any = [];
  id_standard: string;
  id_experiment: string;
  artifacts: any = [];
  list_guide: any = [];
  list_guide_generated: any = [];
  selectedArtifact: any;
  corresponding_author = [];
  experiment: any
  data_labpack: any = [];
  isChecked = false;
  Option: string
  authors: any = [];
  filter: any = [];
  experimenters = [];
  selected_authors: any = [];
  list_experimenters = [];
  @ViewChild("nameAuthor") nameAuthor: ElementRef;
  @ViewChild("emailAuthor") emailAuthor: ElementRef;
  @ViewChild("editorData") editorData: ElementRef;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('SelectOption') SelectOption: ElementRef;

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

  constructor(private formBuilder: FormBuilder,
    private _convertersService: ConvertersService,
    private _artifactController: ArtifactController,
    private _evaluationService: EvaluationService,
    private _artifactService: ArtifactService,
    private actRoute: ActivatedRoute,
    private _alertService: AlertService,
    private _badgeService: BadgeService,
    private labpackService: LabpackService,
    private experimentService: ExperimentService,
    private _experimenterService: ExperimenterService,
    private translateService: TranslateService,
    private fileSaverService: FileSaverService,
    private _authService: AuthService,
    private tokenStorageService: TokenStorageService,) { }

  ngOnInit(): void {
    this.id_experiment = this.actRoute.parent.snapshot.paramMap.get('id');
    this.getBadgesStandards()
    this.getEvaluationsBadges();
    this.getArtifacts();
    this.getCorrespondingAuthor();
    this.getPackage();
    this.getExperiment();
    this.getExperimenters();
    this.loadArtifactOptions();
    this.getUploadedArtifacts();

    this.getActualExperimenter();

    this.Form = this.formBuilder.group({
      tipo: ['', [Validators.required]],
      importancia: ['', [Validators.required]],
      relevancia: ['', [Validators.required]],
      amenazas: ['', [Validators.required]],
      proposito: ['', [Validators.required]],
      link_original: ['', [Validators.required]],
      link_reproduced: ['', [Validators.required]],
    });

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

  ChangeName(name): string {
    let valor = ""
    console.log(name)
    if(name == "Archivo abstract"){
      name = "Archivo abstract reproducido"
    }
    for (let index = 0; index < this.artifactACM.length; index++) {
      if (this.artifactACM[index].name.toLowerCase() == name.toLowerCase() ) {
        valor = this.artifactACM[index].eng_name
      }

    }
    return valor;
  }

  onChange(checked: boolean, option: string) {
    this.isChecked = checked;
    this.Option = option;

  }

  getActualExperimenter() {
    this._experimenterService.get({ user: this.tokenStorageService.getUser()._id }).subscribe((data: any) => {
      this.ActualExperimenter = data.response
      this.experimentOwner = this._authService.validateExperimentOwner(this.ActualExperimenter[0], this.id_experiment);

    })
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
      this._alertService.presentWarningAlert(this.translateService.instant("MSG_VALIDATE_AUTHOR"))
      this.cleanAuthorFields();
    } else {
      if (author.name == "" || author.email == "") {
        this._alertService.presentWarningAlert(this.translateService.instant("MSG_FILL_FIELDS"))
      } else {
        this.authors.push(author);
        this._alertService.presentSuccessAlert(this.translateService.instant("MSG_ADD_AUTHOR"))
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
      this._alertService.presentWarningAlert(this.translateService.instant("MSG_VALIDATE_AUTHOR_SELECT"))
    } else {
      this._alertService.presentSuccessAlert(this.translateService.instant("MSG_SELECT_AUTHOR"))
      this.selected_authors.push(author);
    }

  }
  deleteAuthor(author: any) {
    this.filter = this.authors.filter((item) => item.name != author.name)
    this.authors = this.filter
    if(this.authors.length == 0){
      this.selected_authors = []
     }
    Swal.fire(
      this.translateService.instant("MSG_DELETED_PART"),
      this.translateService.instant("MSG_CONFIRM_DELETED"),
      'success'
    )
  }
  resetFom() {
    this.Form.controls['tipo'].setValue('');
    this.Form.controls['importancia'].setValue('');
    this.Form.controls['relevancia'].setValue('');
    this.Form.controls['amenazas'].setValue('');
    this.Form.controls['proposito'].setValue('');
  }
  click() {
    this.resetFom();
    this.cleanFields();
  }
  cleanFields() {
    this.nameAuthor.nativeElement.value = ""
    this.emailAuthor.nativeElement.value = ""
    this.authors = []
    this.selected_authors = []
  }

  cleanAuthorFields() {
    this.nameAuthor.nativeElement.value = ""
    this.emailAuthor.nativeElement.value = ""
  }

  getArtifacts() {
    this._artifactService.get({
      is_acm: false,
      experiment: this.id_experiment,
      ___populate: 'artifact_class,artifact_type,artifact_purpose,task',
    }).subscribe((data: any) => {
      this.artifacts = data.response
    })
  }
  getExperiment() {
    this.experimentService.get({ _id: this.id_experiment }).subscribe((data: any) => {
      this.experiment = data.response
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

  getPackage() {
    this.labpackService.get({
      experiment: this.id_experiment
      , ___populate: 'package_type,repository'
    }).subscribe((data: any) => {
      this.data_labpack = data.response
    })
  }
  getBadgesStandards() {

    this._badgeService.getStandards({ name: this.standard }).subscribe((data: any) => {
      this.id_standard = data.response[0]._id
    });
  }
  getEvaluationsBadges() {
    this._evaluationService.get({ status: "success" }).subscribe((data: any) => {
      this.evaluationsBadges = data.response


    })
  }

  getUploadedArtifacts() {
    this._artifactService.get({ name: "Archivo abstract reproducido", is_acm: true, experiment: this.id_experiment }).subscribe((data: any) => {
      this.uploadedArtifacts = data.response

    })
  }


  getValueEvaluation() {

    this._evaluationService.get({ standard: this.id_standard, status: "success", experiment: this.id_experiment }).subscribe((data: any) => {
      this.parameterEvaluated = data.response

    })
  }


  cleanProgressBar(){
    this.progressBarValueArtifact = ""
  }


  async loadArtifactOptions() {
    const [types, classes, purposes, acms, evaluations] = await Promise.all([
      this._artifactService.getTypes().toPromise(),
      this._artifactService.getClasses().toPromise(),
      this._artifactService.getPurposes().toPromise(),
      this._artifactService.getACM().toPromise(),
      this._evaluationService.get({ status: "success" }).toPromise()
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
      if (this.evaluationsBadges[index].standard == this.id_standard && this.evaluationsBadges[index].status == "success" && this.evaluationsBadges[index].experiment == this.experiment_id) {
        evaluated = true
      }

    }
    return evaluated
  }
  createEvaluationStandard() {
    if (this.VerifySuccessParameter() == false) {
      this._evaluationService.createEvaluation({
        status: 'success',
        experiment: this.id_experiment,
        standard: this.id_standard
      }).subscribe((data: {}) => { })
    } else {
      console.log("the parameter has been evaluated before.....")
    }
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
    this._artifactController.removeFullArtifact(
      artifact._id,
      onDoneDeleting,
    );
    this.deleteEvaluation()
    this.progressBarValueArtifact=''
  }

  deleteEvaluation() {
    this._evaluationService.delete(this.parameterEvaluated[0]._id).subscribe(data => {
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
      name: 'Archivo abstract reproducido',
      file_content: 'Archivo abstract reproducido',
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
      task: null
    }

    this._artifactService.create(artifact).subscribe(() => {
      this._alertService.presentSuccessAlert(this.translateService.instant('CREATE_ARTIFACT'));
      this.getUploadedArtifacts();
    });
  }

  chooseFileArtifact(event) {
    if (this.VerifySuccessParameter() == true) {
      // el parametro ya existe
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
      'report',
      artifact_name
    );

    const onPercentageChanges = (percentage: string) => {
      this.progressBarValueArtifact = percentage;
    }
    this._artifactController.uploadArtifactToStorage(
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
      'report',
      artifact_name
    );

    const onPercentageChanges = (percentage: string) => {
      this.progressBarValueArtifact = percentage;
    }
    this._artifactController.uploadArtifactToStorage(
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
      name: 'Archivo abstract reproducido',
      file_content: 'Archivo abstract reproducido',
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

    this._artifactService.update(this.id_artifact,artifact).subscribe(() => {
      this._alertService.presentSuccessAlert(this.translateService.instant("MSG_UPDATE_ARTIFACT"));
      this.getUploadedArtifacts();

    });
  }

  getExperimenters() {

    this._experimenterService.get({
      experiment: this.id_experiment,
      ___populate: 'experimenter_roles,user'
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

  generatePDFfile() {
    const doc = new jsPDF();
    let date = new Date();
    let fecha = formatDate(date)

    if (this.Form.value.tipo.length == 0 || this.Form.value.importancia.length == 0 ||
      this.Form.value.relevancia.length == 0 || this.Form.value.amenazas.length == 0 || this.Form.value.proposito.length == 0 ||
      this.Form.value.link_original.length == 0 || this.Form.value.link_reproduced.length == 0) {
      this._alertService.presentWarningAlert(this.translateService.instant("MSG_FILL_FIELDS"))
    }
    else if (this.selected_authors.length == 0) {
      this._alertService.presentWarningAlert(this.translateService.instant("MSG_SELECT_AUTHOR_REPRODUCTION"))
    } else {
      autoTable(doc, {
        body: [
          [
            {
              content: 'Reproduced Abstract File',
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
              content: this.Form.value.tipo + ' Reproduction for Laboratory Package of ' + "the experiment" + '"' + this.experiment[0].name + '"',
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
              content: 'This ABSTRACT file explains how the experimenters make the the reproduction of the original experiment.',
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
              content: 'For any additional information, contact the original author of the experiment by e-mail:  ' + this.corresponding_author[0].user.full_name + "  " + this.corresponding_author[0].user.email + ".",
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
              content: 'Importance',
            }
            ,
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

      autoTable(doc, {
        body: [
          [
            {
              content: this.Form.value.importancia,
            }
            ,
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
              content: 'Relevance',
            }
            ,
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

      autoTable(doc, {
        body: [
          [
            {
              content: this.Form.value.relevancia,
            }
            ,
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
              content: 'Purpose',
            }
            ,
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

      autoTable(doc, {
        body: [
          [
            {
              content: this.Form.value.proposito,
            }
            ,
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
              content: 'Threats',
            }
            ,
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

      autoTable(doc, {
        body: [
          [
            {
              content: this.Form.value.amenazas,
            }
            ,
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
              content: 'Original scientific article',
            }
            ,
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


      autoTable(doc, {
        body: [
          [
            {
              content: this.Form.value.link_original,
            }
            ,
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
              content: 'Reproduced scientific article',
            }
            ,
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



      autoTable(doc, {
        body: [
          [
            {
              content: this.Form.value.link_reproduced,
            }
            ,
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
              content: 'Original Authors',
            }
            ,
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





      autoTable(doc, {
        body: [
          [

            {
              content: 'Author (Corresponding Author)',
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


      for (let index = 0; index < this.corresponding_author.length; index++) {
        autoTable(doc, {
          body: [
            [

              {
                content: this.corresponding_author[index].user.full_name,

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
                content: "Email: " + this.corresponding_author[index].user.email,

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


        // other authors
        for (let index = 0; index < this.experimenters.length; index++) {

          if (this.experimenters[index].corresponding_autor == false) {

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
                    content: this.experimenters[index].user.full_name,

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
                    content: "Email: " + this.experimenters[index].user.email,

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



        }


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

        for (let index = 0; index < this.selected_authors.length; index++) {

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
                  content: this.selected_authors[index].name,

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
                  content: "Email: " + this.selected_authors[index].email,

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
      }
      //this.createEvaluationStandard()
      return doc.save("Reproduced_Abstract_File.pdf");

    }
  }

  showPDFDocument(){
    this.generatePDFfile()
    //clean selected authors list
    this.selected_authors = []
  }
}
