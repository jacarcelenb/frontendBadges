import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-upload-package',
  templateUrl: './upload-package.component.html',
  styleUrls: ['./upload-package.component.scss']
})
export class UploadPackageComponent implements OnInit {
  isSelected: boolean = true;
  isTokenOption: boolean = true;
  NoPersonalToken: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  onChangeOption(checked: boolean) {
    this.isSelected = checked;
  }

  onCheckTokenOption(checked: boolean) {
    this.isTokenOption = checked;
  }

  onCheckPersonalToken(checked: boolean) {
    this.NoPersonalToken = checked;
  }

}
