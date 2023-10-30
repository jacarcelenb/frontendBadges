import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ArtifactController } from 'src/app/controllers/artifact.controller';
import { AlertService } from 'src/app/services/alert.service';
import { ArtifactService } from 'src/app/services/artifact.service';
import { ArtifactCreateComponent } from '../artifact-create/artifact-create.component';
import { MenuItem } from 'primeng/api';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { formatDate } from 'src/app/utils/formatters';
import { HttpClient } from '@angular/common/http';
import { FileSaverService } from 'ngx-filesaver';
import * as JSZip from 'jszip';
import * as JSZipUtils from '../../../../assets/script/jszip-utils.js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { newStorageRefForArtifact, parseArtifactNameForStorage } from 'src/app/utils/parsers';
import { ExperimentService } from 'src/app/services/experiment.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { AuthService } from 'src/app/services/auth.service';
import { ExperimenterService } from 'src/app/services/experimenter.service';
import { SenderParameterService } from 'src/app/services/sender-parameter.service';

@Component({
  selector: 'app-artifact-list',
  templateUrl: './artifact-list.component.html',
  styleUrls: ['./artifact-list.component.scss'],
})
export class ArtifactListComponent implements OnInit {
  experiment_id: string;
  change_language = false;
  artifactForm: FormGroup;
  ActualExperimenter = [];
  completedStepSpanish: MenuItem[];
  experimentOwner: boolean = false;
  @ViewChild('appArtifactCreate', { static: false })
  appArtifactCreate: ArtifactCreateComponent;
  @ViewChild('closeArtifactCreateModal') closeCreateArtifactModal: ElementRef;
  pageSize = 3;
  pageSizes = [3, 6, 9];
  page = 1;
  selectedFileArtifact: FileList;
  Option: string;
  showDataset = false;
  showsoftware = false;
  showscript = false;
  items: MenuItem[];
  updateFields = false;
  menu_type: string;
  count = 0;
  userExperiments = [];
  completedExperiment: boolean = false;
  completedSteps: MenuItem[];
  public maskTime = [/[0-9]/, /\d/, ':', /[0-5]/, /\d/, ':', /[0-5]/, /\d/];
  artifacts = [];
  displayedColumns: string[] = ['name', 'artifact_purpose', 'created_date', 'conected_task', 'options'];
  dataSource: MatTableDataSource<any>

  @ViewChild(MatPaginator) paginator: MatPaginator;
  progressBarValueArtifact: string;
  id_task: any;
  artifactTypes: any;
  artifactClasses: any;
  artifactPurposes: any;
  id_artifact: any;
  constructor(
    private formBuilder: FormBuilder,
    private _artifactService: ArtifactService,
    private _alertService: AlertService,
    private actRoute: ActivatedRoute,
    private _translateService: TranslateService,
    private artifactController: ArtifactController,
    private _router: Router,
    private _ExperimentService: ExperimentService,
    private httpClient: HttpClient,
    private fileSaverService: FileSaverService,
    private tokenStorageService: TokenStorageService,
    private _authService: AuthService,
    private experimenterService: ExperimenterService,
    private senderService: SenderParameterService,
  ) { }

  ngOnInit(): void {
    this.experiment_id = this.actRoute.parent.snapshot.paramMap.get('id');
    this.menu_type = this.actRoute.parent.snapshot.paramMap.get("menu");
    this.getArtifacts();
    this.initForm();
    this.loadArtifactOptions();
    this.artifactController.init(
      this.experiment_id,
    );

    this.ValidateLanguage();
    this._translateService.onLangChange.subscribe(() => {
      this.ValidateLanguage()
    });
    this.items = [
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/artifacts" },
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/artifacts" },
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/artifacts" },
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/artifacts" },
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/artifacts" },
      { routerLink: 'experiments/' + this.experiment_id + "/artifacts_acm" },
      { routerLink: 'experiments/' + this.experiment_id + "/badges" },
      { routerLink: 'experiments/' + this.experiment_id + "/labpack" }
    ]


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
    this.getUserExperiments()

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
    this._ExperimentService.getExperimentsUser().subscribe((data:any)=>{
       this.userExperiments = data.response

       this.experimentOwner = this.validateExperimentOwner(this.experiment_id)
    })
  }

