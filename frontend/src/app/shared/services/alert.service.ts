import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  #toast = Swal.mixin({
    toast: true,
    position: 'top-start',
    showConfirmButton: false,

    timer: 1800,
    timerProgressBar: false,

    background: '#fff',
    color: '#1c1917',

    animation: false,

    showClass: {
      popup: '',
    },

    hideClass: {
      popup: '',
    },
  });

  success(message: string) {
    this.#toast.fire({
      icon: 'success',
      title: message,
      iconColor: '#059669',
    });
  }

  error(message: string) {
    this.#toast.fire({
      icon: 'error',
      title: message,
      iconColor: '#dc2626',
    });
  }

  toastMessage(message: string, icon: SweetAlertIcon = 'info') {
    this.#toast.fire({
      icon,
      title: message,
    });
  }

  modalError(title: string, text: string) {
    Swal.fire({
      title,
      text,
      icon: 'error',
      confirmButtonColor: '#881337',
    });
  }

  async confirm(
    title = '¿Estás seguro?',
    text = 'Esta acción no se puede deshacer',
  ): Promise<boolean> {
    const result = await Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#881337',
      cancelButtonColor: '#57534e',
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    });

    return result.isConfirmed;
  }
}
