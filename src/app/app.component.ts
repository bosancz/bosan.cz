import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { ToastService, Toast } from "./services/toast.service";
import { MenuService } from "./services/menu.service";

@Component({
  selector: 'app-root',
  templateUrl: "app.template.html",
  styleUrls: ["app.style.css"]
})
export class AppComponent {
  
  isMenuTransparent:boolean;
  
  isMenuCollapsed:boolean = true;
  
  constructor(public toastService:ToastService, public menuService:MenuService,private router:Router,private route:ActivatedRoute){
  }
  
  ngOnInit(){
  }
}
