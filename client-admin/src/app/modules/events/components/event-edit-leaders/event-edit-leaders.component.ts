import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'bo-event-edit-leaders',
  templateUrl: './event-edit-leaders.component.html',
  styleUrls: ['./event-edit-leaders.component.scss']
})
export class EventEditLeadersComponent implements OnInit {

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit(): void {
  }

  close() {
    return this.modalController.dismiss();
  }

}
