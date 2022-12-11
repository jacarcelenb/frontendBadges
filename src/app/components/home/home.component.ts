import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
 user: string
  constructor(private tokenService: TokenStorageService) { }



  ngOnInit() {
    console.log(this.tokenService.getUser().full_name)
    this.user = this.tokenService.getUser().full_name

  }

}
