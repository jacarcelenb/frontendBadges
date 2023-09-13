import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-change-newpassword',
  templateUrl: './change-newpassword.component.html',
  styleUrls: ['./change-newpassword.component.scss']
})
export class ChangeNewpasswordComponent implements OnInit {
  Form: FormGroup;
  token: any;
  // passwordField
@ViewChild('passwordField') passwordField: ElementRef;

//passwordIcon
@ViewChild('passwordIcon') passwordIcon: ElementRef;

@ViewChild('passwordField2') passwordField2: ElementRef;

//passwordIcon
@ViewChild('passwordIcon2') passwordIcon2: ElementRef;
type: string = 'SHOW_PASSWORD';
type1: string = 'SHOW_PASSWORD';
  constructor(private actRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService,
    private TranslateService:TranslateService) { }

  ngOnInit(): void {
    this.token = this.actRoute.snapshot.params.id;
    this.initForm();
  }
  initForm() {
    this.Form = this.formBuilder.group({
      password: ['', [Validators.required]],
      newpassword: ['', [Validators.required]],
    });

    this.Form?.get('password').valueChanges.subscribe((password) => {
      if (this.validatePasswords(password))
        return this.Form?.get('password').setErrors(null);
      this.Form?.get('password').setErrors({ invalid: true });
    });

    this.Form?.get('newpassword').valueChanges.subscribe((password) => {
      if (this.validatePasswords(password))
        return this.Form?.get('newpassword').setErrors(null);
      this.Form?.get('newpassword').setErrors({ invalid: true });
    });
  }

  ChangePassword(){

  }

  viewPassword() {
    if (this.passwordField.nativeElement.type == "password") {
      this.passwordField.nativeElement.type = "text";
      this.passwordIcon.nativeElement.className = 'fa fa-eye-slash';
      this.type = 'HIDE_PASSWORD'
    } else {
      this.passwordField.nativeElement.type = "password";
      this.passwordIcon.nativeElement.className = 'fa fa-eye';
      this.type = 'SHOW_PASSWORD'
    }
  }

  viewPasswordTwo() {
    if (this.passwordField2.nativeElement.type == "password") {
      this.passwordField2.nativeElement.type = "text";
      this.passwordIcon2.nativeElement.className = 'fa fa-eye-slash';
      this.type1 = 'HIDE_PASSWORD'
    } else {
      this.passwordField2.nativeElement.type = "password";
      this.passwordIcon2.nativeElement.className = 'fa fa-eye';
      this.type1 = 'SHOW_PASSWORD'
    }
  }

  validatePasswords(password: string) {
    var expr: RegExp = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,}$/g;
    var verification = expr.test(password);
    return verification;
  }


}
