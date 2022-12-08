import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvService {

  // API_URL = 'https://ecommerce-backend-encuba.herokuapp.com/api/';
  API_URL = 'https://backendbadges-production.up.railway.app/api/';
  API_URL_NODE = 'https://backendbadges-production.up.railway.app/api/';
  ASSETS_URL = ' /assets/';
  USER_TOKEN = 'user-token';
  AUTH_USER = 'auth-user';

  constructor() { }
}
