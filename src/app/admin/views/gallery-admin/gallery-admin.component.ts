import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { DataService } from "../../../services/data.service";
import { ToastService } from "../../../services/toast.service";

import { Album } from "../../../schema/album";

@Component({
  selector: 'gallery-admin',
  templateUrl: './gallery-admin.component.html',
  styleUrls: ['./gallery-admin.component.css']
})
export class GalleryAdminComponent implements OnInit {

  years:number[] = [];
  year:number;
  
  tags:string[] = [];
  tag:string;
  
  currentYear:number = (new Date).getFullYear();
  
  createAlbumModalRef: BsModalRef;
  
  constructor(private dataService:DataService, private toastService:ToastService, private router:Router, private route:ActivatedRoute, private modalService: BsModalService) {}

  ngOnInit() {
    this.loadYears();
    this.loadTags();
  }

  async loadYears(){
    this.years = await this.dataService.getAlbumsYears();
  }
  
  async loadTags(){
    this.tags = await this.dataService.getPhotosTags();
  }
  
  openCreateAlbumModal(template:TemplateRef<any>):void{
    this.createAlbumModalRef = this.modalService.show(template);
  }
  
  async createAlbum(form:NgForm){
    // get data from form
    var albumData = form.value;
    // create the event and wait for confirmation
    var album = await this.dataService.createAlbum(albumData);
    // close the modal
    this.createAlbumModalRef.hide();
    // show the confrmation
    this.toastService.toast("Album vytvořeno a uloženo.");
    // open the album
    this.router.navigate(["/interni/galerie/alba/" + album._id], {relativeTo: this.route})
  }

}
