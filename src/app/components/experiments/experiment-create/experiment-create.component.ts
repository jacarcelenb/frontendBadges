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

  gqmHints = {
    analyse: "GQM_HINTS_ANALYSE",
    purposeOf: "GQM_HINTS_PURPOSE",
    respectTo: "GQM_HINTS_RESPECT",
    viewPointOf: "GQM_HINTS_VIEWPOINT",
    inTheContextOf: "GQM_HINTS_CONTEXT",
  };
  isChecked: boolean = false;
  isCheckedSoftware: boolean = false;
  isCheckedSourceCode: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private _experimentService: ExperimentService,
    private _alertService: AlertService,
    private _countriesService: CountriesService,
    private _tokenService: TokenStorageService,
    private _translateService: TranslateService,
  ) { }

  ngOnInit(): void {


  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  show(): void {
    this.active = true;
    this.initForm();
    this.isChecked = false;
    this.isCheckedSoftware = false;
    this.isCheckedSourceCode = false;
  }
  initForm() {
    this.experimentForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      country: ['', [Validators.required]],
      country_state: [''],
      doi_code: null,
      objective: ['', [Validators.required]],
      description: ['', [Validators.required]],
      justification: ['', [Validators.required]],
      has_scripts: [true],
      has_software: [true ],
      has_source_code: [true],
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

  }
  setIsGQMObjective(is_gqm_objective: boolean) {
    this.is_gqm_objective = is_gqm_objective;
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
    experiment.has_scripts = this.isChecked;
    experiment.has_software = this.isCheckedSoftware;
    experiment.has_source_code = this.isCheckedSourceCode;
    experiment.reason = this.experimentForm.get('justification').value;
    experiment.created_date = this.experimentForm.get('created_date').value;
    if (this.is_gqm_objective) {
      experiment.gqm_objective = this.gqmObjectiveForm.value;
      experiment.objective = this.experimentForm.get('objective').value;
    } else {
      experiment.objective = this.experimentForm.get('objective').value;
      experiment.gqm_objective = this.gqmObjectiveForm.value;
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

  onChangeScripts(checked: boolean) {
    this.isChecked = checked;
  }

  onChangeSoftware(checked: boolean) {
    this.isCheckedSoftware = checked;
  }

  onChangeSourceCode(checked: boolean) {
    this.isCheckedSourceCode = checked;
  }

}
