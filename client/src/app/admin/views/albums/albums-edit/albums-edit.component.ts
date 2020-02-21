import { Component } from '@angular/core';
import { AlbumsService } from '../albums.service';
import { ToastService } from 'app/admin/services/toast.service';

@Component({
  selector: 'albums-edit',
  templateUrl: './albums-edit.component.html',
  styleUrls: ['./albums-edit.component.scss']
})
export class AlbumsEditComponent {

  constructor(
    public albumsService: AlbumsService,
    private toastService: ToastService
  ) { }

  ngOnInit() {

  }

}
