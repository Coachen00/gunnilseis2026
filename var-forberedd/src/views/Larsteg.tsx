import { useState } from 'react';
import type { ViewProps } from '../App';
import { useAppState } from '../store/useAppState';
import type { Begrepp, Larsteg as LarstegTyp, SpelomradeId, Status } from '../domain/types';
import { STATUS_VALUES, statusPillClass, utfallBadgeClass } from './status';
import { ListFalt, TextFalt } from './FaltKomponenter';

const SPELOMRADE_LABEL: Record<SpelomradeId, string> = {
  anfall: 'Anfall',
  forsvar: 'Försvar',
  omstallning: 'Omställning',
  fasta: 'Fasta situationer',
};

const ALLA_SPELOMRADEN: SpelomradeId[] = ['anfall', 'forsvar', 'omstallning', 'fasta'];

function BegreppFalt({
  poster,
  redigerbar,
  onSpara,
}: {
  poster: Begrepp[];
  redigerbar: boolean;
  onSpara: (poster: Begrepp[]) => void;
}) {
  const [redigerar, setRedigerar] = useState(false);
  const [utkast, setUtkast] = useState<Begrepp[]>(poster);

  if (!redigerar) {
    return (
      <div className="falt">
        <div className="falt__rad">
          <div className="falt__label">Begrepp</div>
          {redigerbar && (
            <button
              type="button"
              className="link-btn"
              onClick={() => {
                setUtkast(poster);
                setRedigerar(true);
              }}
            >
              Redigera
            </button>
          )}
        </div>
        {poster.length > 0 ? (
          <dl className="begrepp-lista">
            {poster.map((b, i) => (
              <div key={i}>
                <dt>{b.term}</dt>
                <dd>{b.forklaring}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="falt__tom">Inte ifyllt ännu</p>
        )}
      </div>
    );
  }

  return (
    <div className="falt falt--redigerar">
      <div className="falt__label">Begrepp</div>
      <ul className="falt__lista falt__lista--redigerbar">
        {utkast.map((b, i) => (
          <li key={i} className="begrepp-rad">
            <input
              className="falt__input"
              placeholder="Term"
              value={b.term}
              onChange={(e) => setUtkast(utkast.map((r, j) => (j === i ? { ...r, term: e.target.value } : r)))}
            />
            <input
              className="falt__input"
              placeholder="Förklaring"
              value={b.forklaring}
              onChange={(e) =>
                setUtkast(utkast.map((r, j) => (j === i ? { ...r, forklaring: e.target.value } : r)))
              }
            />
            <button
              type="button"
              className="icon-btn"
              aria-label={`Ta bort begrepp: ${b.term || 'tomt'}`}
              onClick={() => setUtkast(utkast.filter((_, j) => j !== i))}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="secondary-action"
        onClick={() => setUtkast([...utkast, { term: '', forklaring: '' }])}
      >
        Lägg till begrepp
      </button>
      <div className="falt__actions">
        <button
          type="button"
          className="primary-action"
          onClick={() => {
            onSpara(utkast.filter((b) => b.term.trim() || b.forklaring.trim()));
            setRedigerar(false);
          }}
        >
          Spara
        </button>
        <button type="button" className="secondary-action" onClick={() => setRedigerar(false)}>
          Avbryt
        </button>
      </div>
    </div>
  );
}

function IdentitetFalt({
  identitetIds,
  alla,
  redigerbar,
  onSpara,
}: {
  identitetIds: string[];
  alla: { id: string; namn: string }[];
  redigerbar: boolean;
  onSpara: (ids: string[]) => void;
}) {
  const [redigerar, setRedigerar] = useState(false);
  const [utkast, setUtkast] = useState<string[]>(identitetIds);
  const valda = alla.filter((i) => identitetIds.includes(i.id));

  if (!redigerar) {
    return (
      <div className="falt">
        <div className="falt__rad">
          <div className="falt__label">Identiteter</div>
          {redigerbar && (
            <button
              type="button"
              className="link-btn"
              onClick={() => {
                setUtkast(identitetIds);
                setRedigerar(true);
              }}
            >
              Redigera
            </button>
          )}
        </div>
        {valda.length > 0 ? (
          <div className="chip-rad">
            {valda.map((i) => (
              <span key={i.id} className="chip">
                {i.namn}
              </span>
            ))}
          </div>
        ) : (
          <p className="falt__tom">Inte ifyllt ännu</p>
        )}
      </div>
    );
  }

  return (
    <div className="falt falt--redigerar">
      <div className="falt__label">Identiteter</div>
      <div className="checkbox-grupp">
        {alla.map((i) => (
          <label key={i.id} className="checkbox-rad">
            <input
              type="checkbox"
              checked={utkast.includes(i.id)}
              onChange={(e) =>
                setUtkast(e.target.checked ? [...utkast, i.id] : utkast.filter((id) => id !== i.id))
              }
            />
            {i.namn}
          </label>
        ))}
      </div>
      <div className="falt__actions">
        <button
          type="button"
          className="primary-action"
          onClick={() => {
            onSpara(utkast);
            setRedigerar(false);
          }}
        >
          Spara
        </button>
        <button type="button" className="secondary-action" onClick={() => setRedigerar(false)}>
          Avbryt
        </button>
      </div>
    </div>
  );
}

function SpelomradeFalt({
  huvudomrade,
  stodomraden,
  redigerbar,
  onSpara,
}: {
  huvudomrade: SpelomradeId | undefined;
  stodomraden: SpelomradeId[];
  redigerbar: boolean;
  onSpara: (patch: { huvudomrade?: SpelomradeId; stodomraden: SpelomradeId[] }) => void;
}) {
  const [redigerar, setRedigerar] = useState(false);
  const [huvudUtkast, setHuvudUtkast] = useState<SpelomradeId | ''>(huvudomrade ?? '');
  const [stodUtkast, setStodUtkast] = useState<SpelomradeId[]>(stodomraden);

  if (!redigerar) {
    return (
      <div className="falt">
        <div className="falt__rad">
          <div className="falt__label">Spelområden</div>
          {redigerbar && (
            <button
              type="button"
              className="link-btn"
              onClick={() => {
                setHuvudUtkast(huvudomrade ?? '');
                setStodUtkast(stodomraden);
                setRedigerar(true);
              }}
            >
              Redigera
            </button>
          )}
        </div>
        <p className="falt__text">
          Huvudområde:{' '}
          {huvudomrade ? SPELOMRADE_LABEL[huvudomrade] : <span className="falt__tom">Inte ifyllt ännu</span>}
        </p>
        {stodomraden.length > 0 ? (
          <div className="chip-rad">
            {stodomraden.map((id) => (
              <span key={id} className="chip">
                {SPELOMRADE_LABEL[id]}
              </span>
            ))}
          </div>
        ) : (
          <p className="falt__tom">Inga stödområden ännu</p>
        )}
      </div>
    );
  }

  return (
    <div className="falt falt--redigerar">
      <div className="falt__label">Huvudområde</div>
      <select
        className="falt__input"
        value={huvudUtkast}
        onChange={(e) => setHuvudUtkast(e.target.value as SpelomradeId | '')}
      >
        <option value="">Inget valt</option>
        {ALLA_SPELOMRADEN.map((id) => (
          <option key={id} value={id}>
            {SPELOMRADE_LABEL[id]}
          </option>
        ))}
      </select>
      <div className="falt__label">Stödområden</div>
      <div className="checkbox-grupp">
        {ALLA_SPELOMRADEN.map((id) => (
          <label key={id} className="checkbox-rad">
            <input
              type="checkbox"
              checked={stodUtkast.includes(id)}
              onChange={(e) =>
                setStodUtkast(e.target.checked ? [...stodUtkast, id] : stodUtkast.filter((x) => x !== id))
              }
            />
            {SPELOMRADE_LABEL[id]}
          </label>
        ))}
      </div>
      <div className="falt__actions">
        <button
          type="button"
          className="primary-action"
          onClick={() => {
            onSpara({ huvudomrade: huvudUtkast || undefined, stodomraden: stodUtkast });
            setRedigerar(false);
          }}
        >
          Spara
        </button>
        <button type="button" className="secondary-action" onClick={() => setRedigerar(false)}>
          Avbryt
        </button>
      </div>
    </div>
  );
}

export default function Larsteg({ onNavigate }: ViewProps) {
  const { state, roll, uppdateraLarsteg, setAktivtUppdragId, setAktivtMatchbevisId } = useAppState();
  const steg = state.larsteg.find((s) => s.id === state.aktivtLarstegId);
  const redigerbar = roll === 'huvudtranare';

  if (!steg) {
    return (
      <div className="view-stub">
        <h1>Lärsteg</h1>
        <div className="empty-state" role="status">
          <p>Inget lärsteg valt ännu. Öppna ett lärsteg från lärprogrammet för att se detaljer.</p>
          <button type="button" className="primary-action" onClick={() => onNavigate('larprogram')}>
            Öppna lärprogrammet
          </button>
        </div>
      </div>
    );
  }

  function spara(patch: Partial<LarstegTyp>) {
    uppdateraLarsteg(steg!.id, patch);
  }

  const kopplatUppdrag = steg.uppdragIds
    .map((id) => state.uppdrag.find((u) => u.id === id))
    .filter((u): u is NonNullable<typeof u> => Boolean(u));
  const kopplatMatchbevis = steg.matchbevisIds
    .map((id) => state.matchbevis.find((m) => m.id === id))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  return (
    <div className="view">
      <header className="card larsteg-header">
        <div className="larsteg-header__top">
          <span className="larsteg-header__nr">Steg {steg.stegnummer}</span>
          <span className={statusPillClass(steg.status)}>{steg.status}</span>
        </div>
        <h1>{steg.titel}</h1>
        <p>{steg.sammanfattning || 'Inte ifyllt ännu'}</p>
        {!redigerbar && <p className="larsteg-lasnotis">Läsläge — endast huvudtränaren kan redigera lärsteget.</p>}
      </header>

      <section className="card larsteg-sektion">
        <h2>Syfte & varför här</h2>
        <TextFalt etikett="Syfte" varde={steg.syfte} redigerbar={redigerbar} onSpara={(v) => spara({ syfte: v })} />
        <TextFalt
          etikett="Varför här"
          varde={steg.varforHar}
          redigerbar={redigerbar}
          onSpara={(v) => spara({ varforHar: v })}
        />
        <TextFalt
          etikett="Förkunskaper"
          varde={steg.forkunskaper}
          redigerbar={redigerbar}
          onSpara={(v) => spara({ forkunskaper: v })}
        />
        <TextFalt
          etikett="Gemensam förståelse"
          varde={steg.gemensamForstaelse}
          redigerbar={redigerbar}
          onSpara={(v) => spara({ gemensamForstaelse: v })}
        />
      </section>

      <section className="card larsteg-sektion">
        <h2>Förståelse per roll</h2>
        <TextFalt
          etikett="Huvudtränare"
          varde={steg.forstaelseHT}
          redigerbar={redigerbar}
          onSpara={(v) => spara({ forstaelseHT: v })}
        />
        <TextFalt
          etikett="Tränarteam"
          varde={steg.forstaelseTeam}
          redigerbar={redigerbar}
          onSpara={(v) => spara({ forstaelseTeam: v })}
        />
        <TextFalt
          etikett="Spelare"
          varde={steg.forstaelseSpelare}
          redigerbar={redigerbar}
          onSpara={(v) => spara({ forstaelseSpelare: v })}
        />
      </section>

      <section className="card larsteg-sektion">
        <BegreppFalt poster={steg.begrepp} redigerbar={redigerbar} onSpara={(v) => spara({ begrepp: v })} />
      </section>

      <section className="card larsteg-sektion">
        <ListFalt
          etikett="Beteenden"
          poster={steg.beteenden}
          redigerbar={redigerbar}
          onSpara={(v) => spara({ beteenden: v })}
        />
      </section>

      <section className="card larsteg-sektion">
        <IdentitetFalt
          identitetIds={steg.identitetIds}
          alla={state.identiteter.map((i) => ({ id: i.id, namn: i.namn }))}
          redigerbar={redigerbar}
          onSpara={(v) => spara({ identitetIds: v })}
        />
      </section>

      <section className="card larsteg-sektion">
        <SpelomradeFalt
          huvudomrade={steg.huvudomrade}
          stodomraden={steg.stodomraden}
          redigerbar={redigerbar}
          onSpara={(patch) => spara(patch)}
        />
      </section>

      <section className="card larsteg-sektion">
        <ListFalt
          etikett="Coachrop"
          poster={steg.coachrop}
          redigerbar={redigerbar}
          onSpara={(v) => spara({ coachrop: v })}
        />
      </section>

      <section className="card larsteg-sektion">
        <h2>Träningsformer</h2>
        <ListFalt
          etikett="Träningsformer"
          poster={steg.traningsformer}
          redigerbar={redigerbar}
          onSpara={(v) => spara({ traningsformer: v })}
        />
        <ListFalt
          etikett="Visualiseringar"
          poster={steg.visualiseringar}
          redigerbar={redigerbar}
          onSpara={(v) => spara({ visualiseringar: v })}
        />
      </section>

      <section className="card larsteg-sektion">
        <h2>Material</h2>
        <ListFalt
          etikett="Befintligt material"
          poster={steg.befintligtMaterial}
          redigerbar={redigerbar}
          onSpara={(v) => spara({ befintligtMaterial: v })}
        />
        <ListFalt
          etikett="Saknat material"
          poster={steg.saknatMaterial}
          redigerbar={redigerbar}
          onSpara={(v) => spara({ saknatMaterial: v })}
        />
      </section>

      <section className="card larsteg-sektion">
        <ListFalt
          etikett="Missförstånd"
          poster={steg.missforstand}
          redigerbar={redigerbar}
          onSpara={(v) => spara({ missforstand: v })}
        />
      </section>

      <section className="card larsteg-sektion">
        <h2>Kopplade uppdrag & matchbevis</h2>
        <div className="falt">
          <div className="falt__label">Tränaruppdrag</div>
          {kopplatUppdrag.length > 0 ? (
            <ul className="falt__lista">
              {kopplatUppdrag.map((u) => (
                <li key={u.id}>
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => {
                      setAktivtUppdragId(u.id);
                      onNavigate('uppdrag');
                    }}
                  >
                    {u.titel}
                  </button>{' '}
                  <span className={statusPillClass(u.status)}>{u.status}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="falt__tom">Inga kopplade uppdrag ännu</p>
          )}
        </div>
        <div className="falt">
          <div className="falt__label">Matchbevis</div>
          {kopplatMatchbevis.length > 0 ? (
            <ul className="falt__lista">
              {kopplatMatchbevis.map((m) => (
                <li key={m.id}>
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => {
                      setAktivtMatchbevisId(m.id);
                      onNavigate('matchbevis');
                    }}
                  >
                    {m.situation || 'Namnlöst matchbevis'}
                  </button>{' '}
                  <span className={utfallBadgeClass(m.utfall)}>{m.utfall}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="falt__tom">Inga kopplade matchbevis ännu</p>
          )}
        </div>
      </section>

      <section className="card larsteg-sektion">
        <h2>Status & progression</h2>
        {redigerbar ? (
          <div className="status-editor">
            <label className="falt__label" htmlFor="larsteg-status">
              Status
            </label>
            <select
              id="larsteg-status"
              className="falt__input"
              value={steg.status}
              onChange={(e) => spara({ status: e.target.value as Status })}
            >
              {STATUS_VALUES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <label className="falt__label" htmlFor="larsteg-progression">
              Progression ({steg.progression}%)
            </label>
            <input
              id="larsteg-progression"
              type="range"
              min={0}
              max={100}
              value={steg.progression}
              onChange={(e) => spara({ progression: Number(e.target.value) })}
            />
          </div>
        ) : (
          <div className="status-editor">
            <span className={statusPillClass(steg.status)}>{steg.status}</span>
            <div className="progress-bar" aria-label={`Progression ${steg.progression} procent`}>
              <div className="progress-bar__fill" style={{ width: `${steg.progression}%` }} />
            </div>
            <span className="progress-bar__label">{steg.progression}%</span>
          </div>
        )}
      </section>

      <section className="card larsteg-sektion">
        <TextFalt
          etikett="Nästa steg"
          varde={steg.nastaSteg}
          redigerbar={redigerbar}
          onSpara={(v) => spara({ nastaSteg: v })}
        />
      </section>
    </div>
  );
}
