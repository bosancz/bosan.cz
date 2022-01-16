# Chceš pomoct s Bošánovským webem? Tak to je super!

## Jak udělat tvou první úpravu webu?

Pomocí následujícího návodu si nainstaluješ potřebné nástroje a vyzkoušíš udělat první úpravu webu. Možná ti to bude za začátku připadat složité, ale spoustu kroků budeš dělat jen jednou a ty zbylé si brzy zapamatuješ a zautomatizuješ. Udělat správně záplatu na loď ti taky určitě nejdřív přišlo složité a teď už to zvládneš i poslepu.

Návod má čtyři kapitoly:

1) [Nainstaluj si potřebné nástroje](#nainstaluj-si-pot%C5%99ebn%C3%A9-n%C3%A1stroje)
2) [Stáhni a spusť si svou kopii webu u sebe na PC](#st%C3%A1hni-a-spus%C5%A5-si-svou-kopii-webu-u-sebe-na-pc)
3) [Měníme web](#m%C4%9Bn%C3%ADme-web)
4) [Publikujeme změny](#publikujeme-zm%C4%9Bny)

### Nainstaluj si potřebné nástroje:

1) [NodeJS](https://nodejs.org/)  
NodeJS je software, co spouští programy v jazyce JavaScript. A v tom je náš web napsaný. Respektive v TypeScriptu, ale o tom později. Při instalaci na Windows nezapomeň zaškrtnout "zahrnutí v cestě PATH".

2) [Visual Studio Code](https://code.visualstudio.com/)  
Editorů kódu je spousta. Já doporučuju Visual Studio Code. Je zdarma, má dobrou podporu pro technologie, co na našem webu požíváme, a má přímo v sobě hezké ovládání nástroje na verzování.

4) [Git](https://git-scm.com/)  
Git je nástroj na verzování, tj. správu různých verzí webu. Bude ti zpočátku připadat strašně složitý a nesmyslný. Budeš si říkat, proč prostě neudělat složku, kam každý všechno nahraje. Ale časem pochopíš, že to bychom se v tom nevyznali, byl v tom bordel a web by nefungoval.

### Stáhni a spusť si svou kopii webu u sebe na PC

1) Někde v počítači si vytvoř složku, kde chceš mít věci, co s webem souvisí. Úplně kde chceš, třeba v Dokumentech a pojmenuj ji třeba Bošán.

2) Spusť Visual Studio Code

3) Volbou File -> Open folder si otevři složku z 1). Bude zatím prázdná.

4) Klávesovou zkratkou `` CTRL+` `` (`` ` `` je klávesa vlevo od jedničky) si otevři Terminál. Ve Windows se tomu také říká příkazový řádek. Budeme jej občas na něco potřebovat, ale neboj, moc často to nebude.

5) Do Terminálu napiš (nebo spíš zkopíruj) následující příkaz. Ten ti z GitHubu stáhne aktuální kód webu.

    ```sh
    git clone https://github.com/bosancz/bosan.cz
    ```

    Jestli ti to nefunguje, asi jsi v minulé kapitole nějak špatně nainstaloval/a Git. Zkus to opravit, dokud to nebude fungovat. Možná taky budeš muset zrestartovat počítač, aby si terminál uvědomil, že příkaz `git` už umí.

6) Nyní by se ti vlevo v menu s ikonkou dvou papírů měla objevit složka bosan.cz. V ní je několik podsložek. Tebe bude teďka zajímat složka `client`, kde jsou kódy k veřejné části webu.  
*Pro zajímavost, k čemu jsou ostatní:*
    - *`.github` - Technická nastavení, která říkají jak se nové změny webu dostávají na server*
    - *`client` - Kód k veřejné sekci webu*
    - *`client-admin` - Kód k interní sekci*
    - *`server` - Kód, který se stará o ukládaní dat a čtení dat z databáze. Např. když si zobrazíš program, tady se zjistí, co je za akce.*
    - *`worker` - Kód k úlohám, které se dělají na pozadí. Zatím tam nic moc není. Ale bude tam třeba nějaké zpracování fotek.*

