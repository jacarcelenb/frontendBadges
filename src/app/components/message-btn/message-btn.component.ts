import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from 'src/app/services/alert.service';
import { TaskService } from 'src/app/services/task.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-message-btn',
  templateUrl: './message-btn.component.html',
  styleUrls: ['./message-btn.component.scss']
})
export class MessageBtnComponent implements OnInit {

  constructor(private _taskService: TaskService,
    private _alertService: AlertService,
    private tokenStorageService: TokenStorageService,
    private _translateService: TranslateService,) { }
  noMessages: boolean = false;
  tasks = [];
  ExperimentId: string = null;
  displayBasic: boolean;
  ngOnInit(): void {
    this.ExperimentId = this.tokenStorageService.getIdExperiment();
    if (this.ExperimentId != null) {
      this.getTasks()

    }
  }

  getTasks() {
    this._taskService.getWithArtifacts({
      experiment: this.ExperimentId
    }).subscribe(data => {
      this.tasks = data.response
      this.CheckTask_Artifacts();
    })
  }

  CheckTask_Artifacts() {
    for (let index = 0; index < this.tasks.length; index++) {
      if (this.tasks[index].needsArtifact && this.tasks[index].artifacts.length == 0) {
        this.noMessages = true;
      }
    }
  }

  showBasicDialog() {
    this.displayBasic = true;
}

}
