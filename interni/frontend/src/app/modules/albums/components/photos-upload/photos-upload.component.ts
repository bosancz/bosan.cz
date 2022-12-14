import { HttpClient, HttpEvent, HttpEventType } from "@angular/common/http";
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { ApiService } from 'app/core/services/api.service';
import { Album } from "app/schema/album";


interface PhotoUploadItem {
  file: File;
  progress: number;
  status: string;
  error?: Error;
}

@Component({
  selector: 'photos-upload',
  templateUrl: './photos-upload.component.html',
  styleUrls: ['./photos-upload.component.scss']
})
export class PhotosUploadComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() album!: Album;

  tags: string[] = [];
  selectedTags: string[] = [];

  uploading: boolean = false;

  photoUploadQueue: PhotoUploadItem[] = [];

  allowedFiles_re = /\.(jpg|jpeg|png|gif)$/i;

  @ViewChild("photoInput") photoInput!: ElementRef<HTMLInputElement>;

  isMobile: boolean = false;

  private preventExitListener = (event: BeforeUnloadEvent) => {
    event.preventDefault();
    event.returnValue = "Opravdu chcete zrušit nahrávání fotek?";
    return "Opravdu chcete zrušit nahrávání fotek?";
  };

  constructor(
    private api: ApiService,
    private http: HttpClient,
    private modalController: ModalController,
    private platform: Platform,
    private cdRef: ChangeDetectorRef
  ) {

  }

  ngOnInit() {
    this.updateTags();

  }
  ngOnDestroy() {
    this.uploading = false;
    this.allowExit();
  }

  ngAfterViewInit() {
    if (this.platform.is("mobile")) {
      this.isMobile = true;
      this.photoInput.nativeElement.click();
    }
  }


  updateTags() {
    this.tags = [];
    this.album.photos.forEach(photo => {
      photo.tags?.filter(tag => this.tags.indexOf(tag) === -1).forEach(tag => this.tags.push(tag));
    });
  }

  addPhotosByInput(photoInput: HTMLInputElement) {

    if (!photoInput.files?.length) return;

    for (let i = 0; i < photoInput.files.length; i++) {
      this.photoUploadQueue.push({
        file: photoInput.files[i],
        progress: 0,
        status: "pending"
      });
    }

  }

  addPhotosByDropzone(event: DragEvent, dropZone: HTMLDivElement) {
    event.preventDefault();

    if (!event.dataTransfer?.files) return;

    for (let i = 0; i < event.dataTransfer.files.length; i++) {
      this.photoUploadQueue.push({
        file: event.dataTransfer.files[i],
        progress: 0,
        status: "pending"
      });
    }

  }

  onDragOver(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
  }

  removeFromQueue(uploadItem: PhotoUploadItem) {
    let i = this.photoUploadQueue.indexOf(uploadItem);
    if (i !== -1) this.photoUploadQueue.splice(i, 1);
  }

  close() {
    this.modalController.dismiss(false);
  }

  async uploadPhotos(album: Album<any, any>) {

    this.uploading = true;
    this.preventExit();

    let uploadItem: PhotoUploadItem;
    for (uploadItem of this.photoUploadQueue) {

      if (!this.uploading) break;

      if (uploadItem.status === "finished") continue;

      try {
        uploadItem.status = "uploading";
        await this.uploadPhoto(album, uploadItem);
        uploadItem.status = "finished";
      }
      catch (err: any) {
        uploadItem.status = "error";
        uploadItem.error = err;
      }
    }

    this.uploading = false;
    this.allowExit();

    this.modalController.dismiss(true);

  }

  async uploadPhoto(album: Album, uploadItem: PhotoUploadItem): Promise<void> {

    if (!this.allowedFiles_re.test(uploadItem.file.name)) {
      throw new Error("Unsupported file type.");
    }

    let formData: FormData = new FormData();

    formData.set("album", album._id);
    formData.set("tags", this.selectedTags.join(","));
    formData.set("photo", uploadItem.file, uploadItem.file.name);
    if (uploadItem.file.lastModified) formData.set("lastModified", new Date(uploadItem.file.lastModified).toISOString());

    const uploadPath = await this.api.path2href("photos");

    return new Promise<void>((resolve, reject) => {

      this.http.post(uploadPath, formData, { withCredentials: true, observe: 'events', reportProgress: true, responseType: "text" }).subscribe(
        (event: HttpEvent<any>) => {
          switch (event.type) {

            case HttpEventType.Sent:
              break;

            case HttpEventType.UploadProgress:
              uploadItem.progress = event.total ? Math.round(event.loaded / event.total * 100) : 0;
              this.cdRef.markForCheck();
              if (event.loaded === event.total) uploadItem.status = "processing";
              break;

            case HttpEventType.Response:
              uploadItem.progress = 100;
              resolve();
              break;
          }
        }, err => reject(err));

    });
  }


  private preventExit() {
    window.addEventListener("beforeunload", this.preventExitListener);
  }

  private allowExit() {
    window.removeEventListener("beforeunload", this.preventExitListener);
  }

}

