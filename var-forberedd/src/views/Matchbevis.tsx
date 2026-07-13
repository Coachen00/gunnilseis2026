import { useState } from 'react';
import type { ViewProps } from '../App';
import { useAppState } from '../store/useAppState';
import type {
  Identitet,
  Larsteg as LarstegTyp,
  Matchbevis as MatchbevisModell,
  MatchbevisTyp,
  MatchbevisUtfall,
} from '../domain/types';
import { MATCHBEVIS_TYP_VALUES, MATCHBEVIS_UTFALL_VALUES, utfallBadgeClass } from './status';
import { SelectFalt, TextFalt } from './FaltKomponenter';

const TYP_LABEL: Record<MatchbevisTyp, string> = {
  match: 'Match',
  träningsmatch: 'Träningsmatch',
  träning: 'Träning',
};

function larstegLabel(alla: LarstegTyp[], id: string): string {
  const steg = alla.find((s) => s.id === id);
  return steg ? `Steg ${steg.stegnummer} · ${steg.titel}` : 'Inget lärsteg valt';
}

function IdentitetCheckboxFalt({
  valda,
  alla,
  onAndra,
}: {
  valda: string[];
  alla: Identitet[];
  onAndra: (ids: string[]) => void;
}) {
  return (
    <div className="checkbox-grupp">
      {alla.map((i) => (
        <label key={i.id} className="checkbox-rad">
          <input
            type="checkbox"
            checked={valda.includes(i.id)}
            onChange={(e) => onAndra(e.target.checked ? [...valda, i.id] : valda.filter((id) => id !== i.id))}
          />
          {i.namn}
        </label>
      ))}
    </div>
  );
}

function SkapaMatchbevisForm({
  alla,
  identiteter,
  onSkapa,
  onAvbryt,
}: {
  alla: LarstegTyp[];
  identiteter: Identitet[];
  onSkapa: (data: Omit<MatchbevisModell, 'id'>) => void;
  onAvbryt: () => void;
}) {
  const [situation, setSituation] = useState('');
  const [vadViSer, setVadViSer] = useState('');
  const [beteende, setBeteende] = useState('');
  const [kvalitet, setKvalitet] = useState('');
  const [uppfoljning, setUppfoljning] = useState('');
  const [typ, setTyp] = useState<MatchbevisTyp>('match');
  const [datum, setDatum] = useState('');
  const [larstegId, setLarstegId] = useState(alla[0]?.id ?? '');
  const [identitetIds, setIdentitetIds] = useState<string[]>([]);
  const [kommentar, setKommentar] = useState('');
  const [materialRef, setMaterialRef] = useState('');

  return (
    <form
      className="card skapa-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (!situation.trim() || !larstegId) return;
        onSkapa({
          situation: situation.trim(),
          vadViSer: vadViSer.trim(),
          beteende: beteende.trim(),
          kvalitet: kvalitet.trim(),
          uppfoljning: uppfoljning.trim(),
          utfall: '—',
          datum,
          typ,
          kommentar: kommentar.trim(),
          materialRef: materialRef.trim(),
          larstegId,
          identitetIds,
        });
      }}
    >
      <h2>Nytt matchbevis</h2>
      <div className="falt__label">Situation</div>
      <input className="falt__input" value={situation} onChange={(e) => setSituation(e.target.value)} required />
      <div className="falt__label">Vad vi ska se</div>
      <textarea
        className="falt__input falt__input--textarea"
        rows={2}
        value={vadViSer}
        onChange={(e) => setVadViSer(e.target.value)}
      />
      <div className="falt__label">Beteende</div>
      <textarea
        className="falt__input falt__input--textarea"
        rows={2}
        value={beteende}
        onChange={(e) => setBeteende(e.target.value)}
      />
      <div className="falt__label">Kvalitet</div>
      <textarea
        className="falt__input falt__input--textarea"
        rows={2}
        value={kvalitet}
        onChange={(e) => setKvalitet(e.target.value)}
      />
      <div className="falt__label">Uppföljning</div>
      <textarea
        className="falt__input falt__input--textarea"
        rows={2}
        value={uppfoljning}
        onChange={(e) => setUppfoljning(e.target.value)}
      />
      <div className="falt__label">Typ</div>
      <select className="falt__input" value={typ} onChange={(e) => setTyp(e.target.value as MatchbevisTyp)}>
        {MATCHBEVIS_TYP_VALUES.map((t) => (
          <option key={t} value={t}>
            {TYP_LABEL[t]}
          </option>
        ))}
      </select>
      <div className="falt__label">Datum</div>
      <input className="falt__input" type="date" value={datum} onChange={(e) => setDatum(e.target.value)} />
      <div className="falt__label">Kopplat lärsteg</div>
      <select className="falt__input" value={larstegId} onChange={(e) => setLarstegId(e.target.value)} required>
        <option value="">Välj lärsteg</option>
        {alla.map((s) => (
          <option key={s.id} value={s.id}>
            Steg {s.stegnummer} · {s.titel}
          </option>
        ))}
      </select>
      <div className="falt__label">Identiteter</div>
      <IdentitetCheckboxFalt valda={identitetIds} alla={identiteter} onAndra={setIdentitetIds} />
      <div className="falt__label">Kommentar</div>
      <textarea
        className="falt__input falt__input--textarea"
        rows={2}
        value={kommentar}
        onChange={(e) => setKommentar(e.target.value)}
      />
      <div className="falt__label">Länk till material</div>
      <input
        className="falt__input"
        type="url"
        placeholder="https://…"
        value={materialRef}
        onChange={(e) => setMaterialRef(e.target.value)}
      />
      <div className="falt__actions">
        <button type="submit" className="primary-action">
          Registrera matchbevis
        </button>
        <button type="button" className="secondary-action" onClick={onAvbryt}>
          Avbryt
        </button>
      </div>
    </form>
  );
}

