import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";

import { Subscription } from "rxjs";

import { DataService } from "app/core/services/data.service";

import { Album } from "app/shared/schema/album";
import { Paginated } from "app/shared/schema/paginated";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgForm } from '@angular/forms';
import { ToastService } from 'app/core/services/toast.service';

@Component({
  selector: 'albums-admin',
  templateUrl: './albums-admin.component.html',
  styleUrls: ['./albums-admin.component.scss']
})
export class AlbumsAdminComponent implements OnInit, OnDestroy {

  years: number[] = [];
  year: number;

  albums: Album[] = [];

  page: number = 1;
  pages: number;

  statuses: any = {
    "public": "zveřejněná",
    "draft": "v přípravě"
  };

  openFilter: boolean = false;

  loading: boolean = false;

  createAlbumModalRef: BsModalRef;

  paramsSubscription: Subscription;

  constructor(private dataService: DataService, private router: Router, private route: ActivatedRoute, private modalService: BsModalService, private toastService: ToastService) { }

  ngOnInit() {
    this.loadYears();

    this.paramsSubscription = this.route.params.subscribe((params: Params) => {
      this.year = params.year;
      this.page = params.page;
      this.loadAlbums();
    });
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  async loadYears() {
    this.years = await this.dataService.getAlbumsYears();
    this.years.sort((a, b) => b - a);
  }

  async loadAlbums() {

    this.loading = true;

    const options = {
      search: "",
      page: this.page || 1,
      sort: "dateFrom",
      filter: {
        year: this.year
      }
    }

    let paginated: Paginated<Album> = await this.dataService.getAlbums(options);

    this.albums = paginated.docs;
    this.pages = paginated.pages;

    this.loading = false;
  }

  getPages() {
    let pages = [];
    for (let i = 1; i <= this.pages; i++) pages.push(i);
    return pages;
  }

  getPageLink(page: number) {
    let params: any = { page: page };
    if (this.year) params.year = this.year || null;
    return ["./", params];
  }

  openCreateAlbumModal(template: TemplateRef<any>): void {
    this.createAlbumModalRef = this.modalService.show(template);
  }

  async createAlbum(form: NgForm) {
    // get data from form
    const albumData = form.value;
    // create the event and wait for confirmation
    const album = await this.dataService.createAlbum(albumData);
    // close the modal
    this.createAlbumModalRef.hide();
    // show the confrmation
    this.toastService.toast("Album vytvořeno a uloženo.");
    // open the album
    this.router.navigate(["./", {}, album._id], { relativeTo: this.route });
  }

}
