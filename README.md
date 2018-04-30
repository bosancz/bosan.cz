# bosan.cz
Frontend webových stránek Dětské vodácké skupiny ŠÁN.

# Instalace

### 0. Prerekvizity

 - NodeJS (npm)
 - Webový server

### 1. Instalace

```
npm install
```

### 2. Konfigurace

Je nutné vytvořit soubory ```src/environments/environment.ts``` a ```src/environments/environment.prod.ts```. Vzory jsou ve stejné složce.

### 3. Kompilace

```
npm run build
```

### 4. Publikace

Použijte svůj oblíbený webový server pro vystavení složky ```dist```.

# Vývoj

## Spuštění pro testovací provoz

```npm run dev-build``` - spustí [angular-cli](https://github.com/angular/angular-cli) v režimu rekompilace v případě změn v adresáři ```src```

```npm run dev-server``` - spustí testovací server [json-server](https://github.com/typicode/json-server) - nutno nakonfigurovat v souboru ```test-api/json-server.json```

```npm run dev``` - spustí oboje výše zmíněné najednou pomocí [concurrently](https://github.com/kimmobrunfeldt/concurrently)

## Přispívání

- názvy souborů, proměnných a dalších názvů v angličtině
- popisky commitů a PR v angličtině
- struktura souborů dle projektu a dle [angular-cli](https://github.com/angular/angular-cli)
- http://nvie.com/posts/a-successful-git-branching-model/
