import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { ParticipantService } from 'src/app/services/participant.service';

@Component({
  selector: 'app-participant-edit',
  templateUrl: './participant-edit.component.html',
  styleUrls: ['./participant-edit.component.scss']
})
export class ParticipantEditComponent {
  @Output() saveModal: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('closeParticipantEditModal') closeButton: ElementRef;

  active = false;
  participant = null;
  participantForm: FormGroup;
  constructor(
    private _formBuilder: FormBuilder,
    private _participantService: ParticipantService,
    private _alertService: AlertService,
  ) { }

  show(participant) {
    this.participant = participant;
    this.active = true;
    this.initForm();
  }

  initForm() {
    this.participantForm = this._formBuilder.group({
      comment: [this.participant?.comment || ''],
    });
  }

  save() {
    const onSuccessUpdate = (resp) => {
      this._alertService.presentSuccessAlert(resp.message);
      this.saveModal.emit(null);
      this.close();
    };
    const onErrorUpdate = (err) => {
      let message = err.error?.join(' <br>') ?? "";
      this._alertService.presentErrorAlert(message);
    }

    this._participantService
    .update({_id: this.participant._id}, this.participantForm.value)
    .subscribe(onSuccessUpdate, onErrorUpdate);
  }

  close() {
    this.participant = null;
    this.closeButton.nativeElement.click();
  }
}
