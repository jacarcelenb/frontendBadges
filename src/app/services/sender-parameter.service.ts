import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
@Injectable({
  providedIn: 'root'
})
export class SenderParameterService {
  name_standard_inventor: string
  name_standard_readme: string
  constructor( private http: HttpClient,) { }

  get(url): Observable<any> {
    return this.http.get(url);
  }
}
