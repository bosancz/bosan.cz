# Server pro webové stránky bosan.cz

## Prerekvizity

 - [NodeJS](http://nodejs.org/) alespoň ve verzi 14
 - Pokud nemáte Docker, tak [MongoDB Community Server](https://www.mongodb.com/try/download/community) ve verzi 4.2

## Spuštění pro vývoj

Pro vývoj serveru si musíte spustit jednak samotný **server**, ale taky **databázi**. 

### Server

Pro vývoj je možné použít script `dev`, který spustí server pomocí aplikace `nodemon` a bude zrestartován při každé změně kódu.

```sh
npm run dev
```

### Databáze

Také je potřeba mít k dispozici MongoDB databázi. Tu můžete spustit buď vlastní dle [návodu na webu MongoDB](https://docs.mongodb.com/manual/), nebo třeba přiloženým docker-compose takto:

```sh
docker-compose up db
```

Pokud byste si chtěli ověřit, že API serveru funguje, jak má, můžete spustit ještě i veřejnou a interní sekci. Buď pomocí návodu v jejich složkách, nebo kdž máte Docker, tak jen přidat do příkazu `docker-compose`:

```sh
docker-compose up db client client-admin
```

Veřejná sekce poběží na http://localhost:4200 a interní na http://localhost:4300.

## Konfigurace

Konfigurace probíhá pomocí Environment variables. Klíče pro  Google a Vapid jsou pak načítány z adresáře keys (v Dockeru `/srv/keys`).

### Environment variables

| ENV variable       | Default value                   | Description                                                   |
|--------------------|---------------------------------|---------------------------------------------------------------|
| AUTH_EXPIRATION    | P1D                             | Expiration of authcookie as ISO 8601 duration string          |
| AUTH_SAMESITE      | true                            | True if samesite parameter should be used when setting cookie |
| AUTH_SECRET        | secret                          | Key to sign JWT tokens CHANGE THIS!                           |
| BASE_DIR           | /api                            | Base URL of the server                                        |
| BASE_URL           | http://SERVER_HOST:SERVER_PORT  | Site url                                                      |
| DATABASE_URI       | mongodb://localhost:27017/bosan | Database path and credentials                                 |
| FACEBOOK_APP_ID    |                                 | Facebook APP ID for sharing                                   |
| GOOGLE_IMPERSONATE |                                 | Which account to use for mailing                              |
| ICAL_DOMAIN        | SERVER_HOST                     | Domain to use for iCal exports                                |
| SERVER_HOST        | 0.0.0.0                         | Server host                                                   |
| SERVER_PORT        | 3000                            | Server port                                                   |
| SITE_DESCRIPTION   |                                 | Site description                                              |
| SITE_MAIL          | info@bosan.cz                   | Site mail                                                     |
| SITE_TITLE         | Dětská vodácká skupina ŠÁN      | Site title                                                    |
| KEYS_DIR           | /keys                           | Keyfiles storage directory                                    |
| STORAGE            | /data                           | Root storage directory                                        |
| STORAGE_CONFIG     | STORAGE + /config               | Storage directory for config                                  |
| STORAGE_EVENTS     | STORAGE + /events               | Storage directory for events                                  |
| STORAGE_PHOTOS     | STORAGE + /photos               | Storage directory for photos                                  |
| STORAGE_THUMBS     | STORAGE + /thumbs               | Storage directory for thumbs                                  |
| STORAGE_UPLOADS    | STORAGE + /uploads              | Storage directory for uploads                                 |
| UPLOADS_LIMIT      | 10mb                            | Maximum size of an uploaded file                              |

### Soubory s klíči: Google a Vapid

Ve složce `keys` (v Dockeru `/srv/keys`) můžou být dva soubory s klíči: `google.json` a `vapid.json`.

`google.json` obsahuje klíče k servisnímu Google účtu, který je použitý na rozesílání emailů z info@bosan.cz. Tento soubor lze vygenerovat v [Google Cloud Console v sekci IAM](https://console.cloud.google.com/iam-admin/iam?authuser=1&project=grand-master-216313)

`vapid.json` si můžete vygenerovat třeba na https://vapidkeys.com/. Slouží k rozesílání notifikací. Když někdo odsouhlasí, že mu můžeme posílat notifikace, jeho prohlížeč/mobil dostane veřejný klíč z tohoto souboru a dovolí notifikace jen když budou podepsané soukromým klíčem z tohoto souboru. Tak se zajistí, že ho nebude spamovat někdo, s jehož notifikacemi nesouhlasil.


## Vytvoření admin účtu:

K vytvoření admin účtu je tu připraven jednoduchý skriptík.

```
npm run create-admin
```