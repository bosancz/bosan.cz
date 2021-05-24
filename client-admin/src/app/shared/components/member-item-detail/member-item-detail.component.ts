import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'app/schema/member';

@Component({
  selector: 'bo-member-item-detail',
  templateUrl: './member-item-detail.component.html',
  styleUrls: ['./member-item-detail.component.scss']
})
export class MemberItemDetailComponent implements OnInit {

  @Input() member!: Member;

  constructor() { }

  ngOnInit(): void {
  }

}
