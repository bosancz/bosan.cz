import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'list-slider',
  templateUrl: './list-slider.component.html',
  styleUrls: ['./list-slider.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => ListSliderComponent),
    }
  ]
})
export class ListSliderComponent implements ControlValueAccessor {

  @Input() items: any[] = [];
  @Input() visible: number = 3;
  @Input() itemWidth = 40;

  value: any;

  disabled: boolean = false;

  onChange = (value: any) => { };
  onTouched = () => { };


  constructor() { }

  getI(): number {
    return this.items.indexOf(this.value);
  }
  getLeft() {
    return this.getI() * this.itemWidth
  }

  getOpacity(i: number) {
    return Math.max(1 - (1 / this.visible) * Math.abs(this.getI() - i), 0);
  }

  /* NgModel (ControlValueAccessor) */

  setValue(value: any) {
    this.value = value;
    this.onChange(this.value);
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

}
