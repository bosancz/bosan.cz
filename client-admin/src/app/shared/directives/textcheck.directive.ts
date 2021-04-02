import { Directive, ElementRef, HostListener } from '@angular/core';
import { ConfigService } from 'app/services/config.service';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

type TextcheckDirectiveDef = { regexp: RegExp, text: string; };

@Directive({
  selector: '[textcheck]',
  exportAs: "textcheck"
})
export class TextcheckDirective {

  defs: BehaviorSubject<TextcheckDirectiveDef[]> = new BehaviorSubject([] as TextcheckDirectiveDef[]);

  warnings: string[] = [];

  constructor(private el: ElementRef<HTMLInputElement | HTMLTextAreaElement>, private configService: ConfigService) {

    this.configService.config
      .pipe(map(config => config.events.descriptionWarnings))
      .pipe(map(warnings => {
        return warnings
          .map(warning => {
            try {
              return { regexp: new RegExp(warning.regexp, warning.regexpModifiers), text: warning.text };
            }
            catch (err) { return undefined; }
          })
          .filter((item): item is Exclude<typeof item, undefined> => item !== undefined);
      }))
      .subscribe(this.defs);

    this.defs.subscribe(() => this.checkText());

    // catch the first value
    setTimeout(() => this.checkText(), 500);
  }

  @HostListener("keyup")
  checkText() {
    const text = this.el.nativeElement.value;
    const defs = this.defs.getValue();
    this.warnings = defs.filter(warning => warning.regexp.test(text)).map(warning => warning.text);
  }



}
