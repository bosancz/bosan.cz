import { Component, forwardRef, Input, HostBinding } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ConfigService } from 'app/core/services/config.service';
import { WebConfigEventType } from 'app/schema/web-config';

@Component({
  selector: 'event-type-selector',
  templateUrl: './event-type-selector.component.html',
  styleUrls: ['./event-type-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => EventTypeSelectorComponent),
    }
  ],
  host: {
    "[class.disabled]": "disabled",
    "[class.readonly]": "readonly"
  }
})
export class EventTypeSelectorComponent implements ControlValueAccessor {

  value?: string;
  types: Observable<WebConfigEventType[]>;

  onChange: any = () => { };
  onTouched: any = () => { };

  disabled: boolean = false;
  @Input() readonly: boolean = false;

  class: string = "badge badge-secondary";

  constructor(configService: ConfigService) {
    this.types = configService.config.pipe(map(config => config.events.types));
  }

  select(type: string) {
    if (this.disabled || this.readonly) return;
    this.value = type;
    this.onTouched();
    this.onChange(this.value);
  }

  /* ControlValueAccessor */
  writeValue(value: string) {
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
