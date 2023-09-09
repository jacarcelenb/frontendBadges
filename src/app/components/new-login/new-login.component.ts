import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-login',
  templateUrl: './new-login.component.html',
  styleUrls: ['./new-login.component.scss']
})
export class NewLoginComponent implements OnInit {
  loginForm: FormGroup;
  datosCorrectos: boolean = true;
  textoError: string = '';
  password: string = '';

  @ViewChild('passwordField2') passwordField2: ElementRef;

  //passwordIcon
  @ViewChild('passwordIcon2') passwordIcon2: ElementRef;
  type: string = 'SHOW_PASSWORD';
  type1: string = 'SHOW_PASSWORD';
  constructor(private formBuilder: FormBuilder,
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
     .login(this.loginForm.value.email)
     .subscribe(
       (data: any) => {
        this.authService.loginAuth({email:this.loginForm.value.email , password:this.loginForm.value.password})
        .then((data) => {
          if (data.user.email === this.loginForm.value.email) {
            this.router.navigate(['experiment/step']);
            this.initForm();
          }
        })


       });



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


}
