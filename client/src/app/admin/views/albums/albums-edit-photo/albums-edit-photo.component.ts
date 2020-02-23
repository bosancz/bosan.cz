import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Photo } from 'app/shared/schema/photo';
import { ApiService } from 'app/core/services/api.service';
import { Member } from 'app/shared/schema/member';
import { ToastService } from 'app/admin/services/toast.service';

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
    this.loadMembers();
    this.selectRandomPlaceholder()
  }

  async loadPhoto(photoId: string) {
    this.photo = photoId ? await this.api.get<Photo>(["photo", photoId]) : undefined;
  }

  selectRandomPlaceholder() {
    this.randomPlaceholder = placeHolders[Math.floor(Math.random() * placeHolders.length)];
  }

  async loadMembers() {
    this.members = await this.api.get<Pick<Member, "_id" | "nickname" | "group" | "faceDescriptor">[]>(["members"], { select: "_id nickname group descriptor" });
  }

  async savePhoto() {
    await this.api.patch(["photo", this.photo._id], this.photo);
    this.toastService.toast("Uloženo.");
  }


}
