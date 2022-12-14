import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "bo-home-card",
  templateUrl: "./home-card.component.html",
  styleUrls: ["./home-card.component.scss"],
})
export class HomeCardComponent implements OnInit {
  @Input() title?: string;

  constructor() {}

  ngOnInit(): void {}
}
