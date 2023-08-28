import { CreateExperimentDto } from 'src/app/models/Input/CreateExperimentDto';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from './env.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class ExperimentService {
  constructor(
    private http: HttpClient,
    private env: EnvService,
    private translateService: TranslateService,
  ) { }
  private getHeaders() {
    return { 'app-language': this.translateService?.currentLang };
  }
  get(params = {}): Observable<any> {
    return this.http.get(this.env.API_URL_NODE + 'allexperiments',
      { params });
  }
  getExperimentsUser(params = {}): Observable<any> {
    return this.http.get(this.env.API_URL_NODE + 'experiments',
      { params });
  }
  count(params): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL_NODE + 'count_experiments', {
      params, headers,
    });
  }
  create(data: CreateExperimentDto): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(this.env.API_URL_NODE + 'experiments', data);
  }
  update(_id = null, experiment = {}) {
    const headers = this.getHeaders();
    return this.http.put(this.env.API_URL_NODE + 'experiments', experiment, {
      params: { _id },
    });
  }

  delete(_id = null): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(this.env.API_URL_NODE + 'experiments', {
      params: { _id },
    });
  }
}
