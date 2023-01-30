import { Component, OnInit } from '@angular/core';
import { Info } from 'src/app/models/informacion/infointerface';
import { InfocardsService } from 'src/app/services/infocards.service';
// import Swiper core and required modules
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y, SwiperOptions,Autoplay } from 'swiper';

// install Swiper modules
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, Autoplay]);
@Component({
  selector: 'app-sliderswiper',
  templateUrl: './sliderswiper.component.html',
  styleUrls: ['./sliderswiper.component.scss']
})
export class SliderswiperComponent implements OnInit {

  mensaje:Array<String> = ["Hello from dato","Nuevo dato"] ;
  datosswiper:Array<Info>=[];
  constructor(private serviciomensaje:InfocardsService) { }

  ngOnInit(): void {
    this.serviciomensaje.getMensajesHomeSwiper().subscribe(dato=>{
      this.datosswiper=dato;
    })
  }

  public config: SwiperOptions = {
    slidesPerView: 1,
    setWrapperSize:true,
    mousewheel: true,
    keyboard: true,
    spaceBetween: 10,
    centeredSlides: true,
    navigation: true,
    loop: true,
    speed: 800,
    updateOnWindowResize: true,
    grabCursor: true,

    autoplay: {
      delay: 2500,
      disableOnInteraction: true,
    },
    // Puntos en la parte inferior de la aplicación para cambiar de imagen
    pagination: {
      clickable: true,
      hideOnClick: true
    },
    // Barra espaciadora inferior
    scrollbar: {
      hide: true,
      draggable: true
    },

    breakpoints:{
      468:{
        slidesPerView: 2,
      },
      1200:{
        slidesPerView: 3,
      },
      1800:{
        slidesPerView: 4,
      },
      2200:{
        slidesPerView: 5,
      },
      2900:{
        slidesPerView: 6,
      },
    },
  };

  onSwiper([swiper]) {

  }
  onSlideChange() {

  }

}
