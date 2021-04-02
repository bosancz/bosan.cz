import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { ApiService } from 'app/services/api.service';
import { ToastService } from 'app/services/toast.service';

import { Member } from 'app/shared/schema/member';
import { Photo } from 'app/shared/schema/photo';
import { Subscription, combineLatest } from 'rxjs';
import { AlbumsService } from '../../../albums.service';
import { map } from 'rxjs/operators';
import { DateTime, LocalZone } from 'luxon';

const placeHolders = [
  "„Já dnes na vyfukování kroužků nemám čas. Hledám někoho, kdo by se zúčastnil jistého dobrodružství,“ řekl Gandalf",
  "Pověsil si plášť s kapucí na nejbližší věšák a s hlubokou poklonou se představil: „Dvalin, k vašim službám!“",
  "„Bilbo Pytlík, k vašim službám!“ odpověděl hobit.",
  "Nic netušící Bilbo uviděl před sebou jenom nějakého starce s holí.",
  "Stařec měl vysoký špičatý modrý klobouk, dlouhý šedivý plášť a stříbrnou šálu, přes kterou mu splýval bílý plnovous.",
  "Stál ve dveřích a kouřil z dlouhé fajfky, která mu sahala až k srstnatým, pečlivě vykartáčovaným prstům na nohou."
];

@Component({
  selector: 'albums-edit-photo',
  templateUrl: './albums-edit-photo.component.html',
  styleUrls: ['./albums-edit-photo.component.scss']
})
export class AlbumsEditPhotoComponent implements OnInit {

  album$ = this.albumsService.album$;

  photo?: Photo;
  photoDate?: string;

  members: Pick<Member, "_id" | "nickname" | "group" | "faceDescriptor">[] = [];

  randomPlaceholder: string = this.selectRandomPlaceholder();

  currentPhotoId?: string;
  previousPhotoId?: string;
  nextPhotoId?: string;

  paramsSubscription?: Subscription;

  constructor(
    private api: ApiService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    private albumsService: AlbumsService
  ) { }

  ngOnInit() {
    this.loadMembers();
    this.randomPlaceholder = this.selectRandomPlaceholder();

    this.paramsSubscription = combineLatest(this.album$, this.route.params.pipe(map((params: Params) => params.photo)))
      .subscribe(([album, photoId]) => {
        const i = album.photos.findIndex(photo => photo._id === photoId);
        if (i === -1) this.selectPhoto(album.photos[0]._id);
        else {
          this.loadPhoto(album.photos[i]._id);

          this.previousPhotoId = i > 0 ? album.photos[i - 1]._id : album.photos[album.photos.length - 1]._id;
          this.nextPhotoId = i < album.photos.length - 1 ? album.photos[i + 1]._id : album.photos[0]._id;
        }
      });


  }

  ngOnDestroy() {
    this.paramsSubscription?.unsubscribe();
  }

  async loadPhoto(photoId: string) {
    this.photo = photoId ? await this.api.get<Photo>(["photo", photoId], { members: 1 }) : undefined;
    this.photoDate = typeof this.photo?.date === "string" ? DateTime.fromISO(this.photo.date).setZone(new LocalZone()).toISO({ includeOffset: false }) : undefined;
  }

  async loadMembers() {
    this.members = await this.api.get<Pick<Member, "_id" | "nickname" | "group" | "faceDescriptor">[]>("members", { select: "_id nickname group descriptor" });
  }

  async savePhoto() {
    if (!this.photo) return;

    if (this.photoDate) this.photo.date = DateTime.fromISO(this.photoDate).setZone(new LocalZone()).toISO();

    await this.api.patch<Photo>(["photo", this.photo._id], this.photo);
    this.toastService.toast("Uloženo.");
  }

  selectPhoto(photoId: string | null) {
    if (photoId) {
      this.router.navigate(["../", photoId], { replaceUrl: true, relativeTo: this.route });
    }
    else {
      this.router.navigate(["../"], { replaceUrl: true, relativeTo: this.route });
    }
  }

  prevPhoto() {
    if (this.previousPhotoId) this.selectPhoto(this.previousPhotoId);
  }

  nextPhoto() {
    if (this.nextPhotoId) this.selectPhoto(this.nextPhotoId);
  }

  selectRandomPlaceholder() {
    return placeHolders[Math.floor(Math.random() * placeHolders.length)];
  }
}
