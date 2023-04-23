import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-guide',
  templateUrl: './user-guide.component.html',
  styleUrls: ['./user-guide.component.scss']
})
export class UserGuideComponent implements OnInit {
  panelOpenState: boolean = false;
  display: boolean = false;
  TutorialPage: boolean = true;
  WhataboutExperimentPage: boolean = false;
  CreateExperimentPage: boolean = false;
  ExperimentTipsPage: boolean = false;
  WhataboutExperimenterPage: boolean = false;
  RegisterExperimenterPage: boolean = false;
  JoinExperimenterPage: boolean = false;
  TipsExperimenterPage: boolean = false;
  WhataboutGroupPage: boolean = false;
  RegisterGroupPage: boolean = false;
  TipsGroupPage: boolean = false;
  WhataboutTaskPage: boolean = false;
  RegisterTaskPage: boolean = false;
  TipsTaskPage: boolean = false;
  WhataboutArtifactPage: boolean = false;
  RegisterArtifactPage: boolean = false;
  TipsArtifactPage: boolean = false;
  WhataboutArtifactACMPage: boolean = false;
  RegisterArtifactACMPage: boolean = false;
  TipsArtifactACMPage: boolean = false;
  WhataboutBadgesPage: boolean = false;
  TipsBadgesPage: boolean = false;
  WhataboutLabpackPage: boolean = false;
  RegisterLabpackPage: boolean = false;
  TipsLabpackPage: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }
  gotoTutorialPage(){
    this.TutorialPage = true;
    this.WhataboutExperimentPage = false;
    this.CreateExperimentPage = false;
    this.ExperimentTipsPage = false;
    this.WhataboutExperimenterPage= false;
    this.RegisterExperimenterPage= false;
    this.JoinExperimenterPage= false;
    this.TipsExperimenterPage= false;
    this.WhataboutGroupPage= false;
    this.RegisterGroupPage= false;
    this.TipsGroupPage= false;
    this.WhataboutTaskPage = false;
    this.RegisterTaskPage= false;
    this.TipsTaskPage= false;
    this.WhataboutArtifactPage= false;
    this.RegisterArtifactPage= false;
    this.TipsArtifactPage= false;
    this.WhataboutArtifactACMPage = false;
    this.RegisterArtifactACMPage= false;
    this.TipsArtifactACMPage= false;
    this.WhataboutBadgesPage= false;
    this.TipsBadgesPage= false;
    this.WhataboutLabpackPage= false;
    this.RegisterLabpackPage= false;
    this.TipsLabpackPage= false;
   }
 gotoWhatAboutExperimentPage(){
  this.TutorialPage = false;
  this.WhataboutExperimentPage = true;
  this.CreateExperimentPage = false;
  this.ExperimentTipsPage = false;
  this.WhataboutExperimenterPage= false;
  this.RegisterExperimenterPage= false;
  this.JoinExperimenterPage= false;
  this.TipsExperimenterPage= false;
  this.WhataboutTaskPage = false;
  this.RegisterTaskPage= false;
  this.TipsTaskPage= false;
  this.WhataboutGroupPage= false;
  this.RegisterGroupPage= false;
  this.TipsGroupPage= false;
  this.WhataboutArtifactPage= false;
  this.RegisterArtifactPage= false;
  this.TipsArtifactPage= false;
  this.WhataboutArtifactACMPage = false;
  this.RegisterArtifactACMPage= false;
  this.TipsArtifactACMPage= false;
  this.WhataboutBadgesPage= false;
  this.TipsBadgesPage= false;
  this.WhataboutLabpackPage= false;
  this.RegisterLabpackPage= false;
  this.TipsLabpackPage= false;
 }

 gotoCreateExperimentPage(){
  this.TutorialPage = false;
  this.WhataboutExperimentPage = false;
  this.CreateExperimentPage = true;
  this.ExperimentTipsPage = false;
  this.WhataboutExperimenterPage= false;
  this.RegisterExperimenterPage= false;
  this.JoinExperimenterPage= false;
  this.TipsExperimenterPage= false;
  this.WhataboutGroupPage= false;
  this.RegisterGroupPage= false;
  this.TipsGroupPage= false;
  this.WhataboutTaskPage = false;
  this.RegisterTaskPage= false;
  this.TipsTaskPage= false;
  this.WhataboutArtifactPage= false;
  this.RegisterArtifactPage= false;
  this.TipsArtifactPage= false;
  this.WhataboutArtifactACMPage = false;
  this.RegisterArtifactACMPage= false;
  this.TipsArtifactACMPage= false;
  this.WhataboutBadgesPage= false;
  this.TipsBadgesPage= false;
  this.WhataboutLabpackPage= false;
  this.RegisterLabpackPage= false;
  this.TipsLabpackPage= false;
 }

 gotoExperimentTipsPage(){
  this.WhataboutTaskPage = false;
  this.RegisterTaskPage= false;
  this.TipsTaskPage= false;
  this.TutorialPage = false;
  this.WhataboutExperimentPage = false;
  this.CreateExperimentPage = false;
  this.ExperimentTipsPage = true;
  this.WhataboutExperimenterPage= false;
  this.RegisterExperimenterPage= false;
  this.JoinExperimenterPage= false;
  this.TipsExperimenterPage= false;
  this.WhataboutGroupPage= false;
  this.RegisterGroupPage= false;
  this.TipsGroupPage= false;
  this.WhataboutArtifactPage= false;
  this.RegisterArtifactPage= false;
  this.TipsArtifactPage= false;
  this.WhataboutArtifactACMPage = false;
  this.RegisterArtifactACMPage= false;
  this.TipsArtifactACMPage= false;
  this.WhataboutBadgesPage= false;
  this.TipsBadgesPage= false;
  this.WhataboutLabpackPage= false;
  this.RegisterLabpackPage= false;
  this.TipsLabpackPage= false;
 }

 gotoWhataboutExperimenterPage(){
  this.WhataboutTaskPage = false;
  this.RegisterTaskPage= false;
  this.TipsTaskPage= false;
  this.TutorialPage = false;
  this.WhataboutExperimentPage = false;
  this.CreateExperimentPage = false;
  this.ExperimentTipsPage = false;
  this.WhataboutExperimenterPage= true;
  this.RegisterExperimenterPage= false;
  this.JoinExperimenterPage= false;
  this.TipsExperimenterPage= false;
  this.WhataboutGroupPage= false;
  this.RegisterGroupPage= false;
  this.TipsGroupPage= false;
  this.WhataboutArtifactPage= false;
  this.RegisterArtifactPage= false;
  this.TipsArtifactPage= false;
  this.WhataboutArtifactACMPage = false;
  this.RegisterArtifactACMPage= false;
  this.TipsArtifactACMPage= false;
  this.WhataboutBadgesPage= false;
  this.TipsBadgesPage= false;
  this.WhataboutLabpackPage= false;
  this.RegisterLabpackPage= false;
  this.TipsLabpackPage= false;
 }


 gotoRegisterExperimenterPage(){
  this.WhataboutTaskPage = false;
  this.RegisterTaskPage= false;
  this.TipsTaskPage= false;
  this.TutorialPage = false;
  this.WhataboutExperimentPage = false;
  this.CreateExperimentPage = false;
  this.ExperimentTipsPage = false;
  this.WhataboutExperimenterPage= false;
  this.RegisterExperimenterPage= true;
  this.JoinExperimenterPage= false;
  this.TipsExperimenterPage= false;
  this.WhataboutGroupPage= false;
  this.RegisterGroupPage= false;
  this.TipsGroupPage= false;
  this.WhataboutArtifactPage= false;
  this.RegisterArtifactPage= false;
  this.TipsArtifactPage= false;
  this.WhataboutArtifactACMPage = false;
  this.RegisterArtifactACMPage= false;
  this.TipsArtifactACMPage= false;
  this.WhataboutBadgesPage= false;
  this.TipsBadgesPage= false;
  this.WhataboutLabpackPage= false;
  this.RegisterLabpackPage= false;
  this.TipsLabpackPage= false;
 }

 gotoJoinExperimenterPage(){
  this.WhataboutTaskPage = false;
  this.RegisterTaskPage= false;
  this.TipsTaskPage= false;
  this.TutorialPage = false;
  this.WhataboutExperimentPage = false;
  this.CreateExperimentPage = false;
  this.ExperimentTipsPage = false;
  this.WhataboutExperimenterPage= false;
  this.RegisterExperimenterPage= false;
  this.JoinExperimenterPage= true;
  this.TipsExperimenterPage= false;
  this.WhataboutGroupPage= false;
  this.RegisterGroupPage= false;
  this.TipsGroupPage= false;
  this.WhataboutArtifactPage= false;
  this.RegisterArtifactPage= false;
  this.TipsArtifactPage= false;
  this.WhataboutArtifactACMPage = false;
  this.RegisterArtifactACMPage= false;
  this.TipsArtifactACMPage= false;
  this.WhataboutBadgesPage= false;
  this.TipsBadgesPage= false;
  this.WhataboutLabpackPage= false;
  this.RegisterLabpackPage= false;
  this.TipsLabpackPage= false;
 }

 gotoTipsExperimenterPage(){
  this.WhataboutTaskPage = false;
  this.RegisterTaskPage= false;
  this.TipsTaskPage= false;
  this.TutorialPage = false;
  this.WhataboutExperimentPage = false;
  this.CreateExperimentPage = false;
  this.ExperimentTipsPage = false;
  this.WhataboutExperimenterPage= false;
  this.RegisterExperimenterPage= false;
  this.JoinExperimenterPage= false;
  this.TipsExperimenterPage= true;
  this.WhataboutGroupPage= false;
  this.RegisterGroupPage= false;
  this.TipsGroupPage= false;
  this.WhataboutArtifactPage= false;
  this.RegisterArtifactPage= false;
  this.TipsArtifactPage= false;
  this.WhataboutArtifactACMPage = false;
  this.RegisterArtifactACMPage= false;
  this.TipsArtifactACMPage= false;
  this.WhataboutBadgesPage= false;
  this.TipsBadgesPage= false;
  this.WhataboutLabpackPage= false;
  this.RegisterLabpackPage= false;
  this.TipsLabpackPage= false;
 }

 gotoWhataboutTaskPage(){
  this.WhataboutTaskPage = true;
  this.RegisterTaskPage= false;
  this.TipsTaskPage= false;
  this.TutorialPage = false;
  this.WhataboutExperimentPage = false;
  this.CreateExperimentPage = false;
  this.ExperimentTipsPage = false;
  this.WhataboutExperimenterPage= false;
  this.RegisterExperimenterPage= false;
  this.JoinExperimenterPage= false;
  this.TipsExperimenterPage= false;
  this.WhataboutGroupPage= false;
  this.RegisterGroupPage= false;
  this.TipsGroupPage= false;
  this.WhataboutArtifactPage= false;
  this.RegisterArtifactPage= false;
  this.TipsArtifactPage= false;
  this.WhataboutArtifactACMPage = false;
  this.RegisterArtifactACMPage= false;
  this.TipsArtifactACMPage= false;
  this.WhataboutBadgesPage= false;
  this.TipsBadgesPage= false;
  this.WhataboutLabpackPage= false;
  this.RegisterLabpackPage= false;
  this.TipsLabpackPage= false;
 }

 gotoRegisterTaskPage(){
  this.WhataboutTaskPage = false;
  this.RegisterTaskPage= true;
  this.TipsTaskPage= false;
  this.TutorialPage = false;
  this.WhataboutExperimentPage = false;
  this.CreateExperimentPage = false;
  this.ExperimentTipsPage = false;
  this.WhataboutExperimenterPage= false;
  this.RegisterExperimenterPage= false;
  this.JoinExperimenterPage= false;
  this.TipsExperimenterPage= false;
  this.WhataboutGroupPage= false;
  this.RegisterGroupPage= false;
  this.TipsGroupPage= false;
  this.WhataboutArtifactPage= false;
  this.RegisterArtifactPage= false;
  this.TipsArtifactPage= false;
  this.WhataboutArtifactACMPage = false;
  this.RegisterArtifactACMPage= false;
  this.TipsArtifactACMPage= false;
  this.WhataboutBadgesPage= false;
  this.TipsBadgesPage= false;
  this.WhataboutLabpackPage= false;
  this.RegisterLabpackPage= false;
  this.TipsLabpackPage= false;
 }

 gotoTipsTaskPage(){
  this.WhataboutTaskPage = false;
  this.RegisterTaskPage= false;
  this.TipsTaskPage= true;
  this.TutorialPage = false;
  this.WhataboutExperimentPage = false;
  this.CreateExperimentPage = false;
  this.ExperimentTipsPage = false;
  this.WhataboutExperimenterPage= false;
  this.RegisterExperimenterPage= false;
  this.JoinExperimenterPage= false;
  this.TipsExperimenterPage= false;
  this.WhataboutGroupPage= false;
  this.RegisterGroupPage= false;
  this.TipsGroupPage= false;
  this.WhataboutArtifactPage= false;
  this.RegisterArtifactPage= false;
  this.TipsArtifactPage= false;
  this.WhataboutArtifactACMPage = false;
  this.RegisterArtifactACMPage= false;
  this.TipsArtifactACMPage= false;
  this.WhataboutBadgesPage= false;
  this.TipsBadgesPage= false;
  this.WhataboutLabpackPage= false;
  this.RegisterLabpackPage= false;
  this.TipsLabpackPage= false;
 }

 gotoWhataboutGroupPage(){
  this.WhataboutTaskPage = false;
  this.RegisterTaskPage= false;
  this.TipsTaskPage= false;
  this.TutorialPage = false;
  this.WhataboutExperimentPage = false;
  this.CreateExperimentPage = false;
  this.ExperimentTipsPage = false;
  this.WhataboutExperimenterPage= false;
  this.RegisterExperimenterPage= false;
  this.JoinExperimenterPage= false;
  this.TipsExperimenterPage= false;
  this.WhataboutGroupPage= true;
  this.RegisterGroupPage= false;
  this.TipsGroupPage= false;
  this.WhataboutArtifactPage= false;
  this.RegisterArtifactPage= false;
  this.TipsArtifactPage= false;
  this.WhataboutArtifactACMPage = false;
  this.RegisterArtifactACMPage= false;
  this.TipsArtifactACMPage= false;
  this.WhataboutBadgesPage= false;
  this.TipsBadgesPage= false;
  this.WhataboutLabpackPage= false;
  this.RegisterLabpackPage= false;
  this.TipsLabpackPage= false;
 }

 gotoRegisterGroupPage(){
  this.WhataboutTaskPage = false;
  this.RegisterTaskPage= false;
  this.TipsTaskPage= false;
  this.TutorialPage = false;
  this.WhataboutExperimentPage = false;
  this.CreateExperimentPage = false;
  this.ExperimentTipsPage = false;
  this.WhataboutExperimenterPage= false;
  this.RegisterExperimenterPage= false;
  this.JoinExperimenterPage= false;
  this.TipsExperimenterPage= false;
  this.WhataboutGroupPage= false;
  this.RegisterGroupPage= true;
  this.TipsGroupPage= false;
  this.WhataboutArtifactPage= false;
  this.RegisterArtifactPage= false;
  this.TipsArtifactPage= false;
  this.WhataboutArtifactACMPage = false;
  this.RegisterArtifactACMPage= false;
  this.TipsArtifactACMPage= false;
  this.WhataboutBadgesPage= false;
  this.TipsBadgesPage= false;
  this.WhataboutLabpackPage= false;
  this.RegisterLabpackPage= false;
  this.TipsLabpackPage= false;
 }

 gotoTipsGroupPage(){
  this.WhataboutTaskPage = false;
  this.RegisterTaskPage= false;
  this.TipsTaskPage= false;
  this.TutorialPage = false;
  this.WhataboutExperimentPage = false;
  this.CreateExperimentPage = false;
  this.ExperimentTipsPage = false;
  this.WhataboutExperimenterPage= false;
  this.RegisterExperimenterPage= false;
  this.JoinExperimenterPage= false;
  this.TipsExperimenterPage= false;
  this.WhataboutGroupPage= false;
  this.RegisterGroupPage= false;
  this.TipsGroupPage= true;
  this.WhataboutArtifactPage= false;
  this.RegisterArtifactPage= false;
  this.TipsArtifactPage= false;
  this.WhataboutArtifactACMPage = false;
  this.RegisterArtifactACMPage= false;
  this.TipsArtifactACMPage= false;
  this.WhataboutBadgesPage= false;
  this.TipsBadgesPage= false;
  this.WhataboutLabpackPage= false;
  this.RegisterLabpackPage= false;
  this.TipsLabpackPage= false;
 }



 gotoWhataboutArtifactPage(){
  this.WhataboutTaskPage = false;
  this.RegisterTaskPage= false;
  this.TipsTaskPage= false;
  this.TutorialPage = false;
  this.WhataboutExperimentPage = false;
  this.CreateExperimentPage = false;
  this.ExperimentTipsPage = false;
  this.WhataboutExperimenterPage= false;
  this.RegisterExperimenterPage= false;
  this.JoinExperimenterPage= false;
  this.TipsExperimenterPage= false;
  this.WhataboutGroupPage= false;
  this.RegisterGroupPage= false;
  this.TipsGroupPage= false;
  this.WhataboutArtifactPage= true;
  this.RegisterArtifactPage= false;
  this.TipsArtifactPage= false;
  this.WhataboutArtifactACMPage = false;
  this.RegisterArtifactACMPage= false;
  this.TipsArtifactACMPage= false;
  this.WhataboutBadgesPage= false;
  this.TipsBadgesPage= false;
  this.WhataboutLabpackPage= false;
  this.RegisterLabpackPage= false;
  this.TipsLabpackPage= false;
 }

 gotoRegisterArtifactPage(){
  this.WhataboutTaskPage = false;
  this.RegisterTaskPage= false;
  this.TipsTaskPage= false;
  this.TutorialPage = false;
  this.WhataboutExperimentPage = false;
  this.CreateExperimentPage = false;
  this.ExperimentTipsPage = false;
  this.WhataboutExperimenterPage= false;
  this.RegisterExperimenterPage= false;
  this.JoinExperimenterPage= false;
  this.TipsExperimenterPage= false;
  this.WhataboutGroupPage= false;
  this.RegisterGroupPage= false;
  this.TipsGroupPage= false;
  this.WhataboutArtifactPage= false;
  this.RegisterArtifactPage= true;
  this.TipsArtifactPage= false;
  this.WhataboutArtifactACMPage = false;
  this.RegisterArtifactACMPage= false;
  this.TipsArtifactACMPage= false;
  this.WhataboutBadgesPage= false;
  this.TipsBadgesPage= false;
  this.WhataboutLabpackPage= false;
  this.RegisterLabpackPage= false;
  this.TipsLabpackPage= false;
 }

 gotoTipsArtifactPage(){
  this.WhataboutTaskPage = false;
  this.RegisterTaskPage= false;
  this.TipsTaskPage= false;
  this.TutorialPage = false;
  this.WhataboutExperimentPage = false;
  this.CreateExperimentPage = false;
  this.ExperimentTipsPage = false;
  this.WhataboutExperimenterPage= false;
  this.RegisterExperimenterPage= false;
  this.JoinExperimenterPage= false;
  this.TipsExperimenterPage= false;
  this.WhataboutGroupPage= false;
  this.RegisterGroupPage= false;
  this.TipsGroupPage= false;
  this.WhataboutArtifactPage= false;
  this.RegisterArtifactPage= false;
  this.TipsArtifactPage= true;
  this.WhataboutArtifactACMPage = false;
  this.RegisterArtifactACMPage= false;
  this.TipsArtifactACMPage= false;
  this.WhataboutBadgesPage= false;
  this.TipsBadgesPage= false;
  this.WhataboutLabpackPage= false;
  this.RegisterLabpackPage= false;
  this.TipsLabpackPage= false;
 }

 gotoWhataboutArtifactACMPage(){
  this.WhataboutTaskPage = false;
  this.RegisterTaskPage= false;
  this.TipsTaskPage= false;
  this.TutorialPage = false;
  this.WhataboutExperimentPage = false;
  this.CreateExperimentPage = false;
  this.ExperimentTipsPage = false;
  this.WhataboutExperimenterPage= false;
  this.RegisterExperimenterPage= false;
  this.JoinExperimenterPage= false;
  this.TipsExperimenterPage= false;
  this.WhataboutGroupPage= false;
  this.RegisterGroupPage= false;
  this.TipsGroupPage= false;
  this.WhataboutArtifactPage= false;
  this.RegisterArtifactPage= false;
  this.TipsArtifactPage= false;
  this.WhataboutArtifactACMPage = true;
  this.RegisterArtifactACMPage= false;
  this.TipsArtifactACMPage= false;
  this.WhataboutBadgesPage= false;
  this.TipsBadgesPage= false;
  this.WhataboutLabpackPage= false;
  this.RegisterLabpackPage= false;
  this.TipsLabpackPage= false;
 }

 gotoRegisterArtifactACMPage(){
  this.WhataboutTaskPage = false;
  this.RegisterTaskPage= false;
  this.TipsTaskPage= false;
  this.TutorialPage = false;
  this.WhataboutExperimentPage = false;
  this.CreateExperimentPage = false;
  this.ExperimentTipsPage = false;
  this.WhataboutExperimenterPage= false;
  this.RegisterExperimenterPage= false;
  this.JoinExperimenterPage= false;
  this.TipsExperimenterPage= false;
  this.WhataboutGroupPage= false;
  this.RegisterGroupPage= false;
  this.TipsGroupPage= false;
  this.WhataboutArtifactPage= false;
  this.RegisterArtifactPage= false;
  this.TipsArtifactPage= false;
  this.WhataboutArtifactACMPage = false;
  this.RegisterArtifactACMPage= true;
  this.TipsArtifactACMPage= false;
  this.WhataboutBadgesPage= false;
  this.TipsBadgesPage= false;
  this.WhataboutLabpackPage= false;
  this.RegisterLabpackPage= false;
  this.TipsLabpackPage= false;
 }

 gotoTipsArtifactACMPage(){
  this.WhataboutTaskPage = false;
  this.RegisterTaskPage= false;
  this.TipsTaskPage= false;
  this.TutorialPage = false;
  this.WhataboutExperimentPage = false;
  this.CreateExperimentPage = false;
  this.ExperimentTipsPage = false;
  this.WhataboutExperimenterPage= false;
  this.RegisterExperimenterPage= false;
  this.JoinExperimenterPage= false;
  this.TipsExperimenterPage= false;
  this.WhataboutGroupPage= false;
  this.RegisterGroupPage= false;
  this.TipsGroupPage= false;
  this.WhataboutTaskPage = false;
  this.RegisterTaskPage= false;
  this.TipsTaskPage= false;
  this.WhataboutArtifactPage= false;
  this.RegisterArtifactPage= false;
  this.TipsArtifactPage= false;
  this.WhataboutArtifactACMPage = false;
  this.RegisterArtifactACMPage= false;
  this.TipsArtifactACMPage= true;
  this.WhataboutBadgesPage= false;
  this.TipsBadgesPage= false;
  this.WhataboutLabpackPage= false;
  this.RegisterLabpackPage= false;
  this.TipsLabpackPage= false;
 }

 gotoWhataboutBadgesPage(){
  this.WhataboutTaskPage = false;
  this.RegisterTaskPage= false;
  this.TipsTaskPage= false;
  this.TutorialPage = false;
  this.WhataboutExperimentPage = false;
  this.CreateExperimentPage = false;
  this.ExperimentTipsPage = false;
  this.WhataboutExperimenterPage= false;
  this.RegisterExperimenterPage= false;
  this.JoinExperimenterPage= false;
  this.TipsExperimenterPage= false;
  this.WhataboutGroupPage= false;
  this.RegisterGroupPage= false;
  this.TipsGroupPage= false;
  this.WhataboutArtifactPage= false;
  this.RegisterArtifactPage= false;
  this.TipsArtifactPage= false;
  this.WhataboutArtifactACMPage = false;
  this.RegisterArtifactACMPage= false;
  this.TipsArtifactACMPage= false;
  this.WhataboutBadgesPage= true;
  this.TipsBadgesPage= false;
  this.WhataboutLabpackPage= false;
  this.RegisterLabpackPage= false;
  this.TipsLabpackPage= false;
 }

 gotoTipsBadgesPage(){
  this.WhataboutTaskPage = false;
  this.RegisterTaskPage= false;
  this.TipsTaskPage= false;
  this.TutorialPage = false;
  this.WhataboutExperimentPage = false;
  this.CreateExperimentPage = false;
  this.ExperimentTipsPage = false;
  this.WhataboutExperimenterPage= false;
  this.RegisterExperimenterPage= false;
  this.JoinExperimenterPage= false;
  this.TipsExperimenterPage= false;
  this.WhataboutGroupPage= false;
  this.RegisterGroupPage= false;
  this.TipsGroupPage= false;
  this.WhataboutArtifactPage= false;
  this.RegisterArtifactPage= false;
  this.TipsArtifactPage= false;
  this.WhataboutArtifactACMPage = false;
  this.RegisterArtifactACMPage= false;
  this.TipsArtifactACMPage= false;
  this.WhataboutBadgesPage= false;
  this.TipsBadgesPage= true;
  this.WhataboutLabpackPage= false;
  this.RegisterLabpackPage= false;
  this.TipsLabpackPage= false;
 }

 gotoWhataboutLabpackPage(){
  this.WhataboutTaskPage = false;
  this.RegisterTaskPage= false;
  this.TipsTaskPage= false;
  this.TutorialPage = false;
  this.WhataboutExperimentPage = false;
  this.CreateExperimentPage = false;
  this.ExperimentTipsPage = false;
  this.WhataboutExperimenterPage= false;
  this.RegisterExperimenterPage= false;
  this.JoinExperimenterPage= false;
  this.TipsExperimenterPage= false;
  this.WhataboutGroupPage= false;
  this.RegisterGroupPage= false;
  this.TipsGroupPage= false;
  this.WhataboutArtifactPage= false;
  this.RegisterArtifactPage= false;
  this.TipsArtifactPage= false;
  this.WhataboutArtifactACMPage = false;
  this.RegisterArtifactACMPage= false;
  this.TipsArtifactACMPage= false;
  this.WhataboutBadgesPage= false;
  this.TipsBadgesPage= false;
  this.WhataboutLabpackPage= true;
  this.RegisterLabpackPage= false;
  this.TipsLabpackPage= false;
 }

 gotoRegisterLabpackPage(){
  this.WhataboutTaskPage = false;
  this.RegisterTaskPage= false;
  this.TipsTaskPage= false;
  this.TutorialPage = false;
  this.WhataboutExperimentPage = false;
  this.CreateExperimentPage = false;
  this.ExperimentTipsPage = false;
  this.WhataboutExperimenterPage= false;
  this.RegisterExperimenterPage= false;
  this.JoinExperimenterPage= false;
  this.TipsExperimenterPage= false;
  this.WhataboutGroupPage= false;
  this.RegisterGroupPage= false;
  this.TipsGroupPage= false;
  this.WhataboutArtifactPage= false;
  this.RegisterArtifactPage= false;
  this.TipsArtifactPage= false;
  this.WhataboutArtifactACMPage = false;
  this.RegisterArtifactACMPage= false;
  this.TipsArtifactACMPage= false;
  this.WhataboutBadgesPage= false;
  this.TipsBadgesPage= false;
  this.WhataboutLabpackPage= false;
  this.RegisterLabpackPage= true;
  this.TipsLabpackPage= false;
 }

 gotoTipsLabpackPage(){
  this.WhataboutTaskPage = false;
  this.RegisterTaskPage= false;
  this.TipsTaskPage= false;
  this.TutorialPage = false;
  this.WhataboutExperimentPage = false;
  this.CreateExperimentPage = false;
  this.ExperimentTipsPage = false;
  this.WhataboutExperimenterPage= false;
  this.RegisterExperimenterPage= false;
  this.JoinExperimenterPage= false;
  this.TipsExperimenterPage= false;
  this.WhataboutGroupPage= false;
  this.RegisterGroupPage= false;
  this.TipsGroupPage= false;
  this.WhataboutArtifactPage= false;
  this.RegisterArtifactPage= false;
  this.TipsArtifactPage= false;
  this.WhataboutArtifactACMPage = false;
  this.RegisterArtifactACMPage= false;
  this.TipsArtifactACMPage= false;
  this.WhataboutBadgesPage= false;
  this.TipsBadgesPage= false;
  this.WhataboutLabpackPage= false;
  this.RegisterLabpackPage= false;
  this.TipsLabpackPage= true;
 }
}
