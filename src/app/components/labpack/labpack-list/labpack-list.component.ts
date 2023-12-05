import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LabpackService } from 'src/app/services/labpack.service';
import { formatDate } from 'src/app/utils/formatters';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import * as JSZip from 'jszip';
import * as JSZipUtils from '../../../../assets/script/jszip-utils.js';
import { saveAs } from '../../../../assets/script/FileSaver.js';
import { TaskService } from '../../../services/task.service';
import { ArtifactService } from '../../../services/artifact.service';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { ExperimentService } from '../../../services/experiment.service';
import { TokenStorageService } from '../../../services/token-storage.service';
import { AuthService } from '../../../services/auth.service';
import { ExperimenterService } from '../../../services/experimenter.service';
import { ArtifactController } from 'src/app/controllers/artifact.controller';
import { parseArtifactNameForStorage, newStorageRefForArtifact } from 'src/app/utils/parsers';


@Component({
  selector: 'app-labpack-list',
  templateUrl: './labpack-list.component.html',
  styleUrls: ['./labpack-list.component.scss']
})
export class LabpackListComponent implements OnInit {
  experiment_id: any;
  userExperiments = [];
  experimentOwner: boolean = false;
  packageZip: FormData;
  downloadZip: boolean = false;
  id_labpack: any;
  data_labpack: any = [];
  artifacts_order: any = [];
  PackagesTypes: [];
  RepositoryTypes: any = [];
  groupForm: FormGroup;
  artifacts = [];
  acm_artifacts = [];
  labpack_name: string;
  task_artifacts = [];
  task_types = [];
  experimental_artifacts = [];
  formation_artifacts = [];
  analysis_artifacts = [];
  artifacts_desc = [];
  artifacts_asc = [];
  isChecked = false;
  ascChecked = true;
  descChecked = false;
  formatChecked = false;
  purposeChecked = false;
  change_language = false;
  isSelected = true;
  items: MenuItem[];
  menu_type: string;
  actualExperiment: any[]
  completedExperiment: boolean = false;
  completedSteps: MenuItem[];
  completedStepSpanish: MenuItem[];
  isChoosed: boolean = false;
  url_package: string

  progressBarValueArtifact = '';
  selectedFileArtifact: FileList;
  file_extension: string;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('closeModalUpdate') closeModalUpdate: ElementRef;
  @ViewChild('createModal') createModal: ElementRef;
  @ViewChild('btnNextButton') btnNextButton: ElementRef;
  @ViewChild('asc') asc: ElementRef;
  @ViewChild('desc') desc: ElementRef;
  @ViewChild('format') format: ElementRef;
  @ViewChild('purpose') purpose: ElementRef;
  isTokenOption: boolean = true;
  NoPersonalToken: boolean = true;
  experimenters: any[];
  tokenLabpack: string;
  idLabpack: string;
  ZenodoCode: string;
  hasZenodoCode: boolean = false;
  artifactData = []
  RepositoryForm: FormGroup;
  RepositoryFileForm: FormGroup;
  labpack: any;
  fileContent: any;
  fileName: any;
  publishedZenodo: boolean = false;
  updateLabpack: any;



  constructor(
    private actRoute: ActivatedRoute,
    private labpackService: LabpackService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private taskService: TaskService,
    private _artifactService: ArtifactService,
    private translateService: TranslateService,
    private _ExperimentService: ExperimentService,
    private _router: Router,
    private tokenStorageService: TokenStorageService,
    private _experimenterService: ExperimenterService,
    private artifactController: ArtifactController,
  ) { }

