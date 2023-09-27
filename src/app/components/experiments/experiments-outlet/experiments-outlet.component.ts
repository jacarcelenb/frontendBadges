import { AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Location } from '@angular/common'
import { ExperimentService } from '../../../services/experiment.service';
import { AuthService } from 'src/app/services/auth.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { ExperimenterService } from 'src/app/services/experimenter.service';

@Component({
  selector: 'app-experiments-outlet',
  templateUrl: './experiments-outlet.component.html',
  styleUrls: ['./experiments-outlet.component.scss']
})
export class ExperimentsOutletComponent implements AfterContentInit, AfterViewInit {
  activeCrumbs: string[];
  experiment: Record<string, any> = null;
  experimentId: string = null;
  routerSubscription: Subscription;
  details_option: any
  show: boolean = false
  autoplay: number = 0
  styleSelect: boolean = true;
  user: any
  @ViewChild('profilephoto') profilephoto: ElementRef;
  url: string;
  oldPathImage: any;
  ruta: string = "../../../assets/images/1486564400-account_81513.png"
  constructor(
    private router: Router,
    private acRoute: ActivatedRoute,
    private experimentsService: ExperimentService,
    private location: Location,
    private _authService: AuthService,
    private tokenStorageService: TokenStorageService,
    private experimenterService: ExperimenterService
  ) { }
  ngAfterContentInit(): void {
    this.user = this.tokenStorageService.getUser();
    this.details_option = this.acRoute.snapshot.paramMap.get('menu');
    this.activeCrumbs = this.parseChildRoute(this.router.url);
    this.experimentId = this.getCurrentExperimentId();
    this.getExperiment();

    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe(() => {
      this.experimentId = this.getCurrentExperimentId();
      this.activeCrumbs = this.parseChildRoute(this.router.url);
      this.getExperiment();
    });
  }
  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.getUser(this.user._id)
    console.table({message:"testing"})
  }
  getCurrentExperimentId(): string {
    return this.acRoute.snapshot.paramMap.get('id');
  }
  getExperiment() {
    this.experiment = null;
   if(this.experimentId != null){
    this.experimentsService.get({ _id: this.experimentId }).subscribe(
      (data) => {
        if (data.response.length > 0) {
          this.experiment = data.response[0];
        } else {
          this.experiment = null;
          this.router.navigate(['/experiment/step']);
        }
      },
      (error) => {

        this.router.navigate(['/experiment/step']);
      }
    )
   }

  }

  getUser(id_user: any) {
    this.experimenterService.getUsers({ _id: id_user }).subscribe((data: any) => {
      this.oldPathImage = data.response[0].userphoto
      this.VerifyUserHasPhoto()
    })
  }


  VerifyUserHasPhoto() {
    if (this.oldPathImage?.length > 0  && this.oldPathImage !="No se registra") {
      this.ruta = this.oldPathImage
    } else {
      this.ruta = "../../../../assets/images/1486564400-account_81513.png";
    }
  }



  gotoHome() {
    this.router.navigate(['/home'])
  }

  colapseMenu() {
    this.show = false
  }
  changeAutoplay() {
    this.autoplay = 1
    this.url = "https://www.youtube.com/embed/iAMNel68YPo?autoplay=" + 1
  }

  OpenMenu() {
    this.show = true
    this.VerifyUserHasPhoto();
  }

  logout() {
    this._authService.logout()
  }
  gotoDetails() {
    this.router.navigate(['/experiment/step/' + this.experimentId + '/step/details/details'])
  }

  StepbyStepOption() {
    this.details_option = this.acRoute.snapshot.paramMap.get('menu');
    if (this.details_option == "details") {
      this.location.back()
    } else {
      this.router.navigate(['/experiment/step'])
    }

  }
  parseChildRoute(route: string): string[] {
    const routeParts = route.split('/');
    routeParts.shift();
    const skipExperimentId = 2;
    const crumbs = routeParts.slice(
      skipExperimentId,
    );
    return crumbs;
  }
}
