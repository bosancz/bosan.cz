import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { ApiService } from "app/core/services/api.service";
import { ToastService } from "app/core/services/toast.service";

import { Event } from "app/shared/schema/event";
import { Member } from "app/shared/schema/member";

@Component({
  selector: 'event-admin-leaders',
  templateUrl: './event-admin-leaders.component.html',
  styleUrls: ['./event-admin-leaders.component.scss']
})
export class EventAdminLeadersComponent {

  event:Event;
  
  @Input("event")
  set setEvent(event:Event){
    this.event = event;
    this.loadLeaders(event);
  }
  
  @Output() saved:EventEmitter<any> = new EventEmitter();
  
  membersModalRef:BsModalRef;
  
  leaders:Member[] = [];
  
  membersSelectOptions:any = { role: "vedoucí"};
  
  constructor(private api:ApiService, private toastService:ToastService, private modalService:BsModalService) {
  }
  
  async loadLeaders(event:Event){    
    
    if(!event._id) return;
    
    this.leaders = await this.api.get<Member[]>(event._links.leaders);
  }
  
  saveLeaders(){
    
    let eventData = {
      leaders: this.leaders.map(leader => leader._id)
    };
    
    this.api.patch(this.event._links.self,eventData);
    
    this.toastService.toast("Uloženo.");
    
    this.saved.emit();
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
