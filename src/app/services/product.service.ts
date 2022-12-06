import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenStorageService } from './token-storage.service';
import { EnvService } from './env.service';
import { Product } from '../models/product.model';

const CATEGORIES_URI = 'categories';
const PRODUCTS = 'products';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private http: HttpClient,
    private env: EnvService,
    private tokenStorage: TokenStorageService,
  ) { }

  getAll(id): Observable<any> {
    return this.http.get(`${this.env.API_URL + CATEGORIES_URI}/${id}/${PRODUCTS}`, { headers: this.tokenStorage.getHeader() });
  }

  get(id): Observable<any> {
    return this.http.get(`${this.env.API_URL + PRODUCTS}/${id}`, { headers: this.tokenStorage.getHeader() });
  }

  create(data): Observable<any> {
    return this.http.post(`${this.env.API_URL + PRODUCTS}`, data, { headers: this.tokenStorage.getHeader() });
  }

  update(id, data): Observable<any> {
    return this.http.put(`${this.env.API_URL + PRODUCTS}/${id}`, data, { headers: this.tokenStorage.getHeader() });
  }

  findByTitle(title): Observable<any> {
    return this.http.get(`${CATEGORIES_URI}?title=${title}`);
  }
}
