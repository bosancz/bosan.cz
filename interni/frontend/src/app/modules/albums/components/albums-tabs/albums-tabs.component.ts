import { Component, Input, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { Album } from "app/schema/album";

@Component({
  selector: "bo-albums-tabs",
  templateUrl: "./albums-tabs.component.html",
  styleUrls: ["./albums-tabs.component.scss"],
})
export class AlbumsTabsComponent implements OnInit {
  @Input() album?: Album<any, any>;
  @Input() selected?: "info" | "fotky";

  constructor(private navController: NavController) {}

  ngOnInit(): void {}

  openTab(id: string) {
    if (!this.album) return;

    const path = `/galerie/${this.album._id}/${id}`;

    this.navController.navigateForward(path, { animated: false, replaceUrl: true });
  }
}