function MatchbevisDetalj({
  bevis,
  alla,
  identiteter,
  redigerbar,
  onTillbaka,
  onOppnaLarsteg,
  uppdatera,
}: {
  bevis: MatchbevisModell;
  alla: LarstegTyp[];
  identiteter: Identitet[];
  redigerbar: boolean;
  onTillbaka: () => void;
  onOppnaLarsteg: () => void;
  uppdatera: (patch: Partial<MatchbevisModell>) => void;
}) {
  const larstegAlternativ = alla.map((s) => ({ value: s.id, label: `Steg ${s.stegnummer} · ${s.titel}` }));
  const typAlternativ = MATCHBEVIS_TYP_VALUES.map((t) => ({ value: t, label: TYP_LABEL[t] }));

  return (
    <div className="view">
      <button type="button" className="link-btn" onClick={onTillbaka}>
        ← Alla matchbevis
      </button>

      <header className="card larsteg-header">
        <div className="larsteg-header__top">
          <button type="button" className="link-btn" onClick={onOppnaLarsteg}>
            {larstegLabel(alla, bevis.larstegId)}
          </button>
          <span className={utfallBadgeClass(bevis.utfall)}>{bevis.utfall}</span>
        </div>
        <h1>{bevis.situation || 'Namnlöst matchbevis'}</h1>
        {!redigerbar && (
          <p className="larsteg-lasnotis">Läsläge — endast huvudtränare och tränarteam kan redigera matchbevis.</p>
        )}
      </header>

      <section className="card larsteg-sektion">
        <TextFalt
          etikett="Vad vi ska se"
          varde={bevis.vadViSer}
          redigerbar={redigerbar}
          onSpara={(v) => uppdatera({ vadViSer: v })}
        />
        <TextFalt
          etikett="Beteende"
          varde={bevis.beteende}
          redigerbar={redigerbar}
          onSpara={(v) => uppdatera({ beteende: v })}
        />
        <TextFalt
          etikett="Kvalitet"
          varde={bevis.kvalitet}
          redigerbar={redigerbar}
          onSpara={(v) => uppdatera({ kvalitet: v })}
        />
        <TextFalt
          etikett="Uppföljning"
          varde={bevis.uppfoljning}
          redigerbar={redigerbar}
          onSpara={(v) => uppdatera({ uppfoljning: v })}
        />
      </section>

      <section className="card larsteg-sektion">
        <SelectFalt
          etikett="Typ"
          varde={bevis.typ}
          alternativ={typAlternativ}
          redigerbar={redigerbar}
          onSpara={(v) => uppdatera({ typ: v as MatchbevisTyp })}
        />
        <SelectFalt
          etikett="Kopplat lärsteg"
          varde={bevis.larstegId}
          alternativ={larstegAlternativ}
          redigerbar={redigerbar}
          onSpara={(v) => uppdatera({ larstegId: v })}
        />
        <div className="falt">
          <div className="falt__label">Datum</div>
          {redigerbar ? (
            <input
              className="falt__input"
              type="date"
              value={bevis.datum}
              onChange={(e) => uppdatera({ datum: e.target.value })}
            />
          ) : (
            <p className={bevis.datum ? 'falt__text' : 'falt__tom'}>{bevis.datum || 'Inte ifyllt ännu'}</p>
          )}
        </div>
      </section>

      <section className="card larsteg-sektion">
        <div className="falt__label">Identiteter</div>
        {redigerbar ? (
          <IdentitetCheckboxFalt
            valda={bevis.identitetIds}
            alla={identiteter}
            onAndra={(ids) => uppdatera({ identitetIds: ids })}
          />
        ) : bevis.identitetIds.length > 0 ? (
          <div className="chip-rad">
            {identiteter
              .filter((i) => bevis.identitetIds.includes(i.id))
              .map((i) => (
                <span key={i.id} className="chip">
                  {i.namn}
                </span>
              ))}
          </div>
        ) : (
          <p className="falt__tom">Inte ifyllt ännu</p>
        )}
      </section>

      <section className="card larsteg-sektion">
        <TextFalt
          etikett="Kommentar"
          varde={bevis.kommentar}
          redigerbar={redigerbar}
          onSpara={(v) => uppdatera({ kommentar: v })}
        />
        <TextFalt
          etikett="Länk till material"
          varde={bevis.materialRef}
          redigerbar={redigerbar}
          onSpara={(v) => uppdatera({ materialRef: v })}
        />
      </section>

      <section className="card larsteg-sektion">
        <h2>Utfall</h2>
        <div className="status-editor">
          <label className="falt__label" htmlFor="bevis-utfall">
            Utfall
          </label>
          <select
            id="bevis-utfall"
            className="falt__input"
            value={bevis.utfall}
            onChange={(e) => uppdatera({ utfall: e.target.value as MatchbevisUtfall })}
            disabled={!redigerbar}
          >
            {MATCHBEVIS_UTFALL_VALUES.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
          {redigerbar && bevis.utfall !== 'uppnått' && (
            <button type="button" className="primary-action" onClick={() => uppdatera({ utfall: 'uppnått' })}>
              Markera som visat
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

export default function Matchbevis({ onNavigate }: ViewProps) {
  const {
    state,
    roll,
    aktivtMatchbevisId,
    setAktivtMatchbevisId,
    setAktivtLarstegId,
    skapaMatchbevis,
    uppdateraMatchbevis,
  } = useAppState();
  const [utfallFilter, setUtfallFilter] = useState<MatchbevisUtfall | 'alla'>('alla');
  const [larstegFilter, setLarstegFilter] = useState('alla');
  const [skapaOppen, setSkapaOppen] = useState(false);
  const farRedigera = roll === 'huvudtranare' || roll === 'tranarteam';

  const vald = state.matchbevis.find((m) => m.id === aktivtMatchbevisId);

  if (vald) {
    return (
      <MatchbevisDetalj
        bevis={vald}
        alla={state.larsteg}
        identiteter={state.identiteter}
        redigerbar={farRedigera}
        onTillbaka={() => setAktivtMatchbevisId(null)}
        onOppnaLarsteg={() => {
          setAktivtLarstegId(vald.larstegId);
          onNavigate('larsteg');
        }}
        uppdatera={(patch) => uppdateraMatchbevis(vald.id, patch)}
      />
    );
  }

  const filtrerade = state.matchbevis.filter(
    (m) => (utfallFilter === 'alla' || m.utfall === utfallFilter) && (larstegFilter === 'alla' || m.larstegId === larstegFilter),
  );

  return (
    <div className="view">
      <div className="falt__rad">
        <h1>Matchbevis</h1>
        {farRedigera && !skapaOppen && (
          <button type="button" className="primary-action" onClick={() => setSkapaOppen(true)}>
            Registrera matchbevis
          </button>
        )}
      </div>

      {skapaOppen && (
        <SkapaMatchbevisForm
          alla={state.larsteg}
          identiteter={state.identiteter}
          onSkapa={(data) => {
            const nytt = skapaMatchbevis(data);
            setSkapaOppen(false);
            setAktivtMatchbevisId(nytt.id);
          }}
          onAvbryt={() => setSkapaOppen(false)}
        />
      )}

      {state.matchbevis.length === 0 && !skapaOppen ? (
        <div className="empty-state" role="status">
          <p>Inga matchbevis ännu. Registrera vad som faktiskt visats i match eller träning.</p>
          {farRedigera && (
            <button type="button" className="primary-action" onClick={() => setSkapaOppen(true)}>
              Registrera matchbevis
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="filter-rad">
            <div className="filter-pillar" role="group" aria-label="Filtrera på utfall">
              <button
                type="button"
                className="filter-pill"
                aria-pressed={utfallFilter === 'alla'}
                onClick={() => setUtfallFilter('alla')}
              >
                Alla
              </button>
              {MATCHBEVIS_UTFALL_VALUES.map((u) => (
                <button
                  key={u}
                  type="button"
                  className="filter-pill"
                  aria-pressed={utfallFilter === u}
                  onClick={() => setUtfallFilter(u)}
                >
                  {u}
                </button>
              ))}
            </div>
            <select
              className="falt__input filter-select"
              value={larstegFilter}
              onChange={(e) => setLarstegFilter(e.target.value)}
              aria-label="Filtrera på lärsteg"
            >
              <option value="alla">Alla lärsteg</option>
              {state.larsteg.map((s) => (
                <option key={s.id} value={s.id}>
                  Steg {s.stegnummer} · {s.titel}
                </option>
              ))}
            </select>
          </div>

          {filtrerade.length > 0 ? (
            <ul className="lista">
              {filtrerade.map((m) => (
                <li key={m.id}>
                  <button type="button" className="card lista-rad" onClick={() => setAktivtMatchbevisId(m.id)}>
                    <span className="lista-rad__titel">{m.situation || 'Namnlöst matchbevis'}</span>
                    <span className="lista-rad__meta">{larstegLabel(state.larsteg, m.larstegId)}</span>
                    <span className="pill">{TYP_LABEL[m.typ]}</span>
                    <span className={utfallBadgeClass(m.utfall)}>{m.utfall}</span>
                    <span className="lista-rad__nar">{m.datum || '—'}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state" role="status">
              Inga matchbevis matchar filtret.
            </div>
          )}
        </>
      )}
    </div>
  );
}
