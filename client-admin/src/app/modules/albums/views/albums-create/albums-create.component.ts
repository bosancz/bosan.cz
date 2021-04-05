import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

import { ApiService } from 'app/core/services/api.service';
import { ToastService } from 'app/core/services/toast.service';

import { Album } from 'app/schema/album';

@Component({
  selector: 'albums-create',
  templateUrl: './albums-create.component.html',
  styleUrls: ['./albums-create.component.scss']
})
export class AlbumsCreateComponent implements OnInit {

  currentYear = (new Date()).getFullYear();

  constructor(
    private api: ApiService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
  }

  async createAlbum(form: NgForm) {
    // get data from form
    const albumData = form.value;
    // create the event and wait for confirmation
    const response = await this.api.post("albums", albumData);
    // get the newly created album    
    const album = await this.api.get<Album>(response.headers.get("location"));
    // show the confrmation
    this.toastService.toast("Album vytvořeno a uloženo.");
    // open the album
    this.router.navigate(["/galerie", album._id, "upravit"], { relativeTo: this.route });
  }

}
