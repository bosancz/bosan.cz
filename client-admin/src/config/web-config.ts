import { WebConfigStructure } from 'app/shared/schema/web-config-structure';

const colorPattern = "^([rR][gG][bB][aA]\\([\\d\\.]*\\d,[\\d\\.]*\\d,[\\d\\.]*\\d,[\\d\\.]*\\d\\)|[rR][gG][bB]\\([\\d\\.]*\\d,[\\d\\.]*\\d,[\\d\\.]*\\d\\)|#[0-9a-fA-F]{8}|#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3})$";

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
      { name: "environment", label: "Poznámka k prostředí", type: "string", help: "Zobrazí se červeně u titulku Bosan.cz" },
      { name: "homeMapUrl", label: "Adresa embed mapy Bošán", type: "string", help: "Zobrazí se v IFRAME." },
      { name: "campMapUrl", label: "Adresa embed mapy Šán", type: "string", help: "Zobrazí se v IFRAME." },
      { name: "canalFormUrl", label: "Přihláška na trénink v Troji", type: "string", help: "Odkaz na formulář." },
      { name: "canalAttendeesUrl", label: "Obsazenost tréninku v Tróji", type: "string", help: "Odkaz na tabulku." },
    ]
  },


  {
    name: "events", label: "Akce",
    items: [
      {
        name: "statuses", label: "Stavy akcí", type: "codelist",
        default: [{ id: "draft" }, { id: "pending" }, { id: "public" }, { id: "cancelled" }, { id: "finalized" }, { id: "rejected" }],
        fields: [
          { "name": "id", "title": "ID", "type": "text" },
          { "name": "name", "title": "Název", "type": "text" },
          { "name": "class", "title": "CSS třída", "type": "text" }
        ]
      },
      {
        name: "types", label: "Typy akcí", type: "codelist",
        fields: [
          { "name": "name", "title": "Název", "type": "text" },
          { "name": "class", "title": "CSS třída", "type": "text" }
        ]
      },
      {
        name: "subtypes", label: "Charaktery akcí", type: "codelist",
        fields: [
          { "name": "name", "title": "Název", "type": "text" },
          { "name": "color", "title": "Barva (#HEX)", "type": "text", "pattern": colorPattern, "placeholder": "#A1B2C3" },
          { "name": "image", "title": "URL obrázku", "type": "text" }
        ]
      },
      {
        name: "expenseTypes", label: "Typy výdajů", type: "codelist",
        fields: [
          { "name": "name", "title": "Typ", "type": "text" }
        ]
      },
      {
        name: "descriptionWarnings", label: "Kontrola popisků", type: "codelist",
        fields: [
          { "name": "regexp", "title": "RegExp", "type": "text" },
          { "name": "regexpModifiers", "title": "RegExp modifikátory", "type": "text" },
          { "name": "text", "title": "Varování", "type": "text" }
        ]
      }
    ]
  },

  {
    name: "members", label: "Členská databáze",
    items: [

      {
        name: "groups", label: "Oddíly", type: "codelist",
        fields: [
          { "name": "id", "title": "ID", "type": "text", "required": true },
          { "name": "name", "title": "Jméno", "type": "text" },
          { "name": "color", "title": "Barva (#HEX)", "pattern": colorPattern, "type": "text", "placeholder": "#A1B2C3" },
          { "name": "real", "title": "Oddíl", "type": "checkbox" },
          { "name": "active", "title": "Aktivní", "type": "checkbox" },
          { "name": "event", "title": "Akce", "type": "checkbox" },
          { "name": "children", "title": "Dětský", "type": "checkbox" }
        ]
      },

      {
        name: "roles", label: "Role", type: "codelist",
        fields: [
          { "name": "id", "title": "ID", "type": "text" },
          { "name": "genitiv", "title": "2. pád", "type": "text" }
        ]
      },

      {
        name: "posts", label: "Funkce", type: "codelist",
        fields: [
          { "name": "id", "title": "ID", "type": "text" },
        ]
      },

      {
        name: "ranks", label: "Hodnosti", type: "codelist",
        fields: [
          { "name": "id", "title": "ID", "type": "text" },
        ]
      },

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


  {
    name: "users", label: "Uživatelé",
    items: [
      {
        name: "roles", label: "Uživatelské role", type: "codelist",
        fields: [
          { "name": "name", "title": "ID", "type": "text" },
          { "name": "title", "title": "Název", "type": "text" },
          { "name": "description", "title": "Popis", "type": "text" }
        ]
      }
    ]
  }

];