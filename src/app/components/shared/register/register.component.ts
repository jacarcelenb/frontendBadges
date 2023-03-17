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
  registerForm: FormGroup;
  user_profiles = [];
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

    this.registerForm?.get('email').valueChanges.subscribe((email) => {
      if (this.validateEmail(email))
        return this.registerForm?.get('email').setErrors(null);
      this.registerForm?.get('email').setErrors({ invalid: true });
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
    this.authService.register(this.registerForm.value).subscribe((data: any) => {
      this._alertService.presentSuccessAlert(this._translateService.instant("CREATE_USER"))
      this.closeRegisterModal.nativeElement.click();
    })
  }


}
