import { AfterViewInit, Component, DoCheck, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { TranslateService } from '@ngx-translate/core';
import { Renderer } from 'html2canvas/dist/types/render/renderer';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Output() getLanguage: EventEmitter<string> = new EventEmitter();
  changestyle = false
  @ViewChild("sLanguage") sLanguage: ElementRef
  @Input() styleSelect: boolean
  isLogged: boolean = false;
  language: any
  idiom: string
  user = {
    full_name: "",
  }
  change_language: boolean = false;
  constructor(
    private _authService: AuthService,
    private translateService: TranslateService,
    private renderer2: Renderer2,
    private tokenStorageService: TokenStorageService,
  ) {
    translateService.addLangs(['en-us', 'es-ec']);
    translateService.setDefaultLang('en-us');
    const browserLang = translateService.getBrowserLang();
    translateService.use(browserLang.match(/en-us|es-ec/) ? browserLang : 'en-us');
  }


  selectLanguage(event: any) {
    this.translateService.use(event.target.value);
    this.getLanguage.emit(event.target.value)
  }


  ngOnInit(): void {

    if (this.styleSelect == true) {
      this.changestyle = this.styleSelect
    }

    this.getUser()
    this.ValidateLanguage();
    this.translateService.onLangChange.subscribe(() => {
      this.ValidateLanguage()
    });
  }


  getUser() {
    this.user = this.tokenStorageService.getUser();
    if (this.user != null) {
      this.isLogged = true
    }

  }
  logout() {
    this._authService.logout()
  }

  ValidateLanguage() {
    if (this.translateService.instant('LANG_SPANISH_EC') == "Español (ECU)") {
      this.change_language = false;
    } else {
      this.change_language = true;
    }
  }
}
