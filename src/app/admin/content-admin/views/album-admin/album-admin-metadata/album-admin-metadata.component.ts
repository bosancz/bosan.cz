import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { formatDate } from "@angular/common";
import { NgForm } from "@angular/forms";

import { ApiService } from "app/core/services/api.service";
import { DataService } from "app/core/services/data.service";
import { ToastService } from "app/core/services/toast.service";

import { Album } from "app/shared/schema/album";
import { Event } from "app/shared/schema/event";
import { Paginated } from "app/shared/schema/paginated";

@Component({
  selector: 'album-admin-metadata',
  templateUrl: './album-admin-metadata.component.html',
  styleUrls: ['./album-admin-metadata.component.css']
})
export class AlbumAdminMetadataComponent {

  @Input() album:Album;
  
  @Output() save:EventEmitter<void> = new EventEmitter();
  
  dateFrom:string;
  dateTill:string;
  year:number;
  
  eventsMatched:Event[] = [];
  
  constructor(private api:ApiService, private dataService:DataService, private toastService:ToastService) {  }
  
  ngOnChanges(changes:SimpleChanges){
    if(changes.album){
      if(this.album.dateFrom) this.dateFrom = this.album.dateFrom;
      if(this.album.dateTill) this.dateTill = this.album.dateTill;
      if(this.album.year) this.year = this.album.year;
    }
  }
  
  async loadTypeaheadEvents(search:string){
    this.eventsMatched = await this.api.get<Paginated<Event>>("events",{search:search,limit:20,sort:"-dateFrom",select:"_id name dateFrom dateTill"}).then(paginated => paginated.docs);
  }
  
  getEventString(event:Event):string{
    if(!event) return "";
    return event.name + " (" + formatDate(event.dateFrom, 'd. M. y', "cs") + " ~ " + formatDate(event.dateTill, 'd. M. y', "cs") + ")";
  }
  
  async saveAlbum(albumForm:NgForm){
    
    let albumData = albumForm.value;
    albumData.event = albumData.event ? albumData.event._id : null;
    
    await this.dataService.updateAlbum(this.album._id,albumData);
    
    this.toastService.toast("Uloženo.");
    
    this.save.emit();
  }
  
  eventSelected(event:Event){
    if(!event) return;
    this.dateFrom = event.dateFrom;
    this.dateTill = event.dateTill;
    this.year = (new Date(event.dateTill)).getFullYear();
  }
}
