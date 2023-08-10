import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class InputtimeService  {
date = "";
  constructor() { }

  GetDate():string{
    return this.date
 }

 SetDate(date:string){
     let duracion = date.split(":")
     return duracion
 }
}
