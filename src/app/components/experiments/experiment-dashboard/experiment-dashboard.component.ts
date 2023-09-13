import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common'
import { ExperimentsListDto } from 'src/app/models/dto/ExperimentsListDto';
import { GroupService } from 'src/app/services/group.service';
import { group } from 'console';
import { ExperimentService } from 'src/app/services/experiment.service';
import { ExperimenterService } from 'src/app/services/experimenter.service';
import { TaskService } from 'src/app/services/task.service';
import { ArtifactService } from 'src/app/services/artifact.service';
import { TranslateService } from '@ngx-translate/core';
import { color } from 'html2canvas/dist/types/css/types/color';

@Component({
  selector: 'app-experiment-dashboard',
  templateUrl: './experiment-dashboard.component.html',
  styleUrls: ['./experiment-dashboard.component.scss']
})
export class ExperimentDashboardComponent implements OnInit {
  @Input() experiment: ExperimentsListDto;
  @Input() experiment_id: string;
  groups: any[]
  experimenters: any[]
  artifacts: any[]
  tasks: any[]
  data: any;
  dataTasksTypes: any
  dataTasks: any

  dataArtifactClass: any
  dataArtifactTasks: any
  numTaskArtifact: number
  numTaskWithoutArtifact: number
  numAnalysisTasks: number
  numPreparationTasks: number
  numExperimentalTasks: number
  numArtifactsTasks: number
  numArtifactWihoutTasks: number
  InputArtifacts: number
  OutputArtifacts: number

  details_option: any
  basicData: any;
  Numexperimenters: number = 0;
  NumGroups: number = 0;
  NumTasks: number = 0;
  NumArtifacts: number = 0;
  ControlParticipants: number = 0;
  ExperimentalParticipants: number = 0;
  constructor(private location: Location,
    private acRoute: ActivatedRoute,
    private groupService: GroupService,
    private experimenterService: ExperimenterService,
    private taskService: TaskService,
    private artifactService: ArtifactService,
    private translateService: TranslateService) { }

  ngOnInit(): void {
    this.experiment_id = this.acRoute.parent.snapshot.paramMap.get('id');
    this.getGroups()
    this.getNumExperimenters()
    this.getNumTasks()
    this.getArtifacts()


  }

  getGroups() {
    this.groupService.get({
      experiment: this.experiment_id,
      ___populate: 'group_type'
    }).subscribe((data: any) => {
      this.groups = data.response
      this.NumGroups = this.groups.length

      if (this.NumGroups == 1) {
        if (this.groups[0].group_type.name == "Control") {
          this.ControlParticipants = this.groups[0].numParticipants
        } else {
          this.ExperimentalParticipants = this.groups[0].numParticipants
        }
      }

      if (this.NumGroups == 2) {
        for (let i = 0; i < this.groups.length; i++) {
          if (this.groups[i].group_type.name == "Control") {
            this.ControlParticipants = this.groups[i].numParticipants
          }
          else if (this.groups[i].group_type.name == "Experimental") {
            this.ExperimentalParticipants = this.groups[i].numParticipants
          }
        }
      }




      this.data = {
        labels: [this.translateService.instant("CONTROL_PARTICIPANTS"), this.translateService.instant("EXPERIMENTAL_PARTICIPANTS")],
        datasets: [
          {
            data: [this.ControlParticipants, this.ExperimentalParticipants],
            backgroundColor: [
              "#66BB6A",
              "#FFA726"
            ],
            hoverBackgroundColor: [
              "#81C784",
              "#FFB74D"
            ]
          }
        ]
      };
    })
  }

  getNumExperimenters() {
    this.experimenterService.get({ experiment: this.experiment_id }).subscribe((data: any) => {
      this.Numexperimenters = data.response.length
    })
  }

