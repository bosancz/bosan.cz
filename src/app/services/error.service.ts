import { Injectable } from '@angular/core';

import { ToastService } from "./toast.service";

@Injectable()
export class ErrorService {

  constructor(private toastService:ToastService) {
  }
  
  error(err:any){
    
    if(typeof err === "string") err = new Error(err);

    this.toastService.toast(err.message,"error"); 
    console.log(err);
    
  }

}
