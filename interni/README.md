# Interní sekce bosan.cz

## Jak na to?

Interní sekce je psána ve frameworku Angular. Pokud ho neznáš, doporučuji si nejdřív prostudovat základní tutoriál na angular.io.

## Adresářová struktura

    .
    ├── dist                    # Výstupní kompilované soubory - to, co běží v prohlížeči
    ├── node_modules            # NPM balíčky, na kterých je aplikace závislá
    └── src                     # Zdrojové kódy
        ├── app                 # Aplikační zdrojové kódy
        │   ├── config          # Statická nastavení
        │   ├── core            # Modul obsahující součásti kořenové části aplikace
        │   ├── modules         # Moduly jednolivých částí aplikace
        │   ├── schema          # TypeScript schémata datových struktur používaných napříč aplikací
        │   ├── shared          # Modul obsahující součísti sdílené všemi moduly aplikace
        │   └── app.*.*         # Kořenová část aplikace
        ├── assets              # Další zdroje aplikace - obrázky, fonty atd.
        ├── environment         # Nastavení prosteřdí
        ├── styles              # Zdrojové kódy globálních CSS stylů
        ├── index.html          # Zaváděcí soubor HTML
        ├── main.ts             # Zaváděcí soubor programu aplikace
        └── styles.scss         # Zaváděcí soubor globálních stylů

## Prerekvizity

 - [NodeJS](http://nodejs.org/) alespoň ve verzi 14

## Instalace

V této složce spusť:

```
npm install
```

## Spuštění pro vývoj

Pro vývoj budeš potřebovat i nějaká data o akcích ze serveru. Můžeš si spustit buď vlastní lokální server, nebo použít náš testovací server `test.bosan.cz`.

### Chci vyvíjet lokálně a použít `test.bosan.cz`

Vývoj interní sekce spusť v této složce následujícím příkazem:

```sh
npm run dev:test-server
```

Web se bude nejdřív celý kompilovat. Až to skončí oetvři si v prohlížeči adresu http://localhost:4300 a uvidíš spuštěný web. Jakmile něco změníš v kódu (složka `src`), ihned se ta část zkompiluje a sama v prohlížeči zaktualizuje.

### Chci vyvíjet lokálně a spustit si vlastní lokální server

Vývoj interní sekce spusť místo přechozího následujícím příkazem:

```sh
npm run dev
```

Budeš muset spustit ještě server a databázi. To můžeš udělat buď ručně dle [návodu u serveru](../server), nebo pomocí `docker-compose` (musíš si nainstalovat [Docker Desktop](https://www.docker.com/get-started)) takto:

```sh
docker-compose up server db
```

Můžeš si k tomu spustit i veřejnou sekci, která poběží na http://localhost:4200:

```sh
docker-compose up server db client
```

### Chci vyvíjet v devcontaineru nebo Github Codespaces

[Viz README k devcontaineru](../.devcontainer/README.md).
