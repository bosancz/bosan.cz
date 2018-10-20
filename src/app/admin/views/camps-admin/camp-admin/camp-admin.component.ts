import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";


import { DataService } from "app/services/data.service";
import { ToastService } from "app/services/toast.service";

import { Camp } from "app/schema/camp";

@Component({
  selector: 'camp-admin',
  templateUrl: './camp-admin.component.html',
  styleUrls: ['./camp-admin.component.css']
})
export class CampAdminComponent implements OnInit, OnDestroy {

  camp:Camp;
  
  category:string;
  
  deleteConfirmation:boolean = false;
  
  paramsSubscription:Subscription;
  
  constructor(private dataService:DataService, private toastService:ToastService, private route:ActivatedRoute, private router:Router) { }

  ngOnInit() {
    
    this.paramsSubscription = this.route.params.subscribe((params:Params) => {
      
      if(params.camp && (!this.camp || this.camp._id !== params.camp)) this.loadCamp(params.camp);
      
      this.category = params.cat;
    });
  }
  
  ngOnDestroy(){
    this.paramsSubscription.unsubscribe();
  }
  
  async loadCamp(id:string){
    this.camp = await this.dataService.getCamp(id);     
  }
  
  async saveCamp(campData:Camp){
    await this.dataService.updateCamp(this.camp._id,campData);
    await this.loadCamp(this.camp._id);
    this.toastService.toast("Uloženo.");
  }
  
  async deleteCamp(){
    let name = this.camp.name;
    await this.dataService.deleteCamp(this.camp._id);
    this.toastService.toast("Tábor " + name + " smazán.");
    this.router.navigate(["/interni/tabory"]);
  }


}
