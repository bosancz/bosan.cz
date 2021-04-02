import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Face } from 'app/shared/schema/face';
import { Member } from 'app/shared/schema/member';
import { Photo } from 'app/shared/schema/photo';
import { BehaviorSubject, combineLatest, Observable, ReplaySubject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

type MemberFaceInfo = Pick<Member, "_id" | "nickname" | "group" | "faceDescriptor">;

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

  @Input() photo!: Photo;
  @Input() size: number = 60;


  @Input() set face(face: Face) {
    this.face$.next(face);
  }
  face$ = new ReplaySubject<Face>(1);


  @Input() set members(members: MemberFaceInfo[]) {
    this.members$.next(members);
  }
  members$ = new ReplaySubject<MemberFaceInfo[]>(1);

  expressionBadges: { [key: string]: string; } = {
    "neutral": "😐",
    "happy": "🙂",
    "sad": "🙁",
    "angry": "😡",
    "fearful": "😨",
    "disgusted": "🤢",
    "surprised": "😲",
  };

  // Compute closest faces
  topMembers$: Observable<MemberFaceInfo[]> = combineLatest([this.face$, this.members$])
    .pipe(map(([face, members]) => this.getTopMembers(face, members)));

  // Filtering of autocomplete
  search$ = new BehaviorSubject<string>("");

  filteredMembers$: Observable<MemberFaceInfo[]> = combineLatest([this.search$.pipe(debounceTime(100)), this.members$])
    .pipe(map(([search, members]) => this.filterMembers(search, members)));



  memberId$ = new ReplaySubject<MemberFaceInfo["_id"] | null>(1);
  member$: Observable<MemberFaceInfo | null> = combineLatest([this.members$, this.memberId$]).pipe(map(([members, memberId]) => memberId ? this.findMember(memberId, members) : null));

  // ControlValueAccessor
  onChange = (memberId: string | null) => { };
  onTouched = () => { };
  disabled: boolean = false;

  constructor() {
  }

  ngOnInit() {
  }

  filterMembers(value: string, members: MemberFaceInfo[]) {
    if (!value) return members;

    const filterValue = value.toLowerCase();
    return members.filter(item => item.nickname.toLowerCase().indexOf(filterValue) === 0);
  }

  findMember(memberId: Member["_id"], members: MemberFaceInfo[]) {
    return members?.find(member => member._id === memberId) || null;
  }

  getTopMembers(face: Face, members: MemberFaceInfo[]) {

    return members
      .filter(member => member.faceDescriptor)
      .map(member => ({
        member,
        distance: this.computeDistance(face, member.faceDescriptor!)
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3)
      .map(memberWithDistance => memberWithDistance.member);

  }

  computeDistance(face: Face, faceDescriptor: number[]) {

    // Euclidean distance
    return Math.sqrt(
      face.descriptor
        .map((faceDescriptorI, i) => Math.pow(faceDescriptor[i] - faceDescriptorI, 2))
        .reduce((acc, cur) => acc + cur, 0)
    );
  }

  memberSelected(member: MemberFaceInfo | null) {
    this.memberId$.next(member ? member._id : null);
    this.onChange(member ? member._id : null);
  }

  displayMember(member: MemberFaceInfo): string {
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
