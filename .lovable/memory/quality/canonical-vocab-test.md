---
name: Canonical vocabulary test
description: Vitest-test som scannar src/pages och src/components och varnar om förbjudna synonymer används i stället för kanoniska termer från src/data/principles.ts.
type: feature
---
Filen `src/test/canonical-vocab.test.ts` håller vokabulären koherent.

**Regler:** kollar gold zone/golden zone → "gyllene zonen", assistzon/assist zone → "assistytan", framåtvänd → "rättvänd", samt sammansättningar (spel-bredd → spelbredd osv).

**Allowlist:** `src/data/principles.ts` (källcitat) och själva testfilen.

**Hur man lägger till en term:** Lägg ny `Rule` i `FORBIDDEN_TERMS`-arrayen. Kommentarer strippas innan scan, så engelska termer i JSDoc är OK.

**Köra:** `bunx vitest run src/test/canonical-vocab.test.ts`
