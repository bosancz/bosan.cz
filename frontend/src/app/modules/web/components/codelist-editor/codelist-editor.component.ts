import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

export interface Codelist {
  default?: any[],
  fields: CodelistField[];
}

export interface CodelistField {
  name: string;
  title: string;
  type: string;
  pattern?: string;
  required?: boolean;
  placeholder?: string;
}

@Component({
  selector: 'bo-codelist-editor',
  templateUrl: './codelist-editor.component.html',
  styleUrls: ['./codelist-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => CodelistEditorComponent)
    }
  ]
})
export class CodelistEditorComponent implements ControlValueAccessor {

  @Input() fields: CodelistField[] = [];

  records: any[] = [];

  disabled: boolean = false;
  onChange: any = () => { };
  onTouched: any = () => { };

  writeValue(records: any): void {
    if (Array.isArray(records)) this.records = records;
    else {
      this.records = [];
      this.onChange(this.records);
    }
  }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }

  constructor() { }

  add() {

    if (this.disabled) return;

    let record = this.fields.reduce((acc, cur) => ({ ...acc, [cur.name]: null }), {});

    this.records.push(record);
  }

  delete(i: number) {
    if (this.disabled) return;
    this.records.splice(i, 1);
  }

  move(from: number, to: number) {
    if (this.disabled) return;
    if (to < 0 || to >= this.records.length) return;
    this.records.splice(to, 0, this.records.splice(from, 1)[0]);
  }

}
