import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'monthName'
})
export class MonthNamePipe implements PipeTransform {
  
  monthNames:{[lang:string]:string[]} = {
    "cs": ["Leden","Únor","Březen","Duben","Květen","Červen","Červenec","Srpen","Září","Říjen","Listopad","Prosinec"]
  };

  transform(value:Date|number|string, lang:string = "cs"):string {
    
    if(!this.monthNames[lang]) return "[Language " + lang + " not available.]";
    
    if(typeof value === "number") this.monthNames[lang][value];
    
    if(typeof value === "string") value = new Date(value);
    
    if(value instanceof Date) return this.monthNames[lang][value.getMonth()];
    
    return "???";
  }

}
