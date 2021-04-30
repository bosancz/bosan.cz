import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { MemberGroupID, MemberGroups } from 'app/config/member-groups';

@Component({
  selector: 'groups-select',
  templateUrl: './groups-select.component.html',
  styleUrls: ['./groups-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => GroupsSelectComponent),
    }
  ],
  host: {
    "[class.disabled]": "disabled",
    "[class.readonly]": "readonly",
  }
})
export class GroupsSelectComponent implements OnInit, ControlValueAccessor {

  groups = Object.entries(MemberGroups)
    .map(([key, value]) => ({ key, value }))
    .filter(group => group.value.event && group.value.active)
    .sort((a, b) => (Number(b.value.children) - Number(a.value.children)) || a.key.localeCompare(b.key, "cs", { numeric: true }));

  selectedGroups: string[] = [];

  disabled: boolean = false;
  @Input() readonly: boolean = false;

  onChange: any = () => { };
  onTouched: any = () => { };

  writeValue(groups: any): void { this.selectedGroups = groups || []; }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.selectedGroups = [];
  }

  constructor() { }

  ngOnInit() {
  }

  isSelected(groupId: string) {
    return this.selectedGroups.indexOf(groupId) !== -1;
  }

  selectAll(checked: boolean): void {

    if (this.disabled || this.readonly) return;

    if (checked) {
      this.selectedGroups = this.getChildrenGroups().map(group => group.key);
    }
    else this.selectedGroups = [];
    this.onChange(this.selectedGroups);
  }

  isSelectedAll(): boolean {
    return !this.getChildrenGroups()
      .some(group => this.selectedGroups.indexOf(group.key) === -1);
  }

  toggleGroup(groupId: string, deselectOther = false) {

    if (this.disabled || this.readonly) return;

    let i = this.selectedGroups.indexOf(groupId);
    if (i === -1) {
      if (deselectOther) this.selectedGroups = [];
      this.selectedGroups.push(groupId);
    }
    else this.selectedGroups.splice(i, 1);
    this.onChange(this.selectedGroups);
  }

  getChildrenGroups() {
    return this.groups.filter(group => group.value.children);
  }
}
