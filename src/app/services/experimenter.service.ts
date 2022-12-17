import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { EnvService } from './env.service';

@Injectable({
  providedIn: 'root',
})
export class ExperimenterService {
  constructor(
    private http: HttpClient,
    private env: EnvService,
    private translateService: TranslateService,
  ) {}
  public getHeaders() {
    return { 'app-language': this.translateService.currentLang };
  }
  get(params = {}): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL_NODE + 'experimenters', {
      params,
      headers,
    });
  }

  count(params = {}): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL_NODE + 'count_experiments', {
      params, headers,
    });
  }
  create(experimenter = {}): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(this.env.API_URL_NODE + 'experimenters', experimenter, { headers });
  }
  getRoles(params = {}): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL_NODE + 'experimenter_roles', {
      params,
      headers,
    });
  }
  getUsers(params = {}): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL_NODE + 'users', {
      params,
      headers,
    });
  }
  getUserProfiles(params = {}): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL_NODE + 'user_profiles', {
      params,
      headers,
    });
  }

  registerExperimenter(experimenter, {
    comment,
    afiliation,
    experiment_id,
    experimenter_roles_id,
  }) {
    const headers = this.getHeaders();
    return this.http.post(this.env.API_URL + 'registerExperimenter', {
      experimenter,
      comment,
      afiliation,
      experiment_id,
      experimenter_roles_id,
    }, { headers });
  }
  addExperimenter(user_id: number, experiment_id: number, experimenter_roles_id: number[]) {
    const headers = this.getHeaders();
    return this.http.post(this.env.API_URL + 'addExperimenter', {
      user_id,
      experiment_id,
      experimenter_roles_id,
    }, { headers });
  }

  update(_id = null, task = {}) {
    const headers = this.getHeaders();
    return this.http.put(this.env.API_URL_NODE + 'experimenters', task, {
      headers,
      params: { _id },
    });
  }

  delete(_id = null): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(this.env.API_URL_NODE + 'experimenters', {
      headers,
      params: { _id },
    });
  }

  deleteUser(_id = null): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(this.env.API_URL_NODE + 'users', {
      headers,
      params: { _id },
    });
  }

  updateUser(_id = null, user = {}) {
    const headers = this.getHeaders();
    return this.http.put(this.env.API_URL_NODE + 'users', user, {
      headers,
      params: { _id },
    });
  }
}
