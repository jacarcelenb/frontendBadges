import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenStorageService } from './token-storage.service';
import { EnvService } from './env.service';
import { Category } from '../models/category.model';
import { BehaviorSubject } from "rxjs";

const SHOPS_URI = 'shops';
const CATEGORIES = 'categories';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  categoryIdSource = new  BehaviorSubject<number>(0);

  constructor(
    private http: HttpClient,
    private env: EnvService,
    private tokenStorage: TokenStorageService,
  ) { }

  isAdmin() {
    var dat = this.tokenStorage.getUser();

    dat.user.roles.forEach(element => {

    });
  }

  getAll(id): Observable<any> {
    return this.http.get(`${this.env.API_URL + SHOPS_URI}/${id}/${CATEGORIES}`, { headers: this.tokenStorage.getHeader() });
  }

  get(id): Observable<any> {
    return this.http.get(`${this.env.API_URL + CATEGORIES}/${id}`, { headers: this.tokenStorage.getHeader() });
  }

  create(data): Observable<any> {
    return this.http.post(`${this.env.API_URL + CATEGORIES}`, data, { headers: this.tokenStorage.getHeader() });
  }

  update(id, data): Observable<any> {
    return this.http.put(`${this.env.API_URL + CATEGORIES}/${id}`, data, { headers: this.tokenStorage.getHeader() });
  }

  delete(id): Observable<any> {
    return this.http.delete(`${SHOPS_URI}/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(SHOPS_URI);
  }

  findByTitle(title): Observable<any> {
    return this.http.get(`${SHOPS_URI}?title=${title}`);
  }

  changeCategoryId(categoyId: number){
    this.categoryIdSource.next(categoyId);
}
}
