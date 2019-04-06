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

### Instalace nástrojů

**NodeJS**
 - https://nodejs.org
 - (při instalaci na Windows nezapomeňte zaškrtnout zahrnutí v cestě PATH)

**Verzovací nástroj s podporou gitu**
 - ([Sourcetree](https://www.sourcetreeapp.com/) nebo [Git](https://git-scm.com/))

**Editor kódu**
 - doporučujeme [VSCode](https://code.visualstudio.com/), nebo [WebStorm](https://www.jetbrains.com/webstorm/)

**Angular CLI**
 - `npm install @angular/cli -g`
 
**MongoDB** (pokud chcete vyvíjet backend)
 - https://www.mongodb.com/download-center/community

### Spuštění pouze pro vývoj frontendu (bez instalace serveru a databáze)
```sh
cd client
ng serve --configuration=local
```
### Spuštění pro vývoj frontendu i backendu
Otevřete si dva terminály (příkazové řádky).

V prvním spusťte:
```sh
cd client
ng serve --configuration=local-server
```

A v druhém:
```sh
$env:NODE_ENV="local" # ve Windows v PowerShellu
set NODE_ENV=local    # ve Windows v příkazovém řádku
NODE_ENV=local        # v Linuxu v terminálu

cd server
npm run dev
```

### Jak na to?

Popis toho, jak web interně funguje, jak co nastavit a jak co naprogramovat najdete ve [wiki](https://github.com/bosancz/bosan.cz/wiki). Obecné věci najdete samozřejmě v dokumentaci k příslušným technologiím.

### Pravidla přispívání

- kód **v angličtině**, commity **v angličtině**, pull requesty **v angličtině**, issues **v češtině**
- struktura souborů na klientu dle [Angular Style Guide](https://angular.io/guide/styleguide)
