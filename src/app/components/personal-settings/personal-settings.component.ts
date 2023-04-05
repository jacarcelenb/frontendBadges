import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
export class PersonalSettingsComponent implements OnInit, AfterViewInit {
  user: any = {};
  userForm: FormGroup;
  selectedFileArtifact: FileList;
  progressBarValueArtifact = '';
  uploadImage: boolean = false;
  //profilephoto
  @ViewChild('profilephoto') profilephoto: ElementRef;
  id_user: any;
  url_file: string;
  constructor(private tokeService: TokenStorageService,
    private experimenterService: ExperimenterService,
    private artifactController: ArtifactController,
    private formBuilder: FormBuilder,
    private _alertService: AlertService,
    private _translateService: TranslateService) { }
  ngAfterViewInit(): void {
    console.log(this.profilephoto)
    this.VerifyUserHasPhoto();



  }

  VerifyUserHasPhoto() {
    if (this.userForm.value.userphoto.length > 0) {
      this.profilephoto.nativeElement.src = this.userForm.value.userphoto;
    } else {
      this.uploadImage = false
    }
  }

  ngOnInit(): void {
    this.user = this.tokeService.getUser()
    console.log(this.user)
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
      userphoto: ['', Validators.required],
      file_location_path: ['', Validators.required],

    });

  }
  showDataUser() {
    this.id_user = this.user._id;
    this.userForm.controls['full_name'].setValue(this.user.full_name)
    this.userForm.controls['email'].setValue(this.user.email)
    this.userForm.controls['affiliation'].setValue(this.user.affiliation)
    this.userForm.controls["website"].setValue(this.user.website)
    this.userForm.controls["profile"].setValue(this.user.profile)
    this.userForm.controls["gender"].setValue(this.user.gender)
    this.userForm.controls["userphoto"].setValue(this.user.userphoto)
    this.userForm.controls["file_location_path"].setValue(this.user.file_location_path)

    console.log(this.userForm.value.full_name)
  }


  chooseFileArtifact(event) {
    this.selectedFileArtifact = event.target.files;
    if (this.selectedFileArtifact.item(0)) {
      var re = /(?:\.([^.]+))?$/;
      const currentFile = this.selectedFileArtifact.item(0);
      let [, extension] = re.exec(currentFile.name);
      extension = extension.toUpperCase();
      console.log(this.selectedFileArtifact)
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
        this.userForm.get('file_location_path').setValue(storage_ref);
        this.url_file = file_url;
        this.profilephoto.nativeElement.src = this.userForm.value.userphoto
        this.uploadImage = true;
        this.VerifyUserHasPhoto();
      },
    );
  }

  updateUser(operation: string) {
    if (operation == "upload") {
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
        userphoto: this.userForm.value.userphoto,
        file_location_path: this.userForm.value.file_location_path,
      };

      console.log(user)
      console.log(this.id_user)
      this.experimenterService.updateUser(this.id_user, user).subscribe((data: any) => {
        this._alertService.presentSuccessAlert(
          this._translateService.instant('MSG_IMAGE_UPLOAD_SUCCESS')

        );

      })
    } else {
      this.userForm.value.userphoto = ""
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
        userphoto: "",
        file_location_path: this.userForm.value.file_location_path,
      };

      this.experimenterService.updateUser(this.id_user, user).subscribe((data: any) => {
        this.getUser(this.id_user)
        this.VerifyUserHasPhoto()

      })
    }
  }


  cancelUploadImage() {
    this._alertService.presentConfirmAlert(
      this._translateService.instant('WORD_CONFIRM_CLICK'),
      this._translateService.instant('CONFIRM_MESSAGE'),
      this._translateService.instant('WORD_ACCEPT'),
      this._translateService.instant('WORD_CANCEL'),
    ).then((status) => {
      if (status.isConfirmed) {
        this.artifactController.deleteUploadImage(this.userForm.value.file_location_path)
        this.updateUser("cancel")
        this.VerifyUserHasPhoto()

      }

    });
  }

  getUser(id_user: any) {
    this.experimenterService.getUsers({ _id: id_user }).subscribe((data: any) => {
      this.userForm.controls['full_name'].setValue(data.response.full_name)
      this.userForm.controls['email'].setValue(data.response.email)
      this.userForm.controls['affiliation'].setValue(data.response.affiliation)
      this.userForm.controls["website"].setValue(data.response.website)
      this.userForm.controls["profile"].setValue(data.response.profile)
      this.userForm.controls["gender"].setValue(data.response.gender)
      this.userForm.controls["file_location_path"].setValue(data.response.file_location_path)
      this.profilephoto.nativeElement.src = data.response.userphoto

    })
  }





}
