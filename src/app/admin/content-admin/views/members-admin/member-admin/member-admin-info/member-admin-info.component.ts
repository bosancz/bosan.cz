import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from "@angular/forms";

import { ConfigService } from "app/core/services/config.service";

import { Member } from "app/shared/schema/member";
import { WebConfigGroup } from "app/shared/schema/webconfig";

@Component({
  selector: 'member-admin-info',
  templateUrl: './member-admin-info.component.html',
  styleUrls: ['./member-admin-info.component.css']
})
export class MemberAdminInfoComponent implements OnInit {

  @Input()  member:Member;

  @Output() save:EventEmitter<any> = new EventEmitter();

  groups:WebConfigGroup[] = [];
  roles:string[] = [];

  constructor(private configService:ConfigService) { }

  ngOnInit() {
    this.loadConfig();
  }

  loadConfig(){
    this.configService.getConfig().then(config => {
      this.groups = config.members.groups;
      this.roles = config.members.roles.map(item => item.id);
    });
  }

  saveMember(form:NgForm){
    this.save.emit(form.value);
  }

}