7) Spusť nyní v terminálu následující příkaz. Tím se otevře složka `client` ve složce `bosan.cz` v tom terminálu. To `cd` totiž znamená „change directory“. Otevřená složka vlevo v menu a v terminálu spolu nesouvisejí. Často totiž chceš měnit nějaký soubor někde, ale spouštět příkazy v hlavní složce.
*Tajný tip: bude stačit napsat jen začátek každého (třeba jen `bo`) a zmáčknout klávesu TAB, automaticky se to doplní na `bosan.cz/`.*
    ```sh
    cd bosan.cz/client
    ```

8) Nyní je potřeba doinstalovat některé součásti (tzv. balíčky), které náš web používá. Nechceme přeci všechno psát ručně. Je na to zase jednoduchý příkaz, který vše nainstaluje. Bude to ale chvilku trvat. Třeba i pár minut.
*Tajný tip: stačilo by `npm i`, to `i` je zkratka pro install.*
    ```sh
    npm install
    ```

9) Teď si na tvém počítači konečně spustíš web! A to sice následujícím příkazem (neboj, to už je poslední!). Ten spustí předvolený příkaz `dev:test-server`, který nám spustí web tak, aby si bral data z `test.bosan.cz`.
    ```sh
    npm run dev:test-server
    ```

10) Web se bude chvíli připravovat. Až to doběhne, můžeš si v prohlížeči otevřít adresu http://localhost:4200 a pokud všechno dopadlo dobře, bude tam běžet tvoje vlastní kopie Bošánovského webu.  
*Proč takhle divná adresa? To `localhost` totiž znamená, že neotevíráme nic na internetu, ale na tvém počítači. `:4200` značí, že se to má otevřít na portu 4200. Porty jsou prostě takové adresy na počítači. Na každém portu může běžet jedna aplikace. Weby na internetu běží většinou na portu 443, ale ten se nepíše, to je výchozí port. Ale můžeš si to vyzkoušet. Třeba jdi na https://www.seznam.cz:443/ a uvidíš, že tam běží web seznam.cz. Náš vývojový je prostě na portu 4200, na 443 by se mohl s něčím hádat.*

### Měníme web!

1) Stránky píšeme v frameworku Angular. Framework je prostě jen takový soubor nástrojů a pravidel, jak se web píše. Šel by psát i ručně od základu (takhle se to asi učí na školách), ale to by bylo hrozně práce. Můžeš si o Angularu něco přečíst na angular.io, ale to až potom, teď jdeme měnit web! Otevři si tedy Visual Studio Code a pomocí známého `File -> Open Folder` složku `client` ve složce `bosan.cz` ve složce, kterou sis vytvořil/a někde u sebe na počítači podle bodu 1 minulé kapitoly.

