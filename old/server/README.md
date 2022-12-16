# Server pro webové stránky bosan.cz

## Prerekvizity

 - [NodeJS](http://nodejs.org/) alespoň ve verzi 14
 - Pokud nemáte Docker, tak [MongoDB Community Server](https://www.mongodb.com/try/download/community) ve verzi 4.2

## Instalace

V této složce spusť:

```
npm install
```

## Spuštění pro vývoj

Pro vývoj serveru si musíte spustit jednak samotný **server**, ale taky **databázi**. 

### Chci vyvíjet server lokálně

Pro vývoj je možné použít script `dev`, který spustí server pomocí aplikace `nodemon` a bude zrestartován při každé změně kódu.

```sh
npm run dev
```

Také je potřeba mít k dispozici MongoDB databázi. Tu můžete spustit buď vlastní dle [návodu na webu MongoDB](https://docs.mongodb.com/manual/), nebo třeba přiloženým docker-compose takto:

```sh
docker-compose up db
```

Pokud byste si chtěli ověřit, že API serveru funguje, jak má, můžete spustit ještě i veřejnou a interní sekci. Buď pomocí návodu v jejich složkách, nebo když máte Docker, tak jen přidat do příkazu `docker-compose`:

```sh
docker-compose up db client client-admin
```

Veřejná sekce pak poběží na http://localhost:4200 a interní na http://localhost:4300.

### Chci vyvíjet v devcontaineru nebo Github Codespaces

[Viz README k devcontaineru](../.devcontainer/README.md).

## Konfigurace

Konfigurace probíhá pomocí Environment variables. Klíče pro  Google a Vapid jsou pak načítány z adresáře keys (v Dockeru `/srv/keys`).

### Environment variables

| ENV variable       | Default value                   | Description                                                                                                                            |
|--------------------|---------------------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| AUTH_EXPIRATION    | P1D                             | Jak dlouho zůstane člověk přihlášený ve formátu ISO 8601                                                                               |
| AUTH_SAMESITE      | true                            | Nastaví [samesite](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite) u přihlašovací cookie.  dovolí vývoj |
| AUTH_SECRET        | secret                          | Klíč k podepsání přihlašovacího tokenu.                                                                                                |
| BASE_DIR           | /api                            | Část cesty URL, na které poběží server                                                                                                 |
| BASE_URL           | http://SERVER_HOST:SERVER_PORT  | Část domény URL serveru                                                                                                                |
| DATABASE_URI       | mongodb://localhost:27017/bosan | Adresa a přihlašovací údaje k databázi                                                                                                 |
| FACEBOOK_APP_ID    |                                 | Facebook APP ID                                                                                                                        |
| GOOGLE_IMPERSONATE |                                 | Který účet na Googlu použít k odesílání mailů (je ptořeba přístup)                                                                     |
| ICAL_DOMAIN        | SERVER_HOST                     | Doména pro ICAL události                                                                                                               |
| SERVER_HOST        | 0.0.0.0                         | Hostname na kterém bude poslouchat server                                                                                              |
| SERVER_PORT        | 3000                            | Port na kterém bude poslouchat server                                                                                                  |
| SITE_DESCRIPTION   |                                 | Hodnota HTML META tagu description                                                                                                     |
| SITE_MAIL          | info@bosan.cz                   | Hodnota HTML META tagu main                                                                                                            |
| SITE_TITLE         | Dětská vodácká skupina ŠÁN      | Hodnota HTML META tagu title                                                                                                           |
| KEYS_DIR           | ./keys                          | Cesta k adresáři s klíči (viz níže)                                                                                                    |
| STORAGE            | ./data                          | Cesta k adresáři s daty (viz níže)                                                                                                     |
| STORAGE_CONFIG     | STORAGE + /config               | Cesta k adresáři souboru nastavení                                                                                                     |
| STORAGE_EVENTS     | STORAGE + /events               | Cesta k adresáři souborů akcí                                                                                                          |
| STORAGE_PHOTOS     | STORAGE + /photos               | Cesta k adresáři originálů fotek                                                                                                       |
| STORAGE_THUMBS     | STORAGE + /thumbs               | Cesta k adresáři zmenšených fotek                                                                                                      |
| STORAGE_UPLOADS    | STORAGE + /uploads              | Cesta k adresáři nahrávaných souborů                                                                                                   |
| UPLOADS_LIMIT      | 20mb                            | Maximální velikost nahrávaního souboru                                                                                                 |

### Soubory s klíči: Google a Vapid

Ve složce `keys` (v Dockeru `/srv/keys`) můžou být dva soubory s klíči: `google.json` a `vapid.json`.

`google.json` obsahuje klíče k servisnímu Google účtu, který je použitý na rozesílání emailů z info@bosan.cz. Tento soubor lze vygenerovat v [Google Cloud Console v sekci IAM](https://console.cloud.google.com/iam-admin/iam?authuser=1&project=grand-master-216313)

`vapid.json` si můžete vygenerovat třeba na https://vapidkeys.com/. Slouží k rozesílání notifikací. Když někdo odsouhlasí, že mu můžeme posílat notifikace, jeho prohlížeč/mobil dostane veřejný klíč z tohoto souboru a dovolí notifikace jen když budou podepsané soukromým klíčem z tohoto souboru. Tak se zajistí, že ho nebude spamovat někdo, s jehož notifikacemi nesouhlasil.

## Data

Soubory se neukládají do databáze, ale do vybrané složky (defaultně ./data). 

Pokud aplikaci spouštíte v Dockeru je potřeba tento adresář namapovat lokálně, jinak o všechna data po restartu přijdete. V Dockeru je plná cesta `/srv/app/${STORAGE}`, tedy defaultně `/srv/app/data`.

## Vytvoření admin účtu:

K vytvoření admin účtu je tu připraven jednoduchý skriptík.

```
npm run create-admin
```