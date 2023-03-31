import { Component, Input } from "@angular/core";
import { Member } from "app/schema/member";

@Component({
  selector: "bo-card-allergies",
  templateUrl: "./card-allergies.component.html",
  styleUrls: ["./card-allergies.component.scss"],
})
export class CardAllergiesComponent {
  @Input() member!: Member;
}
