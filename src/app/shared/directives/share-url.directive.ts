import { Directive, Input, HostListener, ElementRef } from '@angular/core';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { SharingModalComponent } from "app/shared/components/sharing-modal/sharing-modal.component";

declare const navigator:any;

@Directive({
  selector: '[shareUrl]'
})
export class ShareUrlDirective {

  @Input() shareUrl:string;
  @Input() shareData:{title?:string, text?:string} = {};
  
  sharingModalRef:BsModalRef;
  
  constructor(private modalService:BsModalService, el:ElementRef) {
    el.nativeElement.style.cursor = 'pointer';
  }
  
  @HostListener("click")
  onClick(){
    
    const url = this.shareUrl || window.location.href;
    
    if (navigator.share) {
      navigator.share({...this.shareData,url}).catch((error) => console.log('Error sharing', error));
    }
    else {
      this.sharingModalRef = this.modalService.show(SharingModalComponent, {initialState: {title: "Sdílej fotku", url: window.location.href}});
    }
  }

}