  getActualExperimenter() {
    this.experimenterService.get({ user: this.tokenStorageService.getUser()._id }).subscribe((data: any) => {
      this.ActualExperimenter = data.response
      this.experimentOwner = this._authService.validateExperimentOwner(this.ActualExperimenter[0], this.experiment_id);

    })
  }
  VerificateSelectedExperiment(){
    if (this.tokenStorageService.getIdExperiment()) {
         this.experiment_id =this.tokenStorageService.getIdExperiment();
         this.completedExperiment =(this.tokenStorageService.getStatusExperiment() == "true")
    }
 }


  close() {
    this.closeCreateArtifactModal.nativeElement.click();
    this.progressBarValueArtifact = '';
  }
  initForm() {
    this.artifactForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      file_content: ['', [Validators.required]],
      file_format: ['', [Validators.required]],
      file_size: [null, [Validators.required]],
      file_url: [null, [Validators.required]],
      file_location_path: [null, [Validators.required]],
      credential_access: this.formBuilder.group({
        user: [null],
        password: [null],
      }),
      evaluation: this.formBuilder.group({
        time_complete_execution: [null],
        time_short_execution: [null],
        is_accessible: [false],
      }),
      reproduced: this.formBuilder.group({
        substantial_evidence_reproduced: [false],
        respects_reproduction: [false],
        tolerance_framework_reproduced: [false],
      }),
      replicated: this.formBuilder.group({
        substantial_evidence_replicated: [false],
        respects_replication: [false],
        tolerance_framework_replicated: [false],
      }),
      artifact_class: ['', [Validators.required]],
      artifact_type: ['', [Validators.required]],
      description_sistematic_script: [''],
      description_sistematic_software: [''],
      executed_scripts: [false],
      executed_software: [false],
      data_manipulation: [false],
      norms_standards: [false],
      artifact_purpose: ['', [Validators.required]],
      artifact_use: [''],
    });
  }

  ValidateLanguage() {
    if (this._translateService.instant('LANG_SPANISH_EC') == "Español (ECU)") {
      this.change_language = false;
    } else {
      this.change_language = true;
    }
  }
  parseBytes(bytes) {
    if (bytes < 1048576) {
      return (bytes / 1024).toFixed(3) + ' KB';
    }
    else if (bytes < 1073741824) {
      return (bytes / 1048576).toFixed(2) + ' MB';
    }
    else {
      return (bytes / 1073741824).toFixed(2) + ' GB';
    }
  }
  openArtifactUploadModal() {
    this.appArtifactCreate.show();
  }

  updateArtifact(artifact) {
    this.appArtifactCreate.show(artifact._id, true);
  }

  async loadArtifactOptions() {
    const [types, classes, purposes] = await Promise.all([
      this._artifactService.getTypes().toPromise(),
      this._artifactService.getClasses().toPromise(),
      this._artifactService.getPurposes().toPromise(),
    ]);

    this.artifactTypes = types.response;
    this.artifactClasses = classes.response;
    this.artifactPurposes = purposes.response;
  }

  selectArtifact(artifact) {
    this.cleanFields();
    this.id_task = artifact.task
    this.id_artifact = artifact._id
    this.artifactForm.get('name').setValue(artifact.name)
    this.artifactForm.get('file_content').setValue(artifact.file_content)
    this.artifactForm.get('file_format').setValue(artifact.file_format)
    this.artifactForm.get('file_size').setValue(artifact.file_size)
    this.artifactForm.get('file_url').setValue(artifact.file_url)
    this.artifactForm.get('file_location_path').setValue(artifact.file_location_path)
    this.artifactForm.get('credential_access.user').setValue(artifact.credential_access.user)
    this.artifactForm.get('credential_access.password').setValue(artifact.credential_access.password)
    this.artifactForm.get('evaluation.time_complete_execution').setValue(artifact.evaluation.time_complete_execution)
    this.artifactForm.get('evaluation.time_short_execution').setValue(artifact.evaluation.time_short_execution)
    this.artifactForm.get('evaluation.is_accessible').setValue(artifact.evaluation.is_accessible)
    this.artifactForm.get('reproduced.substantial_evidence_reproduced').setValue(artifact.reproduced.substantial_evidence_reproduced)
    this.artifactForm.get('reproduced.respects_reproduction').setValue(artifact.reproduced.respects_reproduction)
    this.artifactForm.get('reproduced.tolerance_framework_reproduced').setValue(artifact.reproduced.tolerance_framework_reproduced)
    this.artifactForm.get('replicated.substantial_evidence_replicated').setValue(artifact.replicated.substantial_evidence_replicated)
    this.artifactForm.get('replicated.respects_replication').setValue(artifact.replicated.respects_replication)
    this.artifactForm.get('replicated.tolerance_framework_replicated').setValue(artifact.replicated.tolerance_framework_replicated)
    this.artifactForm.get('artifact_class').setValue(artifact.artifact_class._id)
    this.artifactForm.get('artifact_type').setValue(artifact.artifact_type._id)
    this.artifactForm.get('description_sistematic_script').setValue(artifact.description_sistematic_script)
    this.artifactForm.get('description_sistematic_software').setValue(artifact.description_sistematic_software)
    this.artifactForm.get('executed_scripts').setValue(artifact.executed_scripts)
    this.artifactForm.get('executed_software').setValue(artifact.executed_software)
    this.artifactForm.get('data_manipulation').setValue(artifact.data_manipulation)
    this.artifactForm.get('norms_standards').setValue(artifact.norms_standards)
    this.artifactForm.get('artifact_purpose').setValue(artifact.artifact_purpose._id)
    this.artifactForm.get('artifact_use').setValue(artifact.artifact_use)
  }

  updateArtifacts() {
    const artifact = this.artifactForm.value
    artifact.experiment = this.experiment_id
    artifact.task = this.id_task

    this._artifactService.update(this.id_artifact, artifact).subscribe((data: any) => {
      this._alertService.presentSuccessAlert(this._translateService.instant('ARTIFACT_UPDATE_SUCCESS'))
      this.getArtifacts()
      this.close()
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
  changeDate(date: any): string {
    return formatDate(date)
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  deleteArtifact(artifact) {
    const onDoneDeleting = () => {
      this.getArtifacts();
    };
    this.artifactController.removeFullArtifact(
      artifact._id,
      onDoneDeleting,
    );
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
  getArtifacts() {
    const params = this.getRequestParams(this.page, this.pageSize);

    this._artifactService.get({
      experiment: this.experiment_id,
      is_acm: false,
      ___sort: '-createdAt',
      ___populate: 'artifact_class,artifact_type,artifact_purpose,task',
    }).subscribe((data) => {
      this.artifacts = data.response;
      this.dataSource = new MatTableDataSource<any>(this.artifacts);
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator._intl = new MatPaginatorIntl()
      this.dataSource.paginator._intl.itemsPerPageLabel = ""
    });

    this._artifactService.count({
      experiment: this.experiment_id
    }).subscribe((data) => {
      this.count = data.response;
    });
  }
  handlePageChange(event) {
    this.page = event;
    this.getArtifacts();
  }

  NotaskAttached(task) {
    let value = "No tiene tareas vinculadas"
    if (task == null) {
      if (this.change_language == true) {
        value = "No related tasks"
      } else {
        value = "No tiene tareas vinculadas"
      }
    } else {
      value = task
    }

    return value
  }
  handlePageSizeChange(event) {
    this.pageSize = event.target.value;
    this.page = 1;
    this.getArtifacts();
  }
  getRequestParams(page, pageSize) {
    // tslint:disable-next-line:prefer-const
    let params = {};

    if (page) {
      params[`___page`] = page;
    }

    if (pageSize) {
      params[`___size`] = pageSize;
    }
    return params;
  }

  Back() {
    this._router.navigate(['experiment/step/' + this.experiment_id + "/step/menu/tasks"])
  }

  Next() {
    this._router.navigate(['experiment/step/' + this.experiment_id + "/step/menu/select_badge"])
  }

  chooseFileArtifact(event) {
    this.selectedFileArtifact = event.target.files;
    if (this.selectedFileArtifact.item(0)) {
      var re = /(?:\.([^.]+))?$/;
      const currentFile = this.selectedFileArtifact.item(0);
      let [, extension] = re.exec(currentFile.name);
      extension = extension.toUpperCase();

      this.artifactForm.get('file_format').setValue(extension);
      this.artifactForm.get('file_size').setValue(currentFile.size);

      this.uploadArtifact();
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
        this.artifactForm.get('file_url').setValue(file_url);
        this.artifactForm.get('file_location_path').setValue(storage_ref);
      },
    );
  }

  cleanFields() {
    this.progressBarValueArtifact = ""
  }

}
