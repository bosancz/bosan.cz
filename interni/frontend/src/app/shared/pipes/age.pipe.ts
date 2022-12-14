import { Pipe, PipeTransform } from "@angular/core";
import { DateTime } from "luxon";

@Pipe({
  name: "age",
  pure: true,
})
export class AgePipe implements PipeTransform {
  transform(birthday: DateTime | string | undefined): number {
    if (!birthday) return NaN;
    if (typeof birthday === "string") birthday = DateTime.fromISO(birthday);

    return Math.floor(birthday.diffNow("years").years * -1);
  }
}
