import { AfterViewInit, Component, ElementRef, HostListener, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { IonInput, IonSlides, ModalController, ViewDidEnter, ViewWillEnter } from '@ionic/angular';
import { Photo } from 'app/schema/photo';
import { AlbumsService } from '../../albums.service';

@Component({
  selector: 'bo-photo-view',
  templateUrl: './photo-view.component.html',
  styleUrls: ['./photo-view.component.scss']
})
export class PhotoViewComponent implements OnInit, ViewDidEnter {

  @Input() photo!: Photo;
  @Input() photos!: Photo[];

  editingCaption = false;

  @ViewChild("captionInput") captionInput!: IonInput;

  sliderOptions?: any;

  @ViewChild("slider") slider!: IonSlides;

  constructor(
    private modalController: ModalController,
    private albumsService: AlbumsService
  ) { }

  ngOnInit(): void {
  }

  async ionViewDidEnter() {

    const index = this.photos.indexOf(this.photo);
    this.sliderOptions = {
      initialSlide: index
    };

    console.log(index, this.photo, this.photos);
  }

  async onSlideChange(event: CustomEvent) {
    const index = await this.slider.getActiveIndex();
    this.photo = this.photos[index];
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    switch (event.code) {
      case "ArrowLeft": return this.previousPhoto();
      case "ArrowRight": return this.nextPhoto();
      case "Escape": return this.close();
      case "Home": return this.openPhoto(0);
      case "End": return this.openPhoto(this.photos.length - 1);
      case "Enter": return this.editCaption();
    }
  }

  async nextPhoto() {
    const index = await this.slider.getActiveIndex();
    if (index + 1 <= this.photos.length - 1) await this.openPhoto(index + 1);
  }

  async previousPhoto() {
    const index = await this.slider.getActiveIndex();
    if (index - 1 >= 0) await this.openPhoto(index - 1);
  }

  async openPhoto(index: number) {
    await this.slider.slideTo(index);
  }

  editCaption() {
    this.editingCaption = true;
    console.log(this.captionInput);
    this.captionInput.getInputElement().then(el => el.focus());
  }

  async saveCaption(value: string | number | null | undefined) {
    value = String(value);
    this.photo.caption = value;
    this.editingCaption = false;
    await this.albumsService.savePhoto(this.photo._id, { caption: value });
  }

  async close() {
    await this.modalController.dismiss();
  }

}
