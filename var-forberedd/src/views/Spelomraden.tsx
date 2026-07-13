import { useState } from 'react';
import { useAppState } from '../store/useAppState';
import type { Princip, PrincipNiva, SpelomradeId } from '../domain/types';
import { ListFalt, TextFalt } from './FaltKomponenter';

const NIVA_ORDER: PrincipNiva[] = ['super', 'huvud', 'sub', 'roll'];

const NIVA_LABEL: Record<PrincipNiva, string> = {
  super: 'Superprincip',
  huvud: 'Huvudprincip',
  sub: 'Subprincip',
  roll: 'Rollcue',
};

function unika(rader: string[][]): string[] {
  return Array.from(new Set(rader.flat().filter((r) => r.trim().length > 0)));
}

function PrincipNod({
  spelomradeId,
  princip,
  barnPerForalder,
  redigerbar,
}: {
  spelomradeId: SpelomradeId;
  princip: Princip;
  barnPerForalder: Map<string, Princip[]>;
  redigerbar: boolean;
}) {
  const { uppdateraPrincip } = useAppState();
  const [oppen, setOppen] = useState(false);
  const barn = barnPerForalder.get(princip.id) ?? [];

  return (
    <li className={`princip-nod princip-nod--${princip.niva}`}>
      <button type="button" className="princip-nod__toggle" onClick={() => setOppen(!oppen)} aria-expanded={oppen}>
        <span className="princip-nod__niva">{NIVA_LABEL[princip.niva]}</span>
        <span className="princip-nod__namn">{princip.namn}</span>
      </button>
      {oppen && (
        <div className="princip-nod__detalj">
          <TextFalt
            etikett="Beskrivning"
            varde={princip.beskrivning}
            redigerbar={redigerbar}
            onSpara={(v) => uppdateraPrincip(spelomradeId, princip.id, { beskrivning: v })}
          />
          <ListFalt
            etikett="Beteenden"
            poster={princip.beteenden}
            redigerbar={redigerbar}
            onSpara={(v) => uppdateraPrincip(spelomradeId, princip.id, { beteenden: v })}
          />
          <ListFalt
            etikett="Coachrop"
            poster={princip.coachrop}
            redigerbar={redigerbar}
            onSpara={(v) => uppdateraPrincip(spelomradeId, princip.id, { coachrop: v })}
          />
          <ListFalt
            etikett="Träningsformer"
            poster={princip.traningsformer}
            redigerbar={redigerbar}
            onSpara={(v) => uppdateraPrincip(spelomradeId, princip.id, { traningsformer: v })}
          />
        </div>
      )}
      {barn.length > 0 && (
        <ul className="princip-trad">
          {barn.map((b) => (
            <PrincipNod key={b.id} spelomradeId={spelomradeId} princip={b} barnPerForalder={barnPerForalder} redigerbar={redigerbar} />
          ))}
        </ul>
      )}
    </li>
  );
}

function PrincipTrad({
  spelomradeId,
  principer,
  redigerbar,
}: {
  spelomradeId: SpelomradeId;
  principer: Princip[];
  redigerbar: boolean;
}) {
  const idSet = new Set(principer.map((p) => p.id));
  const barnPerForalder = new Map<string, Princip[]>();
  const roten: Princip[] = [];

  principer.forEach((p) => {
    if (p.parentId && idSet.has(p.parentId)) {
      const lista = barnPerForalder.get(p.parentId) ?? [];
      lista.push(p);
      barnPerForalder.set(p.parentId, lista);
    } else {
      roten.push(p);
    }
  });

  const sorterad = [...roten].sort((a, b) => NIVA_ORDER.indexOf(a.niva) - NIVA_ORDER.indexOf(b.niva));

  return (
    <ul className="princip-trad">
      {sorterad.map((p) => (
        <PrincipNod key={p.id} spelomradeId={spelomradeId} princip={p} barnPerForalder={barnPerForalder} redigerbar={redigerbar} />
      ))}
    </ul>
  );
}

