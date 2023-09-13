import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { EnvService } from './env.service';
import { TokenStorageService } from './token-storage.service';
import { Router } from '@angular/router';
import { AngularFireAuth} from '@angular/fire/auth';


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
    private router: Router,
    private afAuth: AngularFireAuth,

  ) {

  }
  login(email: String) {
    this.tokenStorage.deleteToken();
    return this.http.post(
      this.env.API_URL_NODE + 'auth/login',
      { email},
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

  validateEmail(email: String) {
    ///auth/verifyEmail
    return this.http.post(
      this.env.API_URL_NODE + 'auth/verifyEmail',
      { email }
    )
  }


  validateExperimentOwner(user: any, experiment_id: string): boolean {
    let experimenterOwner = false;
    if (user.experiment == experiment_id) {
      experimenterOwner = true;
    }

    return experimenterOwner
  }


  registerAuth({ email, password }: any) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
  }

   loginAuth({ email, password }: any) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
  }

  sendResetPasswordEmail(email: string) {
   return this.afAuth.sendPasswordResetEmail(email);
  }
  updateUserFirebase(user){
    return this.http.post(this.env.API_URL_NODE+'/auth/UpdateEmail',user)
  }
}
