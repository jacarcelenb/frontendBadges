import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { EnvService } from './env.service';
import { TokenStorageService } from './token-storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = false;
  token: any;

  constructor(
    private http: HttpClient,
    private env: EnvService,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) { }
  login(email: String, password: String) {
    return this.http.post(
      this.env.API_URL_NODE + 'auth/login',
      { email, password },
      { observe: 'response' }
    ).pipe(
      tap(
        (data) => {
          const token = data.body['response'].token;
          const user = data.body['response'].user;
          this.tokenStorage.saveToken(token);
          this.tokenStorage.saveUser(user);
          this.tokenStorage.getUser();
          this.token = user;
          this.isLoggedIn = true;
          return data;
        }
      )
    );
  }

  logout() {
    this.tokenStorage.deleteToken();
    const headers = new HttpHeaders({
      Authorization: 'Bearer' + ' ' + this.tokenStorage.getToken(),
    });
    return this.http
      .get(this.env.API_URL + 'logout', { headers: headers })
      .pipe(
        tap((data) => {
          this.tokenStorage.deleteToken();
          this.isLoggedIn = false;
        })
      );
  }
  redirectToLogin() {
    this.logout();
    this.router.navigate(['home']);
  }

  register(user: any) {
    return this.http
      .post(this.env.API_URL + 'register', user)
      .pipe(
        tap(
          (data) => {

            this.tokenStorage.saveToken(data['access_token']);
            this.tokenStorage.saveUser(data);
            this.tokenStorage.getUser();
            this.token = data;
            this.isLoggedIn = true;
            return data;
          },
          (error) => {

            return error;
          }
        )
      );
  }

  forgotPassword(email: String) {
    return this.http.post(
      this.env.API_URL_NODE + 'auth/forgotpassword',
      { email }
    )

  }

  changePassword(password: String, token: String) {
    return this.http.post(
      this.env.API_URL_NODE + 'auth/changenewpassword',
      { password, token }
    )
  }


  validateExperimentOwner(user: any, experiment_id: string): boolean {
    let experimenterOwner = false;
    console.log(user)
    console.log(experiment_id)
    if (user.experiment == experiment_id) {
      experimenterOwner = true;
    }

    return experimenterOwner
  }
}