function SkapaPrincipForm({
  spelomradeId,
  principer,
  onKlar,
}: {
  spelomradeId: SpelomradeId;
  principer: Princip[];
  onKlar: () => void;
}) {
  const { skapaPrincip } = useAppState();
  const [namn, setNamn] = useState('');
  const [niva, setNiva] = useState<PrincipNiva>('huvud');
  const [parentId, setParentId] = useState('');
  const [beskrivning, setBeskrivning] = useState('');

  return (
    <form
      className="falt falt--redigerar"
      onSubmit={(e) => {
        e.preventDefault();
        if (!namn.trim()) return;
        skapaPrincip(spelomradeId, {
          namn: namn.trim(),
          niva,
          parentId: parentId || undefined,
          beskrivning: beskrivning.trim(),
          beteenden: [],
          coachrop: [],
          traningsformer: [],
          bilder: [],
        });
        onKlar();
      }}
    >
      <div className="falt__label">Namn</div>
      <input className="falt__input" value={namn} onChange={(e) => setNamn(e.target.value)} />
      <div className="falt__label">Nivå</div>
      <select className="falt__input" value={niva} onChange={(e) => setNiva(e.target.value as PrincipNiva)}>
        {NIVA_ORDER.map((n) => (
          <option key={n} value={n}>
            {NIVA_LABEL[n]}
          </option>
        ))}
      </select>
      <div className="falt__label">Överordnad princip</div>
      <select className="falt__input" value={parentId} onChange={(e) => setParentId(e.target.value)}>
        <option value="">Ingen — toppnivå</option>
        {principer.map((p) => (
          <option key={p.id} value={p.id}>
            {p.namn}
          </option>
        ))}
      </select>
      <div className="falt__label">Beskrivning</div>
      <textarea
        className="falt__input falt__input--textarea"
        rows={3}
        value={beskrivning}
        onChange={(e) => setBeskrivning(e.target.value)}
      />
      <div className="falt__actions">
        <button type="submit" className="primary-action">
          Skapa princip
        </button>
        <button type="button" className="secondary-action" onClick={onKlar}>
          Avbryt
        </button>
      </div>
    </form>
  );
}

export default function Spelomraden() {
  const { state, roll } = useAppState();
  const [valdId, setValdId] = useState<SpelomradeId | null>(null);
  const [skapaOppen, setSkapaOppen] = useState(false);
  const redigerbar = roll === 'huvudtranare';

  if (state.spelomraden.length === 0) {
    return (
      <div className="view-stub">
        <h1>Spelområden</h1>
        <div className="empty-state" role="status">
          Inga spelområden ännu. Här visas anfall, försvar, omställning och fasta situationer med principhierarki.
        </div>
      </div>
    );
  }

  const vald = state.spelomraden.find((s) => s.id === valdId);

  if (vald) {
    const beteenden = unika(vald.principer.map((p) => p.beteenden));
    const coachrop = unika(vald.principer.map((p) => p.coachrop));
    const traningsformer = unika(vald.principer.map((p) => p.traningsformer));

    return (
      <div className="view">
        <button type="button" className="link-btn" onClick={() => setValdId(null)}>
          ← Alla spelområden
        </button>

        <header className="card identitet-header">
          <h1>{vald.namn}</h1>
          <p>{vald.principer.length} principer</p>
        </header>

        <section className="card larsteg-sektion">
          <div className="falt__rad">
            <h2>Principhierarki</h2>
            {redigerbar && !skapaOppen && (
              <button type="button" className="secondary-action" onClick={() => setSkapaOppen(true)}>
                Lägg till princip
              </button>
            )}
          </div>
          {skapaOppen && (
            <SkapaPrincipForm spelomradeId={vald.id} principer={vald.principer} onKlar={() => setSkapaOppen(false)} />
          )}
          {vald.principer.length > 0 ? (
            <PrincipTrad spelomradeId={vald.id} principer={vald.principer} redigerbar={redigerbar} />
          ) : (
            !skapaOppen && (
              <div className="empty-state" role="status">
                <p>Inga principer ännu.</p>
                {redigerbar && (
                  <button type="button" className="primary-action" onClick={() => setSkapaOppen(true)}>
                    Lägg till princip
                  </button>
                )}
              </div>
            )
          )}
        </section>

        <section className="card larsteg-sektion">
          <h2>Beteenden (alla principer)</h2>
          {beteenden.length > 0 ? (
            <ul className="falt__lista">
              {beteenden.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          ) : (
            <p className="falt__tom">Inte ifyllt ännu</p>
          )}
        </section>

        <section className="card larsteg-sektion">
          <h2>Coachrop (alla principer)</h2>
          {coachrop.length > 0 ? (
            <ul className="falt__lista">
              {coachrop.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          ) : (
            <p className="falt__tom">Inte ifyllt ännu</p>
          )}
        </section>

        <section className="card larsteg-sektion">
          <h2>Träningsformer (alla principer)</h2>
          {traningsformer.length > 0 ? (
            <ul className="falt__lista">
              {traningsformer.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          ) : (
            <p className="falt__tom">Inte ifyllt ännu</p>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="view">
      <h1>Spelområden</h1>
      <ul className="omrade-grid">
        {state.spelomraden.map((omrade) => (
          <li key={omrade.id}>
            <button type="button" className="card omrade-kort" onClick={() => setValdId(omrade.id)}>
              <span className="omrade-kort__namn">{omrade.namn}</span>
              <span className="pill">{omrade.principer.length} principer</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
