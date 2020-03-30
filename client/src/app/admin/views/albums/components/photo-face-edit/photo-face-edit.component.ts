import { Component, OnInit, Input, OnChanges, SimpleChange, SimpleChanges, forwardRef } from '@angular/core';

import { Photo } from 'app/shared/schema/photo';
import { Face } from 'app/shared/schema/face';
import { Member } from 'app/shared/schema/member';
import { Subject, BehaviorSubject, combineLatest, Observable, ReplaySubject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'photo-face-edit',
  templateUrl: './photo-face-edit.component.html',
  styleUrls: ['./photo-face-edit.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhotoFaceEditComponent),
      multi: true
    }
  ]
})
export class PhotoFaceEditComponent implements ControlValueAccessor {

  @Input() photo: Photo;
  @Input() size: number = 60;


  @Input() set face(face: Face) {
    this.face$.next(face);
  }
  face$ = new ReplaySubject<Face>(1);


  @Input() set members(members: Member[]) {
    this.members$.next(members);
  }
  members$ = new ReplaySubject<Member[]>(1);

  // Compute closest faces
  topMembers$: Observable<Member[]> = combineLatest(this.face$, this.members$)
    .pipe(map(([face, members]) => this.getTopMembers(face, members)));

  // Filtering of autocomplete
  search$ = new BehaviorSubject<string>("");

  filteredMembers$: Observable<Member[]> = combineLatest(this.search$.pipe(debounceTime(100)), this.members$)
    .pipe(map(([search, members]) => this.filterMembers(search, members)))



  memberId$ = new ReplaySubject<Member["_id"] | null>(1);
  member$: Observable<Member> = combineLatest(this.members$, this.memberId$).pipe(map(([members, memberId]) => this.findMember(memberId, members)));

  // ControlValueAccessor
  onChange = (memberId: string) => { };
  onTouched = () => { };
  disabled: boolean = false;

  constructor() {
  }

  ngOnInit() {
  }

  filterMembers(value: string, members: Member[]) {
    if (!value) return members;

    const filterValue = value.toLowerCase();
    return members.filter(item => item.nickname.toLowerCase().indexOf(filterValue) === 0);
  }

  findMember(memberId: Member["_id"], members: Member[]) {
    return members ? members.find(member => member._id === memberId) : undefined;
  }

  getTopMembers(face: Face, members: Member[]) {

    return members
      .filter(member => member.faceDescriptor)
      .map(member => ({
        member,
        distance: this.computeDistance(face, member)
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3)
      .map(memberWithDistance => memberWithDistance.member);

  }

  computeDistance(face: Face, member: Member) {

    // Euclidean distance
    return Math.sqrt(
      face.descriptor
        .map((faceDescriptorI, i) => Math.pow(member.faceDescriptor[i] - faceDescriptorI, 2))
        .reduce((acc, cur) => acc + cur, 0)
    );
  }

  memberSelected(member: Member | null) {
    this.memberId$.next(member ? member._id : null);
    this.onChange(member ? member._id : null);
  }

  displayMember(member: Member): string {
    return `${member.nickname} (${member.group})`;
  }

  // ControlValueAccessor
  writeValue(memberId: any): void {
    this.memberId$.next(memberId);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
