import { useState } from 'react';
import type { ViewProps } from '../App';
import { useAppState } from '../store/useAppState';
import { ListFalt, TextFalt } from './FaltKomponenter';

export default function Identiteter({ onNavigate }: ViewProps) {
  const { state, roll, setAktivtLarstegId, uppdateraIdentitet } = useAppState();
  const [valdId, setValdId] = useState<string | null>(null);
  const redigerbar = roll === 'huvudtranare';

  if (state.identiteter.length === 0) {
    return (
      <div className="view-stub">
        <h1>Identiteter</h1>
        <div className="empty-state" role="status">
          Inga identiteter ännu. Här visas de fem identiteterna som kort.
        </div>
      </div>
    );
  }

  const vald = state.identiteter.find((i) => i.id === valdId);

  if (vald) {
    const kopplade = state.larsteg.filter((steg) => steg.identitetIds.includes(vald.id));

    return (
      <div className="view">
        <button type="button" className="link-btn" onClick={() => setValdId(null)}>
          ← Alla identiteter
        </button>

        <header className="card identitet-header">
          <h1>{vald.namn}</h1>
          <p>{vald.kortForklaring || 'Inte ifyllt ännu'}</p>
          {!redigerbar && <p className="larsteg-lasnotis">Läsläge — endast huvudtränaren kan redigera identiteten.</p>}
        </header>

        <section className="card larsteg-sektion">
          <TextFalt
            etikett="Beskrivning"
            varde={vald.beskrivning}
            redigerbar={redigerbar}
            onSpara={(v) => uppdateraIdentitet(vald.id, { beskrivning: v })}
          />
          <TextFalt
            etikett="Varför"
            varde={vald.varfor}
            redigerbar={redigerbar}
            onSpara={(v) => uppdateraIdentitet(vald.id, { varfor: v })}
          />
        </section>

        <section className="card larsteg-sektion">
          <ListFalt
            etikett="Observerbara beteenden"
            poster={vald.beteenden}
            redigerbar={redigerbar}
            onSpara={(v) => uppdateraIdentitet(vald.id, { beteenden: v })}
          />
        </section>

        <section className="card larsteg-sektion">
          <ListFalt
            etikett="Missförstånd"
            poster={vald.missforstand}
            redigerbar={redigerbar}
            onSpara={(v) => uppdateraIdentitet(vald.id, { missforstand: v })}
          />
        </section>

        <section className="card larsteg-sektion">
          <ListFalt
            etikett="Coachrop"
            poster={vald.coachrop}
            redigerbar={redigerbar}
            onSpara={(v) => uppdateraIdentitet(vald.id, { coachrop: v })}
          />
        </section>

        <section className="card larsteg-sektion">
          <ListFalt
            etikett="Matchexempel"
            poster={vald.matchexempel}
            redigerbar={redigerbar}
            onSpara={(v) => uppdateraIdentitet(vald.id, { matchexempel: v })}
          />
        </section>

        <section className="card larsteg-sektion">
          <h2>Kopplade lärsteg</h2>
          {kopplade.length > 0 ? (
            <ul className="falt__lista">
              {kopplade.map((steg) => (
                <li key={steg.id}>
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => {
                      setAktivtLarstegId(steg.id);
                      onNavigate('larsteg');
                    }}
                  >
                    Steg {steg.stegnummer} · {steg.titel}
                  </button>
                </li>
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
      <h1>Identiteter</h1>
      <ul className="identitet-grid">
        {state.identiteter.map((identitet) => {
          const antalLarsteg = state.larsteg.filter((steg) => steg.identitetIds.includes(identitet.id)).length;
          return (
            <li key={identitet.id}>
              <button type="button" className="card identitet-kort" onClick={() => setValdId(identitet.id)}>
                <span className="identitet-kort__namn">{identitet.namn}</span>
                <span className="identitet-kort__forklaring">{identitet.kortForklaring || 'Inte ifyllt ännu'}</span>
                <span className="pill">{antalLarsteg} kopplade lärsteg</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
