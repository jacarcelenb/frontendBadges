import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
@Component({
  selector: 'app-objetos-nav',
  templateUrl: './objetos-nav.component.html',
  styleUrls: ['./objetos-nav.component.scss']
})
export class ObjetosNavComponent implements OnInit {

  constructor(private tokenStorageService: TokenStorageService,
    private _authService: AuthService,
    private breakpointObserver: BreakpointObserver) { }

  isLogged: boolean = false
  user = {
    first_name: "",
    last_name: "",
  }
  ngOnInit(): void {
    this.getUser()
  }


  getUser() {
    this.user = this.tokenStorageService.getUser().user
    if (this.user != null) {
      this.isLogged = true
    }

  }
  logout(){
    this._authService.logout()
  }


  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

}
