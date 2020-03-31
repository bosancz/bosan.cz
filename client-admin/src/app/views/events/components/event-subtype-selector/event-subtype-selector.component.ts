import { Component, forwardRef, HostBinding, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ConfigService } from 'app/services/config.service';
import { WebConfigEventSubType } from 'app/shared/schema/webconfig';

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
  ]
})
export class EventSubtypeSelectorComponent implements ControlValueAccessor {

  value: string;
  types: Observable<WebConfigEventSubType[]>;

  onChange: any = () => { };
  onTouched: any = () => { };

  @HostBinding('class.disabled') disabled: boolean = false;
  @HostBinding('class.readonly') @Input() readonly: boolean;

  constructor(configService: ConfigService) {
    this.types = configService.config.pipe(map(config => config.events.subtypes))
  }

  select(type: WebConfigEventSubType) {
    if(this.disabled || this.readonly) return;
    this.value = type.name;
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
    this.disabled = isDisabled
  }

}
