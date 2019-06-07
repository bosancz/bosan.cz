import { Injectable } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  public modalRef: BsModalRef;

  private subscriptions: Subscription[] = [];

  constructor(private bsModalService: BsModalService, private router: Router, private location: Location) {

    router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      this.hide();
    });

  }

  show(content: any, route: ActivatedRoute, modalOptions: ModalOptions): BsModalRef {

    this.hide();



    this.subscriptions.push(this.bsModalService.onHide.subscribe(() => {
      const params = Object.assign({}, route.snapshot.queryParams);
      if (params["openModal"]) {
        delete params.openModal;
        this.router.navigate([], { queryParams: params, relativeTo: route });
      }
    }));

    this.subscriptions.push(this.bsModalService.onHidden.subscribe(() => {
      this.modalRef = undefined;
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
      this.subscriptions = [];
    }));

    this.router.navigate([], { queryParams: { openModal: true }, queryParamsHandling: "merge", relativeTo: route });

    this.modalRef = this.bsModalService.show(content, modalOptions);

    return this.modalRef;
  }

  hide(): void {
    if (this.modalRef) this.modalRef.hide();
  }
}