  ngOnInit(): void {
    this.experiment_id = this.actRoute.parent.snapshot.paramMap.get('id')
    this.menu_type = this.actRoute.parent.snapshot.paramMap.get("menu");
    this.initForm()
    this.getPackage();
    this.getPackageRepository()
    this.getPackageType()
    this.getArtifactsOrder();
    this.getTaskTypes();
    this.getArtifacts();
    this.getAcmArtifacts();
    this.getArtifactsDesc();
    this.getArtifactsAsc();
    this.ValidateLanguage();
    this.getUserExperiments();
    this.getActualExperiment();
    this.getExperimenters();
    this.translateService.onLangChange.subscribe(() => {
      this.ValidateLanguage()
    });

    this.items = [
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/labpack" },
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/labpack" },
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/labpack" },
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/labpack" },
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/labpack" },
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/labpack" },
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/labpack" },
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/labpack" },
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/labpack" }
    ];

    this.completedSteps = [
      { routerLink: '/experiment/step', label: "Experiments" },
      { routerLink: "../experimenters", label: "Experimenters" },
      { routerLink: "../groups", label: "Groups" },
      { routerLink: "../tasks", label: "Tasks" },
      { routerLink: "../artifacts", label: "Artifacts" },
      { routerLink: "../select_badge", label: "ACM Badging" },
      { routerLink: "../artifacts_acm", label: "ACM Artifacts" },
      { routerLink: "../badges", label: "Evaluation Criteria" },
      { routerLink: "../labpack", label: "Labpack" },
    ];

    this.completedStepSpanish = [
      { routerLink: '/experiment/step', label: "Experimentos" },
      { routerLink: "../experimenters", label: "Experimentadores" },
      { routerLink: "../groups", label: "Grupos" },
      { routerLink: "../tasks", label: "Tareas" },
      { routerLink: "../artifacts", label: "Artefactos" },
      { routerLink: "../select_badge", label: "Insignias ACM" },
      { routerLink: "../artifacts_acm", label: "Artefactos ACM" },
      { routerLink: "../badges", label: "Criterios de evaluación" },
      { routerLink: "../labpack", label: "Paquete" },
    ];

    this.VerificateSelectedExperiment()

    this.ZenodoCode = this.tokenStorageService.getZenodoToken()
   if (this.ZenodoCode != "undefined") {
      this.hasZenodoCode = true
   }else{
     this.hasZenodoCode = false
   }
  }

  SelectLabpack(labpack: any) {
    this.labpack = labpack
    if (this.hasZenodoCode && localStorage.getItem('ZenodoCode') == null) {
      this.labpackService.GetTokenGitHub(this.ZenodoCode).subscribe((response: any) => {
        localStorage.setItem('ZenodoCode', response.response)
      })
    }

  }

  CreateGithubRepo() {
    const data = {
      name: this.RepositoryForm.value.name,
      description: this.RepositoryForm.value.description,
      token: localStorage.getItem('zenodo_code'),
    }
    this.labpack.package_description = this.RepositoryForm.value.description
    this.labpack.package_name = this.RepositoryForm.value.name
    this.labpackService.CreateGithubRepo(data).subscribe((data: any) => {
      this.labpack.owner = data.response.owner.login
      this.labpack.package_url = data.response.html_url
      this.labpack.user_url = data.response.url
      this.labpackService.update(this.labpack._id, this.labpack).subscribe((data: any) => {
        this.getPackage();
        this.alertService.presentSuccessAlert(this.translateService.instant("MSG_CREATED_REPO"));
      })
    })
  }

