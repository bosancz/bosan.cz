import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: 'photo-tags-editor',
  templateUrl: './photo-tags-editor.component.html',
  styleUrls: ['./photo-tags-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => PhotoTagsEditorComponent),
    }
  ]
})
export class PhotoTagsEditorComponent implements ControlValueAccessor {

  @Input() tags: string[] = [];
  selectedTags: string[] = [];

  disabled: boolean = false;

  onChange: any = () => { };
  onTouched: any = () => { };

  writeValue(tags: any): void { this.selectedTags = tags || []; }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }

  constructor() { }

  hasTag(tag: string) {
    return this.selectedTags.indexOf(tag) !== -1;
  }

  toggleTag(tag: string) {

    if (this.disabled) return;

    let i = this.selectedTags.indexOf(tag);
    if (i === -1) this.selectedTags.push(tag);
    else this.selectedTags.splice(i, 1);

    this.onChange(this.selectedTags);
  }

  newTag() {

    if (this.disabled) return;

    let tag = window.prompt("Zadejte název nového tagu:");
    if (!tag) return;

    if (tag.charAt(0) === "#") tag = tag.substring(1);

    if (this.tags.indexOf(tag) === -1) this.tags.push(tag);

    if (this.selectedTags.indexOf(tag) === -1) {
      this.selectedTags.push(tag);
      this.onChange(this.selectedTags);
    }
  }

}
