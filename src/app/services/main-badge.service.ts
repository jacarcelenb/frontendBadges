import { Injectable, OnInit } from '@angular/core';
import { BadgeService } from './badge.service';

@Injectable({
  providedIn: 'root'
})
export class MainBadgeService implements OnInit {
  public data: any[] = [];

  constructor(private badgeService: BadgeService) { }
  ngOnInit(): void {
    this.getBadges();
    
  }

  getBadges(){
    this.badgeService.getBadges({}).subscribe((data:any)=>{
      this.data = data.response
    })
  }
}
