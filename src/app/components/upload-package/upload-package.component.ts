import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from 'src/app/services/alert.service';
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
  @ViewChild('contentrepo') contentrepo: ElementRef;
  @ViewChild('nextButton') nextButton: ElementRef;

  showOptImage: boolean;
  showOptPublication: boolean;
  constructor(private formBuilder: FormBuilder,
    private labpackService: LabpackService,
    private alertService: AlertService,
    private translateService: TranslateService) { }

  ngOnInit(): void {
    this.initTokenForm()
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
    this.labpackService.validateToken(this.tokenForm.value.token).subscribe((data) => {
      if (data.response == 200) {
        this.nextButton.nativeElement.click();
      } else {
        this.alertService.presentErrorAlert(this.translateService.instant("MSG_INVALID_TOKEN"))
      }
    })
  }

  showData(){
    console.log(this.tokenForm.value);
    console.log(this.SecondPart.value);
  }

}
