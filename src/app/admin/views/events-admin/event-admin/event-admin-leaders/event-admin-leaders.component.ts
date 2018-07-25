import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, TemplateRef } from '@angular/core';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { DataService } from "../../../../../services/data.service";
import { Event } from "../../../../../schema/event";

@Component({
  selector: 'event-admin-leaders',
  templateUrl: './event-admin-leaders.component.html',
  styleUrls: ['./event-admin-leaders.component.scss']
})
export class EventAdminLeadersComponent implements OnChanges {

  @Input()
  event:Event;
  
  @Output()
  save:EventEmitter<any> = new EventEmitter();
  
  membersModalRef: BsModalRef;
  
  leaders:any[];
  
  constructor(private dataService:DataService, private modalService: BsModalService) {
  }
  
  ngOnChanges(changes:SimpleChanges){
    if(changes.event) this.loadLeaders();
  }
  
  async loadLeaders(){    
    
    if(!this.event._id) return;
    
    this.leaders = await this.dataService.getEventLeaders(this.event._id);
  }
  
  saveEvent(){
    
    var eventData = {
      leaders: this.leaders.map(item => ({ member: item.member._id, roles: item.roles}))
    };
    
    this.save.emit(eventData);
  }
  
  openMembers(membersModalTemplate:TemplateRef<any>){
    this.membersModalRef = this.modalService.show(membersModalTemplate);
  }

}
