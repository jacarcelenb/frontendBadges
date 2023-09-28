import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { EnvService } from './env.service';

@Injectable({
  providedIn: 'root',
})
export class SelectedBadgeService {
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
    return this.http.get(this.env.API_URL_NODE + 'select_standard', {
      params
    });
  }

  create(standard = {}) {
    const headers = this.getHeaders();
    return this.http.post(this.env.API_URL_NODE + 'select_standard', standard);
  }

  update(_id = null, standard = {}) {
    const headers = this.getHeaders();
    return this.http.put(this.env.API_URL_NODE + 'update_select_standard', standard, {
      params: { _id }
    });
  }

}
