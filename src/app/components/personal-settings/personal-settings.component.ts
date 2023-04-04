import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ArtifactController } from 'src/app/controllers/artifact.controller';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { ExperimenterService } from 'src/app/services/experimenter.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { newStorageRefForArtifact, parseArtifactNameForStorage } from 'src/app/utils/parsers';

@Component({
  selector: 'app-personal-settings',
  templateUrl: './personal-settings.component.html',
  styleUrls: ['./personal-settings.component.scss']
})
export class PersonalSettingsComponent implements OnInit {
 user:any = {};
 userForm: FormGroup;
 selectedFileArtifact: FileList;
 progressBarValueArtifact = '';
 //profilephoto
 @ViewChild('profilephoto') profilephoto: ElementRef;
  id_user: any;
  constructor(private tokeService: TokenStorageService,
    private experimenterService:ExperimenterService,
    private artifactController: ArtifactController,
    private formBuilder: FormBuilder,
    private _alertService: AlertService,
    private _translateService: TranslateService) { }

  ngOnInit(): void {
    this.user = this.tokeService.getUser()
    this.initForm();
    this.showDataUser();
  }

  initForm() {

    this.userForm = this.formBuilder.group({
      identification: [''],
      full_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      affiliation: ['', Validators.required],
      website: [''],
      phone: [''],
      gender: [''],
      country: [''],
      profile: ['', Validators.required],
      userphoto: ['', Validators.required]

    });

  }



  showDataUser() {
    this.id_user = this.user.id;
    this.userForm.controls['full_name'].setValue(this.user.full_name)
    this.userForm.controls['email'].setValue(this.user.email)
    this.userForm.controls['affiliation'].setValue(this.user.affiliation)
    this.userForm.controls["website"].setValue(this.user.website)
    this.userForm.controls["profile"].setValue(this.user.profile)
    this.userForm.controls["gender"].setValue(this.user.gender)



  }


  chooseFileArtifact(event) {
    this.selectedFileArtifact = event.target.files;
    if (this.selectedFileArtifact.item(0)) {
      var re = /(?:\.([^.]+))?$/;
      const currentFile = this.selectedFileArtifact.item(0);
      let [, extension] = re.exec(currentFile.name);
      extension = extension.toUpperCase();

      this.uploadArtifact();
    }
  }


  uploadArtifact() {
    const artifact_name = parseArtifactNameForStorage(
      this.selectedFileArtifact.item(0).name,
    );
    const storage_ref = newStorageRefForArtifact(
      'image',
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
        this.userForm.get('userphoto').setValue(file_url);
      },
    );
  }

  updateUser(){
    const user = {
      identification: this.userForm.value.identification,
      full_name: this.userForm.value.full_name,
      country: this.userForm.value.country,
      affiliation: this.userForm.value.affiliation,
      phone: this.userForm.value.phone,
      email: this.userForm.value.email,
      profile: this.userForm.value.profile,
      website: this.userForm.value.website,
      gender: this.userForm.value.gender,
      userphoto: this.userForm.value.userphoto
    };

    this.experimenterService.updateUser(this.id_user, user).subscribe((data: any) => {
      this._alertService.presentSuccessAlert(
        this._translateService.instant('UPDATED_EXPERIMENT')
      );

    })
  }

  getListUsers(id_user: any){
    this.experimenterService.getUsers({_id:id_user}).subscribe((data:any)=>{
    })
  }





}
