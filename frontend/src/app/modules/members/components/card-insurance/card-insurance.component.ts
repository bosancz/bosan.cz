import { Component, Input } from "@angular/core";
import { Member } from "app/schema/member";

@Component({
  selector: "bo-card-insurance",
  templateUrl: "./card-insurance.component.html",
  styleUrls: ["./card-insurance.component.scss"],
})
export class CardInsuranceComponent {
  @Input() member!: Member;
}
