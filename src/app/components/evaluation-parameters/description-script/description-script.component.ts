import {
  AfterViewInit,
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
import { TranslateService } from '@ngx-translate/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FileSaverService } from 'ngx-filesaver';
import * as JSZip from 'jszip';
import * as JSZipUtils from '../../../../assets/script/jszip-utils.js';
import { AuthService } from '../../../services/auth.service';
import { TokenStorageService } from '../../../services/token-storage.service';

@Component({
  selector: 'app-description-script',
  templateUrl: './description-script.component.html',
  styleUrls: ['./description-script.component.scss']
})
export class DescriptionScriptComponent implements OnInit {
  isLoading = false;
  progressBarValueArtifact = '';
  selectedFile: FileList;
  @Input() standard: string;
  @Input() experiment_id: number;
  userExperiments = [];
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
  selectArtifactName: string;
  parameterEvaluated: any;
  id_artifact: any;
  change_language = false;
  dataSource: any
  selected_id_artifact: string;

  @ViewChild("text_editor") texteditor: ElementRef;
  @ViewChild("text_main") textmain: ElementRef;
  @ViewChild("closeModal") closeModal: ElementRef;
  @ViewChild("closeMainModal") closeMainModal: ElementRef;
  @ViewChild("OpenModal") OpenModal: ElementRef;


  displayedColumns: string[] = ['name', 'artifact_type', 'artifact_purpose', 'file_content', 'option'];


  @ViewChild(MatPaginator) paginator: MatPaginator;

  corresponding_author = [];
  experiment: any
  data_labpack: any = [];
  artifact: any;
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
    private tokenStorageService: TokenStorageService,) {
    this.initForm();
  }

  ngOnInit(): void {
    this.id_experiment = this.actRoute.parent.snapshot.paramMap.get('id');
    this.getEvaluationsBadges();
    this.getBadgesStandards()
    this.getArtifacts();
    this.getCorrespondingAuthor();
    this.getPackage();
    this.getExperiment();
    this.loadArtifactOptions();
    this.getUploadedArtifacts();
    this.getUserExperiments()
    this.ValidateLanguage();
    this.translateService.onLangChange.subscribe(() => {
      this.ValidateLanguage()
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

  ValidateLanguage() {
    if (this.translateService.instant('LANG_SPANISH_EC') == "Español (ECU)") {
      this.change_language = false;
    } else {
      this.change_language = true;
    }
  }


  close() {
    this.initForm();
    this.isLoading = false;
    this.closeView.emit(null);
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

  initForm() {
    this.Form = this.formBuilder.group({
      name: ['', Validators.required],
      link: ['', Validators.required],
      requirements: ['', Validators.required],
      recommendations: ['', Validators.required],

    });

  }

  ChangeName(name): string {
    let valor = "Descripción sistemática de los scripts"
      if ("Sistematic Script Description"== name) {
        valor = name
      }

    return valor;
  }

  getArtifacts() {
    this._artifactService.get({
      is_acm: false,
      experiment: this.id_experiment,
      ___populate: 'artifact_class,artifact_type,artifact_purpose,task',
    }).subscribe((data: any) => {
      this.artifacts =[]
      for (let index = 0; index < data.response.length; index++) {
        if (data.response[index].artifact_purpose.name == "Script") {
          this.artifacts.push(data.response[index])
        }
      }

      this.dataSource = new MatTableDataSource<any>(this.artifacts);
      this.dataSource.paginator = this.paginator;
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


  getUploadedArtifacts() {
    this._artifactService.get({ name: "Sistematic Script Description", experiment: this.id_experiment }).subscribe((data: any) => {
      this.uploadedArtifacts = data.response
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
      this.getEvaluationsBadges()
      this.getValueEvaluation();
    });
  }
  getEvaluationsBadges() {
    this._evaluationService.get({ status: "success" }).subscribe((data: any) => {
      this.evaluationsBadges = data.response


    })
  }

  getValueEvaluation() {

    this._evaluationService.get({ standard: this.id_standard, status: "success", experiment: this.id_experiment }).subscribe((data: any) => {
      this.parameterEvaluated = data.response

    })
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
    this._artifactController.removeFullArtifact(
      artifact._id,
      onDoneDeleting,
    );
    this.deleteEvaluation()
    this.progressBarValueArtifact = ''
  }

  deleteEvaluation() {
    this._evaluationService.delete(this.parameterEvaluated[0]._id).subscribe(data => {
      this.getEvaluationsBadges();
    })

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
      name: 'Sistematic Script Description',
      file_content: 'Sistematic Script Description',
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
      is_acm: false,
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
      this._alertService.presentSuccessAlert(this.translateService.instant('CREATE_ARTIFACT'));
      this.getUploadedArtifacts();
      this.closeMainModal.nativeElement.click();
    });
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
      'artifact',
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
        this._alertService.presentWarningAlert(this.translateService.instant("MSG_PDF_FILES"))
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
    this._artifactController.uploadArtifactToStorage(
      storage_ref,
      this.selectedFileArtifact.item(0),
      { onPercentageChanges },
      (storage_ref, file_url) => {
        if (this.progressBarValueArtifact == '100') {
          this._alertService.presentSuccessAlert(this.translateService.instant("MSG_UPLOAD_FILE"))
          this.update(file_url, storage_ref)
        }
      },
    );
  }

  selectArtifact(artifact) {
    this.id_artifact = artifact._id;
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
      name: 'Sistematic Script Description',
      file_content: 'Sistematic Script Description',
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
      is_acm: false,
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
      this._alertService.presentSuccessAlert(this.translateService.instant("MSG_UPDATE_ARTIFACT"));
      this.getUploadedArtifacts();

    });
  }



  cleanArtifactsList() {
    this.list_guide = []
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  getSelectedArtifact(artifact: any) {
    this.initForm()
    let findElement = false;
    this.selected_id_artifact = artifact._id;
    this.Form.controls['name'].setValue(artifact.name)
    for (let index = 0; index < this.list_guide.length; index++) {
      if (this.list_guide[index].name == artifact.name) {
        findElement = true;
      }
    }
    if (findElement == true) {
      this._alertService.presentWarningAlert(this.translateService.instant("MSG_SELECTED_ARTIFACT"))

    } else {
      this.selectedArtifact = artifact;

      this.OpenModal.nativeElement.click();

    }

  }
  show() {
    let findElement = false;

   const DescriptionSoftware ={
    name:this.Form.value.name,
    link: this.Form.value.link,
    requirements: this.Form.value.requirements,
    recommendations: this.Form.value.recommendations

   }
    for (let index = 0; index < this.list_guide.length; index++) {
      if (this.list_guide[index].name == DescriptionSoftware.name) {

        findElement = true;
      }

    }
    if (findElement == true) {
      this._alertService.presentWarningAlert(this.translateService.instant("MSG_ADD_ARTIFACT"))
      this.closeModal.nativeElement.click();
    } else {
      if (this.Form.invalid == true) {
        this._alertService.presentWarningAlert(this.translateService.instant("MSG_FILL_FIELDS"))
      } else {
         this._artifactService.update(this.selected_id_artifact, {
          sistematic_description_scripts: "true"
         }).subscribe(data =>{
          this.list_guide.push(DescriptionSoftware);
          this._alertService.presentSuccessAlert(this.translateService.instant("MSG_REGISTER_ARTIFACT"))
          this.closeModal.nativeElement.click();
         })

      }

    }


  }

  saveData() {
    this.list_guide_generated.push(this.textmain.nativeElement.value);
    this._alertService.presentSuccessAlert(this.translateService.instant("MSG_CONFIRM_PDF"))
  }

  generatePDFfile() {
    const doc = new jsPDF();
    let date = new Date();
    let fecha = formatDate(date)

    autoTable(doc, {
      body: [
        [
          {
            content: 'Sistematic Script Description File',
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
            content: 'This file contains aspects of the script used such as name, download link or information, requirements and recommendations.',
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
            content: 'Sistematic Script Description',
          }
          ,
        ],
      ],
      styles: {
        halign: 'left',
        fontSize: 22,
        fontStyle: 'bold',
        textColor: '#000000'
        , overflow: 'linebreak',
        cellPadding: 0

      },
      theme: 'plain',

    });

    // mostrar los artefactos y sus guias de instalacion

    for (let index = 0; index < this.list_guide.length; index++) {


      autoTable(doc, {
        body: [
          [
            {
              content: "Name",
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
          cellPadding: 0,

        },
        theme: 'plain',

      });


      autoTable(doc, {
        body: [
          [

            {
              content: this.list_guide[index].name,
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
              content: "Link",
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
          cellPadding: 0,

        },
        theme: 'plain',

      });


      autoTable(doc, {
        body: [
          [

            {
              content: this.list_guide[index].link,
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
              content: "Requirements",
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
          cellPadding: 0,

        },
        theme: 'plain',

      });


      autoTable(doc, {
        body: [
          [

            {
              content: this.list_guide[index].requirements,
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
              content: "Recommendations",
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
          cellPadding: 0,

        },
        theme: 'plain',

      });


      autoTable(doc, {
        body: [
          [

            {
              content: this.list_guide[index].recommendations,
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
    let fileData = new File([blobPDF], "Sistematic_Script_Description.pdf", { type: blobPDF.type })
    this.file_format = blobPDF.type
    this.file_size = blobPDF.size
    this.uploadGenerateArtifact(fileData)
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
    this._artifactController.uploadArtifactToStorage(
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

  getArtifact(artifact){
    this.artifact = artifact;
    this.list_guide=[]
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
