import { Component, OnInit } from '@angular/core';
import { FileSaverService } from 'ngx-filesaver';
import * as JSZip from 'jszip';
import * as JSZipUtils from '../../../assets/script/jszip-utils.js';


@Component({
  selector: 'app-user-guide',
  templateUrl: './user-guide.component.html',
  styleUrls: ['./user-guide.component.scss']
})
export class UserGuideComponent implements OnInit {
  panelOpenState: boolean = false;
  display: boolean = false;
  show: boolean = true
  autoplay: number = 0
  styleSelect: boolean = true;
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
  WhataboutACMBadge: boolean = false;
  RegisterLabpackPage: boolean = false;
  TipsLabpackPage: boolean = false;
  urlSlides = "https://firebasestorage.googleapis.com/v0/b/authnode-fe822.appspot.com/o/TutorialCompleto.pptx?alt=media&token=3f533ff2-50c8-445d-9875-c9c491e2a8b8&_gl=1*1abjix5*_ga*MTU2MTgyODAxNy4xNjkxMDk4NDk5*_ga_CW55HF8NVT*MTY5Njg4ODI4OS4yNC4xLjE2OTY4ODgzMjkuMjAuMC4w"
  constructor(
    private fileSaverService: FileSaverService,
  ) { }

  ngOnInit(): void {
  }

  colapseMenu() {
    this.show = false
  }

  OpenMenu() {
    this.show = true
  }

  logout() {

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
    this.WhataboutACMBadge=false;
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
  this.WhataboutACMBadge=false;
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
  this.WhataboutACMBadge=false;
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
  this.WhataboutACMBadge=false;
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
  this.WhataboutACMBadge=false;
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
  this.WhataboutACMBadge=false;
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
  this.WhataboutACMBadge=false;
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
  this.WhataboutACMBadge=false;
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
  this.WhataboutACMBadge=false;
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
  this.WhataboutACMBadge=false;
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
  this.WhataboutACMBadge=false;
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
  this.WhataboutACMBadge=false;
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
  this.WhataboutACMBadge=false;
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
  this.WhataboutACMBadge=false;
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
  this.WhataboutACMBadge=false;
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
  this.WhataboutACMBadge=false;
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
  this.WhataboutACMBadge=false;
 }

 gotoWhataboutArtifactACMBadge(){
  this.WhataboutACMBadge=true;
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
  this.WhataboutACMBadge=false;
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
  this.WhataboutACMBadge=false;
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
  this.WhataboutACMBadge=false;
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
  this.WhataboutACMBadge=false;
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
  this.WhataboutACMBadge=false;
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
  this.WhataboutACMBadge=false;
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
  this.WhataboutACMBadge=false;
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
  this.WhataboutACMBadge=false;
 }

 async UrltoBinary(url) {
  try {
    const resultado = await JSZipUtils.getBinaryContent(url)
    return resultado
  } catch (error) {
    return;
  }
}
async onDown(fromRemote: boolean) {
  const fileName = "Tutorial" + '.' +"pptx";
  if (fromRemote) {
    let data = this.UrltoBinary(this.urlSlides)
    this.fileSaverService.save(await data, fileName);
  }

}
}
