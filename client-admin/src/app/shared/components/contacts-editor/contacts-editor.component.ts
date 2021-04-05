import { Component, OnInit, Input } from '@angular/core';

import { Contact } from "app/schema/contact";

@Component({
  selector: 'contacts-editor',
  templateUrl: './contacts-editor.component.html',
  styleUrls: ['./contacts-editor.component.css']
})
export class ContactsEditorComponent implements OnInit {

  @Input()
  contacts!: Contact[];

  constructor() { }

  ngOnInit() {
  }

  add() {
    this.contacts.push(new Contact);
  }

  delete(i: number) {
    this.contacts.splice(i, 1);
  }

  move(i: number, target: number) {
    if (target < 0 || target >= this.contacts.length) return;
    this.contacts.splice(target, 0, this.contacts.splice(i, 1)[0]);
  }

}
