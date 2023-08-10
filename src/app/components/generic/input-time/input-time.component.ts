import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputtimeService } from 'src/app/services/inputtime.service';
@Component({
  selector: 'app-input-time',
  templateUrl: './input-time.component.html',
  styleUrls: ['./input-time.component.scss']
})
export class InputTimeComponent implements OnInit , AfterViewInit {
  Form: FormGroup;


  constructor(private formBuilder: FormBuilder,
    private TimeDuration: InputtimeService) { }
  ngAfterViewInit(): void {
    this.initForm();
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.Form = this.formBuilder.group({
      hours: [0, [Validators.required]],
      minutes: [0, [Validators.required]],
      seconds: [0, [Validators.required]],
    });
  }

GetDate():string{
   let resp =this.Form.value.hours+":"+this.Form.value.minutes+":"+this.Form.value.seconds
   return resp
}
cleanFields(){
  this.Form.get('hours').setValue(0);
  this.Form.get('minutes').setValue(0);
  this.Form.get('seconds').setValue(0);
}
SetDate(date:string){
    let duracion = date.split(":")
    this.Form.get('hours').setValue(parseInt(duracion[0]));
    this.Form.get('minutes').setValue(parseInt(duracion[1]));
    this.Form.get('seconds').setValue(parseInt(duracion[2]));
}

}
