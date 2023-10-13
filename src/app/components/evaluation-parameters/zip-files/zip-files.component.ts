import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ArtifactController } from 'src/app/controllers/artifact.controller';
import { AlertService } from 'src/app/services/alert.service';
import { ArtifactService } from 'src/app/services/artifact.service';
import { BadgeService } from 'src/app/services/badge.service';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { parseArtifactNameForStorage, newStorageRefForArtifact } from 'src/app/utils/parsers';
import * as JSZip from 'jszip';
import * as JSZipUtils from '../../../../assets/script/jszip-utils.js';
import { saveAs } from 'file-saver/dist/FileSaver';
import { LabpackService } from '../../../services/labpack.service';
import { TaskService } from '../../../services/task.service';
import { TranslateService } from '@ngx-translate/core';
import { formatDate } from 'src/app/utils/formatters';
import { AuthService } from '../../../services/auth.service';
import { TokenStorageService } from '../../../services/token-storage.service';
import { ExperimenterService } from '../../../services/experimenter.service';


import { FileSaverService } from 'ngx-filesaver';
import { ExperimentService } from '../../../services/experiment.service';


@Component({
  selector: 'app-zip-files',
  templateUrl: './zip-files.component.html',
  styleUrls: ['./zip-files.component.scss']
})
export class ZipFilesComponent implements OnInit {
  standard_name = "archivos_comprimidos";
  @Input() experiment_id: number;
  @Input() standard: string;
  userExperiments = [];
  experimentOwner: boolean = false;
  @Output() closeView: EventEmitter<any> = new EventEmitter<any>();
  articleForm: FormGroup;
  progressBarValueArtifact = '';
  selectedFileArticle: FileList;
  evaluationsBadges: any = [];
  id_standard: string;
  id_experiment: string;
  uploadedArtifacts = [];
  labpack_name: string;
  task_artifacts = [];
  task_types = [];
  artifacts_desc = [];
  artifacts_asc = [];
  artifacts = [];
  acm_artifacts = [];
  id_labpack: any;
  data_labpack: any = [];
  url: any;
  file_format: any;
  file_size: any;
  artifacts_az = [];
  artifacts_za = [];
  parameterEvaluated: any;
  artifacts_size = [];
  @ViewChild('alpasc') alpasc: ElementRef;
  @ViewChild('alpdesc') alpdesc: ElementRef;
  @ViewChild('asc') asc: ElementRef;
  @ViewChild('desc') desc: ElementRef;
  @ViewChild('format') format: ElementRef;
  @ViewChild('purpose') purpose: ElementRef;
  @ViewChild('size') size: ElementRef;
  @ViewChild('closeModal') closeModal: ElementRef;

  alpAsc = false
  alpDesc = false
  Asc = false
  Desc = false
  Format = false
  Purpose = false
  Size = false
  Total_artifacts = [];
  artifactTypes = [];
  artifactClasses = [];
  artifactPurposes = [];
  artifactACM = [];
  change_language = false;
  artifact: any;
  file: File;
  constructor(
    private artifactService: ArtifactService,
    private _alertService: AlertService,
    private actRoute: ActivatedRoute,
    private evaluationService: EvaluationService,
    private artifactController: ArtifactController,
    private _badgeService: BadgeService,
    private _artifactService: ArtifactService,
    private taskService: TaskService,
    private labpackService: LabpackService,
    private _translateService: TranslateService,
    private fileSaverService: FileSaverService,
    private _authService: AuthService,
    private tokenStorageService: TokenStorageService,
    private _experimenterService: ExperimenterService,
    private experimentService: ExperimentService
  ) { }

