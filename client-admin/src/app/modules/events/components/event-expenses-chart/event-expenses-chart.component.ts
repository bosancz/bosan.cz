import { Component, OnInit, Input } from '@angular/core';
import { EventExpense } from 'app/schema/event';

@Component({
  selector: 'event-expenses-chart',
  templateUrl: './event-expenses-chart.component.html',
  styleUrls: ['./event-expenses-chart.component.scss']
})
export class EventExpensesChartComponent implements OnInit {

  @Input() expenses!: EventExpense[];

  constructor() { }

  ngOnInit() {
  }

}
