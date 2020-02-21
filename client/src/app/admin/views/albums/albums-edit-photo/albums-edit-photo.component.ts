import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Photo } from 'app/shared/schema/photo';
import { ApiService } from 'app/core/services/api.service';
import { Member } from 'app/shared/schema/member';
import { ToastService } from 'app/admin/services/toast.service';

const placeHolders = [
  "„Výborně!“ pochválil ho Gandalf. „Jenomže já dnes ráno na vyfukování kroužků nemám čas. Hledám někoho, kdo by se zúčastnil jistého dobrodružství.",
  "Pověsil si plášť s kapucí na nejbližší věšák a s hlubokou poklonou se představil: „Dvalin, k vašim službám!“ „Bilbo Pytlík, k vašim!“ odpověděl hobit.",
  "Nic netušící Bilbo uviděl před sebou jenom nějakého starce s holí. Stařec měl vysoký špičatý modrý klobouk, dlouhý šedivý plášť, stříbrnou šálu, přes kterou mu až pod pás splýval bílý plnovous, a obrovské černé boty.",
  "Bilbo Pytlík stál po snídani ve svých dveřích a kouřil z dlouhatánské dřevěné fajfky, která mu sahala skoro až k srstnatým prstům na nohou (pečlivě vykartáčovaným)."
];

@Component({
  selector: 'albums-edit-photo',
  templateUrl: './albums-edit-photo.component.html',
  styleUrls: ['./albums-edit-photo.component.scss']
})
export class AlbumsEditPhotoComponent implements OnInit {

  @Input() src: string;

  @Input() rectangle: { x: number, y: number, height: number, width: number };

  @Input() size: number;

  @Input() set photoId(photoId: string) {
    this.loadPhoto(photoId);
  }

  @Output() prev = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  photo: Photo;

  members: Pick<Member, "_id" | "nickname" | "group" | "faceDescriptor">[] = [];

  randomPlaceholder: string;

  constructor(
    private api: ApiService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.randomPlaceholder = placeHolders[Math.floor(Math.random() * placeHolders.length)];

    this.loadMembers();
  }

  async loadPhoto(photoId: string) {
    this.photo = photoId ? await this.api.get<Photo>(["photo", photoId]) : undefined;
  }

  async loadMembers() {
    this.members = await this.api.get<Pick<Member, "_id" | "nickname" | "group" | "faceDescriptor">[]>(["members"], { select: "_id nickname group descriptor" });
  }

  async savePhoto() {
    await this.api.patch(["photo", this.photo._id], this.photo);
    this.toastService.toast("Uloženo.");
  }


}
