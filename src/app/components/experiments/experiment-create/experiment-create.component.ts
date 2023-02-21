import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CreateExperimentDto } from 'src/app/models/Input/CreateExperimentDto';
import { AlertService } from 'src/app/services/alert.service';
import { ExperimentService } from 'src/app/services/experiment.service';
import { CountriesService } from 'src/app/services/countries.service';
import type { Country, CountryState } from 'src/interfaces/countries.interfaces';
import type { Subscription } from 'rxjs';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-experiment-create',
  templateUrl: './experiment-create.component.html',
  styleUrls: ['./experiment-create.component.scss'],
})
export class ExperimentCreateComponent {
  active: boolean = false;
  experiment: CreateExperimentDto = new CreateExperimentDto();
  @ViewChild('closeExperimentCreateModal') closeAddExpenseModal: ElementRef;
  @Output() saveModal: EventEmitter<any> = new EventEmitter<any>();

  experimentForm: FormGroup;
  gqmObjectiveForm: FormGroup;

  subscriptions: Subscription[] = [];

  countries: Country[] = [];
  countries_states: CountryState[] = [];
  avaliable_states: CountryState[] = [];

  is_gqm_objective = false;
  change_language: boolean = false;

  gqmHints = {
    analyse: "GQM_HINTS_ANALYSE",
    purposeOf: "GQM_HINTS_PURPOSE",
    respectTo: "GQM_HINTS_RESPECT",
    viewPointOf: "GQM_HINTS_VIEWPOINT",
    inTheContextOf: "GQM_HINTS_CONTEXT",
  };

  constructor(
    private formBuilder: FormBuilder,
    private _experimentService: ExperimentService,
    private _alertService: AlertService,
    private _countriesService: CountriesService,
    private _tokenService: TokenStorageService,
    private _translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this._countriesService.getCountries().subscribe((resp) => {
        this.countries = resp.countries;
      })
    );

    this.subscriptions.push(
      this._countriesService.getCountriesStates().subscribe((resp) => {
        this.countries_states = resp.states;
      })
    );

    this.ValidateLanguage();
    this._translateService.onLangChange.subscribe(() => {
      this.ValidateLanguage()
    });


  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  show(): void {
    this.active = true;
    this.initForm();
  }
  initForm() {
    this.experimentForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      country: ['No se registra'],
      country_state: ['No se registra'],
      doi_code: null,
      objective: ['', [Validators.required]],
      description: ['', [Validators.required]],
      justification: [''],
      has_scripts: [true, [Validators.required]],
      has_software: [true, [Validators.required]],
      has_source_code: [true, [Validators.required]],
      created_date: ['', Validators.required],
    });

    this.gqmObjectiveForm = this.formBuilder.group({
      objective_analyze: ['', [Validators.required]],
      with_purpose: ['', [Validators.required]],
      with_respect_that: ['', [Validators.required]],
      with_viewpoint: ['', [Validators.required]],
      in_the_context_of: ['', [Validators.required]],
    })

    /** Handle country changes for filter country states */
    this.subscriptions.push(
      this.experimentForm.get('country').valueChanges.subscribe((country) => {
        this.experimentForm.controls.country_state.setValue('');

        this.avaliable_states = this.countries_states.filter(state => {
          return state.country_name.includes(country);
        });
      })
    );
  }
  setIsGQMObjective(is_gqm_objective: boolean) {
    this.is_gqm_objective = is_gqm_objective;
  }

  ValidateLanguage() {
    if (this._translateService.instant('LANG_SPANISH_EC') == "Español (Ecuador)") {
      this.change_language = false;
    } else {
      this.change_language = true;
    }
  }
  toggleField(field: string) {
    if (this.experimentForm.controls[field]) {
      const prev = this.experimentForm.controls[field].value;
      this.experimentForm.controls[field].setValue(!prev);
    }
  }
  canSubmitTheForm(): boolean {
    if (this.is_gqm_objective) {
      this.experimentForm.controls.objective.setValidators([]);
      this.experimentForm.controls.objective.updateValueAndValidity();
      return (this.experimentForm.valid && this.gqmObjectiveForm.valid);
    }
    this.experimentForm.controls.objective.setValidators([Validators.required]);
    this.experimentForm.controls.objective.updateValueAndValidity();
    return this.experimentForm.valid;
  }




  save() {
    const experiment = new CreateExperimentDto();
    experiment.name = this.experimentForm.get('name').value;
    experiment.country = this.experimentForm.get('country').value;
    experiment.country_state = this.experimentForm.get('country_state').value;
    experiment.doi_code = this.experimentForm.get('doi_code').value;
    experiment.description = this.experimentForm.get('description').value;
    experiment.has_scripts = this.experimentForm.get('has_scripts').value;
    experiment.has_software = this.experimentForm.get('has_software').value;
    experiment.has_source_code = this.experimentForm.get('has_source_code').value;
    experiment.reason = this.experimentForm.get('justification').value;
    experiment.created_date = this.experimentForm.get('created_date').value;


    if (this.is_gqm_objective) {
      experiment.gqm_objective = this.gqmObjectiveForm.value;
      experiment.objective = null;
    } else {
      experiment.objective = this.experimentForm.get('objective').value;
      experiment.gqm_objective = null;
    }

    this._experimentService.create(experiment).subscribe(
      () => {
        this._alertService.presentSuccessAlert(
         this._translateService.instant("CREATE_EXPERIMENT")
        );
        this.saveModal.emit(null);
        this.close();
      },
      (err) => {
        let message = '';
        err.error?.forEach((messageErr) => {
          message += messageErr + ' <br>';
        });
        this._alertService.presentErrorAlert(message);
      }
    );
  }
  close() {
    this.closeAddExpenseModal.nativeElement.click();
  }
}
