import { HttpClient, } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from './env.service';
import type { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  constructor(private http: HttpClient, private env: EnvService) {}
  getCountries(): Observable<Record<string, any>> {
    return this.http.get(
      this.env.ASSETS_URL + 'json/countries-data-store.json'
    );
  }

	getCountriesStates(): Observable<Record<string, any>> {
    return this.http.get(
      this.env.ASSETS_URL + 'json/countries-states-data-store.json'
    );
  }
}
