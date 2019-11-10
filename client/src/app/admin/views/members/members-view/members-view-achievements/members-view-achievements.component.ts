import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { DataService } from "app/core/services/data.service";

import { Member } from "app/shared/schema/member";

@Component({
  selector: 'members-view-achievements',
  templateUrl: './members-view-achievements.component.html',
  styleUrls: ['./members-view-achievements.component.scss']
})
export class MembersViewAchievementsComponent implements OnInit {

  @Input()  member:Member;
  
  @Output() save:EventEmitter<any> = new EventEmitter();
  
  constructor(private dataService:DataService) { }
  
  ngOnInit() {
  }

}
