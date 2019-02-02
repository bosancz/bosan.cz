import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { DataService } from "app/core/services/data.service";

import { Member } from "app/core/schema/member";

@Component({
  selector: 'member-admin-achievements',
  templateUrl: './member-admin-achievements.component.html',
  styleUrls: ['./member-admin-achievements.component.scss']
})
export class MemberAdminAchievementsComponent implements OnInit {

  @Input()  member:Member;
  
  @Output() save:EventEmitter<any> = new EventEmitter();
  
  constructor(private dataService:DataService) { }
  
  ngOnInit() {
  }

}
