import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OutputData } from '@editorjs/editorjs';

@Component({
  selector: 'bo-text-view',
  templateUrl: './text-view.component.html',
  styleUrls: ['./text-view.component.scss'],
})
export class TextViewComponent implements OnInit {

  data?: OutputData;

  @Input()
  set content(content: string) {
    try {
      this.data = JSON.parse(content);
    }
    catch (err: any) {
      this.data = undefined;
      this.error.emit(err);
    }
  }

  @Input() headingLevel: number = 1;

  @Output() error = new EventEmitter<Error>();

  constructor() { }

  ngOnInit(): void {
  }

}
