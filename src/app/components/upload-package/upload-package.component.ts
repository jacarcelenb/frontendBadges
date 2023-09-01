import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from 'src/app/services/alert.service';
import { ExperimenterService } from 'src/app/services/experimenter.service';
import { LabpackService } from 'src/app/services/labpack.service';

@Component({
  selector: 'app-upload-package',
  templateUrl: './upload-package.component.html',
  styleUrls: ['./upload-package.component.scss']
})
export class UploadPackageComponent implements OnInit {
  isSelected: boolean = true;
  isTokenOption: boolean = true;
  NoPersonalToken: boolean = true;
  progressBarValueArtifact = '';
  registeredToken: boolean = false;
  tokenForm: FormGroup;
  SecondPart: FormGroup;
  ThirdPart: FormGroup;
  FourthPart: FormGroup;
  displayedColumns: string[] = ['identifier', 'relation', 'resource_type', 'delete'];
  displayedColumnsCont: string[] = ['name', 'affiliation','option'];
  dataSource: MatTableDataSource<any>
  dataContributors: MatTableDataSource<any>
  IdentifiersList = [];
  experimenters = [];
  experiment_id: string;

  @ViewChild('contentrepo') contentrepo: ElementRef;
  @ViewChild('nextButton') nextButton: ElementRef;
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('closeModalCont') closeModalCont: ElementRef;
  @ViewChild('stepThree') stepThree: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginatorCont: MatPaginator;


  showOptImage: boolean;
  showOptPublication: boolean;
  constructor(private formBuilder: FormBuilder,
    private labpackService: LabpackService,
    private alertService: AlertService,
    private translateService: TranslateService,
    private _experimenterService: ExperimenterService,
    private actRoute: ActivatedRoute,) { }

  ngOnInit(): void {
    this.initTokenForm()
    this.experiment_id = this.actRoute.parent.snapshot.paramMap.get('id');
    this.getExperimenters()

  }


  getExperimenters() {
    this._experimenterService.get({
      experiment: this.experiment_id,
      ___populate: 'experimenter_roles,user',
      admin_experiment: true
    }).subscribe((resp: any) => {

      this.experimenters = []
      for (let index = 0; index < resp.response.length; index++) {
        const experimenterDTO = {
          name: "",
          affiliation: "",
        }
        experimenterDTO.name = resp.response[index].user.full_name
        experimenterDTO.affiliation = resp.response[index].user.affiliation
        this.experimenters.push(experimenterDTO)

      }

      this.dataContributors = new MatTableDataSource<any>(this.experimenters);
      this.dataContributors.paginator = this.paginatorCont;
      this.dataContributors.paginator._intl = new MatPaginatorIntl()
      this.dataContributors.paginator._intl.itemsPerPageLabel = ""

    });
  }

  initTokenForm() {
    this.tokenForm = this.formBuilder.group({
      token: ['', [Validators.required]],
    });

    this.SecondPart = this.formBuilder.group({
      title: ['', [Validators.required]],
      upload_type: ['', [Validators.required]],
      publication_type: [''],
      image_type: [''],
      description: ['', [Validators.required]],
    });

    this.ThirdPart = this.formBuilder.group({
      identifier: ['', [Validators.required]],
      relation: ['', [Validators.required]],
      resource_type: [''],
    })

    this.FourthPart = this.formBuilder.group({
      name: ['', [Validators.required]],
      affiliation: ['', [Validators.required]]
    })
  }

  onChangeOption(checked: boolean) {
    this.isSelected = checked;
  } ElementRefElementRefElementRef
  onCheckTokenOption(checked: boolean) {
    this.isTokenOption = checked;
  }

  onCheckPersonalToken(checked: boolean) {
    this.NoPersonalToken = checked;
  }

  verifyContent() {
    if (this.contentrepo.nativeElement.value == 'publication') {
      this.showOptPublication = true;
      this.showOptImage = false;
    } else if (this.contentrepo.nativeElement.value == 'image') {
      this.showOptImage = true;
      this.showOptPublication = false;
    } else {
      this.showOptImage = false;
      this.showOptPublication = false;
    }
  }

