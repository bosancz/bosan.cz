import { Component, Input } from '@angular/core';

import { Event } from "app/shared/schema/event";

@Component({
  selector: 'event-expenses-table',
  templateUrl: './event-expenses-table.component.html',
  styleUrls: ['./event-expenses-table.component.scss']
})
export class EventExpensesTableComponent {

  @Input() event:Event;
  
  @Input() types:string[] = [];
  
  constructor() { }
  
  sumExpenses(){
    if(!this.event) return 0;
    return this.event.expenses.reduce((acc,cur) => acc + (cur.amount || 0),0)
  }
  
  sumExpensesType(type:string){
    if(!this.event) return 0;
    return this.event.expenses.reduce((acc,cur) => acc + (cur.type === type ? (cur.amount || 0) : 0),0)
  }
  
  sumExpensesOther(){
    if(!this.event) return 0;
    return this.event.expenses.reduce((acc,cur) => acc + (this.types.indexOf(cur.type) === -1 ? (cur.amount || 0) : 0),0)
  }
  
  perPerson(amount:number){
    if(!this.event) return 0;
    return Math.round(amount / (this.event.attendees.length + this.event.leaders.length) * 100) / 100;
  }

}
