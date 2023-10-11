import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { EnvService } from './env.service';

@Injectable({
  providedIn: 'root'
})
export class LabpackService {

  constructor(
    private http: HttpClient,
    private env: EnvService,
    private translateService: TranslateService,
  ) { }

  private getHeaders() {
    return { 'app-language': this.translateService.currentLang };
  }

  get(params = {}): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL_NODE + 'labpack', { params});
  }

  getPackageType(params = {}): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL_NODE + 'package_type', { params});
  }

  getArtifactsOrder(params = {}): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL_NODE + 'artifact_order', { params});
  }

  getRepositoryType(params = {}): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL_NODE + 'repository', { params});
  }


  create(labpack = {}): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(this.env.API_URL_NODE + 'labpack', labpack);
  }

  update(_id = null, labpack = {}) {
    const headers = this.getHeaders();
    return this.http.put(this.env.API_URL_NODE + 'labpack', labpack, {
      params: { _id }
    });
  }

  updateRepo(labpack) {
    return this.http.post(this.env.API_URL_NODE + 'updateRepo',
      labpack
    );
  }

  validateToken(params:any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL_NODE + 'labpackTest?token='+params);
  }


  createRespositorio(labpack:any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(this.env.API_URL_NODE + 'labpackCreateRepo', labpack);
  }

  uploadPackage(labpack:any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(this.env.API_URL_NODE + 'labpackUpload', labpack);
  }

   PublishRepo(labpack:any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(this.env.API_URL_NODE + 'labpackPublishRepo', labpack);
  }
}
