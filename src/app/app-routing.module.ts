import { ExperimentsOutletComponent } from './components/experiments/experiments-outlet/experiments-outlet.component';
import { ExperimentDetailsComponent } from './components/experiments/experiment-details/experiment-details.component';
import { ExperimentListComponent } from './components/experiments/experiment-list/experiment-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/shared/login/login.component';
import { RegisterComponent } from './components/shared/register/register.component';
import { GroupDetailsComponent } from './components/groups/group-details/group-details.component';
import { ExperimentersListComponent } from './components/experimenters/experimenters-list/experimenters-list.component';
import { GroupListComponent } from './components/groups/group-list/group-list.component';
import { TaskListComponent } from './components/tasks/task-list/task-list.component';
import { ArtifactListComponent } from './components/artifacts/artifact-list/artifact-list.component';
import { BadgesDetailsComponent } from './components/badges/badges-details/badges-details.component';
import { AuthGuard } from './guards/AuthGuard';
import { LabpackListComponent } from './components/labpack/labpack-list/labpack-list.component';
import { AcmArtifactsListComponent } from './components/acm-artifacts/acm-artifacts-list/acm-artifacts-list.component';
import { GroupDetailsOutletComponentComponent } from './components/groups/group-details-outlet-component/group-details-outlet-component.component';
import { ParticipantListComponent } from './components/participants/participant-list/participant-list.component';
import { AboutpageComponent } from './components/shared/aboutpage/aboutpage.component';
import { NewLoginComponent } from './components/new-login/new-login.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { ChangeNewpasswordComponent } from './components/change-newpassword/change-newpassword.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { PersonalSettingsComponent } from './components/personal-settings/personal-settings.component';
import { UserGuideComponent } from './components/user-guide/user-guide.component';
import { UserGuideStepperComponent } from './components/user-guide-stepper/user-guide-stepper.component';
import { InputTimeComponent } from './components/generic/input-time/input-time.component';
import { MessageBtnComponent } from './components/message-btn/message-btn.component';
import { UploadPackageComponent } from './components/upload-package/upload-package.component';
import { SelectBadgeComponent } from './components/select-badge/select-badge.component';


const routes: Routes = [
  { path: 'home', component:NewLoginComponent, },
  { path: 'experiment/:step', children: [
    { path: ':id/step/:menu', component: ExperimentsOutletComponent, children: [
        { path: 'details', component: ExperimentDetailsComponent, canActivate: [AuthGuard] },
        { path: 'experiments', component: ExperimentListComponent, canActivate: [AuthGuard] },
        { path: 'experimenters', component: ExperimentersListComponent, canActivate: [AuthGuard] },
        { path: 'groups', component: GroupListComponent, canActivate: [AuthGuard] },
        { path: 'tasks', component: TaskListComponent, canActivate: [AuthGuard] },
        { path: 'artifacts', component: ArtifactListComponent, canActivate: [AuthGuard] },
        { path: 'artifacts_acm', component: AcmArtifactsListComponent, canActivate: [AuthGuard] },
        { path: 'badges', component: BadgesDetailsComponent, canActivate: [AuthGuard] },
        { path: 'labpack', component: LabpackListComponent, canActivate: [AuthGuard] },
        { path: 'select_badge', component: SelectBadgeComponent, canActivate: [AuthGuard] },
        { path: 'upload_labpack', component: UploadPackageComponent, canActivate: [AuthGuard] },
        { path: '**', redirectTo: 'experiments', pathMatch: 'full' },
      ]
    },
    { path: '', component: ExperimentListComponent, canActivate: [AuthGuard] }
  ]
},
  { path: 'groups/:group_id/experiment/:experiment_id', component: GroupDetailsOutletComponentComponent, children: [
      {path: 'details', component: GroupDetailsComponent, canActivate: [AuthGuard] },
      {path: 'participants', component: ParticipantListComponent, canActivate: [AuthGuard] },
      {path: '**', redirectTo: 'details', pathMatch: 'full' },
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'duraction', component: InputTimeComponent },
  { path: 'contact', component: FooterComponent },
  { path: 'changepassword', component: ChangeNewpasswordComponent },
  { path: 'forgotpassword', component: ForgotPasswordComponent },
  { path: 'message', component: MessageBtnComponent },
  { path: 'testStepper', component: UserGuideComponent,canActivate: [AuthGuard] },
  { path: 'help', component: UserGuideComponent, children: [
    { path: 'userguide', component: UserGuideComponent , canActivate: [AuthGuard]  },
  ]
},
  { path: 'personalsettings', component: PersonalSettingsComponent, canActivate: [AuthGuard] },
  { path: '**', pathMatch: 'full', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes ,{
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
