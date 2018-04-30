import { Component } from '@angular/core';

import { ToastService, Toast } from "./services/toast.service";
import { MenuService } from "./services/menu.service";

@Component({
  selector: 'app-root',
  templateUrl: "app.template.html",
  styleUrls: ["app.style.css"]
})
export class AppComponent {
  
  toasts:Toast[] = [];
  
  isMenuTransparent:boolean;
  
  constructor(public toastService:ToastService, public menuService:MenuService){
    this.toasts = toastService.toasts;
  }
}
