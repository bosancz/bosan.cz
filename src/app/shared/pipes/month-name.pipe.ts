import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'monthName'
})
export class MonthNamePipe implements PipeTransform {
  
  monthNames:{[lang:string]:string[]} = {
    "cs": ["Leden","Únor","Březen","Duben","Květen","Červen","Červenec","Srpen","Září","Říjen","Listopad","Prosinec"]
  };

  transform(value:number|string, lang:string = "cs"):string {
    
    if(typeof value === "string") value = Number(value);
    
    if(!this.monthNames[lang]) return "[Language " + lang + " not available.]";
    
    return this.monthNames[lang][value - 1] || "???";
  }

}
