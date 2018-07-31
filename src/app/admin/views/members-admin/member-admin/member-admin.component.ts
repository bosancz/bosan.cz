import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";

import { DataService } from "../../../../services/data.service";
import { ToastService } from "../../../../services/toast.service";

import { Member } from "../../../../schema/member";

@Component({
  selector: 'member-admin',
  templateUrl: './member-admin.component.html',
  styleUrls: ['./member-admin.component.css']
})
export class MemberAdminComponent implements OnInit {
  
  member:Member;
  
  category:string;
  
  deleteConfirmation:boolean = false;
  
  paramsSubscription:Subscription;

  constructor(private dataService:DataService, private toastService:ToastService, private route:ActivatedRoute, private router:Router) { }
  
  ngOnInit() {

    this.paramsSubscription = this.route.params.subscribe((params:Params) => {

      if(params.member && (!this.member || this.member._id !== params.member)) this.loadMember(params.member);
      
      this.category = params.cat;

    });
  }
  
  // DB interaction
  async loadMember(memberId:string){
    this.member = await this.dataService.getMember(memberId);
  }
  
  async saveMember(member:any){
    // send the list of changes or current state of member to the server
    await this.dataService.updateMember(this.member._id,member || this.member);
    
    // send a toast with OK message
    this.toastService.toast("Uloženo.");
  }
  
  async deleteMember(){
    var name = this.member.name;
    await this.dataService.deleteMember(this.member._id)
    this.toastService.toast("Člen " + name + " smazán.");
    this.router.navigate(["/interni/clenove"]);
  }
  
}
