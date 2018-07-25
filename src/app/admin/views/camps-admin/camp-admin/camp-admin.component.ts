import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";


import { DataService } from "../../../../services/data.service";
import { ToastService } from "../../../../services/toast.service";

import { Camp } from "../../../../schema/camp";

@Component({
  selector: 'camp-admin',
  templateUrl: './camp-admin.component.html',
  styleUrls: ['./camp-admin.component.css']
})
export class CampAdminComponent implements OnInit {

  camp:Camp;
  
  category:string;
  
  paramsSubscription:Subscription;
  
  constructor(private dataService:DataService, private toastService:ToastService, private route:ActivatedRoute, private router:Router) { }

  ngOnInit() {
    
    this.paramsSubscription = this.route.params.subscribe((params:Params) => {
      
      if(params.camp && (!this.camp || this.camp._id !== params.camp)) this.loadCamp(params.camp);
      
      this.category = params.cat;
    });
  }
  
  async loadCamp(id:string){
    this.camp = await this.dataService.getCamp(id);     
  }
  
  async saveCamp(campData:Camp){
    await this.dataService.updateCamp(this.camp._id,campData);
    await this.loadCamp(this.camp._id);
    this.toastService.toast("Uloženo.");
  }

}
