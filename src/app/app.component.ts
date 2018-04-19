import { Component } from '@angular/core';

import { ToastService } from "./services/toast.service";

@Component({
  selector: 'app-root',
  templateUrl: "app.template.html",
  styleUrls: ["app.style.css"]
})
export class AppComponent {
  title = 'app';
  
  constructor(public toastService:ToastService){
    
  }
}
