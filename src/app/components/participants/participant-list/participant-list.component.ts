import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from 'src/app/services/alert.service';
import { GroupService } from 'src/app/services/group.service';
import { ParticipantService } from 'src/app/services/participant.service';
import { ParticipantCreateComponent } from '../participant-create/participant-create.component';
import { ParticipantEditComponent } from '../participant-edit/participant-edit.component';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-participant-list',
  templateUrl: './participant-list.component.html',
  styleUrls: ['./participant-list.component.scss']
})
export class ParticipantListComponent implements OnInit {
  @ViewChild('addParticipantModal', { static: false })
  addParticipantModal: ParticipantCreateComponent;
  @ViewChild('editParticipantModal', { static: false })
  editParticipantModal: ParticipantEditComponent;
  group_id: string;
  experiment_id: string;
  participants: Record<string, any>[] = [];


  displayedColumns: string[] = ['id', 'avatar', 'comment', 'details'];
  dataSource: MatTableDataSource<any>

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private actRoute: ActivatedRoute,
    private _groupService: GroupService,
    private _participantService: ParticipantService,
    private _alertService: AlertService,
    private _translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    this.group_id = this.actRoute.parent.snapshot.paramMap.get('group_id');
    this.experiment_id = this.actRoute.parent.snapshot.paramMap.get('experiment_id');
    this.fetchGroupDetails();
  }
  fetchGroupDetails() {
    this._groupService.get({
      _id: this.group_id,
      experiment: this.experiment_id,
      participants: true,
      ___populate: 'group_type'
    }).subscribe(data => {
      this.participants = data.response[0].participants ?? [];
      this.participants = this.participants.sort((a, b) => {
        return a.order - b.order;
      });
      this.dataSource = new MatTableDataSource<any>(this.participants);
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator._intl = new MatPaginatorIntl()
      this.dataSource.paginator._intl.itemsPerPageLabel = ""
    });
  }
  showAddParticipant() {
    this.addParticipantModal.show();
  }
  showEditParticipantModal(participant) {
    this.editParticipantModal.show(participant);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  deleteParticipantConfirm(participant) {
    this._alertService.presentConfirmAlert(
      this._translateService.instant('WORD_CONFIRM_DELETE'),
      this._translateService.instant('WORD_CONFIRM_DELETE_PARTICIPANT'),
      this._translateService.instant('WORD_DELETE'),
      this._translateService.instant('WORD_CANCEL'),
    ).then((result) => {
      if (result.isConfirmed) {
        this.deleteParticipant(participant._id);
      }
    });
  }
  deleteParticipant(participant_id: string) {

    this._participantService.remove({ _id: participant_id }).subscribe(resp => {
      this.fetchGroupDetails();
    });
  }
}
