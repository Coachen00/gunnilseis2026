# Forskningsbaserade träningsscheman

## Mål och omfattning

Revidera allt tränings- och återhämtningsinnehåll på `/semestern-2026`, `/spelarvard` och `/sommaruppstart`, inklusive de tre länkade PDF-presentationerna. Målgruppen är friska seniorspelare. Kalenderdatumen och den personliga, positionsbaserade tonen behålls när de inte står i konflikt med säker belastningsstyrning.

## Träningsmodell

- Fyra veckors progression: cirka 60–70, 70–80, 80–90 och 90–100 procent av full planerad veckovolym. Fart och volym höjs inte kraftigt samtidigt.
- Normalvecka: två styrkepass med 48–72 timmars mellanrum, två kvalitativa sprintexponeringar, ett HIIT/RST-pass, högst ett lugnt aerobt pass och minst en helt ledig dag.
- Högintensiva moment samlas på samma dagar där det går. Sprint görs utvilad före konditionsarbete eller tung benstyrka och avbryts vid tydligt fart- eller tekniktapp.
- Styrka omfattar knädominant, höftdominant, unilateral, vad, överkropp och bål. Huvudlyft doseras 2–4 × 3–8 vid RPE 7–9 utan krav på failure.
- FIFA 11+-lik neuromuskulär uppvärmning används minst två gånger per vecka. Nordic hamstring och Copenhagen adduction introduceras med låg volym och stegras över perioden; vad tränas med raka och böjda knän.
- Spelaren registrerar pass-RPE × minuter och följer sömn, ovanlig träningsvärk, smärta och sjukdom. Smärta eller sjukdom innebär att intensitet avstås och individuell bedömning söks vid kvarstående besvär.

## Innehåll och UX

`/semestern-2026` får en gemensam veckologik med positionsspecifika sprint-, styrke- och teknikvarianter. De tre ambitionsnivåerna uttrycks neutralt som full plan, underhåll och miniminivå; nedvärderande copy tas bort. Varje pass visar syfte, dos, intensitet, vila och stoppregel.

`/sommaruppstart` harmoniseras med egenperioden och får en gradvis kollektiv återstart inför match. Dubbelpass och lägerhelg bedöms som en sammanhängande belastning, inte som isolerade pass.

`/spelarvard` och PDF-materialet använder samma råd om styrka, återhämtning, kost, vätska och tillskott. Absoluta skade- eller prestationslöften ersätts med balanserad copy. Kostråd periodiseras efter träningsbelastning; kreatin anges som 3–5 g/dag och endast batchtestade tillskott rekommenderas.

Mobil läsning prioriteras: viktigaste dosen och dagens handling först, förklaring därefter. Befintliga komponenter och visuella tokens behålls. Accordion, tangentbordsflöde, fokusmarkeringar och rubrikhierarki ska fortsatt fungera.

## Tekniska gränser

Träningsdata flyttas vid behov till fokuserade TypeScript-moduler så att samma ordination inte dupliceras mellan sidor. Inga nya runtime-beroenden eller backendförändringar införs. Tester ska verifiera veckobelastning, vilodag, progression, dosintervall, positionsvarianter och att riskfylld gammal copy inte återkommer.

PDF:erna uppdateras endast om deras råd avviker från den gemensamma modellen. Efter ändring renderas varje sida och granskas visuellt för klippning, kontrast och läsbarhet.

## Källbas

- IOC om belastning och skaderisk: https://pubmed.ncbi.nlm.nih.gov/27535989/
- UEFA:s fotbollsspecifika nutritionskonsensus: https://pubmed.ncbi.nlm.nih.gov/33097528/
- HIIT i herrfotboll: https://pubmed.ncbi.nlm.nih.gov/33423603/
- Repeated-sprint training: https://pubmed.ncbi.nlm.nih.gov/38041768/
- Nordic hamstring och skadereduktion: https://bjsm.bmj.com/content/53/21/1362
- IOC om kosttillskott och kontaminationsrisk: https://pubmed.ncbi.nlm.nih.gov/29540367/

## Verifiering

Kör riktade enhetstester först, därefter hela Vitest-sviten, lint och produktionsbygge. Öppna alla tre routes på mobil och desktop, prova varje interaktivt tillstånd och kontrollera uppdaterade PDF:er som renderade bilder. Befintliga användarändringar utanför omfattningen lämnas orörda.
