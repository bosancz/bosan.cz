import { Pipe, PipeTransform } from "@angular/core";
import prettyBytes, { Options } from "pretty-bytes";

@Pipe({
  name: "prettyBytes",
})
export class PrettyBytesPipe implements PipeTransform {
  transform(value: number, options?: Options) {
    return prettyBytes(value, options);
  }
}
