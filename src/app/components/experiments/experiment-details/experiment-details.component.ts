import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ExperimentsListDto } from 'src/app/models/dto/ExperimentsListDto';
import { ExperimentService } from 'src/app/services/experiment.service';
import * as JSZip from 'jszip';
import * as JSZipUtils from '../../../../assets/script/jszip-utils.js';
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

}

}
