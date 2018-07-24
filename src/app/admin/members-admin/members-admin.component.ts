import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { DataService } from "../../services/data.service";
import { ToastService } from "../../services/toast.service";

import { Member } from "../../schema/member";

@Component({
  selector: 'members-admin',
  templateUrl: './members-admin.component.html',
  styleUrls: ['./members-admin.component.css']
})
export class MembersAdminComponent implements OnInit {

  members:Member[] = [];
  
  constructor(private dataService:DataService, private toastService:ToastService, private router:Router, private route:ActivatedRoute) { }

  ngOnInit() {
    this.loadMembers();
  }
  
  loadMembers():void{
    this.dataService.getMembers().then(members => this.members = members);
  }
  
  getMemberLink(member:Member):string{
    return './' + member._id;
  }
  
  openMember(member:Member):void{
    this.router.navigate([this.getMemberLink(member)], {relativeTo: this.route});
  }

}
