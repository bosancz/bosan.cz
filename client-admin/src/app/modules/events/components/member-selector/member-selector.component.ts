import { AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'app/core/services/api.service';
import { Member } from 'app/schema/member';
import { MemberSelectorModalComponent } from '../member-selector-modal/member-selector-modal.component';

export type MemberSelectorType = Member | Member[] | null;

@Component({
  selector: 'bo-member-selector',
  templateUrl: './member-selector.component.html',
  styleUrls: ['./member-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => MemberSelectorComponent),
    }
  ],
})
export class MemberSelectorComponent implements OnInit, ControlValueAccessor, AfterViewInit, OnDestroy {

  value: Member[] = [];

  members!: Promise<Member[]>;

  @Input() placeholder?: string;
  @Input() multiple: boolean | string = false;

  modal?: HTMLIonModalElement;

  /* ControlValueAccessor */
  onChange?: (value: MemberSelectorType) => void;
  onTouched?: () => void;

  focused = false;
  disabled = false;

  constructor(
    private modalController: ModalController,
    private api: ApiService,
    private elRef: ElementRef<HTMLElement>
  ) { }

  ngOnInit(): void {
    this.loadMembers();
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
        'has-value': this.value.length > 0,
        'has-focus': this.focused,
        'interactive-disabled': this.disabled,
      }
    }));
  }

  inputValueChanged(value: string) {
    if (value === "") this.updateValue(null);
  }

  async openModal() {
    this.focused = true;

    this.modal = await this.modalController.create({
      component: MemberSelectorModalComponent,
      componentProps: {
        members: await this.members
      }
    });

    this.modal.onDidDismiss().then(result => {
      this.focused = false;
      if (result.data?.member !== undefined) this.addMember(result.data.member);
    });

    this.modal.present();
  }

  addMember(member: Member) {
    const i = this.value.findIndex(item => item._id === member._id);
    if (i !== -1) return;
    return this.updateValue([...this.value, member]);
  }

  removeMember(member: Member) {
    const i = this.value.findIndex(item => item._id === member._id);
    if (i === -1) return;

    const members = this.value.slice();
    members.splice(i, 1);
    this.updateValue(members);
  }

  private async updateValue(value: MemberSelectorType) {

    if (this.value === value) return;

    if (!value) {
      this.value = [];
      return;
    }

    if (!Array.isArray(value)) {
      value = [value];
    }

    const members = await this.members;

    this.value = value
      .map(value => members.find(item => item._id === value._id))
      .filter((member): member is Exclude<typeof member, undefined> => !!member);

    if (this.multiple) this.onChange?.(this.value);
    else this.onChange?.(this.value[0] || null);

    this.emitIonStyle();
  }

  private async loadMembers() {
    const options = {
      select: "_id nickname name group"
    };

    this.members = this.api.get<Member[]>("members", options);
  }

  /* ControlValueAccessor */
  writeValue(obj?: MemberSelectorType): void {
    this.updateValue(obj || null);
  };

  registerOnChange(fn: (value: MemberSelectorType) => void): void {
    this.onChange = fn;
  };

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }


}
