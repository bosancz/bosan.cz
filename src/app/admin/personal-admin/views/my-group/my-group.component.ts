import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";

import { MyGroupService } from "./my-group.service";

import { Group } from "app/schema/group";

@Component({
  selector: 'my-group',
  templateUrl: './my-group.component.html',
  styleUrls: ['./my-group.component.scss']
})
export class MyGroupComponent implements OnInit {
  
  group:Observable<Group>

  constructor(private groupService:MyGroupService) { }

  ngOnInit() {
    this.group = this.groupService.group;
  }

}
