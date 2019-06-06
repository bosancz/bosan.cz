import { Component, forwardRef, TemplateRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { BsModalService, ModalOptions, BsModalRef } from 'ngx-bootstrap/modal';

import { Member } from 'app/shared/schema/member';
import { Event } from 'app/shared/schema/event';

@Component({
  selector: 'event-attendees-list',
  templateUrl: './event-attendees-list.component.html',
  styleUrls: ['./event-attendees-list.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => EventAttendeesListComponent),
    }
  ]
})
export class EventAttendeesListComponent implements ControlValueAccessor {

  members: Member[] = [];
  previousMembers: Member[] = [];

  onChange: any = () => { };
  onTouched: any = () => { };

  disabled: boolean = false;
  @Input() readonly: boolean;

  @Input() event:Event;

  modalRef: BsModalRef;

  constructor(private router: Router, private route: ActivatedRoute, private modalService: BsModalService) { }

  removeMember(member: Member): void {
    if (this.disabled || this.readonly) return;
    this.members.splice(this.members.indexOf(member), 1);
    this.publishValue();
  }

  setMembers(members) {
    if (this.disabled || this.readonly) return;
    this.members = members;
    this.publishValue();
  }

  publishValue() {
    this.onChange(this.members);
  }


  openModal(modal: TemplateRef<any>) {
    this.router.navigate(['./', { modal: "open" }], { relativeTo: this.route });
    const modalOptions: ModalOptions = { animated: false };
    this.modalRef = this.modalService.show(modal, modalOptions);

    this.previousMembers = this.members.slice();
  }

  reset() {
    if (this.disabled || this.readonly) return;
    this.members = this.previousMembers;
    this.publishValue();
  }

  /* ControlValueAccessor */
  writeValue(value: Member[]) {
    this.members = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled
  }


}
