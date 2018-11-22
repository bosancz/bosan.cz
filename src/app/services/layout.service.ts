import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  
  public menu = {
    visible: true,
    transparent: false,
    collapsed: true
  };
  
  public footer = {
    visible: true
  };

  constructor() { }
  
  hideMenu(hidden:boolean){
    setTimeout(() => this.menu.visible = !hidden,0); // needs to go in another run
  }
  
  hideFooter(hidden:boolean){
    setTimeout(() => this.footer.visible = !hidden,0); // needs to go in another run
  }
}
