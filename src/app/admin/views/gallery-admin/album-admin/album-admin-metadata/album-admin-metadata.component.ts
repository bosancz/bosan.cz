import { Component, Input, Output, EventEmitter, Inject, LOCALE_ID, ViewChild, ElementRef } from '@angular/core';
import { formatDate } from "@angular/common";
import { NgForm } from "@angular/forms";

import { ApiService } from "app/services/api.service";
import { DataService } from "app/services/data.service";
import { ToastService } from "app/services/toast.service";

import { Album } from "app/schema/album";
import { Event } from "app/schema/event";
import { Paginated } from "app/schema/paginated";

@Component({
  selector: 'album-admin-metadata',
  templateUrl: './album-admin-metadata.component.html',
  styleUrls: ['./album-admin-metadata.component.css']
})
export class AlbumAdminMetadataComponent {

  @Input() album:Album;
  
  @Output() save:EventEmitter<void> = new EventEmitter();
  
  @ViewChild('dateFrom') dateFromInput:ElementRef;
  @ViewChild('dateTill') dateTillInput:ElementRef;
  @ViewChild('year') yearInput:ElementRef;
  
  eventsMatched:Event[] = [];
  
  currentYear:number = (new Date()).getFullYear();
  
  constructor(private api:ApiService, private dataService:DataService, private toastService:ToastService) {
  }
  
  async loadTypeaheadEvents(search:string){
    this.eventsMatched = await this.api.get<Paginated<Event>>("event",{search:search,limit:10,sort:"dateFrom"}).then(paginated => paginated.docs);
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
    this.dateFromInput.nativeElement.value = formatDate(event.dateFrom, 'yyyy-MM-dd', "cs");
    this.dateTillInput.nativeElement.value = formatDate(event.dateTill, 'yyyy-MM-dd', "cs");
    this.yearInput.nativeElement.value = formatDate(event.dateTill, 'yyyy', "cs");
  }
}
