import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-upload-package',
  templateUrl: './upload-package.component.html',
  styleUrls: ['./upload-package.component.scss']
})
export class UploadPackageComponent implements OnInit {
  isSelected: boolean = true;
  isTokenOption: boolean = true;
  NoPersonalToken: boolean = true;
 @ViewChild('contentrepo') contentrepo :ElementRef;
  showOptImage: boolean;
  showOptPublication: boolean;
  constructor() { }

  ngOnInit(): void {
  }

  onChangeOption(checked: boolean) {
    this.isSelected = checked;
  }ElementRefElementRefElementRef
  onCheckTokenOption(checked: boolean) {
    this.isTokenOption = checked;
  }

  onCheckPersonalToken(checked: boolean) {
    this.NoPersonalToken = checked;
  }

  verifyContent(){
   if (this.contentrepo.nativeElement.value=='publication') {
        this.showOptPublication = true;
        this.showOptImage = false;
   }else if(this.contentrepo.nativeElement.value=='image'){
        this.showOptImage = true;
        this.showOptPublication = false;
   } else{
     this.showOptImage = false;
     this.showOptPublication = false;
   }
  }

}
