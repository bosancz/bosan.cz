# Server pro webové stránky bosan.cz

## Jak na to?

Oceníme každou pomoc. Pokud jsi nováček, nejdřív si přečti detailní [návod, jak začít s úpravami webu](./CONTRIBUTING.md).

## Prerekvizity

 - [NodeJS](http://nodejs.org/) alespoň ve verzi 14

## Instalace

V této složce spusť:

```
npm install
```

## Spuštění pro vývoj

Pro vývoj budeš potřebovat i nějaká data o akcích ze serveru. Můžeš si spustit buď vlastní lokální server, nebo použít náš testovací server `test.bosan.cz`.

### Chci vývíjet lokálně a použít `test.bosan.cz`

Vývoj veřejné sekce spusť v této složce následujícím příkazem:

```sh
npm run dev:test-server
```

Web se bude nejdřív celý kompilovat Až to skončí oetvři si v prohlížeči adresu http://localhost:4200 a uvidíš spuštěný web. Jakmile něco změníš v kódu (složka `src`), ihned se ta část zkompiluje a sama v prohlížeči zaktualizuje.

### Chci vyvíjet lokálně a spustit si vlastní lokální server

Vývoj veřejné sekce spusť místo přechozího následujícím příkazem:

```sh
npm run dev
```

Budeš muset spustit ještě server a databázi. To můžeš udělat buď ručně dle [návodu u serveru](../server), nebo pomocí `docker-compose` takto:

```sh
docker-compose up server db
```

Můžeš si k tomu spustit i interní sekci, která poběží na http://localhost:4300:

```sh
docker-compose up db server client-admin
```


### Chci vyvíjet v devcontaineru nebo Github Codespaces

Devcontainer je připraven tak, aby spustil databázi, prohlížeč databáze mongo-express a otevřel vývojový NodeJS kontejner. Jednotlivé části webu (interní, veřejná a server) si pak pro vývoj spustíš ručně příkazy `npm run dev` dle návodu pro lokální užití. Spuštění dalších částí pomocí docker compose zde nefunguje.

Při spuštění na Bošánovském serveru si ve složce `.devcontainer` vytvořte soubor .env s obsahem `COMPOSE_PROJECT_NAME=moje jméno` kde nastavíte svoje jméno bez diakritiky, aby se názvy kontejnerů různých lidí nebily.