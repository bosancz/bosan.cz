import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";

import { Subscription } from "rxjs";

import { DataService } from "app/core/services/data.service";

import { Album } from "app/shared/schema/album";
import { Paginated } from "app/shared/schema/paginated";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgForm } from '@angular/forms';
import { ToastService } from 'app/core/services/toast.service';
import { ApiService } from 'app/core/services/api.service';
import { TitleService } from 'app/core/services/title.service';

@Component({
  selector: 'albums-list',
  templateUrl: './albums-list.component.html',
  styleUrls: ['./albums-list.component.scss']
})
export class AlbumsListComponent implements OnInit, OnDestroy {

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

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private toastService: ToastService,
    private titleService: TitleService
  ) { }

  ngOnInit() {
    this.loadYears();

    this.paramsSubscription = this.route.params.subscribe((params: Params) => {
      this.year = params.year;
      this.page = params.page;
      this.loadAlbums();
    });

    this.titleService.setPageTitle("Galerie");

  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  async loadYears() {
    this.years = await this.api.get<number[]>("albums:years");
    this.years.sort((a, b) => b - a);
  }

  async loadAlbums() {

    this.loading = true;

    const options: any = {
      sort: "dateFrom"
    }

    if (this.year) options.filter = { year: this.year };
    else options.filter = { status: "draft" };

    this.albums = await this.api.get<Album[]>("albums", options);

    this.loading = false;
  }

  openCreateAlbumModal(template: TemplateRef<any>): void {
    this.createAlbumModalRef = this.modalService.show(template);
  }

  async createAlbum(form: NgForm) {
    // get data from form
    const albumData = form.value;
    // create the event and wait for confirmation
    const response = await this.api.post("albums", albumData);
    // get the newly created album    
    const album = await this.api.get<Album>(response.headers.get("location"));
    // close the modal
    this.createAlbumModalRef.hide();
    // show the confrmation
    this.toastService.toast("Album vytvořeno a uloženo.");
    // open the album
    this.router.navigate(["./", {}, album._id], { relativeTo: this.route });
  }

}
