import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, TemplateRef } from '@angular/core';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { DataService } from "app/services/data.service";

import { Event } from "app/schema/event";
import { Member } from "app/schema/member";

@Component({
  selector: 'event-admin-leaders',
  templateUrl: './event-admin-leaders.component.html',
  styleUrls: ['./event-admin-leaders.component.scss']
})
export class EventAdminLeadersComponent implements OnChanges {

  @Input()
  event:Event;
  
  @Output() save:EventEmitter<any> = new EventEmitter();
  
  membersModalRef: BsModalRef;
  
  leaders:any[] = [];
  
  membersSelectOptions:any = { role: "vedoucí"};
  
  constructor(private dataService:DataService, private modalService: BsModalService) {
  }
  
  ngOnChanges(changes:SimpleChanges){
    if(changes.event) this.loadLeaders();
  }
  
  async loadLeaders(){    
    
    if(!this.event._id) return;
    
    this.leaders = await this.dataService.getEventLeaders(this.event._id);
  }
  
  saveLeaders(){
    
    var eventData = {
      leaders: this.leaders.map(leader => leader._id)
    };
    
    this.save.emit(eventData);
  }
  
  removeLeader(member:Member){
    this.leaders = this.leaders.filter(leader => leader._id !== member._id);
  }
  
  moveLeader(from,to):void{
    if(to >= this.leaders.length || to < 0) return;
    this.leaders.splice(to,0,this.leaders.splice(from,1)[0]);
  }
  
  openMembers(membersModalTemplate:TemplateRef<any>){
    this.membersModalRef = this.modalService.show(membersModalTemplate, { class: 'modal-lg' });
  }

}
