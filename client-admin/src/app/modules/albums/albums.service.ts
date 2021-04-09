import { Injectable } from '@angular/core';
import { AlbumsModule } from './albums.module';
import { ApiService } from 'app/core/services/api.service';
import { Album, Photo } from 'app/schema/album';
import { from, Subject, ReplaySubject } from 'rxjs';
import { distinctUntilChanged, mergeMap } from 'rxjs/operators';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AlbumsService {

  album$ = new ReplaySubject<Album<Photo, string>>(1);

  constructor(private api: ApiService) {
  }

  async loadAlbum(albumId: Album["_id"]) {
    const album = await this.api.get<Album<Photo, string>>(["album", albumId], { photos: 1 });
    this.album$.next(album);
    return album;
  }

  async saveAlbum(albumId: Album["_id"], data: Partial<Album<any>>) {
    await this.api.patch(["album", albumId], data);
  }

  async deleteAlbum(albumId: Album["_id"]) {
    await this.api.delete(["album", albumId]);
  }

  async getPhotos(album: Album<any, any> | Album["_id"]): Promise<Photo[]> {
    if (typeof album === "object" && album._links?.["photos"]) {
      return this.api.get<Photo[]>(album._links["photos"]);
    }
    else {
      const albumId = typeof album === "string" ? album : album._id;
      return this.api.get<Photo[]>(["albums:photos", albumId]);
    }
  }

  async deletePhoto(photoId: Photo["_id"]) {
    await this.api.delete(["photo", photoId]);
  }

  async savePhoto(photoId: Photo["_id"], data: Partial<Photo>) {
    await this.api.patch(["photo", photoId], data);
  }

}
