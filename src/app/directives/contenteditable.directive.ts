import { Directive, forwardRef, ElementRef, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Directive({
  selector: '[bosan-contenteditable]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: ContenteditableDirective,
    multi: true
  }]
})
export class ContenteditableDirective  implements ControlValueAccessor{

  onChange = (_) => {};
  onTouched = () => {};
  
  @HostListener('keyup', ['$event'])
  keyPressed(event:Event) {
    this.onChange(this.el.nativeElement.textContent);    
  }
  
  constructor(private el:ElementRef) {
    console.log(el);
    el.nativeElement.focus();
  }
  
  writeValue(value:any):void {
    this.el.nativeElement.textContent = value;
  }

  registerOnChange(fn:(_:any) => void):void { this.onChange = fn; }
  registerOnTouched(fn:() => void):void { this.onTouched = fn; }

}