2) Klávesovou zkratkou `` CTRL+` ``, kterou známe z bodu 4 minulé kapitoly otevři terminál a rovnou v něm spusť příkaz `npm run dev:test-server` z bodu 9 a otevři si zas web v prohlížeči na adrese http://localhost:4200 z bodu 10. Teď jsi ready na to upravovat web.

3) V levém menu si otevři složku `src` v ní je veškerý kód, zbytek jsou jen pomocné soubory a složky. V téhle složce je zase nejdůležitější složka `app`. Tu si taky otevři.

4) Teď to začíná být zajímavé. Otevřeš si složku `pages` ale nejdřív si přečti, co která složka obsahuje:
    - `components` - součásti webu, které jsou společné pro celý web (v současnosti hlavička a patička)
    - `services` - takové pomocné nástroje, co fungují na pozadí webu - samy ale nic nezobrazují
    - `shared` - součásti webu, které se používají na několika různých místech, takže by je nebylo kam zařadit
    - `pages` - jednotlivé stránky webu - to tě asi bude zajímat nejvíc

5) Ve složce `pages` už jsou jednotlivé stránky. Každá stránka je reprezentována komponentou (component). Otevři si stránku `camp-view`. Ve složce najdeš tři soubory:
    - `camp-view.component.ts` - Programový kód té stránky, řídí co se má dít, když se například klikne na tlačítko. V případě téhle stránky nastavuje, aby bylo menu průhledné, a načítá adresu mapy tábora.
    - `camp-view.component.html` - Obsah stránky - všechny údaje a texty, co vidíš na webu. Obsah je psaný v jazyce HTML a tak jsou texty umístěné mezi HTML tagy (to je to `<něco>` a `</něco>`) které určují co je napis, co odkaz, tabulky, sloupce atd.
    - `camp-view.component.scss` - Tady se popisuje styl stránky, tedy jestli má být text červený, jak velký atd. Ten je v jazyce CSS, respektive SCSS, což je takové vylepšení CSS.

6) Nyní klikni na soubor `camp-view.component.html`. V hlavím okně se ti otevře jeho obsah. Uvidíš tam nějaké texty o táboru. Schválně zkus v nějakém textu přepsat slovo a dát uložit (`CTRL+S`). V terminálu by to mělo zachroustat (něco se tam napíše).

7) Koukni se do prohlížeče, text na webu bude změněný podle tebe!

8) Tak a teď tu změnu zase radši vrátíme, jo? Klikni vlevo na takovou ikonku s puntíkama a výhybkou. Bude u ní nejspíš jednička v kroužku. Tady budou vypsané všechny soubory ve kterých nastala změna. Když na ně najedeš, bude tam ikonka šipky zpět. Tou změny zase smažeš.

### Publikujeme změny

Tak dejme tomu, že jsi něco změnil/a podle předešlého návodu a nebyla to jenom sranda, ale opravdová oprava. Jak to teď dostat na opravdový web? Tak v první řadě musíme tu změnu nějak popsat a dát ji do nějaké škatulky (většinou bývá změn více, proto ty škatulky). Asi celý programátorský svět k tomu používá nástroj, kterému se říká Git. Ten je k tomu, abychom se ve všech těch změnách vyznali a hlavně aby se změny od několika lidí daly sloučit do jednoho programu a ten se při tom nerozbil. Navíc se celá historie změn ukládá, takže když náhodou někdo něco rozbije, můžeme se vrátit. Taky je tam systém schvalování, takže se na tu tvoji změnu ještě někdo podívá, než ji pustíme na web.

Ta historie změn se dá představit jako takový divný strom, kde se větve odpojují ale pak zas připojují. Vypadá to spíš jak kolejiště na nádraží. Ten strom má větve (`branch`). Každá `branch` vždy obsahuje kompletní kód webu. Je jedna hlavní větev (říká se ji `master`), to je ta, co obsahuje ten kód co běží na bosan.cz. Změny se dělají tak, že si uděláš svojí větev. Pojmenuješ si jí třeba `fix/summer-camp-dates` kdybys chtěl/a udělat opravu datumů letního tábora. Je to vlastně kopie webu, kde uděláš tu změnu. Každou změnu pak zaeviduješ a napíšeš co měníš (změně se říká `commit`, tomu vysvětlení se říká `commit message`). No a když budeš mít hotovo, nahraješ tuhle novou `branch` na GitHub a požádáš o sloučení všech těch změn do `master`. Té žádosti se říká `pull request`. Někdo zkušenější se na to koukne a když mu to bude připadat v pohodě, sloučí to. Pak se to cca do hodiny objeví na webu.

Tak jdeme na to!

0) Jestli ještě nemáš, zaregistruj se na GitHub.com a požádej správce našeho webu, aby ti přidal přístup k měnení kódu webu.

1) Nejdřív si pro jistotu stáhneme nejnovější verzi webu. Dole by ti mělo vedle ikonky výhybky svítit `master`. Pokud je tam něco jiného, klikni na to a z vyskakovacího menu zvol `master`. Vedle toho vpravo bude ikona dvou šipek v kruhu. Ty zmáčkni. Tím se stáhne nejnovější verze webu. A taky nahrají změny od tebe, ale to později.

2) Nyní si vytvoříme naší větev. Dole na spodní liště Visual Studia Code budeš mít ikonku výhybky a text `master`. To značí, že upravuješ hlavní větev. Klikni na to, pak v menu, které se nahoře zobrazí, klikni na `+ Create new branch`. Zde vyplň název své větve. My používáme přepony `fix/` když je to oprava a `feature/` když je to nová funkce, ale mužeš ji pojmenovat jak chceš. Ale jen bez mezer a speciálních znaků. Tak třeba `fix/summer-camp-dates`. Pak zmáčkni enter.

3) Teď už by dole mělo svítit jméno tvé nové větve. Zatím vedle ní svítí takový obláček. To znamená, že ještě není na GitHubu. Klikni na něj. Tím se na GitHub nahraje. Sice teď bude úplně stejná, jako ta hlavní, ale to neva.

4) Teď udělej nějaké změny. Najdi si něco, co ti přijde blbě, nebo něco, co by šlo vylepšit. Třeba nové datum táborů. Uložíš je normálně `CTRL+S`.

5) Teď změnu zaevidujeme. Vlevo klikni na velký znak výhybky. Měl by u něj být počet změněných souborů. U každého souboru, který se týká jedné změny (občas se ti stane, že změníš dvě věci a pak je jdeš teprve zaevidovat), klikni na znak plus. Tím se ze sekce `Changes` dostanou do sekce `Staged changes`. To jsou ty, co právě evidujeme. Jakmile tam budou (třeba to bude jen ten jeden upravený soubor), zadej do políčka nad tím popis změny. Třeba `new summer camp dates`. Pak zmáčkni `CTRL+Enter`. Tím je změna zaevidována. Jenže jen u nás na počítači.

6) Dole vedle názvu tvé větve by měly být dvě šipky v kruhu a vedle nich `0↓` (to znamená, že nejsou žádné nové změny tvé větve na GitHubu, které bys tu neměl/a) a `1↑` (to je ta tvoje jedna změna, co jsme teď zadali). Klikni na to (je jedno jestli na šipky v kruhu nebo čísla) a počkej, až se to dotočí. Tak, tím se změny nahrály na GitHub. Ale neboj, furt jen v té tvé větvi, zatím jsme na bosan.cz nic nezměnili.

7) Teď chceme požádat o schválení změn. To musíš jít na GitHub na https://github.com/bosancz/bosan.cz a zažádat o sjednocení tvé větve do hlavní větve, ten takzvaný `pull request`. Klikni proto na záložku `Pull requests` a na ní klikni na tlačítko `New pull request`. 

8) Nejdřív se musí vybrat, kterou větev žádáš sloučit a kam. V šedivém řádku uvidíš `base:master <- compare:master`. To druhé změň na svou větev. Pod tím se najedou zobrazí všechny změny v té tvé nové větvi, co se musí sloučit. Nad tím bude i tlačítko `Create pull request`. Klikni na něj.

9) Ve formuláři, který se zobrazí vyplň nadpis a krátký popis co bude shrnovat všechny tvé změny. V naše malém případě asi postačí nadpis. Potvrď zas talčítkem `Create pull request`

10) Výborně! 👏👏👏 Tvoje první změna je na cestě na náš web! 

Možná ti to přišlo složité, ale neboj, většinu kroků jsi dělal/a jen napopré a zbylé se brzy naučíš nazpaměť a pak už budeš jen s radostí upravovat web. A hlavně to pak budeš moct využít třeba v práci, **takhle to totiž dělají všude**.
