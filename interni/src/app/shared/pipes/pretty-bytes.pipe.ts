import { Pipe, PipeTransform } from '@angular/core';
import * as prettyBytes from 'pretty-bytes';

@Pipe({
  name: 'prettyBytes'
})
export class PrettyBytesPipe implements PipeTransform {

  transform(value: number, options?: prettyBytes.Options) {
    return prettyBytes(value, options);
  }

}
