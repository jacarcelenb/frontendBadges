import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-new-login',
  templateUrl: './new-login.component.html',
  styleUrls: ['./new-login.component.scss']
})
export class NewLoginComponent implements OnInit {
  loginForm: FormGroup;
  datosCorrectos: boolean = true;
  textoError: string = '';
  constructor(  private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService) { }

    ngOnInit(): void {
      this.initForm();
    }
    initForm() {
      this.loginForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
      });
    }

    onSubmit() {
      /**
       * present loading while waiting response from api auth
       */

      this.authService
        .login(this.loginForm.value.email, this.loginForm.value.password)
        .subscribe(
          () => {
            /**
             * dismiss loading when operation is complete
             */
            this.initForm();
            this.router.navigate(['experiment/step']);
          }
        );
    }

}
