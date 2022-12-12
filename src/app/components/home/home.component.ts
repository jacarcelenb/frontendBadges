import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user: string
  islogged: boolean = false
  constructor(private tokenService: TokenStorageService) { }



  ngOnInit() {

    this.validateLogin()

  }

  validateLogin() {
    if (this.tokenService?.getUser()== null) {
      this.islogged = false;
    } else {
      this.islogged = true;
    }
  }

  click(){
    alert("Testing")
  }

}
