import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { EnvService } from './env.service';
import { TokenStorageService } from './token-storage.service';
import { Router } from '@angular/router';
import { AuthApiError, Session, SignUpWithPasswordCredentials, SupabaseClient, User, createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
type SupabaseResponse = User | Session | AuthApiError | null;
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = false;
  token: any;

  private supabaseClient: SupabaseClient


  constructor(
    private http: HttpClient,
    private env: EnvService,
    private tokenStorage: TokenStorageService,
    private router: Router,

  ) {
    this.supabaseClient = createClient(environment.supabase.url, environment.supabase.publicKey)
  }
  login(email: String, password: String) {
    this.tokenStorage.deleteToken();
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

  validateEmail(email: String) {
    ///auth/verifyEmail
    return this.http.post(
      this.env.API_URL_NODE + 'auth/verifyEmail',
      { email }
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

  async signUp(credentials: SignUpWithPasswordCredentials): Promise<SupabaseResponse> {

    try {
      const { error, ...rest } = await this.supabaseClient.auth.signUp(credentials)
      const user = rest.data.user
      return user
    } catch (error) {
      console.log(error)
      return error as AuthApiError
    }
  }




  async sendEmail(email:string): Promise<SupabaseResponse> {

    try {
      const { error, ...rest } = await this.supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: "https://badge-go-project.netlify.app/changepassword"
      })
    } catch (error) {
      console.log(error)
      return error
    }
  }
}
