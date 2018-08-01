import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'codelist-editor',
  templateUrl: './codelist-editor.component.html',
  styleUrls: ['./codelist-editor.component.scss']
})
export class CodelistEditorComponent implements OnInit {

  @Input() fields:{name:string,title:string,type:string}[] = [];
  
  @Input() records:any[];
  
  constructor() { }

  ngOnInit() {
  }
  
  add(){
    var record = {};
    this.fields.forEach(field => record[field.name] = null);
    this.records.push(record);
  }
  
  delete(i:number){
    this.records.splice(i,1);
  }
  
  move(from:number,to:number){
    if(to < 0 || to >= this.records.length) return;
    this.records.splice(to,0,this.records.splice(from,1)[0]);
  }

}
