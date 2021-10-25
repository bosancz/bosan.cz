import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'bo-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isLg: boolean = false;

  constructor(
    private platform: Platform,
    private navController: NavController
  ) { }

  ngOnInit(): void {
    this.platform.resize
      .pipe(untilDestroyed(this))
      .subscribe(() => this.updateView());

    this.updateView();
  }

  updateView() {
    this.isLg = this.platform.width() >= 992;
  }

}
