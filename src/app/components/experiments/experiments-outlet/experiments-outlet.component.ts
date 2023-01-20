import { AfterContentInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import {ExperimentService} from '../../../services/experiment.service';

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
  constructor(
    private router: Router,
    private acRoute: ActivatedRoute,
    private experimentsService: ExperimentService,
  ) { }
  ngAfterContentInit(): void {
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
    console.log({experimentId: this.experimentId})
    this.experimentsService.get({_id: this.experimentId}).subscribe(
      (data) => {
        if (data.response.length > 0) {
          this.experiment = data.response[0];
        } else {
          this.experiment = null;
          this.router.navigate(['/experiment/step']);
        }
      },
      (error) => {
        console.log(error);
        this.router.navigate(['/experiment/step']);
      }
    )
  }

gotoHome(){
  this.router.navigate(['/home'])
}

gotoDetails(){
  this.router.navigate(['/experiment/step/'+this.experimentId+'/step/menu/details'])
}

StepbyStepOption(){
  this.router.navigate(['/experiment/step'])
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
