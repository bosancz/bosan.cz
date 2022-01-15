import { Injectable } from '@angular/core';
import { ToastOptions } from "@ionic/core";
import { ToastController } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';

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

  toast(toast: string, toastOptions?: ToastOptions): Promise<HTMLIonToastElement>;
  /** @deprecated */ toast(toast: string, action: string): { onAction: () => Observable<void>; };
  toast(toast: string, toastOptions?: string | ToastOptions): Promise<HTMLIonToastElement> | { onAction: () => Observable<void>; } {

    if (typeof toastOptions === "string") {

      // TODO: remove this way from codebase and then remove this

      console.error("This is a deprecated way of adding button to toast!");

      const actionObservable = new Subject<void>();

      const toastOptions: ToastOptions = {
        message: toast,
        duration: 2000,
        buttons: [{ text: toast, handler: () => { actionObservable.next(); actionObservable.complete(); } }]
      };

      this.toastController.create(toastOptions).then(toast => toast.present());

      return {
        onAction() { return actionObservable; }
      };
    }

    toastOptions = {
      ...toastOptions,
      message: toast,
      duration: toastOptions?.duration || 2000
    };

    return this.toastController
      .create(toastOptions)
      .then(toast => {
        toast.present();
        return toast;
      });

  }

}