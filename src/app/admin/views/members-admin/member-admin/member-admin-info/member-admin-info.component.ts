import { Component, OnInit, Input } from '@angular/core';

import { Member } from "../../../../../schema/member";

@Component({
  selector: 'member-admin-info',
  templateUrl: './member-admin-info.component.html',
  styleUrls: ['./member-admin-info.component.css']
})
export class MemberAdminInfoComponent implements OnInit {

  @Input()
  member:Member;
  
  constructor() { }

  ngOnInit() {
  }

}
