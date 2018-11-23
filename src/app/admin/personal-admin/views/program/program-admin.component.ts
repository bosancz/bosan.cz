import { Component, OnInit } from '@angular/core';

import { DataService } from "app/services/data.service";

@Component({
  selector: 'program-admin',
  templateUrl: './program-admin.component.html',
  styleUrls: ['./program-admin.component.css']
})
export class ProgramAdminComponent implements OnInit {

  events:{ [status:string]: Event[] } = {  };
    
  constructor(private dataService:DataService) {
  }

  ngOnInit() {
    this.loadEvents();
  }
  
  async loadEvents(){
    
  }

}
