# Devcontainer webové stránky bosan.cz

Devcontainer je připraven tak, aby spustil databázi, prohlížeč databáze mongo-express a otevřel vývojový NodeJS kontejner. Díky němu si nemusíš nic instalovat do počítače (záleží na způsobu použití, viz prerekvizity níže) a můžeš rovnou vyvíjet.

## Spuštění

### Spuštění v devcontaineru ve Visual Studiu Code na svém počítači

**Prerekvizity**:
 - [VSCode](https://code.visualstudio.com/download)
 - Rozšíření pro VSCode [Visual Studio Code Remote Development Extension Pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack).
 - [Docker Desktop](https://docs.docker.com/desktop/install/windows-install/)

**Postup**:
 1. Otevři si ve VSCode složku repozitáře
 2. Otevři menu (F1) a zvol možnost `Remote-Containers: Reopen Folder in Container`

### Spuštění v devcontaineru ve Visual Studiu Code na Bošánovském serveru

**Prerekvizity**:
 - [VSCode](https://code.visualstudio.com/download)
 - Rozšíření pro VSCode [Visual Studio Code Remote Development Extension Pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack).

**Postup**:
 1. Připoj se ve VSCode přes SSH k Bošánovskému serveru (přístupy ti zařídí Kopec)
 2. Otevři si ve VSCode složku repozitáře
 3. Ve složce `.devcontainer` vytvoř soubor .env s obsahem `COMPOSE_PROJECT_NAME=mojejmeno` kde nastavíš svoje jméno bez diakritiky -  aby se názvy kontejnerů různých lidí nebily.
 4. Otevři menu (F1) a zvol možnost `Remote-Containers: Reopen Folder in Container`

### Spuštění v Github Codespaces


**Prerekvizity**:
 - *žádné*

**Postup**:
 1. Otevři si repozitář [bosancz/bosan.cz](https://github.com/bosancz/bosan.cz) a v dropdownu `Code` zvol Codespaces a `Create codespace on master`. Zvolené codespace se ti otevře ve webovém nebo lokálním VSCode podle tvého nastavení.

## Po spuštění

Po spuštění budeš muset nainstalovat balíčky ke všem projektům, které chceš vyvíjet a spustit je pro vývoj podle jejich návodů pro lokální spuštění:

 - [Veřejná část (`../web`)](../web)
 - [Interní část (`../interni`)](../interni)
 - [Server (`../server`)](../server)