import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { IonInput, IonSlides, ModalController, ViewDidEnter } from '@ionic/angular';
import { Photo } from 'app/schema/photo';
import { AlbumsService } from '../../services/albums.service';

@Component({
  selector: 'bo-photo-view',
  templateUrl: './photo-view.component.html',
  styleUrls: ['./photo-view.component.scss']
})
export class PhotoViewComponent implements OnInit, ViewDidEnter {

  @Input() photo!: Photo;
  @Input() photos!: Photo[];

  editingCaption = false;

  currentPhoto: number = 0;

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
  }

  async onSlideChange(event: CustomEvent) {
    this.currentPhoto = await this.slider.getActiveIndex();
    this.photo = this.photos[this.currentPhoto];
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {

    if (!this.editingCaption) {
      switch (event.code) {
        case "ArrowLeft": return this.previousPhoto();
        case "ArrowRight": return this.nextPhoto();
        case "Escape": return this.close();
        case "Home": return this.openPhoto(0);
        case "End": return this.openPhoto(this.photos.length - 1);
        case "Enter": return this.editCaption();
      }
    }
    else {
      switch (event.code) {
        case "Escape": return this.cancelEditingCaption();
      }
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
    this.captionInput.getInputElement().then(el => el.focus());
  }

  cancelEditingCaption() {
    this.editingCaption = false;
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
