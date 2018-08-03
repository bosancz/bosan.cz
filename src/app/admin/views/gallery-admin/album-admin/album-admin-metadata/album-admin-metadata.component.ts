import { Component, Input, Output, EventEmitter, Inject, LOCALE_ID } from '@angular/core';
import { formatDate } from "@angular/common";
import { NgForm } from "@angular/forms";

import { DataService } from "../../../../../services/data.service";
import { ToastService } from "../../../../../services/toast.service";

import { Album } from "../../../../../schema/album";
import { Event } from "../../../../../schema/event";
import { Paginated } from "../../../../../schema/paginated";

@Component({
  selector: 'album-admin-metadata',
  templateUrl: './album-admin-metadata.component.html',
  styleUrls: ['./album-admin-metadata.component.css']
})
export class AlbumAdminMetadataComponent {

  @Input() album:Album;
  
  @Output() save:EventEmitter<void> = new EventEmitter();
  
  eventsMatched:Event[] = [];
  
  currentYear:number = (new Date()).getFullYear();
  
  constructor(private dataService:DataService, private toastService:ToastService) {
  }
  
  async loadTypeaheadEvents(search:string){
    this.eventsMatched = await (this.dataService.getEvents({search:search,limit:10,sort:"dateFrom"}).then(paginated => paginated.docs));
  }
  
  getEventString(event:Event):string{
    if(!event) return "";
    return event.name + " (" + formatDate(event.dateFrom, 'd. M. y', "cs") + " ~ " + formatDate(event.dateTill, 'd. M. y', "cs") + ")";
  }
  
  async saveAlbum(albumForm:NgForm){
    
    var albumData = albumForm.value;
    albumData.event = albumData.event ? albumData.event._id : null;
    
    await this.dataService.updateAlbum(this.album._id,albumData);
    
    this.toastService.toast("Uloženo.");
    
    this.save.emit();
  }
}
