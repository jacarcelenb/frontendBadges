import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenStorageService } from './token-storage.service';
import { EnvService } from './env.service';

const SHOPS_URI = 'admin/shops';

const VENDORS_URI = 'admin/vendors';


@Injectable({
  providedIn: 'root'
})
export class ShopService {

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

  getAll(params): Observable<any> {
    // this.isAdmin();
    return this.http.get(this.env.API_URL + SHOPS_URI, { headers: this.tokenStorage.getHeader(), params });
  }

  getVendors(): Observable<any> {
    // this.isAdmin();
    return this.http.get(this.env.API_URL + VENDORS_URI, { headers: this.tokenStorage.getHeader() });
  }

  get(id): Observable<any> {
    return this.http.get(`${this.env.API_URL + SHOPS_URI}/${id}`, { headers: this.tokenStorage.getHeader() });
  }

  create(data): Observable<any> {
    return this.http.post(this.env.API_URL + SHOPS_URI, data, { headers: this.tokenStorage.getHeader() });
  }

  update(id, data): Observable<any> {
    return this.http.put(`${this.env.API_URL + SHOPS_URI}/${id}`, data, { headers: this.tokenStorage.getHeader() });
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
}
