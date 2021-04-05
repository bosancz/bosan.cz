import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'covid-warning',
  templateUrl: './covid-warning.component.html',
  styleUrls: ['./covid-warning.component.scss']
})
export class CovidWarningComponent implements OnInit {

  constructor(public modalRef: BsModalRef) { }

  ngOnInit() {
  }

}
