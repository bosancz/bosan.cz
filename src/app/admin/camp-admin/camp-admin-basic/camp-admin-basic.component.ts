import { Component, OnInit, Input } from '@angular/core';

import { Camp } from "../../../schema/camp";

@Component({
  selector: 'camp-admin-basic',
  templateUrl: './camp-admin-basic.component.html',
  styleUrls: ['./camp-admin-basic.component.css']
})
export class CampAdminBasicComponent implements OnInit {

  @Input()
  camp:Camp;
  
  defaultName:string = "ŠÁN " + (new Date()).getFullYear() + " - I. turnus";
  
  constructor() {
    
  }

  ngOnInit() {
    
  }

}
