import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { EnvService } from './env.service';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  constructor(
    private http: HttpClient,
    private env: EnvService,
    private translateService: TranslateService,
  ) {}
  private getHeaders() {
    return { 'app-language': this.translateService.currentLang };
  }
  count(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL + 'groups_count', { headers });
  }
  get(params: Record<string, any>): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL + 'groups', { headers, params });
  }
  create(data): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(this.env.API_URL + 'groups', data, { headers });
  }
  update(_id = null, task = {}) {
    const headers = this.getHeaders();
    return this.http.put(this.env.API_URL_NODE + 'groups', task, {
      headers,
      params: { _id },
    });
  }
  delete(_id = null): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(this.env.API_URL_NODE + 'groups', {
      headers,
      params: { _id },
    });
  }
  
  getTypes(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL + 'group_types', { headers });
  }

  getGroupTypes(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL + 'groupTypes', { headers });
  }
  createGroup(data): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(this.env.API_URL + 'groups', data, { headers });
  }
  getGroupById(groupId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL + 'groups/' + groupId, { headers });
  }
  getGroupsByExperimentId(experimentId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(
      this.env.API_URL + 'groupsByExperimentId/' + experimentId,
      { headers },
    );
  }
}
