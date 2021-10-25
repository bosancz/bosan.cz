import { Component, OnInit } from '@angular/core';

interface HomeMenuItem {
  title: string;
  link: string;
  color?: string;
}

@Component({
  selector: 'bo-home-menu',
  templateUrl: './home-menu.component.html',
  styleUrls: ['./home-menu.component.scss']
})
export class HomeMenuComponent implements OnInit {

  items: HomeMenuItem[] = [
    { link: "/moje-akce", title: "Moje akce", color: "primary" },
    { link: "/volne-akce", title: "Volné akce", color: "primary" },
    { link: "/kalendar", title: "Kalendář", color: "primary" },
    { link: "/akce", title: "Akce", color: "secondary" },
    { link: "/program", title: "Program", color: "secondary" },
    { link: "/galerie", title: "Galerie", color: "secondary" },
    { link: "/databaze", title: "Databáze", color: "secondary" },
    { link: "/blog", title: "Blog", color: "secondary" },
    { link: "/statistiky", title: "Statistiky", color: "secondary" },
    { link: "/uzivatele", title: "Uživatelé", color: "secondary" },
    { link: "/web", title: "Nastavení webu", color: "secondary" },
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
