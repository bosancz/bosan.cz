import { Component, Input, OnChanges } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'photo-face',
  templateUrl: './photo-face.component.html',
  styleUrls: ['./photo-face.component.scss'],
})
export class PhotoFaceComponent implements OnChanges {

  @Input() src!: string;

  @Input() rectangle!: { x: number, y: number, height: number, width: number; };

  @Input() size!: number;

  style: any = {};
  backgroundStyle?: SafeStyle;

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  ngOnChanges() {
    this.style = {
      "width": this.size + 'px',
      "height": this.size + 'px',
      "border-radius": (this.size / 2) + 'px',
      "background-image": 'url(' + this.src + ')',
      "background-size": this.rectangle.width > this.rectangle.height ? (this.size * 1 / this.rectangle.width) + 'px auto' : 'auto ' + (this.size * 1 / this.rectangle.height) + 'px'
    };

    this.backgroundStyle = this.sanitizer.bypassSecurityTrustStyle('calc(' + (this.rectangle.x * 100) + '% - ' + (this.rectangle.x * this.size) + 'px) calc(' + (this.rectangle.y * 100) + '% - ' + (this.rectangle.y * this.size) + 'px)');
  }

}
