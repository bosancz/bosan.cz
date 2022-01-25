import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ItemReorderEventDetail } from '@ionic/core';
import { Photo } from 'app/schema/photo';

@Component({
  selector: 'bo-photo-list',
  templateUrl: './photo-list.component.html',
  styleUrls: ['./photo-list.component.scss']
})
export class PhotoListComponent implements OnInit {

  @Input() photos?: Photo[];
  @Input() view: "list" | "grid" = "grid";

  @Input() selectable: boolean = false;
  @Input() sortable: boolean = false;

  @Input() selected: Photo[] = [];
  @Output() selectedChange = new EventEmitter<Photo[]>();

  @Output() click = new EventEmitter<CustomEvent<Photo | undefined>>();

  loadingPhotos?: any[] = Array(5).fill(true);

  constructor() { }

  ngOnInit(): void {
  }

  onReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    this.photos?.splice(ev.detail.to, 0, this.photos?.splice(ev.detail.from, 1)[0]);
    ev.detail.complete();
  }

  getMpix(width: number, height: number) {
    return Math.round(width * height / 1000000);
  }


  onPhotoClick(photo: Photo, event: MouseEvent) {

    event.preventDefault();
    event.stopPropagation();

    if (this.selectable) {
      this.onPhotoCheck(photo, !this.isPhotoChecked(photo));
    }
    else if (this.sortable) {
      return;
    }
    else {
      this.click.emit(new CustomEvent("click", { detail: photo }));
    }
  }

  isPhotoChecked(photo: Photo) {
    return this.selected.indexOf(photo) !== -1;
  }

  onPhotoCheck(photo: Photo, isChecked: boolean) {
    console.log("onPhotoCheck", isChecked);
    const i = this.selected.indexOf(photo);

    // if checked, but not in list, add photo 
    if (isChecked && i === -1) this.selected.push(photo);

    // if not checked, but in list, remove photo
    else if (!isChecked && i !== -1) this.selected.splice(i, 1);
  }

}
