# Frontend webových stránek Dětské vodácké skupiny ŠÁN.

 - [Spuštění na serveru](#spuštění-na-serveru) 
 - [Lokální vývoj](#lokální-vývoj)

## Spuštění na serveru

### Instalace

#### Potřebné aplikace

 - [NodeJS](https://nodejs.org)
 - [MongoDB](https://www.mongodb.com/download-center/community)
 
#### Instalace webu

```sh
npm install # instalace balíčků
npm run build # kompilace kódu
npm start # spuštění serveru
```

### Nastavení

#### Vytvoření admin přístupu

```
npm run create-admin
```

#### Konfigurace serveru

##### Prostředí

Konfigurační soubory `server/environment.<prostředí>`

Prostředí nastavíme pomocí globální proměnné `NODE_ENV`:

```
NODE_ENV=production npm start
```

##### Obecná nastavení

Soubor `server/config/general.js`.

##### Řízení přístupů
Soubor `server/config/permissions.js`.

#### Konfigurace klienta

##### Řízení přístupů

Soubor `client/src/config/permissions.ts`

#### Sdílení na sociálních sítích

Facebook a další nečtou obsah stránky vygenerovaný dynamicky. Je proto potřeba jim dodat obsah jinak, prostřednictvím OpenGraph tagů. Odchycení těchto dotazů docílíte např. metodou rewrite v Nginx:
```nginx
if ($http_user_agent ~ "^(facebookexternalhit)|(Twitterbot)|(Pinterest)|(Slackbot)") {
  rewrite ^/(\/(?!data).*)$ /api/share/$1;#only when doesnt start with /data because there are the pictures shared
}
```

## Lokální vývoj

### Spuštění pouze pro vývoj frontendu (bez instalace serveru a databáze)

1) Nejdřív si nainstalujte následující aplikace:

 - [NodeJS](https://nodejs.org) (při instalaci na Windows nezapomeňte zaškrtnout zahrnutí v cestě PATH)
 - Versovací nástroj s podporou gitu ([Sourcetree](https://www.sourcetreeapp.com/), [Git](https://git-scm.com/))
 - Editor kódu (doporučujeme [VSCode](https://code.visualstudio.com/), nebo [WebStorm](https://www.jetbrains.com/webstorm/))


2) Potém si nainstalujte @angular/cli globálně. To uděláte v příkazovém řádku následovně:
```
npm install @angular/cli -g
```

3) A web pro vývoj následně spustíte tamtéž:
```
cd client
ng serve --configuration=local
```
### Spuštění pro vývoj frontendu i backendu

TODO

### Jak na to?

Popis toho, jak web interně funguje, jak co nastavit a jak co naprogramovat najdete ve [wiki](https://github.com/bosancz/bosan.cz/wiki). Obecné věci najdete samozřejmě v dokumentaci k příslušným technologiím.

### Pravidla přispívání

- kód **v angličtině**, commity **v angličtině**, pull requesty **v angličtině**, issues **v češtině**
- struktura souborů na klientu dle [Angular Style Guide](https://angular.io/guide/styleguide)
