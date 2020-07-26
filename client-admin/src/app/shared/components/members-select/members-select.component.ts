import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';

import { ConfigService } from "app/services/config.service";
import { ApiService } from "app/services/api.service";

import { Member } from "app/shared/schema/member";
import { WebConfigGroup } from "app/shared/schema/web-config";
import { Subject, combineLatest, BehaviorSubject } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';


type MemberWithSearchString = Member & { searchString: string };

@Component({
  selector: 'members-select',
  templateUrl: './members-select.component.html',
  styleUrls: ['./members-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => MembersSelectComponent),
    }
  ]
})
export class MembersSelectComponent implements ControlValueAccessor {

  value$ = new Subject<string[]>();
  members$ = new Subject<MemberWithSearchString[]>();

  selectedMembers$ = new BehaviorSubject<Member[]>([]);

  searchIndex: string[] = [];

  search$ = new Subject<string>();
  filteredMembers = combineLatest(this.search$.pipe(filter(search => typeof search === "string")), this.members$)
    .pipe(map(([search, members]) => {
      const searchString = this.replaceSpecialChars(search);
      return members.filter(member => member.searchString.search(searchString) !== -1);
    }));

  /* autocomplete */
  separatorKeysCodes = [ENTER, COMMA, SPACE];

  /* ngModel */
  disabled: boolean = false;

  onChange: any = () => { };
  onTouched: any = () => { };

  writeValue(membersIds: string[]): void {
    this.value$.next(membersIds || []);
  }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }
  publishValue() {
    this.onChange(this.selectedMembers$.value.map(member => member._id));
  }

  constructor(
    private api: ApiService,
    private configService: ConfigService
  ) {

    combineLatest(this.members$, this.value$)
      .pipe(map(([members, value]) => {
        return value.map(id => members.find(item => item._id === id)).filter(item => !!item)
      }))
      .subscribe(this.selectedMembers$);

  }

  @Input("members")
  set setMembers(members: Member[]) {
    this.members$.next(members.map(member => ({ ...member, searchString: this.getSearchString(member) })));
  }

  getSearchString(member: Member): string {
    let names = member.nickname + (member.name ? (" " + member.name.first + " " + member.name.last) : "");

    names = names.toLowerCase();
    names = this.replaceSpecialChars(names);
    return names;
  }

  replaceSpecialChars(string: string) {
    const replaceChars = ["áčďéěíľňóřšťúůýž", "acdeeilnorstuuyz"];
    return string.replace(/[áčďéěíľňóřšťúůýž]/g, char => replaceChars[1].charAt(replaceChars[0].indexOf(char)));
  }

  add(event: MatAutocompleteSelectedEvent) {
    const member = event.option.value;
    const index = this.selectedMembers$.value.indexOf(member);

    if (index === -1) {
      this.selectedMembers$.next([...this.selectedMembers$.value, member]);
    }

    this.publishValue();
    this.search$.next("");
  }

  remove(member: Member) {
    this.selectedMembers$.next(this.selectedMembers$.value.filter(item => item !== member));

    this.publishValue();
  }

}
