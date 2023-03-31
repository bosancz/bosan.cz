import { Component, Input } from "@angular/core";
import { MembershipTypes } from "app/config/membership-types";
import { Member } from "app/schema/member";

@Component({
  selector: "bo-card-membership",
  templateUrl: "./card-membership.component.html",
  styleUrls: ["./card-membership.component.scss"],
})
export class CardMembershipComponent {
  @Input() member!: Member;

  membershipTypes = MembershipTypes;
}
