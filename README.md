# bosan.cz
Frontend webových stránek Dětské vodácké skupiny ŠÁN.

# Instalace

1, 2, 3, jako v Horstovi Fuchsovi:

### 0. Prerekvizity

 - NodeJS
 - MongoDB

### 1. Instalace

```
npm install
```

### 2. Kompilace

```
npm run build
```

### 3. Start

```
npm start
```

# Nastavení

## Vytvoření admin přístupu

```
npm run create-admin
```

## Konfigurace serveru

### Prostředí

Konfigurační soubory `server/environment.<prostředí>`

Prostředí nastavíme pomocí globální proměnné `NODE_ENV`:

```
NODE_ENV=production npm start
```

### Obecná nastavení

Soubor `server/config/general.js`.

### Řízení přístupů
Soubor `server/config/permissions.js`.

## Konfigurace klienta

### Řízení přístupů

Soubor `client/src/config/permissions.ts`

## Sdílení na sociálních sítích

Facebook a další nečtou obsah stránky vygenerovaný dynamicky. Je proto potřeba jim dodat obsah jinak, prostřednictvím OpenGraph tagů. Odchycení těchto dotazů docílíte např. metodou rewrite v Nginx:
```nginx
if ($http_user_agent ~ "^(facebookexternalhit)|(Twitterbot)|(Pinterest)|(Slackbot)") {
  rewrite ^/(\/(?!data).*)$ /api/share/$1;#only when doesnt start with /data because there are the pictures shared
}
```

# Vývoj

## Jak na to?

Popis toho, jak web interně funguje, jak co nastavit a jak co naprogramovat najdete ve [wiki](https://github.com/bosancz/bosan.cz/wiki). Obecné věci najdete samozřejmě v dokumentaci k příslušným technologiím.

## Spuštění pro testovací provoz na localhostu

Nainstalujte si @angular/cli globálně:
```
sudo npm install @angular/cli -g
```

Spusťte si vývojový server, který se sám překompiluje v případě změny kódu. jako backend jsou použita testovací data z test.bosan.cz.
```
cd client
ng serve --configuration=local
```

## Přispívání

- názvy souborů, proměnných a dalších názvů v angličtině
- popisky commitů a PR v angličtině
- struktura souborů dle projektu a dle [angular-cli](https://github.com/angular/angular-cli)
- http://nvie.com/posts/a-successful-git-branching-model/
