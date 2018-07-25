import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from "@angular/forms";

import { DataService } from "../../../../../services/data.service";
import { ToastService } from "../../../../../services/toast.service";

import { Album } from "../../../../../schema/album";

@Component({
  selector: 'album-admin-metadata',
  templateUrl: './album-admin-metadata.component.html',
  styleUrls: ['./album-admin-metadata.component.css']
})
export class AlbumAdminMetadataComponent {

  @Input() album:Album;
  
  @Output() save:EventEmitter<void> = new EventEmitter();
  
  constructor(private dataService:DataService, private toastService:ToastService) { }
  
  async saveAlbum(albumForm:NgForm){
    
    await this.dataService.updateAlbum(this.album._id,albumForm.value);
    
    this.toastService.toast("Uloženo.");
    
    this.save.emit();
  }
}
