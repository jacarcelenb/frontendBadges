import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from 'src/app/services/alert.service';
import { GroupService } from 'src/app/services/group.service';
import { MenuItem } from 'primeng/api';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ExperimentService } from 'src/app/services/experiment.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { AuthService } from 'src/app/services/auth.service';
import { ExperimenterService } from 'src/app/services/experimenter.service';

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
  actualExperiment: any[];
  completedExperiment:boolean = false;
  completedSteps: MenuItem[];
  ActualExperimenter = [];
  experimentOwner: boolean = false;
  completedStepSpanish: MenuItem[];
  change_language = false;
  userExperiments = [];


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
    private _ExperimentService: ExperimentService,
    private tokenStorageService: TokenStorageService,
    private _authService: AuthService,
    private experimenterService: ExperimenterService,

  ) { }

  ngOnInit(): void {
    this.experiment_id = this.actRoute.parent.snapshot.paramMap.get('id');
    this.menu_type = this.actRoute.parent.snapshot.paramMap.get("menu");
    this.getGroupTypes();
    this.getUserExperiments();
    this.init();
    this.initForm();

    this.ValidateLanguage();
    this._translateService.onLangChange.subscribe(() => {
      this.ValidateLanguage()
    });
      this.items = [
      { routerLink: 'experiment/step/'+this.experiment_id + "/step/menu/groups"},
      { routerLink: 'experiment/step/'+this.experiment_id + "/step/menu/groups"},
      { routerLink: 'experiment/step/'+this.experiment_id + "/step/menu/groups" },
      { routerLink: 'experiments/' + this.experiment_id  + "/tasks" },
      { routerLink: 'experiments/' + this.experiment_id  + "/artifacts" },
      { routerLink: 'experiments/' + this.experiment_id  + "/select_badge" },
      { routerLink: 'experiments/' + this.experiment_id  + "/artifacts_acm" },
      { routerLink: 'experiments/' + this.experiment_id  + "/badges" },
      { routerLink: 'experiments/' + this.experiment_id  + "/labpack" }
  ];
  this.completedSteps = [
    { routerLink: '/experiment/step', label: "Experiments" },
    { routerLink: "../experimenters", label: "Experimenters" },
    { routerLink: "../groups", label: "Groups" },
    { routerLink: "../tasks", label: "Tasks" },
    { routerLink: "../artifacts", label: "Artifacts" },
    { routerLink: "../select_badge", label: "ACM Badging" },
    { routerLink: "../artifacts_acm", label: "ACM Artifacts" },
    { routerLink: "../badges", label: "Evaluation Criteria" },
    { routerLink: "../labpack", label: "Labpack" },
  ];

  this.completedStepSpanish = [
    { routerLink: '/experiment/step', label: "Experimentos" },
    { routerLink: "../experimenters", label: "Experimentadores" },
    { routerLink: "../groups", label: "Grupos" },
    { routerLink: "../tasks", label: "Tareas" },
    { routerLink: "../artifacts", label: "Artefactos" },
    { routerLink: "../select_badge", label: "Insignias ACM" },
    { routerLink: "../artifacts_acm", label: "Artefactos ACM" },
    { routerLink: "../badges", label: "Criterios de evaluación" },
    { routerLink: "../labpack", label: "Paquete" },
  ];
   this.VerificateSelectedExperiment()
  }
  init(): void {
    const groups_query = {
      experiment: this.experiment_id,
      participants: true,
      ___populate: 'group_type experiment',
      ___sort: '-createdAt'
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



  validateExperimentOwner(experiment_id: string): boolean{
    let experimenterOwner = false;
    for (let index = 0; index < this.userExperiments.length; index++) {

      if (this.userExperiments[index]== experiment_id) {
          experimenterOwner = true;
      }
    }

    return experimenterOwner

  }

  getUserExperiments(){
    this._ExperimentService.getExperimentsUser().subscribe((data:any)=>{
       this.userExperiments = data.response
       this.experimentOwner = this.validateExperimentOwner(this.experiment_id)
    })
  }

  ValidateLanguage() {
    if (this._translateService.instant('LANG_SPANISH_EC') == "Español (ECU)") {
      this.change_language = false;
    } else {
      this.change_language = true;
    }
  }
  getActualExperiment() {
    this._ExperimentService.get({ _id: this.experiment_id }).subscribe((data: any) => {
      this.actualExperiment = data.response
      this.completedExperiment = data.response[0].completed
    })
  }

  VerificateSelectedExperiment(){
    if (this.tokenStorageService.getIdExperiment()) {
         this.experiment_id =this.tokenStorageService.getIdExperiment();
         this.completedExperiment =(this.tokenStorageService.getStatusExperiment() == "true")
    }
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
