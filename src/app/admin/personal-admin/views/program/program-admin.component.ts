import { Component, OnInit } from '@angular/core';

import { ProgramAdminService } from "./program-admin.service";

@Component({
  selector: 'program-admin',
  templateUrl: './program-admin.component.html',
  styleUrls: ['./program-admin.component.css']
})
export class ProgramAdminComponent implements OnInit {

  constructor(public programAdminService:ProgramAdminService) {
  }
  
  ngOnInit(){
    this.programAdminService.loadStats();
  }

}
