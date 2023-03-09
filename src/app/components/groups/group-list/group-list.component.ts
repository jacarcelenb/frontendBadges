import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from 'src/app/services/alert.service';
import { GroupService } from 'src/app/services/group.service';
import { MenuItem } from 'primeng/api';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss'],
})
export class GroupListComponent implements OnInit {
  experiment_id: string;
  page = 1;
  count = 0;
  pageSize = 3;
  pageSizes = [3, 6, 9];
  groups = [];
   items: MenuItem[];
  menu_type: string;
  name = '';
  groupTypes: [];
  groupForm: FormGroup;
  id_group: string;
  @ViewChild('closeGroupCreateModal') closeCreateGroupModal: ElementRef;

  displayedColumns: string[] = ['group_type', 'participants', 'description','edit','delete'];
  dataSource: MatTableDataSource<any>

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private _router: Router,
    private _groupsService: GroupService,
    private actRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private _groupService: GroupService,
    private _alertService: AlertService,
    private _translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    this.experiment_id = this.actRoute.parent.snapshot.paramMap.get('id');
    this.menu_type = this.actRoute.parent.snapshot.paramMap.get("menu");
    this.getGroupTypes();
    this.init();
    this.initForm();
      this.items = [
      { routerLink: 'experiment/step/'+this.experiment_id + "/step/menu/groups"},
      { routerLink: 'experiment/step/'+this.experiment_id + "/step/menu/groups"},
      { routerLink: 'experiment/step/'+this.experiment_id + "/step/menu/groups" },
      { routerLink: 'experiments/' + this.experiment_id  + "/tasks" },
      { routerLink: 'experiments/' + this.experiment_id  + "/artifacts" },
      { routerLink: 'experiments/' + this.experiment_id  + "/artifacts_acm" },
      { routerLink: 'experiments/' + this.experiment_id  + "/badges" },
      { routerLink: 'experiments/' + this.experiment_id  + "/labpack" }
  ];

  }
  init(): void {
    const groups_query = {
      experiment: this.experiment_id,
      participants: true,
      ___populate: 'group_type experiment',
    };

    this._groupsService.get(groups_query).subscribe(data => {
      this.groups = data.response;
      this.dataSource = new MatTableDataSource<any>(this.groups);
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator._intl = new MatPaginatorIntl()
      this.dataSource.paginator._intl.itemsPerPageLabel = ""
    });

    this._groupsService.count().subscribe(data => {
      this.count = data.response;
    });
  }


  Back(){
    this._router.navigate(['experiment/step/'+this.experiment_id + "/step/menu/experimenters"])
  }

  Next(){
    this._router.navigate(['experiment/step/'+this.experiment_id + "/step/menu/tasks"])
   }

  initForm() {
    this.groupForm = this.formBuilder.group({
      numParticipants: [0, [Validators.required]],
      description: ['', [Validators.required]],
      group_type: ['', Validators.required],
      experiment: ['', Validators.required],
    });
    this.groupForm.get('experiment').setValue(this.experiment_id);
  }
  handlePageChange(event) {
    this.page = event;
  }
  goToDetails(group_id: string) {
    this._router.navigate([`groups/${group_id}/experiment/${this.experiment_id}`]);
  }
  handlePageSizeChange(event) {
    this.pageSize = event.target.value;
    this.page = 1;
  }

  getGroupTypes() {
    this._groupService.getTypes().subscribe((data) => {
      this.groupTypes = data.response
    });
  }

  selectGroup(group: any) {
    this.groupForm.controls['numParticipants'].setValue(group.numParticipants)
    this.groupForm.controls['description'].setValue(group.description)
    this.groupForm.controls['group_type'].setValue(group.group_type._id)
    this.id_group = group._id;
  }
  ValidateGroupType(group_type): boolean{

    let findOne = false;
    for (let index = 0; index < this.groups.length; index++) {

      if (group_type === this.groups[index].group_type._id) {
        findOne = true;
      }
    }
    return findOne;
  }
  updateGroup() {

    if (this.groupForm.value.description.trim().length == 0) {
      this._alertService.presentWarningAlert(this._translateService.instant("DESCRIPTION_GROUP"))
   } else{
    this._groupsService.update(this.id_group, this.groupForm.value).subscribe((data: any) => {
      this.init();
      this._alertService.presentSuccessAlert(this._translateService.instant("UPDATE_GROUP_MSG"));
      this.closeCreateGroupModal.nativeElement.click();
    })

   }
  }

  deleteGroup(group: any) {

      this._alertService.presentConfirmAlert(
        this._translateService.instant('WORD_CONFIRM_DELETE'),
        this._translateService.instant("MSG_DELETE_GROUP"),
        this._translateService.instant('WORD_DELETE'),
        this._translateService.instant('WORD_CANCEL'),
      ).then((result) => {
        if (result.isConfirmed) {
          this._groupsService.delete(group._id).subscribe((data: any) => {
            this.init();
            this._alertService.presentSuccessAlert(this._translateService.instant("DELETE_GROUP"));
          })
        }
      });


  }
}
