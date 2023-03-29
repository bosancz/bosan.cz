import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from "@angular/common";
// (value: string | number | Date, format: string, locale: string, timezone?: string): string

@Pipe({
  name: 'dateRange'
})
export class DateRangePipe implements PipeTransform {

  transform(value:Array<string|Date>, format1:string = "d. M. y", format2:string = "d. M.", format3:string = "d.", separator:string = " – "):string {
    let dateFrom = new Date(value[0]);
    let dateTill = new Date(value[1]);
    
    if(dateFrom.getFullYear() !== dateTill.getFullYear()) return formatDate(dateFrom,format1,"cs") + separator + formatDate(dateTill,format1,"cs");
    if(dateFrom.getMonth() !== dateTill.getMonth()) return formatDate(dateFrom,format2,"cs") + separator + formatDate(dateTill,format1,"cs");
    if(dateFrom.getDate() !== dateTill.getDate()) return formatDate(dateFrom,format3,"cs") + separator + formatDate(dateTill,format1,"cs");
    return formatDate(dateFrom,format1,"cs");
  }

}
