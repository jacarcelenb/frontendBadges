import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { TaskService } from 'src/app/services/task.service';
import { ArtifactCreateComponent } from 'src/app/components/artifacts/artifact-create/artifact-create.component';
import { TaskCreateComponent } from '../task-create/task-create.component';
import { AngularFireStorage } from '@angular/fire/storage';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ExperimentService } from 'src/app/services/experiment.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { AuthService } from 'src/app/services/auth.service';
import { ExperimenterService } from 'src/app/services/experimenter.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
  @ViewChild('appTaskCreate', { static: false })
  appTaskCreate: TaskCreateComponent;
  @ViewChild('appArtifactCreate', { static: false })
  appArtifactCreate: ArtifactCreateComponent;
  experiment_id: string;
  tasks_without_artifacts: number = 0;
  numTasks: number = 0;
  pageSize = 2;
  userExperiments = [];
  completedStepSpanish: MenuItem[];
  experimentOwner: boolean = false;
  pageSizes = [2, 4, 6, 8, 10];
  page = 1;
  items: MenuItem[];
  menu_type: string;
  count = 0;
  tasks = [];
  change_language = false;
  displayedColumns: string[] = ['index', 'artifacts', 'name', 'type', 'responsible', 'actions'];
  dataSource: MatTableDataSource<any>
  actualExperiment: any[];
  completedExperiment: boolean = false;
  completedSteps: MenuItem[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private _taskService: TaskService,
    private _alertService: AlertService,
    private afStorage: AngularFireStorage,
    private _translateService: TranslateService,
    private actRoute: ActivatedRoute,
    private _ExperimentService: ExperimentService,
    private _router: Router,
    private tokenStorageService: TokenStorageService,
    private experimenterService: ExperimenterService,
    private _authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.experiment_id = this.actRoute.parent.snapshot.paramMap.get('id');
    this.menu_type = this.actRoute.parent.snapshot.paramMap.get("menu");
    this.getTaskByExperimentId();
    this.ValidateLanguage();
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
    this._translateService.onLangChange.subscribe(() => {
      this.ValidateLanguage()
    });

    this.items = [
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/tasks" },
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/tasks" },
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/tasks" },
      { routerLink: 'experiment/step/' + this.experiment_id + "/step/menu/tasks" },
      { routerLink: 'experiments/' + this.experiment_id + "/artifacts" },
      { routerLink: 'experiments/' + this.experiment_id  + "/select_badge" },
      { routerLink: 'experiments/' + this.experiment_id + "/artifacts_acm" },
      { routerLink: 'experiments/' + this.experiment_id + "/badges" },
      { routerLink: 'experiments/' + this.experiment_id + "/labpack" }
    ]
    this.VerificateSelectedExperiment()

    this.getUserExperiments()

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
    this._ExperimentService.getExperimentsUser().subscribe((data: any) => {
      this.userExperiments = data.response

      this.experimentOwner = this.validateExperimentOwner(this.experiment_id)
    })
  }

  VerificateSelectedExperiment() {
    if (this.tokenStorageService.getIdExperiment()) {
      this.experiment_id = this.tokenStorageService.getIdExperiment();
      this.completedExperiment = (this.tokenStorageService.getStatusExperiment() == "true")
    }
  }

  openArtifactUploadModal(task_id?: string) {
    this.appArtifactCreate.show(task_id);
  }
  showCreateTaskModal(task_id?: string) {
    this.appTaskCreate.show(task_id);
  }
  ValidateLanguage() {
    if (this._translateService.instant('LANG_SPANISH_EC') == "Español (ECU)") {
      this.change_language = false;
    } else {
      this.change_language = true;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  deleteTaskConfirm(task) {
    this._alertService.presentConfirmAlert(
      this._translateService.instant('WORD_CONFIRM_DELETE'),
      this._translateService.instant('WORD_CONFIRM_DELETE_TASK'),
      this._translateService.instant('WORD_DELETE'),
      this._translateService.instant('WORD_CANCEL'),
    ).then((status) => {
      if (status.isConfirmed) {
        if (task.artifacts.length == 0) {
          this._taskService.deletetTaskWihoutArtifacts(task._id).subscribe(() => {
            this._alertService.presentSuccessAlert(
              this._translateService.instant("DELETE_TASK")
            );
            this.getTaskByExperimentId();
          })

        } else {
          this.deleteTask(task);
        }
      }
    });
  }
  deleteTask(task) {

    const onSuccess = async () => {
      await Promise.all(
        task.artifacts.map((artifact) => {
          return this.afStorage
            .storage
            .ref(artifact.file_location_path)
            .delete();
        })
      );
      this._alertService.presentSuccessAlert(
        this._translateService.instant("DELETE_TASK")
      );
      this.getTaskByExperimentId();
    };

    this._taskService.delete(task._id).subscribe(onSuccess);
  }
  getTaskByExperimentId() {
    const params = this.getRequestParams(this.page, this.pageSize);

    this._taskService.getWithArtifacts({
      experiment: this.experiment_id,
      ___populate: 'responsible,task_type',
      ___sort: '-createdAt'
    }).subscribe((data) => {
      this.tasks = data.response;
      this.dataSource = new MatTableDataSource<any>(this.tasks);
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator._intl = new MatPaginatorIntl()
      this.dataSource.paginator._intl.itemsPerPageLabel = ""
      this.tasks_without_artifacts = this.tasks.filter(task => task.artifacts.length == 0 && task.needsArtifact).length;
    });
  }
  handlePageChange(event) {
    this.page = event;
    this.getTaskByExperimentId();
  }

  handlePageSizeChange(event) {
    this.pageSize = event.target.value;
    this.page = 1;
    this.getTaskByExperimentId();
  }
  getRequestParams(page, pageSize) {
    const params = {};

    if (page) {
      params[`___page`] = page;
    }

    if (pageSize) {
      params[`___size`] = pageSize;
    }
    return params;
  }

  Back() {
    this._router.navigate(['experiment/step/' + this.experiment_id + "/step/menu/groups"])
  }

  Next() {
    this._router.navigate(['experiment/step/' + this.experiment_id + "/step/menu/artifacts"])
  }

}
