# Vývoj webu bosan.cz


## Postup

1. [Nastavení vývojového prostředí](#nastavení-vývojového-prostředí)
2. [Instalace balíčků](#instalace-balíčků)
3. [Spuštění vývoje webu](#spuštění-vývoje-webu)
4. [Jak udělat tvou první úpravu webu?](#jak-udělat-tvou-první-úpravu-webu)
5. [Publikujeme úpravy](#publikujeme-úpravy)


## Pojmy

Nejdřív zmíníme nějaké pojmy, které se v tomto dokumentu budou objevovat, abys věděl*a, o čem mluvíme.

<!-- zachovávej jeden pojem na jeden řádek, ať se dají jednodušše řadit podle abecedy nebo jinak -->

- [Angular](https://angular.io/) - Stránky píšeme v frameworku Angular. Framework je prostě jen takový soubor nástrojů a pravidel, jak se web píše. Šel by psát i ručně od základu, ale to by bylo hrozně práce.
- [Git](https://git-scm.com/) - Git je nástroj na verzování, tj. správu různých verzí webu. Bude ti zpočátku připadat strašně složitý a nesmyslný. Budeš si říkat, proč prostě neudělat složku, kam každý všechno nahraje. Ale časem pochopíš, že to bychom se v tom nevyznali, byl v tom bordel a web by nefungoval.
- [HTML](https://en.wikipedia.org/wiki/HTML) - HTML je značkovací jazyk, kterým se popisuje struktura webu. Tj. co jsou nadpisy, odkazy, obrázky, atd.
- [NodeJS](https://nodejs.org/) - NodeJS je software, co spouští programy v jazyce JavaScript. A v tom je náš web napsaný. Respektive v TypeScriptu, ale o tom později. Při instalaci na Windows nezapomeň zaškrtnout u Zahrnutí v cestě PATH (Add to PATH) možnost "Entire feature will be installed to local hard drive".  
*Pozor: Aktuální verze (18) není kompatibilní s naším webem (ten používá verzi 14), takže buď najdi starší verzi, nebo se netrap s nějakou instalací a využij spuštění v codespaces, kde se NodeJS automaticky nainstaluje, viz sekce [Nastavení vývojového prostředí](#nastavení-vývojového-prostředí)*
- [SCSS](https://sass-lang.com/) - CSS je jazyk, kterým se popisuje vzhled webu. Tj. jaké barvy apod. mají nadpisy, odkazy, obrázky, atd. My používáme jeho rozšíření SCSS.
- [TypeScript](https://www.typescriptlang.org/) - TypeScript je programovací jazyk, který se překládá do JavaScriptu. Je to jazyk, který má všechny výhody JavaScriptu, ale je o něco přehlednější a příjemnější k psaní. Používá se pro programování logiky webu, tedy jak co bude fungiovat.
- [Visual Studio Code](https://code.visualstudio.com/) - Editorů kódu je spousta. My doporučujeme Visual Studio Code. Je zdarma, má dobrou podporu pro technologie, co na našem webu požíváme, a má přímo v sobě hezké ovládání nástroje na verzování.

## Nastavení vývojového prostředí

### Lokální vývoj na svém počítači

**Prerekvizity**:
 - [VSCode](https://code.visualstudio.com/download) nebo jiné IDE
 - [NodeJS](http://nodejs.org/) alespoň ve verzi 14
 - [Git](https://git-scm.com/downloads)

**Postup**:
 1. Někde v počítači si vytvoř složku, kde chceš mít věci, co s webem souvisí. Úplně kde chceš, třeba v Dokumentech a pojmenuj ji třeba Bošán.
 2. Spusť Visual Studio Code
 3. Volbou File -> Open folder si otevři složku z 1). Bude zatím prázdná.
 4. Klávesovou zkratkou `` CTRL+` `` (`` ` `` je klávesa zpravidla vlevo od jedničky) si otevři Terminál. Ve Windows se tomu také říká příkazový řádek. Budeme jej občas na něco potřebovat, ale neboj, moc často to nebude.
 5. Následující krok bude z celé práce s terminálem nejnáročnější. Bude potřeba nasměrovat terminál do právě vytvořené složky. To se dělá příkazem cd <složka>. Nejjednodušší způsob je zkopírovat do uvozovek celou cestu třeba z průzkumníku (pozor, někdy je v příkazovém řádku při kopírování potřeba zmáčknout navíc Shift, kromě klasického Ctrl+C/V). Druhá možnost je jít po složkách (tedy např. cd Dokumenty -> cd <složka v dokumentech> …) V tom případě je potřeba psát uvozovky, jenom pokud název složky obsahuje mezery. Do nadřazené složky se případně dostaneš příkazem cd .. a diskovou jednotku změníš napsáním <písmeno disku>:
 5. Do Terminálu napiš (nebo spíš zkopíruj) následující příkaz. Ten ti z GitHubu stáhne aktuální kód webu.

    ```sh
    git clone https://github.com/bosancz/bosan.cz
    ```

    Jestli ti to nefunguje, asi jsi nějak špatně nainstaloval*a Git. Zkus to opravit, dokud to nebude fungovat. Možná taky budeš muset zrestartovat počítač, aby si terminál uvědomil, že příkaz `git` už umí.

### Vývoj v Dockeru na svém počítači

**Prerekvizity**:
 - [VSCode](https://code.visualstudio.com/download)
 - Rozšíření pro VSCode [Visual Studio Code Remote Development Extension Pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack).
 - [WSL 2](https://learn.microsoft.com/en-us/windows/wsl/install) a počítač, který jej podporuje
 - [Docker Desktop](https://docs.docker.com/desktop/install/windows-install/)

**Postup**:
 1. Otevři si ve VSCode a v něm menu (F1) a zvol možnost `Dev Containers: Clone Repository in Container Volume`
 2. Vlož adresu repozitáře webu `https://github.com/bosancz/bosan.cz` a stiskni `Enter`

<!-- Bošánovský server to nedává, když je spuštěn vývof frontendu a i backendu, killne to a možná killne třeba i něco jiného, jako třeba web nebo databázi, takže radši nic -->
<!-- ### Vývoj v Dockeru na Bošánovském serveru

**Prerekvizity**:
 - [VSCode](https://code.visualstudio.com/download)
 - Rozšíření pro VSCode [Visual Studio Code Remote Development Extension Pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack).
 - SSH přístup na bošánovský server (zařídí ti někdo ze správců webu)

**Postup**:
 1. Připoj se ve VSCode přes SSH k Bošánovskému serveru
 2. Otevři si ve VSCode složku repozitáře
 3. Ve složce `.devcontainer` vytvoř soubor .env s obsahem `COMPOSE_PROJECT_NAME=mojejmeno` kde nastavíš svoje jméno bez diakritiky -  aby se názvy kontejnerů různých lidí nebily.
 4. Otevři menu (F1) a zvol možnost `Remote-Containers: Reopen Folder in Container` -->

### Vývoj v Github Codespaces

⚠️ Pozor, za tuto možnost platíme (cca 8 Kč/hod), takže ji nepoužívej zbytečně. V billingu je také nastven limit (cca 200 Kč/měsíc), takže se může stát, že ke konci měsíce bude tato možnost nedostupná.

**Prerekvizity**:
 - *žádné*

**Postup**:
 1. Otevři si repozitář [bosancz/bosan.cz](https://github.com/bosancz/bosan.cz) a v dropdownu `Code` zvol Codespaces a `Create codespace on master`. Zvolené codespace se ti otevře ve webovém nebo lokálním VSCode podle tvého nastavení.

## Instalace balíčků

Pro vývoj budeš muset nainstalovat balíčky, které web využívá. Spusť proto následující příkazy v tomto adresáři.

1. Nejdřív nainstalujem balíčky pro některé základní funkce repozitáře
```sh
npm install
```

2. Nyní si v terminálu otevřeme složku `web`
```sh
cd web
```

*Tip: při psaní cest k souboům stačí napsat jen začátek každého (třeba jen `w`) a zmáčknout klávesu `TAB`, automaticky se to doplní na `web/`.*

3. A nainstalujeme balíčky pro vývoj webu
```sh
npm install
```

## Spuštění vývoje webu

Ke zobrazování programu a fotogalerie budeme potřebovat data z interní sekce. Buď se připojíme přes internet k ostré, nebo testovací, nebo si spustíme vlastní.

Po spuštění webu jedním z příkazů níže se web nejdřív bude chvilku kompilovat a pak si v prohlížeči na adrese http://localhost:4200 budeš moci prohlížet svoji vlastní verzi webu, která bude automaticky aktualizována po každé změně v kódu.

*Proč takhle divná adresa? To `localhost` totiž znamená, že neotevíráme nic na internetu, ale na tvém počítači. `:4200` značí, že se to má otevřít na portu 4200. Porty jsou prostě takové adresy na počítači. Na každém portu může běžet jedna aplikace. Weby na internetu běží většinou na portu 443, ale ten se nepíše, to je výchozí port. Ale můžeš si to vyzkoušet. Třeba jdi na https://www.seznam.cz:443/ a uvidíš, že tam běží web seznam.cz. Náš vývojový je prostě na portu 4200, na 443 by se mohl s něčím hádat.*


#### Chci použít data z ostré interní sekce `https://interni.bosan.cz`

```sh
npm run dev:prod
```

#### Chci použít data z testovací interní sekce `https://interni.test.bosan.cz`

```sh
npm run dev:test
```

#### Chci si spustit vlastní lokální interní sekci

Server interní sekce na portu 3000 si spusť podle návodu v [repozitáři interní sekce](https://github.com/bosancz/interni-sekce).

Pak spusť v této složce vývoj webu následujícím příkazem:

```sh
npm run dev
```

## Jak udělat tvou první úpravu webu?

Pomocí následujícího návodu si vyzkoušíš udělat první úpravu webu. Možná ti to bude za začátku připadat složité, ale spoustu kroků budeš dělat jen jednou a ty zbylé si brzy zapamatuješ a zautomatizuješ. Udělat správně záplatu na loď nebo uvázat dračák ti taky určitě nejdřív přišlo složité a teď už to zvládneš i poslepu.

1. V levém menu si otevři složku `web` a pak `src`. V ní jsou veškeré soubory webu, zbytek jsou jen pomocné soubory a složky. V téhle složce je zase nejdůležitější složka `app`. Tu si taky otevři, v ní je kód webu. Pak je tam ještě složka assets, tam jsou různé obrázky, co se na webu zobrazují, ale to teď nepotřebujeme.

2. Teď to začíná být zajímavé. Otevřeš si složku `views` ale nejdřív si přečti, co která složka obsahuje:
    - `components` - součásti webu, které jsou společné pro celý web (v současnosti hlavička a patička)
    - `services` - takové pomocné nástroje, co fungují na pozadí webu - samy ale nic nezobrazují
    - `shared` - součásti webu, které se používají na několika různých místech, takže by je nebylo kam zařadit
    - `views` - jednotlivé stránky webu - to tě asi bude zajímat nejvíc

3. Ve složce `views` už jsou jednotlivé stránky. Každá stránka je reprezentována komponentou (component). Otevři si stránku `camp-view`. Ve složce najdeš tři soubory:
    - `camp-view.component.ts` - Programový kód té stránky, řídí co se má dít, když se například klikne na tlačítko. V případě téhle stránky nastavuje, aby bylo menu průhledné, a načítá adresu mapy tábora.
    - `camp-view.component.html` - Obsah stránky - všechny údaje a texty, co vidíš na webu. Obsah je psaný v jazyce HTML a tak jsou texty umístěné mezi HTML tagy (to je to `<něco>` a `</něco>`) které určují co je napis, co odkaz, tabulky, sloupce atd.
    - `camp-view.component.scss` - Tady se popisuje styl stránky, tedy jestli má být text červený, jak velký atd. Ten je v jazyce CSS, respektive SCSS, což je takové vylepšení CSS.

4. Nyní klikni na soubor `camp-view.component.html`. V hlavím okně se ti otevře jeho obsah. Uvidíš tam nějaké texty o táboru. Schválně zkus v nějakém textu přepsat slovo a uložit ho (`CTRL+S`). V terminálu by to mělo zachroustat (něco se tam napíše).

5. Koukni se do prohlížeče, text na webu bude změněný podle tebe!

6. Tak a teď tu změnu zase radši vrátíme, jo? Klikni vlevo na takovou ikonku s třema puntíkama a výhybkou (správa zdrojového kódu, pod lupičkou). Bude u ní nejspíš jednička v kroužku. Tady budou vypsané všechny soubory ve kterých nastala změna. Když na ně najedeš, bude tam ikonka šipky zpět. Tou změny zase smažeš.

## Publikujeme úpravy

Tak dejme tomu, že jsi něco změnil*a podle předešlého návodu a nebyla to jenom sranda, ale opravdová oprava. Jak to teď dostat na opravdový web? Tak v první řadě musíme tu změnu nějak popsat a dát ji do nějaké škatulky (většinou bývá změn více, proto ty škatulky). Skoro celý programátorský svět k tomu používá nástroj, kterému se říká Git. Ten je k tomu, abychom se ve všech těch změnách vyznali a hlavně aby se změny od několika lidí daly sloučit do jednoho kódu a ten se při tom nerozbil. Navíc se celá historie změn ukládá, takže když náhodou někdo něco rozbije, můžeme se vrátit.

Pro ukládání této historie používáme server GitHub, kde máme účet. Tam je také systém schvalování, takže se na tu tvoji změnu ještě někdo podívá, než ji pustíme na web.

Hqistorie změn se dá představit jako takový divný strom, kde se větve odpojují ale pak zas připojují. Vypadá to spíš jak kolejiště na nádraží. Ten strom má větve (`branch`). Každá `branch` vždy obsahuje kompletní kopii kódu webu. Je jedna hlavní větev (říká se ji `master`), to je ta, co obsahuje ten kód co běží na bosan.cz. Změny se dělají tak, že si uděláš svojí větev, pojmenuješ si jí třeba `fix/summer-camp-dates` (kdybys chtěl/a udělat opravu datumů tábora), tam uděláš změny a ty pak sloučíš zase do `master`u. Změny ve větvi uděláš normálně editací souboru, ale každou změnu zaeviduješ a napíšeš co měníš (změně se říká `commit`, tomu vysvětlení se říká `commit message`). No a když budeš mít hotovo, nahraješ tuhle změněnou větev na GitHub a požádáš o sloučení všech těch změn do `master`. Té žádosti se říká `pull request`. Někdo zkušenější se na to koukne a když mu to bude připadat v pohodě, sloučí to. Pak se to cca do hodiny objeví na webu.

Takhle to vypadá hrozně složitě, ale v následujících krocích to bude jasný.

Tak jdeme na to!

0. Jestli ještě nemáš, zaregistruj se na GitHub.com a požádej správce našeho webu, aby ti přidal přístup k měnení kódu webu.

1. Nejdřív si pro jistotu stáhneme nejnovější verzi webu. Dole by ti mělo vedle ikonky výhybky svítit `master`. Pokud je tam něco jiného, klikni na to a z vyskakovacího menu zvol `master`. Vedle toho vpravo bude ikona dvou šipek v kruhu. Ty zmáčkni. Tím se stáhne nejnovější verze webu. A taky nahrají změny od tebe, ale to později.

2. Nyní si vytvoříme naší větev. Dole na spodní liště Visual Studia Code budeš mít ikonku výhybky a text `master`. To značí, že upravuješ hlavní větev. Klikni na to a pak v menu, které se nahoře zobrazí, klikni na `+ Create new branch`. Zde vyplň název své větve. My používáme přepony `fix/` když je to oprava a `feature/` když je to nová funkce, ale mužeš ji pojmenovat jak chceš. Ale jen bez mezer a speciálních znaků. Tak třeba `fix/summer-camp-dates`. Pak zmáčkni enter.

3. Teď už by dole mělo svítit jméno tvé nové větve. Zatím vedle ní svítí takový obláček. To znamená, že ještě není na GitHubu. Klikni na něj. Tím se na GitHub nahraje. Sice teď bude úplně stejná, jako ta hlavní, ale to neva.

4. Teď udělej nějaké změny. Najdi si něco, co ti přijde blbě, nebo něco, co by šlo vylepšit. Třeba nové datum táborů. Uložíš je normálně `CTRL+S`.

5. Teď změnu zaevidujeme. Vlevo klikni na velký znak výhybky (ten pod lupičkou). Měl by u něj být počet změněných souborů. U každého souboru, který se týká jedné změny (občas se ti stane, že změníš dvě věci a pak je jdeš teprve zaevidovat), klikni na znak plus (nebo na ten velký čudlík Potvrdit). Tím se ze sekce `Changes` dostanou do sekce `Staged changes`. To jsou ty, co právě evidujeme. Jakmile tam budou (třeba to bude jen ten jeden upravený soubor), zadej do políčka nad tím (resp. do prvního řádku „kódu”, co se ti otevře) popis změny. Třeba `fix: new summer camp dates`. To `feat:` je tam proto, aby se odlišily různé typy změn. Všechny typy jsou v [zde](https://www.conventionalcommits.org/en/v1.0.0/#summary). Pak zmáčkni `CTRL+Enter` (nebo tu nenápadnou fajfku v pravém horním rohu). Tím je změna zaevidována. Jenže jen u nás na počítači.

6. Dole vedle názvu tvé větve by měly být dvě šipky v kruhu a vedle nich `0↓` (to znamená, že nejsou žádné nové změny na GitHubu, které bys tu neměl*a) a `1↑` (to je ta tvoje jedna změna, co jsme teď zadali a není na GitHubu). Klikni na to (je jedno jestli na šipky nebo čísla) a počkej, až se to dotočí. Tak, tím se změny nahrály na GitHub. Ale neboj, furt jen v té tvé větvi, zatím jsme na bosan.cz nic nezměnili.
*Jestli tam tu `1↑` a `0↓` nevidíš, nejsi jediný (nevím, zda to je novou verzí VS code, nebo prostředím codespades). V tom případě je to ještě jednodušší - najdeš je na stejném tlačítku, kde bylo předtím Potvrdit.*

7. Teď chceme požádat o schválení změn. To musíš jít na GitHub na https://github.com/bosancz/bosan.cz a zažádat o sjednocení tvé větve do hlavní větve, ten takzvaný `pull request`. Klikni proto na záložku `Pull requests` a na ní klikni na tlačítko `New pull request`. 

8. Nejdřív se musí vybrat, kterou větev žádáš sloučit a kam. V šedivém řádku uvidíš `base:master <- compare:master`. To druhé změň na svou větev. Pod tím se najedou zobrazí všechny změny v té tvé nové větvi, co se musí sloučit. Nad tím bude i tlačítko `Create pull request`. Klikni na něj.

9. Ve formuláři, který se zobrazí vyplň nadpis a krátký popis co bude shrnovat všechny tvé změny. V naše malém případě asi postačí nadpis. Potvrď zas talčítkem `Create pull request`

10. Výborně! 👏👏👏 Tvoje první změna je na cestě na náš web!
*Dál tě už nanavigují kdyžtak ostatní, kdyby to bylo ještě potřeba, ale jejich reakci můžeš urychlit, když je přidáš mezi Reviewers (v tom pravém sloupečku).*

Možná ti to přišlo složité, ale neboj, většinu kroků jsi dělal*a jen napoprvé a zbylé se brzy naučíš nazpaměť a pak už budeš jen s radostí upravovat web. A hlavně to pak budeš moct využít třeba v práci, **takhle to totiž dělají všude**.
