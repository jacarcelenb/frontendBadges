import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { EnvService } from './env.service';



@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor(private env: EnvService) { }

  public saveToken(token: string): void {
    localStorage.removeItem(this.env.USER_TOKEN);
    localStorage.setItem(this.env.USER_TOKEN, token);
  }

  saveLanguage(language: string): void {
     localStorage.setItem("language", language);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.env.USER_TOKEN);
  }

  public deleteToken(): void {
    localStorage.removeItem(this.env.AUTH_USER);
    localStorage.removeItem(this.env.USER_TOKEN);
    localStorage.removeItem("language")
  }

  public saveUser(user: any): void {
    localStorage.removeItem(this.env.AUTH_USER);
    localStorage.setItem(this.env.AUTH_USER, JSON.stringify(user));
  }

  public getUser(): any {
    const user = localStorage.getItem(this.env.AUTH_USER);
    if (user) {
      return JSON.parse(user);
    }

    return null;
  }

  public getHeader() {
    var auth_token = this.getToken();
    var headers_object = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });

    const httpOptions = {
      headers: headers_object
    };

    return headers_object;
  }



}
