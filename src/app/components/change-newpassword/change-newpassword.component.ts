import { Component, OnInit } from '@angular/core';
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
  constructor(private actRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService,
    private TranslateService:TranslateService) { }

  ngOnInit(): void {
    this.token = this.actRoute.snapshot.params.id;
    console.log(this.token);
    this.initForm();
  }
  initForm() {
    this.Form = this.formBuilder.group({
      password: ['', [Validators.required]],
      newpassword: ['', [Validators.required]],
    });
  }

  ChangePassword(){
    if (this.Form.value.password == this.Form.value.newpassword) {
     this.authService.changePassword(this.Form.value.password,this.token).subscribe((data: any)=>{
      if (data.response=="OK") {
        this.alertService.presentSuccessAlert(this.TranslateService.instant("MSG_CHANGE_PASSWORD"))
      }

     })
    }else {
      this.alertService.presentWarningAlert(this.TranslateService.instant("VALIDATE_PASSWORD"))
    }
  }

}
