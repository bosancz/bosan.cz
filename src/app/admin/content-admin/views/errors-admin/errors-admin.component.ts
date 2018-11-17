import { Component, OnInit } from '@angular/core';

import { ApiService } from "app/services/api.service";

import { ReportedError } from "app/schema/reported-error";

@Component({
  selector: 'errors-admin',
  templateUrl: './errors-admin.component.html',
  styleUrls: ['./errors-admin.component.css']
})
export class ErrorsAdminComponent implements OnInit {

  errors:ReportedError[] = [];
  
  constructor(private api:ApiService) { }

  ngOnInit() {
    this.loadErrors()
  }
  
  async loadErrors(){
    
    const from = new Date();
    from.setDate(from.getDate() - 7);
    
    const options = {
      filter: { from },
      populate: [ "user" ],
      sort: "-timestamp"
    }
    
    this.errors = await this.api.get<ReportedError[]>("errors", options);
  }

}
