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
    return this.http.get(this.env.API_URL_NODE + 'labpack', { params, headers });
  }

  getPackageType(params = {}): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL_NODE + 'package_type', { params, headers });
  }

  getArtifactsOrder(params = {}): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL_NODE + 'artifact_order', { params, headers });
  }

  getRepositoryType(params = {}): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL_NODE + 'repository', { params, headers });
  }
  

  create(labpack = {}): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(this.env.API_URL_NODE + 'labpack', labpack, {
      headers,
    });
  }

  update(_id = null, labpack = {}) {
    const headers = this.getHeaders();
    return this.http.put(this.env.API_URL_NODE + 'labpack', labpack, {
      headers,
      params: { _id },
    });
  }
}
