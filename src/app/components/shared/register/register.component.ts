import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
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
    { label: 'Masculino', value: 'man' , eng_Label: 'Male' },
    { label: 'Femenino', value: 'female' ,eng_Label: 'Female'},
  ];
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private _alertService: AlertService,
    private _experimenterService: ExperimenterService,
    private _translateService: TranslateService,
    private _countriesService: CountriesService,
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      identification: ['', Validators.required],
      full_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      affiliation: ['', Validators.required],
      website: ['' , Validators.required],
      phone: ['' , Validators.required],
      gender: ['', Validators.required],
      country: ['', [Validators.required]],
      profile: ['', Validators.required],
      password: ['' , Validators.required],
    });

    this.getCountries();
    this.getUserProfiles();
    this._translateService.onLangChange.subscribe(() => {
      this.ValidateLanguage()
    });
  }


  ValidateLanguage() {
    if (this._translateService.instant('LANG_SPANISH_EC') == "Español (Ecuador)") {
      this.change_language = false;
    } else {
      this.change_language = true;
    }
  }

  getCountries(){
    this._countriesService.getCountries().subscribe((resp: any) => {
      this.countries = resp.countries;
    });
  }

  getUserProfiles() {
    this._experimenterService.getUserProfiles().subscribe((data: any) => {
      this.user_profiles = data.response;
    });
  }

 registerUser(){
  this.authService.register(this.registerForm.value).subscribe((data: any)=>{
   this._alertService.presentSuccessAlert(this._translateService.instant("CREATE_USER"))
   this.closeRegisterModal.nativeElement.click();
  })
 }


}
