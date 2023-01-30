import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ParticipantService } from 'src/app/services/participant.service';

@Component({
  selector: 'app-participant-create',
  templateUrl: './participant-create.component.html',
  styleUrls: ['./participant-create.component.scss']
})
export class ParticipantCreateComponent {
  @Input() group_id: number;
  @Input() experiment_id: string;
  @Output() saveModal: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('closeParticipantCreateModal') closeCreateParticipantModal: ElementRef;
  active = false;
  participantForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _participantService: ParticipantService,
  ) { }

  show(): void {
    this.active = true;
    this.initForm();
  }

  initForm() {
    this.participantForm = this._formBuilder.group({
      participants_count: [, [Validators.required, Validators.min(1)]],
    });
  }

  save() {
    const new_participants = {
      count: this.participantForm.value.participants_count,
      group: this.group_id,
      experiment: this.experiment_id
    };


    this._participantService.create(new_participants).subscribe((data) => {

      this.saveModal.emit(null);
      this.close();
    });
  }

  close() {
    this.closeCreateParticipantModal.nativeElement.click();
  }

}
