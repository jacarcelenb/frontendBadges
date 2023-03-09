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
    console.log({ 'app-language': this.translateService.currentLang })
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
      params, headers,
    });
  }
  create(artifact = {}) {
    const headers = this.getHeaders();
    return this.http.post(this.env.API_URL_NODE + 'artifacts', artifact, { headers });
  }
  delete(_id = null) {
    const headers = this.getHeaders();
    return this.http.delete(this.env.API_URL_NODE + 'artifacts', { params: {_id}, headers });
  }
  update(_id = null, artifact = {}) {
    const headers = this.getHeaders();
    return this.http.put(this.env.API_URL_NODE + 'artifacts', artifact, {
      headers,
      params: { _id },
    });
  }

  getClasses(params = {}): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL_NODE + 'artifact_classes', { params, headers });
  }
  getTypes(params = {}): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL_NODE + 'artifact_types', { params, headers });
  }
  getPurposesByName( params = {} ): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL_NODE + 'artifact_purposes', { params,headers });
  }
  getPurposes(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL_NODE + 'artifact_purposes', { headers });
  }

  //artifact_acm
  getACM(params = {}): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL_NODE + 'artifact_acm', { params,headers });
  }

  deleteArtifactById(id) {
    const headers = this.getHeaders();
    return this.http.delete(this.env.API_URL + 'artifacts/' + id, { headers });
  }
  getArtifactById(artifact_id) {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL + 'artifactById/' + artifact_id, { headers });
  }
  getArtifactsByTaskId(taskId: number, params): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL + 'artifactsByTaskId/' + taskId, {
      params, headers,
    });
  }
  getArtifacTypes() {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL + 'artifactTypes', { headers });
  }
  createArtifact(artifact) {
    const headers = this.getHeaders();
    return this.http.post(this.env.API_URL + 'artifacts', artifact, { headers });
  }
  createArtifactWithoutTask(artifact) {
    const headers = this.getHeaders();
    return this.http.post(this.env.API_URL + 'artifactsWithoutTask', artifact, { headers });
  }
  createFlexibleArtifact(artifact) {
    const headers = this.getHeaders();
    return this.http.post(this.env.API_URL + 'flexibleArtifact', artifact, { headers });
  }
  updateArtifact(artifact_id, artifact) {
    const headers = this.getHeaders();
    return this.http.put(this.env.API_URL + 'artifacts/' + artifact_id, artifact, { headers });
  }
}