  VerificateSelectedExperiment() {
    if (this.tokenStorageService.getIdExperiment()) {
      this.experiment_id = this.tokenStorageService.getIdExperiment();
      this.completedExperiment = (this.tokenStorageService.getStatusExperiment() == "true")
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
  getExperimenters() {
    this._experimenterService.get({
      experiment: this.experiment_id,
      ___populate: 'experimenter_roles,user',
      admin_experiment: true
    }).subscribe((resp: any) => {

      this.experimenters = []
      for (let index = 0; index < resp.response.length; index++) {
        const experimenterDTO = {
          name: "",
          affiliation: "",
        }
        experimenterDTO.name = resp.response[index].user.full_name
        experimenterDTO.affiliation = resp.response[index].user.affiliation
        this.experimenters.push(experimenterDTO)
      }

    });
  }
  getUserExperiments() {
    this._ExperimentService.getExperimentsUser().subscribe((data: any) => {
      this.userExperiments = data.response
      this.experimentOwner = this.validateExperimentOwner(this.experiment_id)

    })
  }

  ValidateLanguage() {
    if (this.translateService.instant('LANG_SPANISH_EC') == "Español (ECU)") {
      this.change_language = false;
    } else {
      this.change_language = true;
    }
  }
  getArtifactsOrder() {
    this.labpackService.getArtifactsOrder().subscribe((data: any) => {
      this.artifacts_order = data.response
    })
  }

  getActualExperiment() {
    this._ExperimentService.get({ _id: this.experiment_id }).subscribe((data: any) => {
      this.actualExperiment = data.response
      this.completedExperiment = data.response[0].completed
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
      experiment: this.experiment_id,
      ___populate: 'artifact_class,artifact_type,artifact_purpose,task',
      ___sort: '-createdAt'

    }).subscribe((data) => {
      this.artifacts_desc = data.response;

    });
  }

  getArtifactsAsc() {
    this._artifactService.get({
      experiment: this.experiment_id,
      ___populate: 'artifact_class,artifact_type,artifact_purpose,task',
      ___sort: 'createdAt'

    }).subscribe((data) => {
      this.artifacts_asc = data.response;
    });
  }

  getArtifacts() {
    this._artifactService.get({
      experiment: this.experiment_id,
      is_acm: false,
      ___populate: 'artifact_class,artifact_type,artifact_purpose,task',
    }).subscribe((data) => {
      this.artifacts = data.response;

    });
  }

  getAcmArtifacts() {
    this._artifactService.get({
      experiment: this.experiment_id,
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

  cleanFields() {
    this.groupForm.controls['package_name'].setValue("")
    this.groupForm.controls['package_doi'].setValue("")
    this.groupForm.controls['package_type'].setValue("")
    this.groupForm.controls['package_description'].setValue("")
    this.groupForm.controls['repository'].setValue("")
    if (this.hasZenodoCode) {
      this.isChoosed = true
    } else {
      this.isChoosed = false
    }
    if (this.hasZenodoCode) {
     console.log(this.tokenStorageService.getZenodoToken())
    }
  }
  GetDataLabPack(labpack: any) {
    this.updateLabpack = labpack
    this.publishedZenodo = labpack.publishedZenodo
    this.id_labpack = labpack._id;
    this.groupForm.controls['package_name'].setValue(labpack.package_name)
    this.groupForm.controls['package_doi'].setValue(labpack.package_doi)
    this.groupForm.controls['package_type'].setValue(labpack.package_type._id)
    this.groupForm.controls['package_description'].setValue(labpack.package_description)
    this.groupForm.controls['repository'].setValue(labpack.repository._id)
    if (this.hasZenodoCode && localStorage.getItem('ZenodoCode') == null) {
      this.labpackService.GetTokenGitHub(this.ZenodoCode).subscribe((response: any) => {
        localStorage.setItem('ZenodoCode', response.response)
        console.log(response.response)
      })
    }
  }

  Back() {
    this._router.navigate(['experiment/step/' + this.experiment_id + "/step/menu" + "/badges"]);
  }


  initForm() {
    this.groupForm = this.formBuilder.group({
      package_name: ['', [Validators.required]],
      package_doi: [''],
      package_type: ['', [Validators.required]],
      package_description: ['', [Validators.required]],
      repository: [''],
      package_url: [''],
      publishedZenodo: [false,],
    });
    this.RepositoryForm = this.formBuilder.group({
      name: [''],
      description: [''],
    })
    this.RepositoryFileForm = this.formBuilder.group({
      filename: [''],
      owner: [''],
      message: [''],
      sha: [''],
    })
  }

  validateNumPackage(): boolean {
    let value = false;
    if (this.data_labpack.length > 0) {
      value = true;
    }
    return value;
  }

  uploadArtifact(file) {
    const artifact_name = parseArtifactNameForStorage(
      file.name,
    );
    const storage_ref = newStorageRefForArtifact(
      'repository',
      artifact_name
    );
    const onPercentageChanges = (percentage: string) => {
      this.progressBarValueArtifact = percentage;
    }
    this.artifactController.uploadArtifactToStorage(
      storage_ref,
      file,
      { onPercentageChanges },
      (storage_ref, file_url) => {
        this.url_package = file_url;
      },
    );
  }

  VerifyUserLogin() {
    if (!this.hasZenodoCode && this.isChoosed) {
      this.alertService.presentWarningAlert(this.translateService.instant("VERIFY_SIGN_UP_GITHUB"))
    }
  }



  getPackage() {
    this.labpackService.get({
      experiment: this.experiment_id
      , ___populate: 'package_type,repository',
    }).subscribe((data: any) => {
      this.data_labpack = data.response

    })
  }

  onChangeChoice(checked: boolean) {
    this.isChoosed = checked;

  }

  getPackageType() {
    this.labpackService.getPackageType().subscribe((data: any) => {
      this.PackagesTypes = data.response
    })
  }

  getPackageRepository() {
    this.labpackService.getRepositoryType().subscribe((data: any) => {
      this.RepositoryTypes = data.response

    })
  }

  changeLanguage(repository): string {
    let value = ""
    if (repository == "Repositorio institucional" && this.change_language == true) {
      value = "Institutional Repository"
    } else if (repository == "Computer Society Digital Library" && this.change_language == false) {
      value = "Librería Digital de la Sociedad de la Computación"
    } else {
      value = repository
    }

    return value
  }

  ChangeDate(date: string): string {
    return formatDate(date);
  }

  getRepositoryId(name): string {
    return this.RepositoryTypes.find(repository => repository.name.toLowerCase() == name.toLowerCase())._id;
  }

  save() {
    const labpack = this.groupForm.value
    labpack.experiment = this.experiment_id
    labpack.package_url = this.url_package
    labpack.publishedZenodo = this.isChoosed

    const data = {
      name: labpack.package_name,
      description: labpack.description,
      token: localStorage.getItem('ZenodoCode'),
    }
    if (this.isChoosed) {
      this.groupForm.value.repository = this.getRepositoryId("Github");
    }
    if (this.validateNumPackage()) {
      this.alertService.presentWarningAlert('Only one package is allowed');
      this.close();
    } else if (this.artifacts.length == 0) {
      this.alertService.presentWarningAlert(this.translateService.instant("MSG_ARTIFACTS_GENERATED"));
      this.close();
    } else {
      if (this.hasZenodoCode) {
        this.labpackService.CreateGithubRepo(data).subscribe((data: any) => {
          labpack.owner = data.response.owner.login
          labpack.package_url = data.response.html_url
          labpack.user_url = data.response.url
          labpack.sha = "",
            labpack.filename = "",
            labpack.commit = ""
          this.labpackService.create(labpack).subscribe((data: any) => {
            this.alertService.presentSuccessAlert('Laboratory Package saved successfully');
            this.actualExperiment[0].completed = true;
            if (this.tokenStorageService.getIdExperiment().length > 0) {
              this.tokenStorageService.deleteSelectedExperiment();
              this.tokenStorageService.saveExperimentId(this.actualExperiment[0]._id, this.actualExperiment[0].completed)
            }
            this._ExperimentService.update(this.experiment_id, this.actualExperiment[0]).subscribe((data: any) => {
              this.getPackage()
              this.VerificateSelectedExperiment();
              this.close();

            })

          })

        })
      }
      else {

        this.labpackService.create(labpack).subscribe((data: any) => {
          this.alertService.presentSuccessAlert('Laboratory Package saved successfully');
          this.actualExperiment[0].completed = true;
          if (this.tokenStorageService.getIdExperiment().length > 0) {
            this.tokenStorageService.deleteSelectedExperiment();
            this.tokenStorageService.saveExperimentId(this.actualExperiment[0]._id, this.actualExperiment[0].completed)
          }

          this._ExperimentService.update(this.experiment_id, this.actualExperiment[0]).subscribe((data: any) => {
            this.getPackage()
            this.VerificateSelectedExperiment();
            this.close();

          })

        })
      }
    }
  }
  LoginWithZenodo() {
    window.location.href = 'https://zenodo.org/oauth/authorize?response_type=token&client_id=gJGshefN5uUB2tV707CLI3yuTNXsbIMMdwkATw5L&scope=deposit%3Awrite+deposit%3Aactions&state=CHANGEME&redirect_uri=https%3A%2F%2Fbadge-go.netlify.app%2Fexperiment%2Fstep'
  }

  update() {
    const labpack = this.groupForm.value
    this.id_labpack;
    labpack.experiment = this.experiment_id
    if (this.hasZenodoCode && this.updateLabpack.publishedZenodo) {
      this.labpackService.UpdateRepoGithub({
        url: this.updateLabpack.user_url,
        name: labpack.package_name,
        description: labpack.package_description,
        token: localStorage.getItem("ZenodoCode")
      }).subscribe((data: any) => {
        labpack.owner = data.response.owner.login
        labpack.package_url = data.response.html_url
        labpack.user_url = data.response.url
        labpack.publishedZenodo = true
        this.labpackService.update(this.id_labpack, labpack).subscribe((data: any) => {
          this.loadSucessMessage();
        })
      })

    } else {
      this.labpackService.update(this.id_labpack, labpack).subscribe((data: any) => {
        this.loadSucessMessage();
      })
    }

  }

  loadSucessMessage() {
    this.alertService.presentSuccessAlert(this.translateService.instant('MSG_UPDATE_LABPACK'));
    this.getPackage();
    this.closeModalUpdate.nativeElement.click();
  }

  UploadLabpack() {
    if (this.labpack.sha.length > 0) {
      this.labpackService.DeleteRepoFile({
        url: this.labpack.user_url,
        filename: this.labpack.filename,
        message: this.labpack.commit,
        token: localStorage.getItem('ZenodoCode'),
        sha: this.labpack.sha
      }).subscribe((data: any) => {
        const dataRepo =
        {
          url: this.labpack.user_url,
          file: this.fileContent,
          filename: this.fileName,
          message: "Uploading labpack" + " " + new Date().toString(),
          token: localStorage.getItem('ZenodoCode'),
          sha: this.labpack.sha
        }
        this.labpackService.UploadRepoFile(
          dataRepo
        ).subscribe((data: any) => {
          this.labpack.sha = data.response.content.sha
          this.labpack.commit = dataRepo.message
          this.labpack.filename = dataRepo.filename
          this.labpackService.update(this.labpack._id, this.labpack).subscribe((data: any) => {
            this.alertService.presentSuccessAlert(this.translateService.instant("MSG_UPLOAD_REPO"))
          })
        })

      })

    } else {
      // Subir archivo
      const dataRepo =
      {
        url: this.labpack.user_url,
        file: this.fileContent,
        filename: this.fileName,
        message: "Uploading labpack" + " " + new Date().toString(),
        token: localStorage.getItem('ZenodoCode'),
        sha: ""
      }
      this.labpackService.UploadRepoFile(
        dataRepo
      ).subscribe((data: any) => {
        this.labpack.sha = data.response.content.sha
        this.labpack.commit = dataRepo.message
        this.labpack.filename = dataRepo.filename
        this.labpackService.update(this.labpack._id, this.labpack).subscribe((data: any) => {
          this.alertService.presentSuccessAlert(this.translateService.instant("MSG_UPLOAD_REPO"))
        })
      })
    }
  }

  close() {
    this.closeModal.nativeElement.click();
  }
  saveAs(uploadGithub) {
    this.generateZipFile(this.artifacts, uploadGithub)
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


  async UrltoBinary(url) {
    try {
      const resultado = await JSZipUtils.getBinaryContent(url)
      return resultado
    } catch (error) {
      return;
    }
  }
  // metodo para crear el archivo zip en forma cronologica descendente
  createCronologicZipDESC(uploadGithub) {
    const zip = new JSZip();
    let count = 0
    this.fileContent = ""
    for (let index = 0; index < this.artifacts_desc.length; index++) {
      let data = this.UrltoBinary(this.artifacts_desc[index].file_url) //
      zip.file(this.artifacts_desc[index].name + "." + this.artifacts_desc[index].file_format.toLowerCase(), data, { binary: true, date: new Date(this.artifacts_desc[index].createdAt) });
      count++;

      if (count === this.artifacts_desc.length) {
        if (uploadGithub) {
          zip.generateAsync({ type: 'base64' }).then((content) => {
            this.fileContent = content;
            this.fileName = this.data_labpack[0].package_name + "_desc.zip"
            this.UploadLabpack()

          });
        } else {
          zip.generateAsync({ type: 'blob' }).then((content) => {
            saveAs(content, this.data_labpack[0].package_name + "_desc.zip");
          });
        }

      }

    }

  }


  // metodo para crear el archivo zip en forma cronologica ascendente
  createCronologicASC(uploadGithub) {
    const zip = new JSZip();
    let count = 0
    this.fileContent = ""
    for (let index = 0; index < this.artifacts_asc.length; index++) {
      let data = this.UrltoBinary(this.artifacts_asc[index].file_url) //
      zip.file(this.artifacts_asc[index].name + "." + this.artifacts_asc[index].file_format.toLowerCase(), data, { binary: true, date: new Date(this.artifacts_asc[index].createdAt) });
      count++;

      if (count === this.artifacts_asc.length) {
        if (uploadGithub) {
          zip.generateAsync({ type: 'base64' }).then((content) => {
            this.fileContent = content;
            this.fileName = this.data_labpack[0].package_name + "_asc.zip"
            this.UploadLabpack()
          });
        } else {
          zip.generateAsync({ type: 'blob' }).then((content) => {
            saveAs(content, this.data_labpack[0].package_name + "_asc.zip");
          });
        }

      }

    }

  }


  createFormatZipFile(uploadGithub) {
    let formatFile = this.CheckArtfifactFormat()
    const zip = new JSZip();
    let count = 0
    let listFile = []
    this.fileContent = ""
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
          if (uploadGithub) {
            zip.generateAsync({ type: 'base64' }).then((content) => {
              this.fileContent = content;
              this.fileName = this.data_labpack[0].package_name + "_byFormat.zip"
              this.UploadLabpack()

            });
          } else {
            zip.generateAsync({ type: 'blob' }).then((content) => {
              saveAs(content, this.data_labpack[0].package_name + "_byFormat.zip");
            });
          }
        }
      })

    })

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
        zipContent.push("Tareas_Análisis")
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
  generateZipFile(artifacts, uploadGithub) {
    const zip = new JSZip();
    let count = 0;
    let HasTask = []
    let NoTask = []
    let AcmArtifacts = []
    this.fileContent = ""
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
        this.artifactData.push(data)
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
        this.artifactData.push(data)
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
          this.artifactData.push(data)
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
      this.artifactData.push(data)

    }

    for (let index = 0; index < zipContent.length; index++) {
      const files = zipContent[index];
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
              this.artifactData.push(data)
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
              this.artifactData.push(data)

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
              this.artifactData.push(data)

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
              this.artifactData.push(data)
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
              this.artifactData.push(data)
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
              this.artifactData.push(data)
            }

          }
        }
      }
    }

    this.artifactData.forEach((artifacts) => {

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

        if (count === this.artifactData.length) {
          if (uploadGithub) {
            zip.generateAsync({ type: 'base64' }).then((content) => {
              this.fileContent = content;
              this.fileName = this.data_labpack[0].package_name + ".zip"
              this.UploadLabpack()

            });
          } else {
            zip.generateAsync({ type: 'blob' }).then((content) => {
              saveAs(content, this.data_labpack[0].package_name + ".zip");

            });
          }
        }
      })

    })
  }





  onChange(bool1, bool2, bool3, bool4) {
    this.ascChecked = bool1;
    this.descChecked = bool2;
    this.purposeChecked = bool3;
    this.formatChecked = bool4;
  }

  checked() {
    if (this.asc.nativeElement.checked == true) {
      this.ascChecked = false;
      this.purposeChecked = false;
      this.formatChecked = false;
    } else if (this.desc.nativeElement.checked == true) {
      this.purposeChecked = false;
      this.formatChecked = false;
      this.ascChecked = false
    } else if (this.format.nativeElement.checked == true) {
      this.purposeChecked = false;
      this.ascChecked = false
      this.descChecked = false;
    } else {
      if (this.purpose.nativeElement.checked == true) {
        this.ascChecked = false
        this.descChecked = false;
        this.formatChecked = false;
      }
    }
  }

  ShowZip(uploadGithub: boolean) {
    if (this.asc.nativeElement.checked == true) {
      if (this.artifacts_asc.length == 0) {
        this.alertService.presentWarningAlert(this.translateService.instant("MSG_ARTIFACTS_GENERATED"))
      } else {
        this.downloadZip = true;
        this.desc.nativeElement.checked = false;
        this.purpose.nativeElement.checked = false;
        this.format.nativeElement.checked = false;
        this.createCronologicASC(uploadGithub)

        this.alertService.presentSuccessAlert(this.translateService.instant("MSG_ARCHIVE_GENERATED"))
      }

    } else if (this.desc.nativeElement.checked == true) {
      if (this.artifacts_desc.length == 0) {
        this.alertService.presentWarningAlert(this.translateService.instant("MSG_ARTIFACTS_GENERATED"))
      } else {
        this.downloadZip = true;
        this.purpose.nativeElement.checked = false;
        this.format.nativeElement.checked = false;
        this.asc.nativeElement.checked = false
        this.createCronologicZipDESC(uploadGithub)
        this.alertService.presentSuccessAlert(this.translateService.instant("MSG_ARCHIVE_GENERATED"))

      }
    } else if (this.format.nativeElement.checked == true) {
      if (this.artifacts_asc.length == 0) {
        this.alertService.presentWarningAlert(this.translateService.instant("MSG_ARTIFACTS_GENERATED"))
      } else {
        this.downloadZip = true;
        this.purpose.nativeElement.checked = false;
        this.asc.nativeElement.checked = false
        this.desc.nativeElement.checked = false;
        this.createFormatZipFile(uploadGithub)
        this.alertService.presentSuccessAlert(this.translateService.instant("MSG_ARCHIVE_GENERATED"))
      }
    } else if (this.purpose.nativeElement.checked == true) {
      if (this.artifacts.length == 0) {
        this.alertService.presentWarningAlert(this.translateService.instant("MSG_ARTIFACTS_GENERATED"))
      } else {
        this.downloadZip = true;
        this.asc.nativeElement.checked = false
        this.desc.nativeElement.checked = false;
        this.format.nativeElement.checked = false;
        this.saveAs(uploadGithub)
        this.alertService.presentSuccessAlert(this.translateService.instant("MSG_ARCHIVE_GENERATED"))
      }

    } else {
      this.alertService.presentWarningAlert(this.translateService.instant("MSG_SELECT_ORDER"))
    }
  }

  onChangeOption(checked: boolean) {
    this.isSelected = checked;
  }

  onCheckTokenOption(checked: boolean) {
    this.isTokenOption = checked;
  }

  onCheckPersonalToken(checked: boolean) {
    this.NoPersonalToken = checked;
  }

  uploadPackage() {
    this._router.navigate(['experiment/step/' + this.experiment_id + "/step/menu/upload_labpack"])
  }


  ConfirmDeleteLabpack(labpack) {
    this.alertService.presentConfirmAlert(
      this.translateService.instant('WORD_CONFIRM_DELETE'),
      this.translateService.instant('WORD_CONFIRM_DELETE_LABPACK'),
      this.translateService.instant('WORD_DELETE'),
      this.translateService.instant('WORD_CANCEL'),
    ).then((status) => {
      if (status.isConfirmed) {
        this.DeleteLabpack(labpack._id)
      }
    })
  }

  DeleteRepoGitHub(labpack: any, token) {
    console.log(labpack)
    let id_labpack = labpack._id
    this.labpackService.DeleteRepoGithub({
      url: labpack.user_url,
      token: token
    }).subscribe((data: any) => {
      console.log(data);
      this.DeleteLabpack(id_labpack)

    })
  }
  DeleteLabpack(id) {
    this.labpackService.delete(id).subscribe(() => {
      this.getPackage();
      this.alertService.presentSuccessAlert(this.translateService.instant("MSG_DELETE_LABPACK"));
    })
  }

  createRepository(): void {
    this.labpackService.createRespositorio(
      {
        "metadata": {
          "title": "",
          "upload_type": 'other',
          "description": "",
          "creators": this.experimenters
        },
        "token": ""
      }
    ).subscribe((data) => {
      if (data.response.id > 0) {
        this.alertService.presentSuccessAlert(this.translateService.instant("MSG_CREATED_REPO"))
        this.labpackService.uploadPackage({
          url: "",
          name: "",
          token: "",
          id_zenodo: "",
        }
        ).subscribe(data => {
          if (data.response.id?.length > 0) {
            this.alertService.presentSuccessAlert(this.translateService.instant("MSG_UPLOAD_REPO"))
          }
        })
      }
    })
  }


  publishRepo() {
    this.labpackService.PublishRepo({
      token: "",
      id_zenodo: ""
    }).subscribe((data) => {
      if (data.response.doi_url.length > 0) {
        this.labpackService.update("",
          {
            "package_name": "",
            "package_doi": "",
            "experiment": "",
            "package_type": "",
            "package_url": "",
            "repository": "",
            "package_description": "",
            "published": false,
            "submitedZenodo": true,
            "id_zenodo": "",
            "tokenRepo": ""
          }
        ).subscribe((data) => {
          this.alertService.presentSuccessAlert(this.translateService.instant("MSG_PUBLISH_REPO"))
          this._router.navigate(['experiment/step/' + this.experiment_id + "/step/menu/labpack"])
        })

      }
    })
  }

  confirmPublish() {
    this.alertService.presentConfirmAlert(
      this.translateService.instant("PUBLISH_ZENODO_PART05"),
      this.translateService.instant("MSG_PUBLISH"),
      this.translateService.instant("WORD_ACCEPT"),
      this.translateService.instant("WORD_CANCEL")
    ).then((data) => {
      if (data.isConfirmed) {
        this.publishRepo()
      }
    })
  }


  confirmCreateRepo() {
    this.alertService.presentConfirmAlert(
      this.translateService.instant("PUBLISH_ZENODO_PART02"),
      this.translateService.instant("MSG_CREATE_REPO"),
      this.translateService.instant("WORD_ACCEPT"),
      this.translateService.instant("WORD_CANCEL")
    ).then((data) => {
      if (data.isConfirmed) {
        this.createRepository()


      }
    })
  }






}