  validateToken() {
    if (this.NoPersonalToken) {
      this.tokenForm.controls['token'].setValue("")
    }
    this.labpackService.validateToken(this.tokenForm.value.token).subscribe((data) => {
      if (data.response == 200) {
        this.nextButton.nativeElement.click();
      } else {
        this.alertService.presentErrorAlert(this.translateService.instant("MSG_INVALID_TOKEN"))
      }
    })
  }



  addIdentifier() {
    if (this.HasNoDuplicatedIdentifiers(this.ThirdPart.value.identifier)) {
      this.alertService.presentWarningAlert(this.translateService.instant("MSG_VALIDATE_IDENTIFIER"))
    } else {
      let identifierItem = {
        identifier: this.ThirdPart.value.identifier.trim(),
        relation: this.ThirdPart.value.relation,
        resource_type: this.ThirdPart.value.resource_type
      }
      this.IdentifiersList.push(identifierItem)
      this.dataSource = new MatTableDataSource<any>(this.IdentifiersList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator._intl = new MatPaginatorIntl()
      this.dataSource.paginator._intl.itemsPerPageLabel = ""
      this.alertService.presentSuccessAlert(this.translateService.instant("MSG_CONFIRM_ADD"))
      this.cleanIdentifierForm()
      this.closeBtn.nativeElement.click()
    }

  }

  cleanIdentifierForm() {
    this.ThirdPart = this.formBuilder.group({
      identifier: ['', [Validators.required]],
      relation: ['', [Validators.required]],
      resource_type: [''],
    })
  }

  HasNoDuplicatedIdentifiers(identifier): boolean {
    let duplicated = false;
    for (let index = 0; index < this.IdentifiersList.length; index++) {
      if (this.IdentifiersList[index].identifier === identifier) {
        duplicated = true;
      }
    }
    return duplicated;
  }

  DeleteIdentifier(identifier) {
    let newList = [];
    for (let index = 0; index < this.IdentifiersList.length; index++) {
      if (this.IdentifiersList[index].identifier != identifier) {
        newList.push(this.IdentifiersList[index]);
      }
    }
    this.IdentifiersList = newList;
    this.dataSource = new MatTableDataSource<any>(this.IdentifiersList);
  }


  addContributor() {
    if (this.HasNoDuplicatedContributor(this.FourthPart.value.name)) {
      this.alertService.presentWarningAlert(this.translateService.instant("MSG_VALIDATE_CONTRIBUTOR"))
    } else {
      let Item = {
        name: this.FourthPart.value.name,
        affiliation: this.FourthPart.value.affiliation,
      }
      this.experimenters.push(Item)
      this.dataContributors = new MatTableDataSource<any>(this.experimenters);
      this.alertService.presentSuccessAlert(this.translateService.instant("MSG_CONFIRM_ADD"))
      this.cleanContributorForm()
      this.closeModalCont.nativeElement.click()
    }

  }

  cleanContributorForm() {
    this.FourthPart = this.formBuilder.group({
      name: ['', [Validators.required]],
      affiliation: ['', [Validators.required]]
    })
  }

  HasNoDuplicatedContributor(name): boolean {
    let duplicated = false;
    for (let index = 0; index < this.experimenters.length; index++) {
      if (this.experimenters[index].name === name) {
        duplicated = true;
      }
    }
    return duplicated;
  }

  DeleteContributor(name) {
    let newList = [];
    for (let index = 0; index < this.experimenters.length; index++) {
      if (this.experimenters[index].name != name) {
        newList.push(this.experimenters[index]);
      }
    }
    this.experimenters = newList;
    this.dataContributors = new MatTableDataSource<any>(this.experimenters);
  }

  validateIdentifier() {
    if (this.IdentifiersList.length == 0) {
      this.alertService.presentWarningAlert(this.translateService.instant("VALIDATE_LIST_IDENTIFIER"))
    } else {
      this.stepThree.nativeElement.click()
    }
  }

}