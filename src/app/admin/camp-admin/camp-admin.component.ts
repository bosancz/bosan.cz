import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs/Subscription";


import { DataService } from "../../services/data.service";

import { Camp } from "../../schema/camp";

@Component({
  selector: 'camp-admin',
  templateUrl: './camp-admin.component.html',
  styleUrls: ['./camp-admin.component.css']
})
export class CampAdminComponent implements OnInit {

  camp:Camp;
  
  camps:Camp[];
  
  campId:string;
  
  category:string;
  categories = {
    "info": "basic",
    "ucastnici": "participants"    
  };
  
  paramsSubscription:Subscription;
  
  constructor(private dataService:DataService,private route:ActivatedRoute, private router:Router) { }


  ngOnInit() {
    
    this.paramsSubscription = this.route.params.subscribe((params:Params) => {
      
      if(params.camp && (!this.camp || this.camp._id !== params.camp)) this.loadCamp(params.camp);
      
      this.category = this.categories[params.cat];
    });
    
    this.loadCamps();
  }

  loadCamps():void{
    this.dataService.getCamps().then(camps => {
      this.camps = camps;
      
      if(!this.camp) this.openCamp(this.camps[0]._id);
    });
  }
  
  loadCamp(id:string):void{
    this.dataService.getCamp(id).then(camp => {
      this.camp = camp;
      this.campId = camp._id;
    });
  }
  
  saveCamp(camp:Camp):void{
    this.dataService.saveCamp(camp._id,camp).then(() => this.loadCamp(this.campId));
  }
  
  openCamp(id:string):void{
    console.log(id);
    this.router.navigate(["/interni/tabor/" + id]);
  }

}
