import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { EnvService } from './env.service';

@Injectable({
  providedIn: 'root',
})
export class BadgeService {
  constructor(
    private http: HttpClient,
    private env: EnvService,
    private translateService: TranslateService,
  ) {}
  private getHeaders() {
    return { 'app-language': this.translateService.currentLang };
  }
  get({}): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL_NODE + 'badges');
  }

  getBadges(params = {}): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL_NODE + 'badges', { params});
  }
  getStandards(params = {}): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL_NODE + 'standards', { params});
  }
  getStandardsTypes(params = {}): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL_NODE + 'standards_types', { params});
  }



}
