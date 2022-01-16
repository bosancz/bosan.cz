import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'pour-feliciter',
  templateUrl: './pour-feliciter.component.html',
  styleUrls: ['./pour-feliciter.component.scss']
})
export class PourFeliciterComponent implements OnInit {

  constructor(
    public bsModalRef: BsModalRef
  ) { }

  ngOnInit(): void {
  }

}
