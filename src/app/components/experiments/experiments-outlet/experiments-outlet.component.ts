import { AfterContentInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Location } from '@angular/common'
import { ExperimentService } from '../../../services/experiment.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-experiments-outlet',
  templateUrl: './experiments-outlet.component.html',
  styleUrls: ['./experiments-outlet.component.scss']
})
export class ExperimentsOutletComponent implements AfterContentInit {
  activeCrumbs: string[];
  experiment: Record<string, any> = null;
  experimentId: string = null;
  routerSubscription: Subscription;
  details_option: any
  show: boolean = true
  constructor(
    private router: Router,
    private acRoute: ActivatedRoute,
    private experimentsService: ExperimentService,
    private location: Location,
    private _authService:AuthService,
  ) { }
  ngAfterContentInit(): void {
    this.details_option = this.acRoute.snapshot.paramMap.get('menu');
    console.log("Parameter Menu "+ this.details_option)
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
  getCurrentExperimentId(): string {
    return this.acRoute.snapshot.paramMap.get('id');
  }
  getExperiment() {
    this.experiment = null;

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

  gotoHome() {
    this.router.navigate(['/home'])
  }

  colapseMenu() {
    this.show = false
  }

  OpenMenu() {
    this.show = true
  }

  logout(){
    this._authService.logout()
  }
  gotoDetails() {
    console.log("Parameter Menu "+ this.details_option)
    this.router.navigate(['/experiment/step/' + this.experimentId + '/step/details/details'])
  }

  StepbyStepOption() {
    this.details_option = this.acRoute.snapshot.paramMap.get('menu');
    if (this.details_option == "details") {
      this.location.back()
    }else {
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
