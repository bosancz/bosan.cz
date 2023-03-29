import { Component, Input } from '@angular/core';

@Component({
  selector: 'admin-table',
  templateUrl: './admin-table.component.html',
  styleUrls: ['./admin-table.component.scss']
})
export class AdminTableComponent {

  defaultTableClass = "table table-hover";
  tableClass: string;

  @Input() set class(classNames: string) {
    this.tableClass = this.defaultTableClass + (classNames ? " " + classNames : "");
  }

  constructor() {
    this.tableClass = this.defaultTableClass;
  }

}
