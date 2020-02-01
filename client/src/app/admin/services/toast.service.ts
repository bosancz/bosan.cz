import { Injectable } from '@angular/core';

import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { AdminModule } from 'app/admin/admin.module';

export interface Toast {
  text: string;
  action: string;
}

/**
  * Service to manage warning toasts
	* 
	* toast() - create new toast
	*/
@Injectable({
  providedIn: AdminModule
})
export class ToastService {

  constructor(private snackBar: MatSnackBar) {

  }
  /**
    * text:string - text of toast
	  * status:string - status type of toast, translates possibly to class
	  */
  toast(toast: Toast): MatSnackBarRef<SimpleSnackBar>;
  toast(text: string, action?: string): MatSnackBarRef<SimpleSnackBar>;
  toast(text: Toast | string, action?: string): MatSnackBarRef<SimpleSnackBar> {

    if (typeof text === "object") {
      action = text.action;
      text = text.text;
    }

    const toastRef = this.snackBar.open(text, action || "Zavřít", { duration: action ? undefined : 3000 });

    if (!action) {
      toastRef.onAction().subscribe(() => toastRef.dismiss());
    }

    return toastRef;

  }

}