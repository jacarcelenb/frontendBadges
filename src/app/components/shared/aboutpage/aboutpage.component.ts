import { Component, OnInit } from '@angular/core';
import { Info } from 'src/app/models/informacion/infointerface';
import { InfocardsService } from 'src/app/services/infocards.service';

@Component({
  selector: 'app-aboutpage',
  templateUrl: './aboutpage.component.html',
  styleUrls: ['./aboutpage.component.scss']
})
export class AboutpageComponent implements OnInit {
  mensajes: Array<Info> = [];
  constructor(private infoservice: InfocardsService) { }

  ngOnInit(): void {
    this.infoservice.getInfocardsAbout().subscribe((infouse)=>{
      this.mensajes=infouse
    })
   
  }

}
