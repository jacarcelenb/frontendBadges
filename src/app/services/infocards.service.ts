import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { swipertexto } from '../models/informacion/datosestaticos/homes';
import { informacion } from '../models/informacion/datosestaticos/info';
import { Info } from '../models/informacion/infointerface';

@Injectable({
  providedIn: 'root'
})
export class InfocardsService {

  constructor() { }

  getInfocardsAbout(): Observable<Array<Info>> {
    const datos= of(informacion);
    return datos;
  }

  getMensajesHomeSwiper():Observable<Array<Info>>{
    const mensajesswiper = of(swipertexto) ;
    return mensajesswiper;
  }
}