  ngOnInit(): void {
    this.id_experiment = this.actRoute.parent.snapshot.paramMap.get('id');

    this.getBadgesStandards()
    this.getEvaluationsBadges();
    this.getUploadedArtifacts();
    this.loadArtifactOptions();
    this.getPackage();
    this.getTaskTypes();
    this.getArtifacts();
    this.getTotalArtifacts();
    this.getAcmArtifacts();
    this.getArtifactsDesc();
    this.getArtifactsAsc();
    this.getArtifactsSize();
    this.ValidateLanguage();
    this.getUserExperiments()
    this._translateService.onLangChange.subscribe(() => {
      this.ValidateLanguage()
    });
  }
  close() {
    this.closeView.emit(null);
  }
  ValidateLanguage() {
    if (this._translateService.instant('LANG_SPANISH_EC') == "Español (ECU)") {
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

  async loadArtifactOptions() {
    const [types, classes, purposes, acms] = await Promise.all([
      this._artifactService.getTypes().toPromise(),
      this._artifactService.getClasses().toPromise(),
      this._artifactService.getPurposes().toPromise(),
      this.artifactService.getACM().toPromise(),
    ]);

    this.artifactTypes = types.response;
    this.artifactClasses = classes.response;
    this.artifactPurposes = purposes.response;
    this.artifactACM = acms.response;
  }


  async onDown(fromRemote: boolean, artifact) {
    const fileName = artifact.name + '.' + artifact.file_format.toLowerCase();
    if (fromRemote) {
      let data = this.UrltoBinary(artifact.file_url)
      this.fileSaverService.save(await data, fileName);
    }

  }
  getUploadedArtifacts() {
    this._artifactService.get({ name: "Artefactos comprimidos", is_acm: true, experiment: this.id_experiment }).subscribe((data: any) => {
      this.uploadedArtifacts = data.response
      this.url = this.uploadedArtifacts[0]?.file_url
    })
  }

  getPackage() {
    this.labpackService.get({
      experiment: this.id_experiment
      , ___populate: 'package_type,repository',
    }).subscribe((data: any) => {
      this.data_labpack = data.response

    })
  }
  changeDate(date: any): string {
    return formatDate(date)
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
  getNameTaskType(id): string {
    let name = ""
    for (let index = 0; index < this.task_types.length; index++) {
      if (this.task_types[index]._id === id) {
        name = this.task_types[index].name
      }
    }
    return name;
  }

  getIDTaskType(task): string {
    let id = ""
    for (let index = 0; index < this.task_types.length; index++) {
      if (this.task_types[index].name == task) {
        id = this.task_types[index]._id
      }
    }
    return id;
  }

  getArtifactsDesc() {
    this._artifactService.get({
      experiment: this.id_experiment,
      ___populate: 'artifact_class,artifact_type,artifact_purpose,task',
      ___sort: '-createdAt'

    }).subscribe((data) => {
      this.artifacts_desc = data.response;

    });
  }

  getArtifactsAsc() {
    this._artifactService.get({
      experiment: this.id_experiment,
      ___populate: 'artifact_class,artifact_type,artifact_purpose,task',
      ___sort: 'createdAt'

    }).subscribe((data) => {
      this.artifacts_asc = data.response;
    });
  }

  getArtifactsSize() {
    this._artifactService.get({
      experiment: this.id_experiment,
      ___populate: 'artifact_class,artifact_type,artifact_purpose,task',
      ___sort: 'file_size'

    }).subscribe((data) => {
      this.artifacts_size = data.response;
    });
  }

  getArtifactsZ_A() {
    for (let index = this.artifacts_az.length - 1; index >= 0; index--) {
      this.artifacts_za.push(this.artifacts_az[index]);
    }
  }
  getArtifactsA_Z() {
    this.artifacts_az = this.Total_artifacts;
    this.artifacts_az.sort((a, b) => a.name.localeCompare(b.name));
  }

  getArtifacts() {
    this._artifactService.get({
      experiment: this.id_experiment,
      is_acm: false,
      ___populate: 'artifact_class,artifact_type,artifact_purpose,task',
    }).subscribe((data) => {
      this.artifacts = data.response;
    });
  }


  getTotalArtifacts() {
    this._artifactService.get({
      experiment: this.id_experiment,
      ___populate: 'artifact_class,artifact_type,artifact_purpose,task',
    }).subscribe((data) => {
      this.Total_artifacts = data.response;
      this.getArtifactsA_Z();
      this.getArtifactsZ_A();

    });
  }

  getAcmArtifacts() {
    this._artifactService.get({
      experiment: this.id_experiment,
      is_acm: true,
      ___populate: 'artifact_class,artifact_type,artifact_purpose,task',
    }).subscribe((data) => {
      this.acm_artifacts = data.response;

    });
  }

  getTaskTypes() {
    this.taskService.getTypes().subscribe((data) => {
      this.task_types = data.response
    })
  }

  getArtifactsWithTasks(artifacts) {
    let list = []
    for (let index = 0; index < artifacts.length; index++) {
      if (this.artifacts[index].task != null) {
        list.push(this.artifacts[index])
      }
    }
    return list
  }

  getArtifactsWithoutTasks(artifacts) {
    let list = []
    for (let index = 0; index < artifacts.length; index++) {
      if (this.artifacts[index].task == null) {
        list.push(this.artifacts[index])
      }
    }
    return list
  }

  GetDataLabPack(labpack: any) {

    this.id_labpack = labpack._id;

    let labpack_data = []

    this.labpackService.get({
      _id: labpack._id
      , ___populate: 'package_type,repository,artifacts_order'
    }).subscribe((data: any) => {
      labpack_data = data.response
      this.labpack_name = labpack_data[0].package_name

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
      name: 'Artefactos comprimidos',
      file_content: 'Artefactos comprimidos',
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
      this._alertService.presentSuccessAlert(this._translateService.instant('CREATE_ARTIFACT'));
      this.getUploadedArtifacts();
    });
  }

  uploadArtifact() {
    const artifact_name = this.selectedFileArticle.item(0).name

    const storage_ref = newStorageRefForArtifact(
      'result',
      artifact_name,
    );
    const onPercentageChanges = (percentage: string) => {
      this.progressBarValueArtifact = percentage;
    };
    this.artifactController.uploadArtifactToStorage(
      storage_ref,
      this.selectedFileArticle.item(0),
      { onPercentageChanges },
      (storage_ref, url) => {
        if (this.progressBarValueArtifact == '100') {
          this._alertService.presentSuccessAlert(this._translateService.instant("MSG_UPLOAD_FILE"))
          this.save(url, storage_ref, false)
          this.createEvaluationStandard();
        }
      }
    );
  }
  chooseFileArtifact(event) {
    this.selectedFileArticle = event.target.files;
    if (this.selectedFileArticle.item(0)) {
      var re = /(?:\.([^.]+))?$/;
      const currentFile = this.selectedFileArticle.item(0);
      let [, extension] = re.exec(currentFile.name);
      extension = extension.toUpperCase();
      this.file_format = extension;
      this.file_size = currentFile.size
      this.uploadArtifact();
    }
  }

  saveAs() {
    this.generateZipFile(this.artifacts)
  }


  async UrltoBinary(url) {
    try {
      const resultado = await JSZipUtils.getBinaryContent(url)
      return resultado
    } catch (error) {
      return;
    }
  }


  CheckArtfifactFormat() {
    let formats = []
    for (let index = 0; index < this.artifacts_asc.length; index++) {
      formats.push(this.artifacts_asc[index].file_format.toLowerCase())
    }
    // objeto Set para definir valores unicos en la lista
    const dataArr = new Set(formats)
    let resultado = [...dataArr]
    return resultado
  }
  // buscar las tareas que tienen artefactos y llenar
  // un arreglo con el nombre de los carpetas
  // que tienen artefactos
  FillFolderArray() {
    let HasTask = []
    let NoTask = []
    let zipContent = []

    HasTask = this.getArtifactsWithTasks(this.artifacts)
    NoTask = this.getArtifactsWithoutTasks(this.artifacts)

    for (let index = 0; index < HasTask.length; index++) {
      if (HasTask[index].task.task_type == this.getIDTaskType('Formación')) {
        zipContent.push("Tareas_Formación")
      } else if (HasTask[index].task.task_type == this.getIDTaskType('Análisis')) {
        zipContent.push("Tareas_Analisis")
      } else if (HasTask[index].task.task_type == this.getIDTaskType('Experimental')) {
        zipContent.push("Tareas_Experimental")
      }

    }

    for (let index = 0; index < NoTask.length; index++) {
      if (NoTask[index].artifact_purpose.name == "Dataset") {
        zipContent.push("Datasets")
      } else if (NoTask[index].name.includes("Instalación") == true || NoTask[index].name.includes("instalación") == true) {
        zipContent.push("Instalación")
      } else {
        zipContent.push("Artefactos_Sin_Tareas")

      }
    }

    if (this.acm_artifacts.length > 0) {
      zipContent.push("Criterios_evaluación")
    }

    // objeto Set para definir valores unicos en la lista
    const dataArr = new Set(zipContent)

    let resultado = [...dataArr]

    return resultado
  }
  // metodo para crear el archivo zip de forma alfabetica DESC
  createAlphabeticDESC() {
    const zip = new JSZip();
    let count = 0

    for (let index = 0; index < this.artifacts_za.length; index++) {
      let data = this.UrltoBinary(this.artifacts_za[index].file_url) //
      zip.file(this.artifacts_za[index].name + "." + this.artifacts_za[index].file_format.toLowerCase(), data, { binary: true, date: new Date(this.artifacts_za[index].createdAt) });
      count++;

      if (count === this.artifacts_za.length) {
        zip.generateAsync({ type: 'blob' }).then((content) => {
          this.file = new File([content], this.data_labpack[0].package_name + "_alp_desc.zip", { type: content.type })
          this.file_size =this.file.size
          this.file_format = ".zip"
          this.uploadGenerateArtifact(this.file)
        });
      }

    }

  }
  // metodo para crear el archivo zip en forma cronologica ascendente
  createAlphabeticASC() {
    const zip = new JSZip();
    let count = 0

    for (let index = 0; index < this.artifacts_az.length; index++) {
      let data = this.UrltoBinary(this.artifacts_az[index].file_url) //
      zip.file(this.artifacts_az[index].name + "." + this.artifacts_az[index].file_format.toLowerCase(), data, { binary: true, date: new Date(this.artifacts_az[index].createdAt) });
      count++;

      if (count === this.artifacts_az.length) {
        zip.generateAsync({ type: 'blob' }).then((content) => {
          this.file = new File([content], this.data_labpack[0].package_name + "_alp_asc.zip", { type: content.type })
          this.file_size =this.file.size
          this.file_format = ".zip"
          this.uploadGenerateArtifact(this.file)
        });
      }

    }

  }

  // metodo para crear el archivo zip en forma cronologica ascendente
  createZIPbySIze() {
    const zip = new JSZip();
    let count = 0

    for (let index = 0; index < this.artifacts_size.length; index++) {
      let data = this.UrltoBinary(this.artifacts_size[index].file_url) //
      zip.file(this.artifacts_size[index].name + "." + this.artifacts_size[index].file_format.toLowerCase(), data, { binary: true, date: new Date(this.artifacts_size[index].createdAt) });
      count++;

      if (count === this.artifacts_size.length) {
        zip.generateAsync({ type: 'blob' }).then((content) => {
          this.file = new File([content], this.data_labpack[0].package_name + "_BySize.zip", { type: content.type })
          this.file_size =this.file.size
          this.file_format = ".zip"
          this.uploadGenerateArtifact(this.file)
        });
      }

    }

  }


  // metodo para crear el archivo zip en forma cronologica descendente
  createCronologicASC() {
    const zip = new JSZip();
    let count = 0

    for (let index = 0; index < this.artifacts_asc.length; index++) {
      let data = this.UrltoBinary(this.artifacts_asc[index].file_url) //
      zip.file(this.artifacts_asc[index].name + "." + this.artifacts_asc[index].file_format.toLowerCase(), data, { binary: true, date: new Date(this.artifacts_asc[index].createdAt) });
      count++;

      if (count === this.artifacts_asc.length) {
        zip.generateAsync({ type: 'blob' }).then((content) => {
          this.file = new File([content], this.data_labpack[0].package_name + "_asc.zip", { type: content.type })
          this.file_size =this.file.size
          this.file_format = ".zip"
          this.uploadGenerateArtifact(this.file)
        });
      }

    }

  }

  // metodo para crear el archivo zip en forma cronologica descendente
  createCronologicZipDESC() {
    const zip = new JSZip();
    let count = 0


    for (let index = 0; index < this.artifacts_desc.length; index++) {
      let data = this.UrltoBinary(this.artifacts_desc[index].file_url) //
      zip.file(this.artifacts_desc[index].name + "." + this.artifacts_desc[index].file_format.toLowerCase(), data, { binary: true, date: new Date(this.artifacts_desc[index].createdAt) });
      count++;

      if (count === this.artifacts_desc.length) {
        zip.generateAsync({ type: 'blob' }).then((content) => {
          this.file = new File([content], this.data_labpack[0].package_name + "_desc.zip", { type: content.type })
          this.file_size =this.file.size
          this.file_format = ".zip"
          this.uploadGenerateArtifact(this.file)
        });
      }

    }

  }


  createFormatZipFile() {
    let formatFile = this.CheckArtfifactFormat()
    const zip = new JSZip();
    let count = 0
    let listFile = []
    for (let i = 0; i < this.artifacts_asc.length; i++) {
      for (let j = 0; j < formatFile.length; j++) {
        if (this.artifacts_asc[i].file_format.toLowerCase() == formatFile[j]) {
          const data = {
            ruta: this.artifacts_asc[i].file_format.toLowerCase() + "/",
            value: this.artifacts_asc[i]
          }
          listFile.push(data)
        }
      }
    }
    formatFile.forEach((format) => {
      zip.folder(format)
    })

    listFile.forEach((file) => {

      JSZipUtils.getBinaryContent(file.value.file_url, (err, data) => {
        if (err) {
          throw err;
        }
        zip.file(
          file.ruta + file.value.name + '.' + file.value.file_format,
          data,
          {
            binary: true,
          }
        );
        count++;

        if (count === listFile.length) {
          zip.generateAsync({ type: 'blob' }).then((content) => {
            this.file = new File([content], this.data_labpack[0].package_name + "_Format.zip", { type: content.type })
            this.file_size =this.file.size
            this.file_format = ".zip"
            this.uploadGenerateArtifact(this.file)
          });
        }
      })

    })

  }

  generateZipFile(artifacts) {
    const zip = new JSZip();
    let count = 0;
    let HasTask = []
    let NoTask = []
    let AcmArtifacts = []
    let artifactData = [];
    let counterFiles = 0
    // contenido del archivo comprimido
    let zipContent = this.FillFolderArray()
    // llenar las listas
    HasTask = this.getArtifactsWithTasks(artifacts)
    NoTask = this.getArtifactsWithoutTasks(artifacts)
    AcmArtifacts = this.acm_artifacts


    for (let index = 0; index < NoTask.length; index++) {
      if (NoTask[index].artifact_purpose.name == "Dataset") {
        let path = "Datasets/" + NoTask[index].artifact_purpose.name +
          '/' +
          NoTask[index].artifact_type.name +
          '/';

        const data = {
          ruta: path,
          artifact: NoTask[index]
        }
        artifactData.push(data)
      }
      if (NoTask[index].name.includes("Instalación") == true || NoTask[index].name.includes("instalación") == true) {
        let path = "Instalación/" + NoTask[index].artifact_purpose.name +
          '/' +
          NoTask[index].artifact_type.name +
          '/';

        const data = {
          ruta: path,
          artifact: NoTask[index]
        }
        artifactData.push(data)
      } else {
        if (NoTask[index].artifact_purpose.name != "Dataset") {
          let path = "Artefactos_Sin_Tareas/" + NoTask[index].artifact_purpose.name +
            '/' +
            NoTask[index].artifact_type.name +
            '/';

          const data = {
            ruta: path,
            artifact: NoTask[index]
          }
          artifactData.push(data)
        }

      }


    }
    for (let index = 0; index < AcmArtifacts.length; index++) {
      let path = "Criterios_evaluación/" + AcmArtifacts[index].name +
        '/' +
        AcmArtifacts[index].artifact_type.name +
        '/';

      const data = {
        ruta: path,
        artifact: AcmArtifacts[index]
      }
      artifactData.push(data)

    }

    zipContent.forEach((files) => {

      // crear los directorios
      zip.folder(files)
      for (let index = 0; index < HasTask.length; index++) {
        if (HasTask[index].task.task_type == this.getIDTaskType('Formación')) {
          if (files == "Tareas_Formación") {
            if (HasTask[index].artifact_class.name == "Entrada") {
              let entrada = files + "/Artefactos_entrada/" + HasTask[index].artifact_purpose.name +
                '/' +
                HasTask[index].artifact_type.name +
                '/';
              zip.folder(entrada)
              const data = {
                ruta: entrada,
                artifact: HasTask[index]
              }
              artifactData.push(data)
            }
            if (HasTask[index].artifact_class.name == "Salida") {
              let salida = files + "/Artefactos_salida/" + HasTask[index].artifact_purpose.name +
                '/' +
                HasTask[index].artifact_type.name +
                '/';
              zip.folder(salida)

              const data = {
                ruta: salida,
                artifact: HasTask[index]
              }
              artifactData.push(data)

            }
          }
        } //
        if (HasTask[index].task.task_type == this.getIDTaskType('Experimental')) {
          if (files == "Tareas_Experimental") {
            if (HasTask[index].artifact_class.name == "Entrada") {
              let entrada = files + "/Artefactos_entrada/" + HasTask[index].artifact_purpose.name +
                '/' +
                HasTask[index].artifact_type.name +
                '/';
              zip.folder(entrada)

              const data = {
                ruta: entrada,
                artifact: HasTask[index]
              }
              artifactData.push(data)

            }
            if (HasTask[index].artifact_class.name == "Salida") {
              let salida = files + "/Artefactos_salida/" + HasTask[index].artifact_purpose.name +
                '/' +
                HasTask[index].artifact_type.name +
                '/';
              zip.folder(salida)
              const data = {
                ruta: salida,
                artifact: HasTask[index]
              }
              artifactData.push(data)
            }
          }
        }
        if (HasTask[index].task.task_type == this.getIDTaskType('Análisis')) {
          if (files == "Tareas_Análisis") {

            if (HasTask[index].artifact_class.name == "Entrada") {
              let entrada = files + "/Artefactos_entrada/" + HasTask[index].artifact_purpose.name +
                '/' +
                HasTask[index].artifact_type.name +
                '/';
              zip.folder(entrada)
              const data = {
                ruta: entrada,
                artifact: HasTask[index]
              }
              artifactData.push(data)
            }
            if (HasTask[index].artifact_class.name == "Salida") {
              let salida = files + "/Artefactos_salida/" + HasTask[index].artifact_purpose.name +
                '/' +
                HasTask[index].artifact_type.name +
                '/';
              zip.folder(salida)
              const data = {
                ruta: salida,
                artifact: HasTask[index]
              }
              artifactData.push(data)
            }

          }
        }
      } //


      artifactData.forEach((artifacts) => {

        JSZipUtils.getBinaryContent(artifacts.artifact.file_url, (err, data) => {
          if (err) {
            throw err;
          }
          zip.file(
            artifacts.ruta + artifacts.artifact.name + '.' + artifacts.artifact.file_format,
            data,
            {
              binary: true,
            }
          );
          count++;

          if (count === artifactData.length) {
            zip.generateAsync({ type: 'blob' }).then((content) => {
              this.file = new File([content], this.data_labpack[0].package_name + ".zip", { type: content.type })
              this.file_size =this.file.size
              this.file_format = ".zip"
              this.uploadGenerateArtifact(this.file)

            });
          }
        })

      })

    })
  }

  onChange(bool1, bool2, bool3, bool4, bool5, bool6, bool7) {
    this.Asc = bool1;
    this.Desc = bool2;
    this.alpAsc = bool3;
    this.alpDesc = bool4;
    this.Format = bool5;
    this.Size = bool6;
    this.Purpose = bool7;
  }

  checked() {
    if (this.asc.nativeElement.checked == true) {
      this.Asc = true;
      this.Desc = false;
      this.alpAsc = false;
      this.alpDesc = false;
      this.Format = false;
      this.Size = false;
      this.Purpose = false;;
    } else if (this.desc.nativeElement.checked == true) {
      this.Asc = false;
      this.Desc = true;
      this.alpAsc = false;
      this.alpDesc = false;
      this.Format = false;
      this.Size = false;
      this.Purpose = false;;
    } else if (this.format.nativeElement.checked == true) {
      this.Asc = false;
      this.Desc = false;
      this.alpAsc = false;
      this.alpDesc = false;
      this.Format = true;
      this.Size = false;
      this.Purpose = false;;
    }
    else if (this.alpasc.nativeElement.checked == true) {
      this.Asc = false;
      this.Desc = false;
      this.alpAsc = true;
      this.alpDesc = false;
      this.Format = false;
      this.Size = false;
      this.Purpose = false;;
    }
    else if (this.alpdesc.nativeElement.checked == true) {
      this.Asc = false;
      this.Desc = false;
      this.alpAsc = false;
      this.alpDesc = true;
      this.Format = false;
      this.Size = false;
      this.Purpose = false;;
    }
    else if (this.size.nativeElement.checked == true) {
      this.Asc = false;
      this.Desc = false;
      this.alpAsc = false;
      this.alpDesc = false;
      this.Format = false;
      this.Size = true;
      this.Purpose = false;
    }

    else {
      if (this.purpose.nativeElement.checked == true) {
        this.Asc = false;
        this.Desc = false;
        this.alpAsc = false;
        this.alpDesc = false;
        this.Format = false;
        this.Size = false;
        this.Purpose = true;
      }
    }
  }

  ShowZip() {


    if (this.asc.nativeElement.checked == true) {
      if (this.artifacts_asc.length == 0) {
        this._alertService.presentWarningAlert(this._translateService.instant("MSG_ARTIFACTS_GENERATED"))
      } else {
        this.desc.nativeElement.checked = false;
        this.purpose.nativeElement.checked = false;
        this.format.nativeElement.checked = false;
        this.alpasc.nativeElement.checked = false
        this.alpdesc.nativeElement.checked = false
        this.size.nativeElement.checked = false
        this.createCronologicASC()
        this._alertService.presentSuccessAlert(this._translateService.instant("MSG_ARCHIVE_GENERATED"))
      }

    } else if (this.desc.nativeElement.checked == true) {
      if (this.artifacts_desc.length == 0) {
        this._alertService.presentWarningAlert(this._translateService.instant("MSG_ARTIFACTS_GENERATED"))
      } else {
        this.purpose.nativeElement.checked = false;
        this.format.nativeElement.checked = false;
        this.asc.nativeElement.checked = false
        this.alpasc.nativeElement.checked = false
        this.alpdesc.nativeElement.checked = false
        this.size.nativeElement.checked = false
        this.createCronologicZipDESC()
        this._alertService.presentSuccessAlert(this._translateService.instant("MSG_ARCHIVE_GENERATED"))

      }
    } else if (this.format.nativeElement.checked == true) {
      if (this.artifacts_asc.length == 0) {
        this._alertService.presentWarningAlert(this._translateService.instant("MSG_ARTIFACTS_GENERATED"))
      } else {
        this.purpose.nativeElement.checked = false;
        this.asc.nativeElement.checked = false
        this.desc.nativeElement.checked = false;
        this.alpasc.nativeElement.checked = false
        this.alpdesc.nativeElement.checked = false
        this.size.nativeElement.checked = false
        this.createFormatZipFile()
        this._alertService.presentSuccessAlert(this._translateService.instant("MSG_ARCHIVE_GENERATED"))
      }
    } else if (this.purpose.nativeElement.checked == true) {
      if (this.artifacts.length == 0) {
        this._alertService.presentWarningAlert(this._translateService.instant("MSG_ARTIFACTS_GENERATED"))
      } else {
        this.asc.nativeElement.checked = false
        this.desc.nativeElement.checked = false;
        this.format.nativeElement.checked = false;
        this.alpasc.nativeElement.checked = false
        this.alpdesc.nativeElement.checked = false
        this.size.nativeElement.checked = false
        this.saveAs()
        this._alertService.presentSuccessAlert(this._translateService.instant("MSG_ARCHIVE_GENERATED"))
      }

    }
    else if (this.alpasc.nativeElement.checked == true) {
      if (this.artifacts_az.length == 0) {
        this._alertService.presentWarningAlert(this._translateService.instant("MSG_ARTIFACTS_GENERATED"))
      } else {
        this.asc.nativeElement.checked = false
        this.desc.nativeElement.checked = false;
        this.format.nativeElement.checked = false;
        this.alpdesc.nativeElement.checked = false
        this.size.nativeElement.checked = false
        this.purpose.nativeElement.checked = false;
        this.createAlphabeticASC();
        this._alertService.presentSuccessAlert(this._translateService.instant("MSG_ARCHIVE_GENERATED"))
      }

    }
    else if (this.alpdesc.nativeElement.checked == true) {
      if (this.artifacts_az.length == 0) {
        this._alertService.presentWarningAlert(this._translateService.instant("MSG_ARTIFACTS_GENERATED"))
      } else {
        this.asc.nativeElement.checked = false
        this.desc.nativeElement.checked = false;
        this.format.nativeElement.checked = false;
        this.size.nativeElement.checked = false
        this.purpose.nativeElement.checked = false;
        this.alpasc.nativeElement.checked = false
        this.createAlphabeticDESC()
        this._alertService.presentSuccessAlert(this._translateService.instant("MSG_ARCHIVE_GENERATED"))
      }

    }
    else if (this.size.nativeElement.checked == true) {
      if (this.artifacts_size.length == 0) {
        this._alertService.presentWarningAlert(this._translateService.instant("MSG_ARTIFACTS_GENERATED"))
      } else {
        this.asc.nativeElement.checked = false
        this.desc.nativeElement.checked = false;
        this.format.nativeElement.checked = false;
        this.purpose.nativeElement.checked = false;
        this.alpasc.nativeElement.checked = false
        this.createZIPbySIze()
        this._alertService.presentSuccessAlert(this._translateService.instant("MSG_ARCHIVE_GENERATED"))
      }

    }
    else {
      this._alertService.presentWarningAlert(this._translateService.instant("MSG_SELECT_ORDER"))
    }

  }
  getValueEvaluation() {

    this.evaluationService.get({ standard: this.id_standard, status: "success", experiment: this.id_experiment }).subscribe((data: any) => {
      this.parameterEvaluated = data.response

    })
  }

  deleteArtifactConfirm(artifact) {
    const title = this._translateService.instant('WORD_CONFIRM_DELETE');
    const message = this._translateService.instant('WORD_CONFIRM_DELETE_ARTIFACT');
    const confirmText = this._translateService.instant('WORD_DELETE');
    const cancelText = this._translateService.instant('WORD_CANCEL');
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

  }
  GenerateNewFile() {
    if (this.artifact?._id.length > 0) {
      this.deleteArtifact(this.artifact);
      this.ShowZip()
      this.closeModal.nativeElement.click();
    } else {
      this.ShowZip()
      this.closeModal.nativeElement.click();
    }
  }
}
