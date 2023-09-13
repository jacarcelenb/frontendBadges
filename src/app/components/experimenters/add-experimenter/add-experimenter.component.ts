import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { ExperimenterService } from 'src/app/services/experimenter.service';
import { CountriesService } from 'src/app/services/countries.service';
import { Country } from 'src/interfaces/countries.interfaces';
import { IdentificationController } from 'src/app/controllers/identification.controller';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';
export interface User {
  name: string;
}
@Component({
  selector: 'app-add-experimenter',
  templateUrl: './add-experimenter.component.html',
  styleUrls: ['./add-experimenter.component.scss'],
})
export class AddExperimenterComponent implements OnInit {
  active = false;
  change_language = false;
  @ViewChild('closeAddExperimenter') closeAddExperimenter: ElementRef;
  @Input() experiment_id: number;
  @Output() saveModal: EventEmitter<any> = new EventEmitter<any>();

  countries: Country[] = [];
  genders = [
    { label: 'Masculino', value: 'Male' , eng_Label: 'Male' },
    { label: 'Femenino', value: 'Female' ,eng_Label: 'Female'},
    { label: 'Otro', value: 'Other' ,eng_Label: 'Other'},
  ];
  user_profiles = [];
  us_profile = [];
  corresponding_author = [];
  experimenterForm: FormGroup;
  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: '_id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,

  };

  dropdownEnGSettings: IDropdownSettings = {
    singleSelection: false,
    idField: '_id',
    textField: 'eng_name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };
  constructor(
    private _experimenterService: ExperimenterService,
    private _countriesService: CountriesService,
    private _alertService: AlertService,
    private formBuilder: FormBuilder,
    private identificationController: IdentificationController,
    private _translateService: TranslateService,
    private authService: AuthService,
  ) { }
  ngOnInit(): void {
    this.getCorrespondingAuthor()
    this.ValidateLanguage();
    this.getExperimentRoles();
    this.getUserProfiles();
    this.initForm();
    this._translateService.onLangChange.subscribe(() => {
      this.ValidateLanguage()
    });
  }
  ValidateLanguage() {
    if (this._translateService.instant('LANG_SPANISH_EC') == "Español (ECU)") {
      this.change_language = false;
    } else {
      this.change_language = true;
    }
  }

  roles = [];
  eng_roles = [];
  language: any;
  show(idioma: any) {
    this.language = idioma;
    this.active = true;
    this.cleanForm();
  }

  cleanForm(){
   this.experimenterForm.controls["identification"].setValue("")
   this.experimenterForm.controls["full_name"].setValue("")
   this.experimenterForm.controls["email"].setValue("")
   this.experimenterForm.controls["affiliation"].setValue("")
   this.experimenterForm.controls["experimenter_roles"].setValue([])
   this.experimenterForm.controls["website"].setValue("")
   this.experimenterForm.controls["phone"].setValue("")
   this.experimenterForm.controls["gender"].setValue("")
   this.experimenterForm.controls["country"].setValue("")
   this.experimenterForm.controls["profile"].setValue("")
   this.experimenterForm.controls["is_random_password"].setValue(true)
   this.experimenterForm.controls["password"].setValue("")
   this.experimenterForm.controls["random_password"].setValue("")
   this.experimenterForm.controls["comment"].setValue("")
   this.experimenterForm.controls["corresponding_autor"].setValue(false)

  }
  initForm() {
    this._countriesService.getCountries().subscribe((resp: any) => {
      this.countries = resp.countries;
    });
    this.experimenterForm = this.formBuilder.group({
      identification: [''],
      full_name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      affiliation: ['', [Validators.required]],
      experimenter_roles: [[], [Validators.required]],
      website: [''],
      phone: [''],
      gender: ['',[Validators.required]],
      country: [''],
      profile: ['', [Validators.required]],
      is_random_password: [true],
      password: ['', [Validators.required]],
      random_password: [''],
      comment: [''],
      corresponding_autor: [false],
    });




    this.experimenterForm.get('is_random_password').valueChanges.subscribe((isRandomPassword) => {
      if (!isRandomPassword)
        this.experimenterForm.get('password').setValidators([Validators.required]);
      else
        this.experimenterForm.get('password').setValidators(null);
      this.experimenterForm.get('password').updateValueAndValidity();
    });
    this.generateRandomPassword();

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



  getCorrespondingAuthor() {
    this._experimenterService.get({
      experiment: this.experiment_id,
      corresponding_autor: true
    }).subscribe((data: any) => {
      this.corresponding_author = data.response
    })
  }
  generateRandomPassword() {
    const password = Math.random().toString(36).slice(-8);
    this.experimenterForm.get('random_password').setValue(password);
  }
  setIsRandomPassword(isRandomPassword) {
    this.experimenterForm.get('is_random_password').setValue(isRandomPassword);
  }
  getExperimentRoles() {
    this._experimenterService.getRoles().subscribe((data: any) => {
      this.roles = data.response;
    })
  }

  getUserProfiles() {
    this._experimenterService.getUserProfiles().subscribe((data: any) => {
      this.user_profiles = data.response;
    });

  }

  save() {
    const user = {
      identification: this.experimenterForm.value.identification,
      full_name: this.experimenterForm.value.full_name,
      country: this.experimenterForm.value.country,
      affiliation: this.experimenterForm.value.affiliation,
      phone: this.experimenterForm.value.phone,
      email: this.experimenterForm.value.email,
      profile: this.experimenterForm.value.profile,
      password: this.experimenterForm.value.is_random_password ?
        this.experimenterForm.value.random_password :
        this.experimenterForm.value.password,
      website: this.experimenterForm.value.website,
      gender: this.experimenterForm.value.gender
    };

    const experimenter_roles = this.experimenterForm.value.experimenter_roles.map(
      (experimenter_role) => experimenter_role._id,
    );


    const experimenter = {
      user,
      experimenter_roles,
      experiment: this.experiment_id,
      admin_experiment:true,
      corresponding_autor: this.experimenterForm.value.corresponding_autor

    };



    const onSuccessRegister = (resp: any) => {
      this._alertService.presentSuccessAlert(
       this._translateService.instant('CREATE_EXPERIMENTER')
      );
      this.saveModal.emit(true);
      this.close();
    };

    const onErrorRegister = (err) => {
      let message = err.error?.join(' <br>') ?? "";
      this._alertService.presentErrorAlert(message);
    };

    if (this.corresponding_author.length > 0  && experimenter.corresponding_autor == true) {
      this._alertService.presentWarningAlert(this._translateService.instant("VALIDATE_CORRESPONDING_AUTHOR"));

    } else {
      this.authService.validateEmail(user.email).subscribe((data: any) => {

        if (data.response.user == "OK") {
          this._experimenterService.create(experimenter).subscribe((data)=>{
            this.authService.registerAuth({email: user.email, password: user.password}).then(
              onSuccessRegister,
              onErrorRegister,
            )
          });
         } else {
          this._alertService.presentWarningAlert(this._translateService.instant("VALIDATE_SAME_EMAIL"))
        }
      })


    }


  }
  close() {
    this.closeAddExperimenter.nativeElement.click();
  }
}
