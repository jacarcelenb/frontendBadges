import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ArtifactController } from 'src/app/controllers/artifact.controller';
import { ArtifactService } from 'src/app/services/artifact.service';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { parseArtifactNameForStorage, newStorageRefForArtifact } from 'src/app/utils/parsers';
import { formatDate } from 'src/app/utils/formatters';
import { AlertService } from 'src/app/services/alert.service';
import { BadgeService } from 'src/app/services/badge.service';
import { ActivatedRoute, Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ExperimentService } from 'src/app/services/experiment.service';
import { ExperimenterService } from 'src/app/services/experimenter.service';
import { LabpackService } from 'src/app/services/labpack.service';
import { TranslateService } from '@ngx-translate/core';
import { FileSaverService } from 'ngx-filesaver';
import * as JSZip from 'jszip';
import * as JSZipUtils from '../../../../assets/script/jszip-utils.js';
import { AuthService } from '../../../services/auth.service';
import { TokenStorageService } from '../../../services/token-storage.service';
@Component({
  selector: 'app-artifacts-inventory',
  templateUrl: './artifacts-inventory.component.html',
  styleUrls: ['./artifacts-inventory.component.scss']
})
export class ArtifactsInventoryComponent implements OnInit {
  standard_name = "inventario_artefacto";
  @Input() experiment_id: number;
  @Input() standard: string;
  userExperiments = [];
  experimentOwner: boolean = false;
  @Output() closeView: EventEmitter<any> = new EventEmitter<any>();
  progressBarValueArtifact = '';
  isLoading = false;
  id_standard: string;
  id_experiment: string;
  artifacts: any = [];
  all_standards = [];
  list_artifacts = [];
  experiment: any
  selectedFileArtifact: FileList;
  evaluationsBadges: any = [];
  corresponding_author = [];
  data_labpack: any = [];
  artifactTypes = [];
  artifactClasses = [];
  artifactPurposes = [];
  artifactACM = [];
  uploadedArtifacts = [];
  file_content: any;
  file_format: any;
  file_size: any;
  file_url: any;
  file_location_path: any;
  evaluations = [];
  id_artifact: any;
  parameterEvaluated: any;
  change_language = false;
  url_package: string;
  constructor(
    private evaluationService: EvaluationService,
    private artifactService: ArtifactService,
    private artifactController: ArtifactController,
    private actRoute: ActivatedRoute,
    private alertService: AlertService,
    private labpackService: LabpackService,
    private _badgeService: BadgeService,
    private experimentService: ExperimentService,
    private translateService: TranslateService,
    private _experimenterService: ExperimenterService,
    private fileSaverService: FileSaverService,
    private _authService: AuthService,
    private tokenStorageService: TokenStorageService,

  ) { }

  ngOnInit(): void {
    this.id_experiment = this.actRoute.parent.snapshot.paramMap.get('id');
    this.getArtifacts();
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
    if (this.translateService.instant('LANG_SPANISH_EC') != "Español (Ecuador)") {
      this.change_language = true;
    }
  }

