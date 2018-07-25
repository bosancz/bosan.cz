import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

import { DataService } from "../../../services/data.service";

import { Camp } from "../../../schema/camp";


@Component({
  selector: 'camps-admin',
  templateUrl: './camps-admin.component.html',
  styleUrls: ['./camps-admin.component.css']
})
export class CampsAdminComponent implements OnInit {

  camps:Camp[];

  constructor(private dataService:DataService, private router:Router, private route:ActivatedRoute) { }

  ngOnInit() {
    this.loadCamps();
  }

  loadCamps():void{
    this.dataService.getCamps().then(camps => this.camps = camps);
  }
  
    getCampLink(camp:Camp):string{
    return './' + camp._id;
  }
  
  openCamp(camp:Camp):void{
    this.router.navigate([this.getCampLink(camp)], {relativeTo: this.route});
  }

}
