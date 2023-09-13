import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IdentificationController } from 'src/app/controllers/identification.controller';
import { AlertService } from 'src/app/services/alert.service';
import { CountriesService } from 'src/app/services/countries.service';
import { ExperimenterService } from 'src/app/services/experimenter.service';
import { Country } from 'src/interfaces/countries.interfaces';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  @ViewChild('closeRegisterModal') closeRegisterModal: ElementRef;

// passwordField
@ViewChild('passwordField') passwordField: ElementRef;

//passwordIcon
@ViewChild('passwordIcon') passwordIcon: ElementRef;
  registerForm: FormGroup;
  user_profiles = [];
  type: string = 'SHOW_PASSWORD';
  change_language = false;
  countries: Country[] = [];
  genders = [
    { label: 'Masculino', value: 'Male', eng_Label: 'Male' },
    { label: 'Femenino', value: 'Female', eng_Label: 'Female' },
    { label: 'Otro', value: 'Other', eng_Label: 'Other' },
  ];
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private _alertService: AlertService,
    private _experimenterService: ExperimenterService,
    private _translateService: TranslateService,
    private _countriesService: CountriesService,
    private identificationController: IdentificationController,
  ) { }

  ngOnInit(): void {
    this.cleanFields();

    this.getUserProfiles();
    this._translateService.onLangChange.subscribe(() => {
      this.ValidateLanguage()
    });
  }

  cleanFields() {
    this.registerForm = this.formBuilder.group({
      identification: ['', Validators.required],
      full_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      affiliation: ['', Validators.required],
      website: [''],
      gender: ['', Validators.required],
      profile: ['', Validators.required],
      password: ['', Validators.required],
    });


    this.registerForm?.get('identification').valueChanges.subscribe((identification) => {
      if (this.identificationController.isValidDNI(identification))
        return this.registerForm?.get('identification').setErrors(null);
      if (this.identificationController.isValidDNIEC(identification))
        return this.registerForm?.get('identification').setErrors(null);
      this.registerForm?.get('identification').setErrors({ invalid: true });
    });


    this.registerForm?.get('full_name').valueChanges.subscribe((fullname) => {
      if (this.validateNames(fullname))
        return this.registerForm?.get('full_name').setErrors(null);
      this.registerForm?.get('full_name').setErrors({ invalid: true });
    });

    this.registerForm?.get('password').valueChanges.subscribe((password) => {
      if (this.validatePasswords(password))
        return this.registerForm?.get('password').setErrors(null);
      this.registerForm?.get('password').setErrors({ invalid: true });
    });
  }

  ValidateLanguage() {
    if (this._translateService.instant('LANG_SPANISH_EC') == "Español (ECU)") {
      this.change_language = false;
    } else {
      this.change_language = true;
    }
  }

  validateEmail(email: string): boolean {
    let resp = false;

    let emailDomains = ["@gmail.com", "@yahoo.com", "@outlook.es", "@outlook.com", "@hotmail.com"]
    for (let index = 0; index < emailDomains.length; index++) {
      if (email.endsWith(emailDomains[index])) {
        resp = true;
      }
    }

    return resp

  }

  getCountries() {
    this._countriesService.getCountries().subscribe((resp: any) => {
      this.countries = resp.countries;
    });
  }



  getUserProfiles() {
    this._experimenterService.getUserProfiles().subscribe((data: any) => {
      this.user_profiles = data.response;
    });
  }

  registerUser() {
    const user= {
    email: this.registerForm.value.email,
    password: this.registerForm.value.password
    }
    this.authService.validateEmail(this.registerForm.value.email).subscribe((data: any) => {

    if (data.response.user == "OK") {

      this.authService.register(this.registerForm.value).subscribe((data: any) => {
        this._alertService.presentSuccessAlert(this._translateService.instant("CREATE_USER"))
        this.authService.registerAuth({email: user.email, password: user.password}).then((data) => {
          this.closeRegisterModal.nativeElement.click();
        })

      })
    }else {
     this._alertService.presentWarningAlert(this._translateService.instant("VALIDATE_SAME_EMAIL"))
    }
    })

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

  validateNames(namesPer: string) {
    var expr: RegExp = /^([A-Za-zÑñÁáÉéÍíÓóÚú]+['\-]{0,1}[A-Za-zÑñÁáÉéÍíÓóÚú]+)(\s+([A-Za-zÑñÁáÉéÍíÓóÚú]+['\-]{0,1}[A-Za-zÑñÁáÉéÍíÓóÚú]+))*$/g;
    var verification = expr.test(namesPer);
    return verification;
  }

  validatePasswords(password: string) {
    var expr: RegExp = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,}$/g;
    var verification = expr.test(password);
    return verification;
  }


}