  // Request to fetch data
  getPackage() {
    this.labpackService.get({
      experiment: this.experiment_id
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

  getExperiment() {
    this.experimentService.get({ _id: this.id_experiment }).subscribe((data: any) => {
      this.experiment = data.response
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
  async onDown(fromRemote: boolean, artifact) {
    const fileName = artifact.name + '.' + artifact.file_format.toLowerCase();
    if (fromRemote) {
      let data = this.UrltoBinary(artifact.file_url)
      this.fileSaverService.save(await data, fileName);
    }

  }

  close() {
    this.closeView.emit();
  }

  ChangeName(name): string {
    let valor = ""
    for (let index = 0; index < this.artifactACM.length; index++) {

      if (this.artifactACM[index].name.toLowerCase() == name.toLowerCase()) {
        valor = this.artifactACM[index].eng_name
      }

    }
    return valor;
  }

  getArtifacts() {

    this.artifactService.get({
      experiment: this.id_experiment,
      is_acm: false,
      ___populate: 'artifact_class,artifact_type,artifact_purpose,task'
    }).subscribe((data: any) => {
      this.artifacts = data.response

      let artefacto = []
      for (let index = 0; index < this.artifacts.length; index++) {
        artefacto = [this.artifacts[index].name,
        this.artifacts[index].artifact_type.name,
        this.artifacts[index].artifact_class.name,
        this.artifacts[index].artifact_purpose.name,
        this.artifacts[index].evaluation.time_short_execution,
        this.artifacts[index].evaluation.time_complete_execution,
        this.artifacts[index].file_content,
        this.VerificarTareaArtefactos(this.artifacts[index].task)
        ]

        this.list_artifacts.push(artefacto)

      }


    });

  }

  getUploadedArtifacts() {
    this.artifactService.get({ name: "Archivo Inventario", is_acm: true, experiment: this.id_experiment }).subscribe((data: any) => {
      this.uploadedArtifacts = data.response


    })
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

  uploadGenerateArtifact(file) {
    const artifact_name = parseArtifactNameForStorage(
      file.name,
    );
    const storage_ref = newStorageRefForArtifact(
      'inventary',
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

  // methods

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

  findNameArtifact(id: any): string {
    let data = ""
    for (let index = 0; index < this.artifactACM.length; index++) {
      if (this.artifactACM[index]._id == id) {
        data = this.artifactACM[index].name
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
    else if (name == "Archivo decisión") {
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
      this.evaluationService.createEvaluation({
        status: 'success',
        experiment: this.experiment_id,
        standard: id
      }).subscribe((data: {}) => { })
    }
  }

  GenerateNewFile(artifact) {
    if (artifact._id.length > 0) {
      this.deleteArtifact(artifact);
      this.showPDF();
    }
  }
  showPDF() {

    if (this.list_artifacts.length > 0) {
      const doc = new jsPDF();
      let date = new Date();
      let fecha = formatDate(date)


      autoTable(doc, {
        body: [
          [
            {
              content: 'Artifact Inventory',
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
              content: 'This INVENTORY file describes the artifacts that were used during the experiment.',
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
              content: 'File Content',
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
              content: 'In this file you can find information about the artifacts as type, purpose, content, etc.',
            }

          ],
        ],
        styles: {
          halign: 'left',
          fontSize: 12,
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
              content: 'Artifacts Features',
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

      autoTable(doc, {
        body: [
          [

            {
              content: 'Name',

              styles: {
                halign: 'left',
                fontSize: 12,
                fontStyle: 'bold',
                textColor: '#000000',
                overflow: 'linebreak',
                cellPadding: 0

              }
            }


          ],
        ],
        theme: 'plain',

      });

      autoTable(doc, {
        body: [
          [

            {
              content: 'Represents the name of the artifact.',

              styles: {
                halign: 'left',
                fontSize: 11,
                textColor: '#000000',
                overflow: 'linebreak',
                cellPadding: 0

              }
            }


          ],
        ],
        theme: 'plain',

      });

      autoTable(doc, {
        body: [
          [

            {
              content: 'Type',

              styles: {
                halign: 'left',
                fontSize: 12,
                fontStyle: 'bold',
                textColor: '#000000',
                overflow: 'linebreak',
                cellPadding: 0

              }
            }


          ],
        ],
        theme: 'plain',

      });

      autoTable(doc, {
        body: [
          [

            {
              content: 'Represents the type of the artifact for example: dataset, software , image ,video ,etc.',

              styles: {
                halign: 'left',
                fontSize: 11,
                textColor: '#000000',
                overflow: 'linebreak',
                cellPadding: 0

              }
            }


          ],
        ],
        theme: 'plain',

      });


      autoTable(doc, {
        body: [
          [

            {
              content: 'Class',

              styles: {
                halign: 'left',
                fontSize: 12,
                fontStyle: 'bold',
                textColor: '#000000',
                overflow: 'linebreak',
                cellPadding: 0

              }
            }


          ],
        ],
        theme: 'plain',

      });

      autoTable(doc, {
        body: [
          [

            {
              content: 'Represents the class of the artifact for example: input or output',

              styles: {
                halign: 'left',
                fontSize: 11,
                textColor: '#000000',
                overflow: 'linebreak',
                cellPadding: 0

              }
            }


          ],
        ],
        theme: 'plain',

      });




      autoTable(doc, {
        body: [
          [

            {
              content: 'Purpose',

              styles: {
                halign: 'left',
                fontSize: 12,
                fontStyle: 'bold',
                textColor: '#000000',
                overflow: 'linebreak',
                cellPadding: 0

              }
            }


          ],
        ],
        theme: 'plain',

      });

      autoTable(doc, {
        body: [
          [

            {
              content: 'Represents the purpose of the artifact for example: UML model , scripts, requirements, etc.',

              styles: {
                halign: 'left',
                fontSize: 11,
                textColor: '#000000',
                overflow: 'linebreak',
                cellPadding: 0

              }
            }


          ],
        ],
        theme: 'plain',

      });



      autoTable(doc, {
        body: [
          [

            {
              content: 'Short Execution Time or S.E.T',

              styles: {
                halign: 'left',
                fontSize: 12,
                fontStyle: 'bold',
                textColor: '#000000',
                overflow: 'linebreak',
                cellPadding: 0

              }
            }


          ],
        ],
        theme: 'plain',

      });

      autoTable(doc, {
        body: [
          [

            {
              content: 'Represents the short execution time of the artifact.',

              styles: {
                halign: 'left',
                fontSize: 11,
                textColor: '#000000',
                overflow: 'linebreak',
                cellPadding: 0

              }
            }


          ],
        ],
        theme: 'plain',

      });


      autoTable(doc, {
        body: [
          [

            {
              content: 'Completed Execution Time or C.E.T',

              styles: {
                halign: 'left',
                fontSize: 12,
                fontStyle: 'bold',
                textColor: '#000000',
                overflow: 'linebreak',
                cellPadding: 0

              }
            }


          ],
        ],
        theme: 'plain',

      });

      autoTable(doc, {
        body: [
          [

            {
              content: 'Represents the completed execution time of the artifact.',

              styles: {
                halign: 'left',
                fontSize: 11,
                textColor: '#000000',
                overflow: 'linebreak',
                cellPadding: 0

              }
            }


          ],
        ],
        theme: 'plain',

      });

      autoTable(doc, {
        body: [
          [

            {
              content: 'Content',

              styles: {
                halign: 'left',
                fontSize: 12,
                fontStyle: 'bold',
                textColor: '#000000',
                overflow: 'linebreak',
                cellPadding: 0

              }
            }


          ],
        ],
        theme: 'plain',

      });

      autoTable(doc, {
        body: [
          [

            {
              content: 'Describes the content of the artifact.',

              styles: {
                halign: 'left',
                fontSize: 11,
                textColor: '#000000',
                overflow: 'linebreak',
                cellPadding: 0

              }
            }


          ],
        ],
        theme: 'plain',

      });


      autoTable(doc, {
        body: [
          [

            {
              content: '¿Has Tasks?',

              styles: {
                halign: 'left',
                fontSize: 12,
                fontStyle: 'bold',
                textColor: '#000000',
                overflow: 'linebreak',
                cellPadding: 0

              }
            }


          ],
        ],
        theme: 'plain',

      });

      autoTable(doc, {
        body: [
          [

            {
              content: 'Describes if the artifact has or no linked tasks.',

              styles: {
                halign: 'left',
                fontSize: 11,
                textColor: '#000000',
                overflow: 'linebreak',
                cellPadding: 0

              }
            }


          ],
        ],
        theme: 'plain',

      });


      autoTable(doc, {
        body: [
          [

            {
              content: 'The following table shows the list of artifacts that were used in this experiment.',

              styles: {
                halign: 'left',
                fontSize: 11,
                textColor: '#000000',
                overflow: 'linebreak',
                cellPadding: 0

              }
            }


          ],
        ],
        theme: 'plain',

      });

      autoTable(doc, {
        head: [['Name', 'Type', 'Class', 'Purpose', 'S.E.T', 'C.E.T', 'Content', 'Has tasks?'],],
        body: this.list_artifacts,
        theme: 'striped',
      })
      let blobPDF = new Blob([doc.output()], { type: '.pdf' })
      let fileData = new File([blobPDF], "Artifact_Inventory" + ".pdf", { type:blobPDF.type })
      this.file_format = blobPDF.type
      this.file_size = blobPDF.size
      this.uploadGenerateArtifact(fileData);
    } else {
      this.alertService.presentWarningAlert(this.translateService.instant("MSG_NO_ARTIFACTS"))
    }

  }

  VerificarTareaArtefactos(valor: any): string {
    let resultado = "YES"
    if (valor == null) {
      resultado = "NO"

    }
    return resultado
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
      name: 'Archivo Inventario',
      file_content: 'Archivo Inventario',
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
      maturity_level: this.showMaturityLevel(this.getArtifactPurposesById("Requisito")),
      executed_scripts: false,
      executed_software: false,
      norms_standards: false,
      artifact_acm: this.getIdStandard("Archivo inventario"),
      is_generated: isGenerated,
      task: null
    }
    this.artifactService.create(artifact).subscribe(() => {
      this.alertService.presentSuccessAlert(this.translateService.instant('CREATE_ARTIFACT'));
      this.getUploadedArtifacts();
    });
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
    if (value == "Instrucción") {
      resp = "Procedural"
    }
    if (value == "Modelo UML") {
      resp = "Operational"
    }
    if (value == "Encuesta") {
      resp = "Operational"
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
      this.file_format = extension;
      this.file_size = currentFile.size

      if (extension === 'PDF') {
        this.uploadArtifact();
      } else {
        this.alertService.presentWarningAlert(this.translateService.instant("MSG_PDF_FILES"))
      }
    }


  }

  uploadArtifact() {
    const artifact_name = parseArtifactNameForStorage(
      this.selectedFileArtifact.item(0).name,
    );
    const storage_ref = newStorageRefForArtifact(
      'inventary',
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

  cleanProgressBar() {
    this.progressBarValueArtifact = ""
  }
  uploadUpdatedArtifact() {
    const artifact_name = parseArtifactNameForStorage(
      this.selectedFileArtifact.item(0).name,
    );
    const storage_ref = newStorageRefForArtifact(
      'inventary',
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
      name: 'Archivo Inventario',
      file_content: 'Archivo Inventario',
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
      artifact_acm: this.getIdStandard("Archivo inventario"),
      norms_standards: false,
      task: null
    }

    this.artifactService.update(this.id_artifact, artifact).subscribe(() => {
      this.alertService.presentSuccessAlert(this.translateService.instant("MSG_UPDATE_ARTIFACT"));
      this.getUploadedArtifacts();

    });
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






}
