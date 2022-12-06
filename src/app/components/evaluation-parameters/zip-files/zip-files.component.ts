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
@Component({
  selector: 'app-zip-files',
  templateUrl: './zip-files.component.html',
  styleUrls: ['./zip-files.component.scss']
})
export class ZipFilesComponent implements OnInit {
  standard_name = "archivos_comprimidos";
  @Input() experiment_id: number;
  @Input() standard: string;
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
  artifacts_az = [];
  artifacts_za = [];
  artifacts_size = [];
  @ViewChild('alpasc') alpasc: ElementRef;
  @ViewChild('alpdesc') alpdesc: ElementRef;
  @ViewChild('asc') asc: ElementRef;
  @ViewChild('desc') desc: ElementRef;
  @ViewChild('format') format: ElementRef;
  @ViewChild('purpose') purpose: ElementRef;
  @ViewChild('size') size: ElementRef;

  alpAsc = false
  alpDesc = false
  Asc = false
  Desc = false
  Format = false
  Purpose = false
  Size = false
  Total_artifacts = [];
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
    private  _translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.id_experiment = this.actRoute.parent.snapshot.paramMap.get('id');
    console.log(this.id_experiment);
    this.getBadgesStandards()
    this.getEvaluationsBadges();
    this.getUploadedArtifacts();
    this.getPackage();
    this.getTaskTypes();
    this.getArtifacts();
    this.getTotalArtifacts();
    this.getAcmArtifacts();
    this.getArtifactsDesc();
    this.getArtifactsAsc();
    this.getArtifactsSize();
  }
  close() {
    this.closeView.emit(null);
  }
  getBadgesStandards() {
    console.log(this.standard)
    this._badgeService.getStandards({ name: this.standard }).subscribe((data: any) => {
      this.id_standard = data.response[0]._id
    });
  }
  getEvaluationsBadges() {
    this.evaluationService.get({ status: "success" }).subscribe((data: any) => {
      this.evaluationsBadges = data.response
      console.log(this.evaluationsBadges)

    })
  }

  getUploadedArtifacts() {
    this._artifactService.get({ name: "Artefactos comprimidos", is_acm: true, experiment: this.id_experiment }).subscribe((data: any) => {
      this.uploadedArtifacts = data.response
      this.url = this.uploadedArtifacts[0].file_url
      console.log(this.uploadedArtifacts)
      console.log(this.url)
    })
  }

  getPackage() {
    this.labpackService.get({
      experiment: this.id_experiment
      , ___populate: 'package_type,repository',
    }).subscribe((data: any) => {
      this.data_labpack = data.response
      console.log(this.data_labpack)
    })
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
      console.log(this.artifacts_size);
    });
  }

  getArtifactsZ_A() {
    for (let index = this.artifacts_az.length-1; index >= 0; index--) {
      this.artifacts_za.push(this.artifacts_az[index]);
    }

   console.log(this.artifacts_za)
  }
  getArtifactsA_Z() {
    this.artifacts_az = this.Total_artifacts;
    this.artifacts_az.sort((a, b) => a.name.localeCompare(b.name));
    console.log(this.artifacts_az)
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
      console.log(this.task_types)
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

      console.log(labpack_data)
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
    } else {
      console.log("the parameter has been evaluated before.....")
    }
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
        console.log(url);
        if (this.progressBarValueArtifact == '100') {
          this._alertService.presentSuccessAlert(this._translateService.instant("MSG_UPLOAD_FILE"))
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
          saveAs(content, this.data_labpack[0].package_name + "_alp_desc.zip");
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
          saveAs(content, this.data_labpack[0].package_name + "_alp_asc.zip");
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
          saveAs(content, this.data_labpack[0].package_name + "_BySize.zip");
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
          saveAs(content, this.data_labpack[0].package_name + "_asc.zip");
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
          saveAs(content, this.data_labpack[0].package_name + "_desc.zip");
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

    console.log(listFile)
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
            saveAs(content, this.data_labpack[0].package_name + "_byFormat.zip");
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
              saveAs(content, this.data_labpack[0].package_name + ".zip");
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


}
