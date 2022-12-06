import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenStorageService } from './token-storage.service';
import { EnvService } from './env.service';

const MAIN_CATEGORIES_URI = 'main-categories';

@Injectable({
  providedIn: 'root'
})
export class MainCategoryService {

  constructor(
    private http: HttpClient,
    private env: EnvService,
    private tokenStorage: TokenStorageService,
  ) { }

  getAll(): Observable<any> {
    return this.http.get(`${this.env.API_URL + MAIN_CATEGORIES_URI}`, { headers: this.tokenStorage.getHeader() });
  }
}
