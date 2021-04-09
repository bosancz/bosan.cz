import { AfterViewChecked, Component, ElementRef, Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { Photo } from 'app/schema/photo';

class PhotoRow {
  height: number = 0;
  photos: Photo[] = [];
}

@Component({
  selector: 'bo-photo-gallery',
  templateUrl: './photo-gallery.component.html',
  styleUrls: ['./photo-gallery.component.scss']
})
export class PhotoGalleryComponent implements OnInit, AfterViewChecked, OnChanges {

  @Input() photos: Photo[] = [];
  @Input() maxHeight: number = 200;
  margin: number = 5;

  rows: PhotoRow[] = [];

  width!: number;

  constructor(
    private elRef: ElementRef<HTMLElement>
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewChecked() {

    const width = this.elRef.nativeElement.offsetWidth;

    if (width !== this.width) {
      this.width = width;
      setTimeout(() => this.createRows(), 0);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.createRows();
  }

  createRows() {

    if (!this.width) return;

    this.rows = [];

    const photos = this.photos.slice();

    const rows: PhotoRow[] = [];

    while (photos.length) {

      let rowWidth = 0;
      let row = new PhotoRow();
      let photo: Photo | undefined;


      // add photos to row, stop when first photo over limit
      while ((rowWidth <= this.width) && (photo = photos.shift())) {
        rowWidth += this.maxHeight / photo.sizes.small.height * photo.sizes.small.width;
        if (row.photos.length) rowWidth += this.margin;
        row.photos.push(photo);

      }

      const totalMaxWidth = row.photos.reduce((acc, cur) => acc + this.maxHeight / cur.sizes.small.height * cur.sizes.small.width, 0);

      const availableWidth = this.width - (row.photos.length - 1) * this.margin;

      const ratio = availableWidth / totalMaxWidth;

      row.height = this.maxHeight * ratio;

      if (!photos.length) {
        const rowHeightAvg = rows.reduce((acc, cur) => acc + cur.height, 0) / rows.length;
        row.height = Math.min(rowHeightAvg, row.height);
      }

      rows.push(row);
    }

    this.rows = rows;

  }



}
