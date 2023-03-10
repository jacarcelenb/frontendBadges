import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { EnvService } from './env.service';

@Injectable({
  providedIn: 'root',
})
export class ParticipantService {
  constructor(
    private http: HttpClient,
    private env: EnvService,
    private translateService: TranslateService,
  ) {}
  private getHeaders() {
    return { 'app-language': this.translateService.currentLang };
  }
  get(params): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL + 'participants', { headers, params });
  }
  update(params, data): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put(this.env.API_URL + 'participants', data, { headers, params });
  }
  remove(params): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(this.env.API_URL + 'participants', { headers, params });
  }
  create(data): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(this.env.API_URL + 'participants', data);
  }

  addParticipantsToGroup(group_id, experiment_id, participants_count = 1): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(this.env.API_URL + 'addParticipantsToGroup/' + group_id,
      { participants_count, experiment_id },
      { headers }
    );
  }
}
