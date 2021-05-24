import { WebConfigStructure } from 'app/schema/web-config-structure';

const contactFields = [
  { "name": "name", "title": "Jméno", "type": "text" },
  { "name": "nickname", "title": "Přezdívka", "type": "text" },
  { "name": "avatar", "title": "Avatar", "type": "text" },
  { "name": "role", "title": "Role", "type": "text" },
  { "name": "email", "title": "E-mail", "type": "text" },
  { "name": "mobile", "title": "Mobil", "type": "text" }
];

export const webConfigStructure: WebConfigStructure = [

  {
    name: "general", label: "Obecné nastavení",
    items: [
      { name: "title", label: "Titulek webu", type: "string", default: "Název webu", help: "Zobrazí se v záhlaví prohlížeče." },
      { name: "homeMapUrl", label: "Adresa embed mapy Bošán", type: "string", help: "Zobrazí se v IFRAME." },
      { name: "campMapUrl", label: "Adresa embed mapy Šán", type: "string", help: "Zobrazí se v IFRAME." },
      { name: "canalFormUrl", label: "Přihláška na trénink v Troji", type: "string", help: "Odkaz na formulář." },
      { name: "canalAttendeesUrl", label: "Obsazenost tréninku v Tróji", type: "string", help: "Odkaz na tabulku." },
    ]
  },

  {
    name: "contacts", label: "Kontakty",
    items: [
      { name: "leaders", label: "Vedení", type: "codelist", fields: contactFields },
      { name: "monday", label: "Schůzky v pondělí", type: "codelist", fields: contactFields },
      { name: "wednesday", label: "Schůzku ve středu", type: "codelist", fields: contactFields },
    ]
  },

];