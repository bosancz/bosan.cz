import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { EventTypeID, EventTypes } from 'app/config/event-types';
import { Observable } from 'rxjs';


@Component({
  selector: 'event-subtype-selector',
  templateUrl: './event-subtype-selector.component.html',
  styleUrls: ['./event-subtype-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => EventSubtypeSelectorComponent),
    }
  ],
  host: {
    "[class.disabled]": "disabled",
    "[class.readonly]": "readonly"
  }
})
export class EventSubtypeSelectorComponent implements ControlValueAccessor {

  value?: EventTypeID;
  types = EventTypes;

  onChange: any = () => { };
  onTouched: any = () => { };

  disabled: boolean = false;
  @Input() readonly: boolean = false;

  constructor() {
  }

  select(typeId: EventTypeID) {
    if (this.disabled || this.readonly) return;
    this.value = typeId;
    this.onTouched();
    this.onChange(this.value);
  }

  /* ControlValueAccessor */
  writeValue(value: EventTypeID) {
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
