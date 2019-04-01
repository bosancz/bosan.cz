import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sharing-modal',
  templateUrl: './sharing-modal.component.html',
  styleUrls: ['./sharing-modal.component.css']
})
export class SharingModalComponent implements OnInit {

  title:string;
  url:string;
  
  count = {
    facebook: 0
  };
  
  copied:boolean = false;
  
  constructor() { }

  ngOnInit() {
    console.log(this.url);
  }

  updateCount(event){
    console.log(event);
  }
}
