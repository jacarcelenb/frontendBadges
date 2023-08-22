import { Injectable } from '@angular/core';
import Swal, { SweetAlertResult } from 'sweetalert2'
@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }
  presentConfirmAlert(
    title: string,
    message: string,
    confirmButtonText: string,
    cancelButtonText: string
  ) : Promise<SweetAlertResult<any>> {
    return new Promise((resolve, reject) => {
      Swal.fire({
        title,
        html: message,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        cancelButtonText
      }).then((result) => {
        resolve(result);
      }).catch((error) => {
        reject(error);
      });
    });
  }
  presentSuccessAlert(title) {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: title,
      showConfirmButton: false,
      timer: 1500
    })
  }
  presentWarningAlert(title: string) {
    Swal.fire({
      position: "center",
      icon: 'warning',
      title,
      showConfirmButton: false,
      timer: 2000
    })
  }

  presentWarningAlertWithButton(title: string) {
    Swal.fire({
      position: "center",
      icon: 'warning',
      title,
      showConfirmButton: true,
    })
  }

  presenInfoWithButton(title: string) {
    Swal.fire({
      position: "center",
      icon: 'info',
      title,
      showConfirmButton: true,
    })
  }
  presentErrorAlert(message?: string) {
    Swal.fire({
      title: 'Error!',
      html: message,
      icon: 'error',
      confirmButtonText: 'Aceptar'
    })
  }
}
