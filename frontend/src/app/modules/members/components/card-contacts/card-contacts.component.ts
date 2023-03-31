import { Component, Input } from "@angular/core";
import { Member } from "app/schema/member";

@Component({
  selector: "bo-card-contacts",
  templateUrl: "./card-contacts.component.html",
  styleUrls: ["./card-contacts.component.scss"],
})
export class CardContactsComponent {
  @Input() member!: Member;
}
