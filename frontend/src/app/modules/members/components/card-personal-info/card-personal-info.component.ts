import { Component, Input } from "@angular/core";
import { Member } from "app/schema/member";

@Component({
  selector: "bo-card-personal-info",
  templateUrl: "./card-personal-info.component.html",
  styleUrls: ["./card-personal-info.component.scss"],
})
export class CardPersonalInfoComponent {
  @Input() member!: Member;
}
