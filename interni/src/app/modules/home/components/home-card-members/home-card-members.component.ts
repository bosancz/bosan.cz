import { Component, OnInit } from "@angular/core";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { ApiService } from "app/core/services/api.service";
import { Member } from "app/schema/member";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";

@UntilDestroy()
@Component({
  selector: "bo-home-card-members",
  templateUrl: "./home-card-members.component.html",
  styleUrls: ["./home-card-members.component.scss"],
})
export class HomeCardMembersComponent implements OnInit {
  searchString = new Subject<string>();

  members: Member[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.searchString
      .pipe(untilDestroyed(this))
      .pipe(debounceTime(250))
      .subscribe((searchString) => this.loadMembers(searchString));
  }

  async loadMembers(searchString: string) {
    console.log("search", searchString);
    if (searchString) {
      this.members = await this.api.get<Member[]>("members", { search: searchString, limit: 3 });
    } else {
      this.clearMembers();
    }
  }

  clearMembers() {
    this.members = [];
  }
}
