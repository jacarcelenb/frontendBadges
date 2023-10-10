import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ArtifactController } from 'src/app/controllers/artifact.controller';
import { AlertService } from 'src/app/services/alert.service';
import { ExperimenterService } from 'src/app/services/experimenter.service';
import { LabpackService } from 'src/app/services/labpack.service';
import { newStorageRefForArtifact, parseArtifactNameForStorage } from 'src/app/utils/parsers';

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
  selectedFileArtifact: FileList;
  registeredToken: boolean = false;
  tokenForm: FormGroup;
  SecondPart: FormGroup;
  ThirdPart: FormGroup;
  FourthPart: FormGroup;
  displayedColumns: string[] = ['identifier', 'relation', 'resource_type', 'delete'];
  displayedColumnsCont: string[] = ['name', 'affiliation', 'option'];
  dataSource: MatTableDataSource<any>
  dataContributors: MatTableDataSource<any>
  IdentifiersList = [];
  RepoList = [];
  Labpack = [];
  experimenters = [];
  experiment_id: string;
  url_downloadFile: string = "";
  file_extension: string;
  @Input() idExperiment: string;
  @ViewChild('contentrepo') contentrepo: ElementRef;
  @ViewChild('nextButton') nextButton: ElementRef;
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('closeModalCont') closeModalCont: ElementRef;
  @ViewChild('stepThree') stepThree: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginatorCont: MatPaginator;


  showOptImage: boolean;
  showOptPublication: boolean;
  url_labpack: string;
  id_zenodo: number = 0;
  doiUrl: any;
  constructor(private formBuilder: FormBuilder,
    private labpackService: LabpackService,
    private alertService: AlertService,
    private translateService: TranslateService,
    private _experimenterService: ExperimenterService,
    private actRoute: ActivatedRoute,
    private artifactController: ArtifactController,
    private _router: Router,) { }

  ngOnInit(): void {
    this.initTokenForm()
    this.experiment_id = this.actRoute.parent.snapshot.paramMap.get('id');
    this.getExperimenters()
    this.getLabpack();

  }

  getLabpack() {
    this.labpackService.get({
      experiment: this.experiment_id
      , ___populate: 'package_type,repository',
    }).subscribe((data: any) => {
      this.Labpack = data.response
      console.log(this.Labpack)
    })
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
        this.dataContributors = new MatTableDataSource<any>(this.experimenters);

      }

    });
  }

  initTokenForm() {
    this.tokenForm = this.formBuilder.group({
      token: ['', [Validators.required]],
    });

    this.SecondPart = this.formBuilder.group({
      title: ['', [Validators.required]],
    });


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
    if (this.tokenForm.value.token.length > 0 || this.NoPersonalToken && ! this.isTokenOption) {
      this.labpackService.validateToken(this.tokenForm.value.token).subscribe((data) => {
        if (data.response.status == 200) {
          this.RepoList = data.response.data
          this.nextButton.nativeElement.click();
        } else {
          this.alertService.presentErrorAlert(this.translateService.instant("MSG_INVALID_TOKEN"))
        }
      })
    } else {
      this.alertService.presentWarningAlert(this.translateService.instant("VALIDATE_ZENODO_TOKEN"))
    }

  }

  addContributor() {

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


  chooseFileArtifact(event) {
    this.selectedFileArtifact = event.target.files;
    if (this.selectedFileArtifact.item(0)) {
      var re = /(?:\.([^.]+))?$/;
      const currentFile = this.selectedFileArtifact.item(0);
      let [, extension] = re.exec(currentFile.name);
      extension = extension.toLowerCase();
      this.file_extension = extension
      this.uploadArtifact();
    }
  }

  uploadArtifact() {
    const artifact_name = parseArtifactNameForStorage(
      this.selectedFileArtifact.item(0).name,
    );
    const storage_ref = newStorageRefForArtifact(
      'repository',
      artifact_name
    );
    const onPercentageChanges = (percentage: string) => {
      this.progressBarValueArtifact = percentage;
    }
    this.artifactController.uploadArtifactToStorage(
      storage_ref,
      this.selectedFileArtifact.item(0),
      { onPercentageChanges },
      (storage_ref, file_url) => {
        this.url_labpack = file_url;
        this.labpackService.uploadPackage({
          url: file_url,
          name: artifact_name + "." + this.file_extension,
          token: this.tokenForm.value,
          id_zenodo: this.id_zenodo,
        }
        ).subscribe(data => {
          if (data.response.id?.length > 0) {
            this.alertService.presentSuccessAlert(this.translateService.instant("MSG_UPLOAD_REPO"))
            this.url_downloadFile = data.response.links.download
          }
        })
      },
    );
  }

  createRepository(): void {
    if (this.id_zenodo == 0) {
      this.labpackService.createRespositorio(
        {
          "metadata": {
            "title": this.Labpack[0].package_title            ,
            "upload_type": 'other',
            "description":  this.Labpack[0].package_description,
            "creators": this.experimenters
          },
          "token": this.tokenForm.value
        }
      ).subscribe((data) => {
        this.id_zenodo = data.response.id
        if (this.id_zenodo > 0) {
          this.alertService.presentSuccessAlert(this.translateService.instant("MSG_CREATED_REPO"))
          this.labpackService.uploadPackage({
            url: this.Labpack[0].package_url,
            name: this.Labpack[0].package_name + ".zip",
            token: this.tokenForm.value,
            id_zenodo: this.id_zenodo,
          }
          ).subscribe(data => {
            if (data.response.id?.length > 0) {
              this.alertService.presentSuccessAlert(this.translateService.instant("MSG_UPLOAD_REPO"))
              this.url_downloadFile = data.response.links.download
            }
          })
        }
      })
    }
  }

  publishRepo() {
    if (this.tokenForm.value.token.length == 0) {
        this.tokenForm.value.token = "UkO33J14iE8Svd4Ck4VvfT4BDuT25uwY0zwdRXiWIPHOr3iRJbegI7rc8Emh"
    }
    this.labpackService.PublishRepo({
      token: this.tokenForm.value,
      id_zenodo: this.id_zenodo
    }).subscribe((data) => {
      if (data.response.doi_url.length > 0) {
        this.doiUrl = data.response.doi_url
        let id = this.Labpack[0]._id
        this.labpackService.update(id,
          {
            "package_name": this.Labpack[0].package_name,
            "package_doi": this.doiUrl,
            "experiment": this.Labpack[0].experiment,
            "package_type": this.Labpack[0].package_type,
            "package_url": this.Labpack[0].package_url,
            "repository": this.Labpack[0].repository,
            "package_description": this.Labpack[0].package_description,
            "published": false,
            "submitedZenodo":true,
            "id_zenodo":this.id_zenodo,
            "tokenRepo": this.tokenForm.value.token
          }
        ).subscribe((data) => {
          this.alertService.presentSuccessAlert(this.translateService.instant("MSG_PUBLISH_REPO"))
          this._router.navigate(['experiment/step/' + this.experiment_id + "/step/menu/labpack"])
        })

      }
    })
  }

  confirmPublish() {
    this.alertService.presentConfirmAlert(
      this.translateService.instant("PUBLISH_ZENODO_PART05"),
      this.translateService.instant("MSG_PUBLISH"),
      this.translateService.instant("WORD_ACCEPT"),
      this.translateService.instant("WORD_CANCEL")
    ).then((data) => {
      if (data.isConfirmed) {
        this.publishRepo()
      }
    })
  }


  confirmCreateRepo() {
    this.alertService.presentConfirmAlert(
      this.translateService.instant("PUBLISH_ZENODO_PART02"),
      this.translateService.instant("MSG_CREATE_REPO"),
      this.translateService.instant("WORD_ACCEPT"),
      this.translateService.instant("WORD_CANCEL")
    ).then((data) => {
      if (data.isConfirmed) {
        this.createRepository()


      }
    })
  }






}