  getNumTasks() {
    this.taskService.get({
      experiment: this.experiment_id,
      ___populate: "task_type"
    }).subscribe((data: any) => {
      this.tasks = data.response
      this.NumTasks = this.tasks.length

      this.CountTaskWithArtifacts(this.tasks)
      this.CountTypeTasks(this.tasks)


      this.dataTasks = {

        labels: [this.translateService.instant("WORD_WITH_ARTIFACTS"),
        this.translateService.instant("WORD_WITHOUT_ARTIFACTS")],
        datasets: [
          {
            data: [this.numTaskArtifact, this.numTaskWithoutArtifact],
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
            ],
            hoverBackgroundColor: [
              "#FF6384",
              "#36A2EB",
            ]
          }
        ]
      };

      this.dataTasksTypes = {

        labels: [this.translateService.instant("WORD_PREPARATION"),
        this.translateService.instant("WORD_ANALYSIS"),
        this.translateService.instant("WORD_EXPERIMENTAL")],
        datasets: [
          {
            data: [this.numPreparationTasks, this.numAnalysisTasks,
            this.numExperimentalTasks],
            backgroundColor: [
              "#66BB6A",
              "#36A2EB",
              "#FFCE56"
            ],
            hoverBackgroundColor: [
              "#66BB6A",
              "#36A2EB",
              "#FFCE56"
            ]
          }
        ]
      };

    })


  }

  CountTaskWithArtifacts(tasks: any) {
    let resp = 0
    let noArtifact = 0
    for (let index = 0; index < tasks.length; index++) {

      if (tasks[index].needsArtifact == true) {
        resp += 1
      } else {
        noArtifact += 1
      }
    }
    this.numTaskArtifact = resp
    this.numTaskWithoutArtifact = noArtifact
  }

  CountTypeTasks(tasks: any) {
    let resp = 0
    let experimentalTasks = 0
    let analysisTasks = 0
    for (let index = 0; index < tasks.length; index++) {

      if (tasks[index].task_type.name == "Preparación") {
        resp += 1
      }
      else if (tasks[index].task_type.name == "Experimental") {
        experimentalTasks += 1
      } else {
        analysisTasks += 1
      }
    }
    this.numPreparationTasks = resp
    this.numAnalysisTasks = analysisTasks
    this.numExperimentalTasks = experimentalTasks
  }




  getArtifacts() {
    this.artifactService.get({
      experiment: this.experiment_id,
      ___populate: "artifact_class"
    }).subscribe((data: any) => {
      this.artifacts = data.response
      this.NumArtifacts = this.artifacts.length

      this.counArtifactClass(this.artifacts)
      this.counArtifactTask(this.artifacts)

      this.dataArtifactClass = {
        labels: [this.translateService.instant("ARTIFACT_OUTPUT_CLASS"),
        this.translateService.instant("ARTIFACT_INPUT_CLASS")],
        datasets: [
          {
            label: this.translateService.instant("ARTIFACT_INPUT_CLASS"),
            backgroundColor: '#42A5F5',
            data: [0, this.InputArtifacts]
          },
          {
            label: this.translateService.instant("ARTIFACT_OUTPUT_CLASS"),
            backgroundColor: '#FFA726',
            data: [this.OutputArtifacts]
          }
        ]
      };

      this.dataArtifactTasks = {
        labels: [this.translateService.instant("WORD_WITHOUT_TASK"),
        this.translateService.instant("WORD_WITH_TASK")],
        datasets: [
          {
            label: this.translateService.instant("WORD_WITH_TASK"),
            backgroundColor: '#FFCE56',
            data: [0, this.numArtifactsTasks],
          },
          {
            label: this.translateService.instant("WORD_WITHOUT_TASK"),
            backgroundColor: '#66BB6A',
            data: [this.numArtifactWihoutTasks]
          }
        ],

      };
    })
  }


  counArtifactTask(artifacts: any) {

    let withTasks = 0
    let withoutTasks = 0

    for (let index = 0; index < artifacts.length; index++) {
      if (artifacts[index].task != null) {
        withTasks += 1
      } else {
        withoutTasks += 1
      }
    }

    this.numArtifactsTasks = withTasks
    this.numArtifactWihoutTasks = withoutTasks

  }


  counArtifactClass(artifacts: any) {

    let withTasks = 0
    let withoutTasks = 0

    for (let index = 0; index < artifacts.length; index++) {
      if (artifacts[index].artifact_class.name == "Entrada") {
        withTasks += 1
      } else {
        withoutTasks += 1
      }
    }

    this.InputArtifacts = withTasks
    this.OutputArtifacts = withoutTasks

  }







}
