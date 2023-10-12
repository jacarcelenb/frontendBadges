import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtifactController } from 'src/app/controllers/artifact.controller';
import { AlertService } from 'src/app/services/alert.service';
import { BadgeService } from 'src/app/services/badge.service';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { ExperimentService } from 'src/app/services/experiment.service';
import { ExperimenterService } from 'src/app/services/experimenter.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'
import { formatDate } from 'src/app/utils/formatters';
import { newStorageRefForArtifact, parseArtifactNameForStorage } from 'src/app/utils/parsers';
import { LabpackService } from 'src/app/services/labpack.service';
import { ArtifactService } from 'src/app/services/artifact.service';
import { TranslateService } from '@ngx-translate/core';
import { FileSaverService } from 'ngx-filesaver';
import * as JSZip from 'jszip';
import * as JSZipUtils from '../../../../assets/script/jszip-utils.js';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../../../services/auth.service';



@Component({
  selector: 'app-install-file',
  templateUrl: './install-file.component.html',
  styleUrls: ['./install-file.component.scss']
})
export class InstallFileComponent implements OnInit {
  standard_name = "archivo_install";
  id_experiment: string;
  userExperiments = [];
  experimentOwner: boolean = false;
  experiment: any
  evaluationsBadges: any = [];
  progressBarValueArtifact = '';
  selectedFileArtifact: FileList;
  id_standard: string;
  experimenter = ""
  data_labpack: any = [];
  corresponding_author = [];
  artifacts: any = [];
  list_guide: any = [];
  list_guide_generated: any = [];
  selectedArtifact: any;
  @Input() standard: string;
  @Output() closeView: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild("idinstall") idinstall: ElementRef;
  @ViewChild("text_editor") texteditor: ElementRef;
  @ViewChild("OpenModal") OpenModal: ElementRef;
  @ViewChild("CloseModal") CloseModal: ElementRef;
  @ViewChild("closeMainModal") closeMainModal: ElementRef;
  experimenters: any;
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
  dataSource: any
  displayedColumns: string[] = ['name', 'artifact_type', 'artifact_purpose', 'file_content', 'option'];


  @ViewChild(MatPaginator) paginator: MatPaginator;
  artifact: any;
  constructor(
    private actRoute: ActivatedRoute,
    private artifactController: ArtifactController,
    private alertService: AlertService,
    private experimentService: ExperimentService,
    private evaluationService: EvaluationService,
    private _badgeService: BadgeService,
    private tokenStorage: TokenStorageService,
    private _artifactService: ArtifactService,
    private labpackService: LabpackService,
    private _experimenterService: ExperimenterService,
    private translateService: TranslateService,
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
    this.getArtifacts();
    this.loadArtifactOptions();
    this.getUploadedArtifacts();
    this.getUserExperiments()
    this.ValidateLanguage();
    this.translateService.onLangChange.subscribe(() => {
      this.ValidateLanguage()
    });

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
  async onDown(fromRemote: boolean, artifact) {
    const fileName = artifact.name + '.' + artifact.file_format.toLowerCase();
    if (fromRemote) {
      let data = this.UrltoBinary(artifact.file_url)
      this.fileSaverService.save(await data, fileName);
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

  getArtifacts() {
    this._artifactService.get({
      experiment: this.id_experiment,
      is_acm: false,
      ___populate: 'artifact_class,artifact_type,artifact_purpose,task',
    }).subscribe((data: any) => {
      this.artifacts = data.response
      this.dataSource = new MatTableDataSource<any>(this.artifacts);
      this.dataSource.paginator = this.paginator;
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

  cleanArtifactsList() {
    this.list_guide = []
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
    this._artifactService.get({ name: "Archivo install", is_acm: true, experiment: this.id_experiment }).subscribe((data: any) => {
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

  getSelectedArtifact(artifact: any) {
    let findElement = false;

    // validar si el objeto ya existe en la lista
    for (let index = 0; index < this.list_guide.length; index++) {
      if (this.list_guide[index].artifact._id == artifact._id) {
        findElement = true;
      }
    }
    if (findElement == true) {
      this.alertService.presentWarningAlert(this.translateService.instant("MSG_SELECTED_ARTIFACT"))

    } else {
      this.texteditor.nativeElement.value = ""
      this.selectedArtifact = artifact;
      this.OpenModal.nativeElement.click();
    }
  }
  show() {
    let findElement = false;
    const data = {
      artifact: this.selectedArtifact,
      instructions: this.texteditor.nativeElement.value
    }
    // validar si el objeto ya existe en la lista
    for (let index = 0; index < this.list_guide.length; index++) {
      if (this.list_guide[index].artifact._id == data.artifact._id) {

        findElement = true;
      }

    }
    if (findElement == true) {
      this.alertService.presentWarningAlert(this.translateService.instant("MSG_ADD_ARTIFACT"))
      this.CloseModal.nativeElement.click();
    } else {
      if (this.texteditor.nativeElement.value == "") {
        this.alertService.presentWarningAlert(this.translateService.instant("MSG_FILL_FIELDS"))
      } else {
        this.list_guide.push(data);
        this.alertService.presentSuccessAlert(this.translateService.instant("MSG_CONFIRM_ADD"))
        this.CloseModal.nativeElement.click();
      }

    }

  }

  saveData() {
    this.list_guide_generated.push(this.idinstall.nativeElement.value);
    this.alertService.presentSuccessAlert("")
    this.GenerePdfWithoOutHelp();
    this.idinstall.nativeElement.value = ""
  }


  GenerePdfWithoOutHelp() {
    const doc = new jsPDF();
    let date = new Date();
    let fecha = formatDate(date)

    autoTable(doc, {
      body: [
        [
          {
            content: 'INSTALL File',
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
            content: 'This document contains information on how to install the dependencies for this experiment and how to use them.',
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
            content: 'Installation',
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
            content: this.idinstall.nativeElement.value
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

    // this.createEvaluationStandard()
    return doc.save("Install_File.pdf")
  }

  generatePDFfile() {
    const doc = new jsPDF();
    let date = new Date();
    let fecha = formatDate(date)

    autoTable(doc, {
      body: [
        [
          {
            content: 'INSTALL File',
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
            content: 'This document contains information on how to install the dependencies for this experiment and how to use them.',
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
            content: 'Installation',
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

    for (let index = 0; index < this.list_guide.length; index++) {
      autoTable(doc, {
        body: [
          [
            {
              content: this.list_guide[index].artifact.name,
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
              content: "How to install",
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
              content: this.list_guide[index].instructions,
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
    let fileData = new File([blobPDF], "Install_File.pdf", { type: blobPDF.type })
    this.file_format = blobPDF.type
    this.file_size = blobPDF.size
    this.uploadGenerateArtifact(fileData)
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
    this.progressBarValueArtifact = ''
  }

  deleteEvaluation() {
    this.evaluationService.delete(this.parameterEvaluated[0]._id).subscribe(data => {
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
      name: 'Archivo install',
      file_content: 'Archivo install',
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
      this.closeMainModal.nativeElement.click();
    });
  }

  chooseFileArtifact(event) {
    if (this.VerifySuccessParameter() == true) {
      // el parametro ya existe
      // this.alertService.presentWarningAlert("El parametro ha sido completado")
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
    this.list_guide=[]
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
      name: 'Archivo install',
      file_content: 'Archivo install',
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
    this.list_guide = []
    this.cleanArtifactsList();
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
