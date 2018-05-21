import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

export class Toast{
	text:string;
	status:string;	
}

/**
  * Service to manage warning toasts
	* 
	* toast() - create new toast
	*/
@Injectable()
export class ToastService {
	
	/**
		* array of toasts
		*/
	toasts:Toast[] = [];

  constructor(){
    
  }
	/**
		* text:string - text of toast
		* status:string - status type of toast, translates possibly to class
		*/
	toast(text: string, status?: string):void{
		
		if(!status) status = "notice";

		this.toasts.push({text:text, status: status ? status : "notice"});
		
    setTimeout(() => this.toasts.shift(), 2000);
	}
  
  clearToasts(){
    this.toasts = [];
  }



}