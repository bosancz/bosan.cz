import { Component, Input, forwardRef, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';

@Component({
  selector: 'typeahead-field',
  templateUrl: './typeahead-field.component.html',
  styleUrls: ['./typeahead-field.component.scss'],
  providers: [
    { 
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => TypeaheadFieldComponent),
    }
  ]
})
export class TypeaheadFieldComponent implements ControlValueAccessor {

  @Input() toStringFn:(item:any) => string;
  @Input() matched:any[];
  @Input() delay:number;
  
  @Output() search:EventEmitter<string> = new EventEmitter();
  
  selected:any;
  
  onChange:any;
  onTouched:any;
  
  disabled:boolean = false;
  
  constructor() { }
  
  writeValue(item:any):void{ this.selected = item; }
  registerOnChange(fn:any):void{ this.onChange = fn; }
  registerOnTouched(fn:any):void{ this.onTouched = fn; }
  setDisabledState(isDisabled:boolean):void{ this.disabled = isDisabled; }
  
  loadItems(search:string):void{
    this.search.emit(search);
  }
  
  getItemString(item:any):string{
    return this.toStringFn ? this.toStringFn(item) : String(item);
  }
  
  selectItem(item:any):void{
    this.selected = item;
    this.onChange(this.selected);
  }
  
  onTypeaheadSelected(match:TypeaheadMatch):void{
    this.selectItem(match.item);
  }

}
