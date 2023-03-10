import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { EnvService } from './env.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(
    private http: HttpClient,
    private env: EnvService,
    private translateService: TranslateService,
  ) {}
  private getHeaders() {
    return { 'app-language': this.translateService.currentLang };
  }
  getTypes(params = {}): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL_NODE + 'task_types', { params});
  }
  get(params = {}): Observable<any> {
    return this.http.get(this.env.API_URL_NODE + 'tasks', { params});
  }
  getNumtasks(params = {}): Observable<any>{
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL_NODE + 'total_task', { params});
  }
  getNumArtifacttasks(params = {}): Observable<any>{
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL_NODE + 'num_task_artifact', { params});
  }
  getWithArtifacts(params = {}): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL_NODE + 'tasks_attached_artifacts', { params});
  }
  create(task = {}): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(this.env.API_URL_NODE + 'tasks', task);
  }
  update(_id = null, task = {}) {
    const headers = this.getHeaders();
    return this.http.put(this.env.API_URL_NODE + 'tasks', task, {
      params: { _id }
    });
  }
  delete(_id = null): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(this.env.API_URL_NODE + 'tasks', {
      params: { _id }
    });
  }

  deletetTaskWihoutArtifacts(_id = null): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(this.env.API_URL_NODE + 'tasks_without_artifacts', {
      params: { _id }
    });
  }

  getTaskByExperimentId(experimentId: number, params): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(
      this.env.API_URL + 'tasksByExperimentId/' + experimentId,
      { params},
    );
  }
  getTaskByExperimentIdWithArtifacts(experimentId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(
      this.env.API_URL + 'tasksByExperimentIdWithArtifacts/' + experimentId,
      { headers },
    );
  }
  deleteTaskById(task_id: number) {
    const headers = this.getHeaders();
    return this.http.delete(this.env.API_URL + 'tasks/' + task_id);
  }
  getTaskById(task_id: number, params) {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL + 'tasks/' + task_id, {
      params
    });
  }
  createTask(task) {
    const headers = this.getHeaders();
    return this.http.post(this.env.API_URL + 'tasks', task);
  }
}
