import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { EnvService } from './env.service';

@Injectable({
  providedIn: 'root',
})
export class ArtifactService {
  constructor(
    private http: HttpClient,
    private env: EnvService,
    private translateService: TranslateService,
  ) {}
  getHeaders() {
    return { 'app-language': this.translateService.currentLang };
  }
  get(params = {}): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL_NODE + 'artifacts', {
      params
    });
  }
  count(params = {}): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL_NODE + 'artifacts_count', {
      params
    });
  }
  create(artifact = {}) {
    const headers = this.getHeaders();
    return this.http.post(this.env.API_URL_NODE + 'artifacts', artifact);
  }
  delete(_id = null) {
    const headers = this.getHeaders();
    return this.http.delete(this.env.API_URL_NODE + 'artifacts', { params: {_id} });
  }
  update(_id = null, artifact = {}) {
    const headers = this.getHeaders();
    return this.http.put(this.env.API_URL_NODE + 'artifacts', artifact, {
      params: { _id }
    });
  }

  getClasses(params = {}): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL_NODE + 'artifact_classes', { params});
  }
  getTypes(params = {}): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL_NODE + 'artifact_types', { params});
  }
  getPurposesByName( params = {} ): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL_NODE + 'artifact_purposes', { params});
  }
  getPurposes(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL_NODE + 'artifact_purposes');
  }

  //artifact_acm
  getACM(params = {}): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL_NODE + 'artifact_acm', { params});
  }

  deleteArtifactById(id) {
    const headers = this.getHeaders();
    return this.http.delete(this.env.API_URL + 'artifacts/' + id);
  }
  getArtifactById(artifact_id) {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL + 'artifactById/' + artifact_id);
  }
  getArtifactsByTaskId(taskId: number, params): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL + 'artifactsByTaskId/' + taskId, {
      params, headers,
    });
  }
  getArtifacTypes() {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL + 'artifactTypes');
  }
  createArtifact(artifact) {
    const headers = this.getHeaders();
    return this.http.post(this.env.API_URL + 'artifacts', artifact);
  }
  createArtifactWithoutTask(artifact) {
    const headers = this.getHeaders();
    return this.http.post(this.env.API_URL + 'artifactsWithoutTask', artifact);
  }
  createFlexibleArtifact(artifact) {
    const headers = this.getHeaders();
    return this.http.post(this.env.API_URL + 'flexibleArtifact', artifact);
  }
  updateArtifact(artifact_id, artifact) {
    const headers = this.getHeaders();
    return this.http.put(this.env.API_URL + 'artifacts/' + artifact_id, artifact);
  }
}
