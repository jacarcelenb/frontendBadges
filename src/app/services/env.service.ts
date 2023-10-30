import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvService {

  API_URL = 'https://backendbadgego.onrender.com/api/';
  // API_URL = 'http://localhost:4000/api/';
  API_URL_NODE = this.API_URL;
  ASSETS_URL = ' /assets/';
  USER_TOKEN = 'user-token';
  AUTH_USER = 'auth-user';

  constructor() { }
}
