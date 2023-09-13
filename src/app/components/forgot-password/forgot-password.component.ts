import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { error } from 'console';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  Form: FormGroup;
  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService,
    private TranslateService: TranslateService) { }

  ngOnInit(): void {
    this.initForm();
  }
  initForm() {
    this.Form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ForgotPassword() {
    this.authService.sendResetPasswordEmail(this.Form.value.email).then( (data) =>{

      this.alertService.presentSuccessAlert(this.TranslateService.instant("CHECK_YOUR_EMAIL"))
    }

    ).catch(
       (error) => console.log(error))
  }

}
