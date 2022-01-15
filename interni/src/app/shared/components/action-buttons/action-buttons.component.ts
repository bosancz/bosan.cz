import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ActionSheetController, Platform } from '@ionic/angular';
import { ActionSheetButton, PredefinedColors } from "@ionic/core";

export interface Action extends ActionSheetButton {
  disabled?: boolean;
  hidden?: boolean;
  pinned?: boolean;
  color?: PredefinedColors;
}

@Component({
  selector: 'bo-action-buttons',
  templateUrl: './action-buttons.component.html',
  styleUrls: ['./action-buttons.component.scss']
})
export class ActionButtonsComponent implements OnInit {

  @Input() set actions(actions: Action[]) {

    actions = this.filterActions(actions);

    if (actions.length === 1) {
      this.single = actions[0];
      this.pinned = [];
      this.buttons = [];
      this.menu = [];
    }
    else {
      this.single = undefined;

      this.pinned = actions.filter(item => item.pinned);

      this.buttons = actions.filter(item => !item.pinned);

      if (actions.filter(item => !item.pinned).length) {

        this.menu = actions.filter(item => item.text && !item.disabled && !item.pinned);

        if (!this.menu.some(item => item.role === "cancel") && this.platform.is('ios')) {
          this.menu.push({
            text: "Zrušit",
            role: "cancel",
            icon: "close-outline"
          });
        }
      }
      else {
        this.menu = [];
      }
    }

  }

  single?: Action;
  pinned: Action[] = [];
  buttons: Action[] = [];
  menu: Action[] = [];

  @Input() header?: string;
  @Input() subHeader?: string;

  @Output() close = new EventEmitter<void>();

  desktop = true;
  ios = this.platform.is("ios");

  open = false;

  constructor(
    private platform: Platform,
    private actionsController: ActionSheetController
  ) { }

  ngOnInit(): void {
  };

  async openActions() {
    let buttons = this.menu;

    if (this.platform.is("ios")) buttons = buttons.map(item => ({ ...item, icon: undefined }));

    buttons.sort((a, b) => {
      if (a.role === "destructive" && b.role !== "destructive") return -1;
      else if (a.role !== "destructive" && b.role === "destructive") return 1;
      else return 0;
    });

    const actionSheet = await this.actionsController.create({
      buttons: buttons,
      header: this.header,
      subHeader: this.subHeader
    });

    actionSheet.present();

  }

  onClick(action: Action) {
    action.handler?.();
  }

  private filterActions(actions: Action[]) {
    return actions.filter(item => !item.hidden);
  }

}
