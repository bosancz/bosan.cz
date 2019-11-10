import { Component, OnInit } from '@angular/core';

import { ProgramService } from "./program.service";

@Component({
  selector: 'program',
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.scss']
})
export class ProgramComponent implements OnInit {

  constructor(public programService: ProgramService) {
  }

  ngOnInit() {
    this.programService.loadStats();
  }

}
