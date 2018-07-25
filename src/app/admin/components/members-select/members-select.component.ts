import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'members-select',
  templateUrl: './members-select.component.html',
  styleUrls: ['./members-select.component.scss']
})
export class MembersSelectComponent implements OnInit {

  @Input()
  options:any = {};
  
  @Output()
  select:EventEmitter<any[]> = new EventEmitter();
  
  constructor() {
  }

  ngOnInit() {
  }

}
