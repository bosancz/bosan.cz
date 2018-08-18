import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from "@angular/forms";

import { Camp } from "../../../../../schema/camp";

@Component({
  selector: 'camp-admin-basic',
  templateUrl: './camp-admin-basic.component.html',
  styleUrls: ['./camp-admin-basic.component.css']
})
export class CampAdminBasicComponent implements OnInit {

  @Input()
  camp:Camp;
  
  @Output()
  save:EventEmitter<Camp> = new EventEmitter();
  
  constructor() {
    
  }

  ngOnInit() {
    
  }
  
  saveCamp(form:NgForm){
    this.save.emit(form.value);
  }

}
