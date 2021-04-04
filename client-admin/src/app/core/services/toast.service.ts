import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { TableRowHeightAttributes } from 'docx';
import { Subject } from 'rxjs';

/**
  * Service to manage warning toasts
  * 
  * toast() - create new toast
  */
@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    public toastController: ToastController
  ) { }

  toast(text: string, action?: string) {

    const actionObservable = new Subject();

    const toastOptions = {
      message: text,
      duration: 2000,
      buttons: action ? [{ text: action, handler: () => { actionObservable.next(); actionObservable.complete(); } }] : undefined
    };

    this.toastController.create(toastOptions).then(toast => toast.present());

    return {
      onAction() {
        return actionObservable;
      }
    };

  }

}