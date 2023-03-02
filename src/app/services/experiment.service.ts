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
    const headers = this.getHeaders();
    console.log(headers)
    console.log(params)
    return this.http.get(this.env.API_URL_NODE + 'experiments'
    );
  }
  count(params): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL_NODE + 'count_experiments', {
      params, headers,
    });
  }
  create(data: CreateExperimentDto): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(this.env.API_URL_NODE + 'experiments', data, { headers });
  }
  update(_id = null, experiment = {}) {
    const headers = this.getHeaders();
    return this.http.put(this.env.API_URL_NODE + 'experiments', experiment, {
      headers,
      params: { _id },
    });
  }

  delete(_id = null): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(this.env.API_URL_NODE + 'experiments', {
      headers,
      params: { _id },
    });
  }
}
