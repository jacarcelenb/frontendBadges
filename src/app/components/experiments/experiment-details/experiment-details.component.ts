import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ExperimentsListDto } from 'src/app/models/dto/ExperimentsListDto';
import { ExperimentService } from 'src/app/services/experiment.service';
import * as JSZip from 'jszip';
import * as JSZipUtils from '../../../../assets/script/jszip-utils.js';
import { saveAs } from 'file-saver/dist/FileSaver';
import { TaskService } from '../../../services/task.service';
import { AlertService } from 'src/app/services/alert.service';
import {ExperimentArtifact} from 'src/interfaces/expermients.interfaces';
@Component({
  selector: 'app-experiment-details',
  templateUrl: './experiment-details.component.html',
  styleUrls: ['./experiment-details.component.scss'],
})
export class ExperimentDetailsComponent implements OnInit {
  experiment: ExperimentsListDto = new ExperimentsListDto();
  isGeneratingZip = false;
  steps = [];

  constructor(
    private actRoute: ActivatedRoute,
    private _experimentService: ExperimentService,
    private _taskService: TaskService,
    private _router: Router,
    private _alertService: AlertService
  ) {}
  ngOnInit(): void {
    this.experiment._id = this.actRoute.parent.snapshot.paramMap.get('id');
    if (!this.experiment._id) {
      this.redirectToExperimentList();
    } else {
      this.getExperimentDetails(this.experiment._id);
    }

  }
  saveAs() {
    // this._taskService
    //   .getTaskByExperimentIdWithArtifacts(this.experiment._id)
    //   .subscribe((resp: any) => {
    //     if (!resp.data?.length)
    //       return this._alertService.presentWarningAlert(
    //         "No hay artefactos para este experimento"
    //       );
    //     this.generateZipFile(resp.data);
    //   });
  }

  private getTaskArtifactZipPath(task, artifact) {
    let fileName = 'Paquete Laboratorio/';

    if (task.task_type.name == 'Formación') {
      fileName = fileName + '01 Tareas_Formación/';
    }
    if (task.task_type.name == 'Experimental') {
      fileName = fileName + '02 Tareas_Experimentales/';
    }
    if (task.task_type.name == 'Análisis') {
      fileName = fileName + '03 Tareas_Análisis/';
    }

    let fileNameAux = fileName;
    if (artifact.class == 'Entrada') {
      fileNameAux =
        fileNameAux +
        'Artefactos_entrada/' +
        artifact.purpose.name +
        '/' +
        artifact.artifact_type.name +
        '/';
    }
    if (artifact.class == 'Salida') {
      fileNameAux =
        fileNameAux +
        'Artefactos_salida/' +
        artifact.purpose.name +
        '/' +
        artifact.artifact_type.name +
        '/';
    }

    return fileNameAux + artifact.name + '.' + artifact.file_format;
  }

  private parseTaskArtifacts(tasks) {
    const artifacts: ExperimentArtifact[] = [];

    tasks.forEach((task) => {
      task.artifacts.forEach((artifact) => {
        const artifact_zip_path = this.getTaskArtifactZipPath(
          task,
          artifact
        );

        artifacts.push({
          artifact_url: artifact.url,
          artifact_zip_path
        });
      });
    });

    return artifacts;
  }

  private getBinaryContentFromUrl(url): Promise<any> {
    return new Promise((resolve, reject) => {
      JSZipUtils.getBinaryContent(url, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  }

  async generateZipFile(tasks) {
    try {
      const zipFile: JSZip = new JSZip();

      const artifacts = this.parseTaskArtifacts(tasks);
      this.isGeneratingZip = true;

      const artifactsFiles = await Promise.all(
        artifacts.map(async ({artifact_url, artifact_zip_path}) => {
          const data = await this.getBinaryContentFromUrl(
            artifact_url
          );

          return {
            data,
            artifact_zip_path,
          };
        })
      );

      artifactsFiles.forEach((artifact) => {
        zipFile.file(
          artifact.artifact_zip_path,
          artifact.data,
          {
            binary: true
          }
        );
      });

      const content = await zipFile.generateAsync({ type: 'blob' })
      saveAs(content, 'testRP' + '.zip');
      this.isGeneratingZip = false;
    } catch (error) {
      this.isGeneratingZip = false;
    }
  }
  private redirectToExperimentList() {
    this._router.navigate(['experiments']);
  }
  getExperimentDetails(experiment_id) {
    this._experimentService.get({_id: experiment_id}).subscribe((data: any) => {
      if (data.response.length) {
        this.experiment = data.response[0];
      } else {
        this.redirectToExperimentList();
      }
    });
  }
}
