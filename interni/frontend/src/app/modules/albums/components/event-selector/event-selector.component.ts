import { AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { StyleEventDetail } from "@ionic/core";

import { ApiService } from 'app/core/services/api.service';
import { Event } from 'app/schema/event';
import { EventSelectorModalComponent } from '../event-selector-modal/event-selector-modal.component';

@Component({
  selector: 'bo-event-selector',
  templateUrl: './event-selector.component.html',
  styleUrls: ['./event-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => EventSelectorComponent),
    }
  ],
})
export class EventSelectorComponent implements OnInit, ControlValueAccessor, AfterViewInit, OnDestroy {

  value?: Event["_id"] | null;
  event?: Event;

  @Input() placeholder?: string;
  @Output("event") eventOutput = new EventEmitter<Event>();


  modal?: HTMLIonModalElement;

  /* ControlValueAccessor */
  onChange?: (value: Event["_id"] | null) => void;
  onTouched?: () => void;

  focused = false;
  disabled = false;

  constructor(
    private modalController: ModalController,
    private api: ApiService,
    private elRef: ElementRef<HTMLElement>
  ) { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {

    this.emitIonStyle();
  }

  ngOnDestroy() {
    this.modal?.dismiss();
  }

  private emitIonStyle() {
    this.elRef.nativeElement.dispatchEvent(new CustomEvent("ionStyle", {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {
        'interactive': true,
        'input': true,
        'has-placeholder': true,
        'has-value': !!this.value,
        'has-focus': this.focused,
        'interactive-disabled': this.disabled,
      }
    }));
  }

  inputValueChanged(value: string) {
    if (value === "") this.updateValue(null);
  }

  async openModal() {
    this.modal = await this.modalController.create({
      component: EventSelectorModalComponent
    });

    this.modal.onDidDismiss().then(result => {
      if (result.data?.event !== undefined) this.updateValue(result.data?.event);
    });

    this.modal.present();
  }

  private async updateValue(value: Event["_id"] | null) {

    if (value === this.value) return;

    this.value = value;
    this.event = value ? await this.loadEvent(value) : undefined;

    this.onChange?.(value);
    this.eventOutput.emit(this.event);
    this.emitIonStyle();
  }

  private async loadEvent(eventId: Event["_id"]) {
    return this.api.get<Event>(["event", eventId]);
  }

  /* ControlValueAccessor */
  writeValue(obj?: Event["_id"] | null): void {
    this.updateValue(obj || null);
  };

  registerOnChange(fn: (value: Event["_id"] | null) => void): void {
    this.onChange = fn;
  };

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }


}
