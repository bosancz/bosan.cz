import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  
  public menu = {
    transparent: false,
    collapsed: true
  };
  
  public footer = {
    visible: true
  };

  constructor() { }
}
