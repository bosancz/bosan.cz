import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from "@angular/forms";

import { ConfigService } from "app/core/services/config.service";

import { Member } from "app/shared/schema/member";
import { WebConfigGroup } from "app/shared/schema/webconfig";

@Component({
  selector: 'members-view-info',
  templateUrl: './members-view-info.component.html',
  styleUrls: ['./members-view-info.component.css']
})
export class MembersViewInfoComponent implements OnInit {

  @Input()  member:Member;

  @Output() save:EventEmitter<any> = new EventEmitter();

  groups:WebConfigGroup[] = [];
  roles:string[] = [];
  membershipTypes:string[] = [];

  constructor(private configService:ConfigService) { }

  ngOnInit() {
    this.loadConfig();
  }

  loadConfig(){
    this.configService.getConfig().then(config => {
      this.groups = config.members.groups.filter(group => group.real);
      this.roles = config.members.roles.map(item => item.id);
      this.membershipTypes = config.members.membershipTypes.map(item => item.id);
    });
  }

  saveMember(form:NgForm){
    this.save.emit(form.value);
  }

}
