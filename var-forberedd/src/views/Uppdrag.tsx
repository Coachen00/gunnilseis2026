import { useState } from 'react';
import type { ViewProps } from '../App';
import { useAppState } from '../store/useAppState';
import type { Larsteg as LarstegTyp, Roll, Status, Traneruppdrag } from '../domain/types';
import { STATUS_VALUES, statusPillClass } from './status';
import { ListFalt, SelectFalt, TextFalt } from './FaltKomponenter';

const ROLL_LABEL: Record<Roll, string> = {
  huvudtranare: 'Huvudtränare',
  tranarteam: 'Tränarteam',
  spelare: 'Spelare',
};

function larstegLabel(alla: LarstegTyp[], id: string): string {
  const steg = alla.find((s) => s.id === id);
  return steg ? `Steg ${steg.stegnummer} · ${steg.titel}` : 'Inget lärsteg valt';
}

function SkapaUppdragForm({
  alla,
  onSkapa,
  onAvbryt,
}: {
  alla: LarstegTyp[];
  onSkapa: (data: Omit<Traneruppdrag, 'id'>) => void;
  onAvbryt: () => void;
}) {
  const [titel, setTitel] = useState('');
  const [syfte, setSyfte] = useState('');
  const [ansvarigRoll, setAnsvarigRoll] = useState<Roll>('huvudtranare');
  const [larstegId, setLarstegId] = useState(alla[0]?.id ?? '');
  const [nar, setNar] = useState('');

  return (
    <form
      className="card skapa-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (!titel.trim() || !larstegId) return;
        onSkapa({
          titel: titel.trim(),
          syfte: syfte.trim(),
          ansvarigRoll,
          forberedelser: '',
          observera: '',
          fragor: [],
          coachrop: [],
          forstarkBeteenden: [],
          traningsformer: [],
          nar: nar.trim(),
          larstegId,
          status: 'Ej påbörjat',
          kommentarer: [],
          nastaAktion: '',
        });
      }}
    >
      <h2>Nytt tränaruppdrag</h2>
      <div className="falt__label">Titel</div>
      <input className="falt__input" value={titel} onChange={(e) => setTitel(e.target.value)} required />
      <div className="falt__label">Syfte</div>
      <textarea
        className="falt__input falt__input--textarea"
        rows={2}
        value={syfte}
        onChange={(e) => setSyfte(e.target.value)}
      />
      <div className="falt__label">Ansvarig roll</div>
      <select className="falt__input" value={ansvarigRoll} onChange={(e) => setAnsvarigRoll(e.target.value as Roll)}>
        {(Object.keys(ROLL_LABEL) as Roll[]).map((r) => (
          <option key={r} value={r}>
            {ROLL_LABEL[r]}
          </option>
        ))}
      </select>
      <div className="falt__label">Kopplat lärsteg</div>
      <select className="falt__input" value={larstegId} onChange={(e) => setLarstegId(e.target.value)} required>
        <option value="">Välj lärsteg</option>
        {alla.map((s) => (
          <option key={s.id} value={s.id}>
            Steg {s.stegnummer} · {s.titel}
          </option>
        ))}
      </select>
      <div className="falt__label">När</div>
      <input
        className="falt__input"
        value={nar}
        onChange={(e) => setNar(e.target.value)}
        placeholder="T.ex. Vecka 12"
      />
      <div className="falt__actions">
        <button type="submit" className="primary-action">
          Skapa tränaruppdrag
        </button>
        <button type="button" className="secondary-action" onClick={onAvbryt}>
          Avbryt
        </button>
      </div>
    </form>
  );
}

function UppdragDetalj({
  uppdrag,
  alla,
  redigerbar,
  roll,
  onTillbaka,
  onOppnaLarsteg,
  uppdatera,
}: {
  uppdrag: Traneruppdrag;
  alla: LarstegTyp[];
  redigerbar: boolean;
  roll: Roll;
  onTillbaka: () => void;
  onOppnaLarsteg: () => void;
  uppdatera: (patch: Partial<Traneruppdrag>) => void;
}) {
  const [kommentarText, setKommentarText] = useState('');
  const larstegAlternativ = alla.map((s) => ({ value: s.id, label: `Steg ${s.stegnummer} · ${s.titel}` }));
  const rollAlternativ = (Object.keys(ROLL_LABEL) as Roll[]).map((r) => ({ value: r, label: ROLL_LABEL[r] }));

  return (
    <div className="view">
      <button type="button" className="link-btn" onClick={onTillbaka}>
        ← Alla tränaruppdrag
      </button>

      <header className="card larsteg-header">
        <div className="larsteg-header__top">
          <button type="button" className="link-btn" onClick={onOppnaLarsteg}>
            {larstegLabel(alla, uppdrag.larstegId)}
          </button>
          <span className={statusPillClass(uppdrag.status)}>{uppdrag.status}</span>
        </div>
        <h1>{uppdrag.titel}</h1>
        {!redigerbar && (
          <p className="larsteg-lasnotis">Läsläge — endast huvudtränare och tränarteam kan redigera tränaruppdrag.</p>
        )}
      </header>

      <section className="card larsteg-sektion">
        <TextFalt etikett="Syfte" varde={uppdrag.syfte} redigerbar={redigerbar} onSpara={(v) => uppdatera({ syfte: v })} />
        <TextFalt
          etikett="Förberedelser"
          varde={uppdrag.forberedelser}
          redigerbar={redigerbar}
          onSpara={(v) => uppdatera({ forberedelser: v })}
        />
        <TextFalt
          etikett="Observera"
          varde={uppdrag.observera}
          redigerbar={redigerbar}
          onSpara={(v) => uppdatera({ observera: v })}
        />
      </section>

      <section className="card larsteg-sektion">
        <ListFalt etikett="Frågor" poster={uppdrag.fragor} redigerbar={redigerbar} onSpara={(v) => uppdatera({ fragor: v })} />
        <ListFalt
          etikett="Coachrop"
          poster={uppdrag.coachrop}
          redigerbar={redigerbar}
          onSpara={(v) => uppdatera({ coachrop: v })}
        />
        <ListFalt
          etikett="Förstärk beteenden"
          poster={uppdrag.forstarkBeteenden}
          redigerbar={redigerbar}
          onSpara={(v) => uppdatera({ forstarkBeteenden: v })}
        />
        <ListFalt
          etikett="Träningsformer"
          poster={uppdrag.traningsformer}
          redigerbar={redigerbar}
          onSpara={(v) => uppdatera({ traningsformer: v })}
        />
      </section>

      <section className="card larsteg-sektion">
        <TextFalt etikett="När" varde={uppdrag.nar} redigerbar={redigerbar} onSpara={(v) => uppdatera({ nar: v })} />
        <SelectFalt
          etikett="Ansvarig roll"
          varde={uppdrag.ansvarigRoll}
          alternativ={rollAlternativ}
          redigerbar={redigerbar}
          onSpara={(v) => uppdatera({ ansvarigRoll: v as Roll })}
        />
        <SelectFalt
          etikett="Kopplat lärsteg"
          varde={uppdrag.larstegId}
          alternativ={larstegAlternativ}
          redigerbar={redigerbar}
          onSpara={(v) => uppdatera({ larstegId: v })}
        />
      </section>

      <section className="card larsteg-sektion">
        <h2>Status</h2>
        <div className="status-editor">
          <label className="falt__label" htmlFor="uppdrag-status">
            Status
          </label>
          <select
            id="uppdrag-status"
            className="falt__input"
            value={uppdrag.status}
            onChange={(e) => uppdatera({ status: e.target.value as Status })}
            disabled={!redigerbar}
          >
            {STATUS_VALUES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="card larsteg-sektion">
        <div className="falt__label">Kommentarer</div>
        {uppdrag.kommentarer.length > 0 ? (
          <ul className="kommentar-lista">
            {uppdrag.kommentarer.map((k, i) => (
              <li key={i} className="kommentar-rad">
                <span className="kommentar-rad__meta">
                  {ROLL_LABEL[k.roll]} · {k.datum}
                </span>
                <p>{k.text}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="falt__tom">Inga kommentarer ännu</p>
        )}
        {redigerbar && (
          <div className="falt__ny-rad">
            <input
              className="falt__input"
              placeholder="Skriv en kommentar"
              value={kommentarText}
              onChange={(e) => setKommentarText(e.target.value)}
            />
            <button
              type="button"
              className="secondary-action"
              onClick={() => {
                if (!kommentarText.trim()) return;
                uppdatera({
                  kommentarer: [
                    ...uppdrag.kommentarer,
                    { roll, text: kommentarText.trim(), datum: new Date().toISOString().slice(0, 10) },
                  ],
                });
                setKommentarText('');
              }}
            >
              Lägg till kommentar
            </button>
          </div>
        )}
      </section>

      <section className="card larsteg-sektion">
        <TextFalt
          etikett="Nästa aktion"
          varde={uppdrag.nastaAktion}
          redigerbar={redigerbar}
          onSpara={(v) => uppdatera({ nastaAktion: v })}
        />
      </section>
    </div>
  );
}

export default function Uppdrag({ onNavigate }: ViewProps) {
  const {
    state,
    roll,
    aktivtUppdragId,
    setAktivtUppdragId,
    setAktivtLarstegId,
    skapaUppdrag,
    uppdateraUppdrag,
  } = useAppState();
  const [statusFilter, setStatusFilter] = useState<Status | 'alla'>('alla');
  const [larstegFilter, setLarstegFilter] = useState('alla');
  const [skapaOppen, setSkapaOppen] = useState(false);
  const farRedigera = roll === 'huvudtranare' || roll === 'tranarteam';

  const vald = state.uppdrag.find((u) => u.id === aktivtUppdragId);

  if (vald) {
    return (
      <UppdragDetalj
        uppdrag={vald}
        alla={state.larsteg}
        redigerbar={farRedigera}
        roll={roll}
        onTillbaka={() => setAktivtUppdragId(null)}
        onOppnaLarsteg={() => {
          setAktivtLarstegId(vald.larstegId);
          onNavigate('larsteg');
        }}
        uppdatera={(patch) => uppdateraUppdrag(vald.id, patch)}
      />
    );
  }

  const filtrerade = state.uppdrag.filter(
    (u) => (statusFilter === 'alla' || u.status === statusFilter) && (larstegFilter === 'alla' || u.larstegId === larstegFilter),
  );

  return (
    <div className="view">
      <div className="falt__rad">
        <h1>Tränaruppdrag</h1>
        {farRedigera && !skapaOppen && (
          <button type="button" className="primary-action" onClick={() => setSkapaOppen(true)}>
            Lägg till tränaruppdrag
          </button>
        )}
      </div>

      {skapaOppen && (
        <SkapaUppdragForm
          alla={state.larsteg}
          onSkapa={(data) => {
            const nytt = skapaUppdrag(data);
            setSkapaOppen(false);
            setAktivtUppdragId(nytt.id);
          }}
          onAvbryt={() => setSkapaOppen(false)}
        />
      )}

      {state.uppdrag.length === 0 && !skapaOppen ? (
        <div className="empty-state" role="status">
          <p>Inga tränaruppdrag ännu. Skapa ett uppdrag för att koppla ett lärsteg till konkret arbete på planen.</p>
          {farRedigera && (
            <button type="button" className="primary-action" onClick={() => setSkapaOppen(true)}>
              Lägg till tränaruppdrag
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="filter-rad">
            <div className="filter-pillar" role="group" aria-label="Filtrera på status">
              <button
                type="button"
                className="filter-pill"
                aria-pressed={statusFilter === 'alla'}
                onClick={() => setStatusFilter('alla')}
              >
                Alla
              </button>
              {STATUS_VALUES.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="filter-pill"
                  aria-pressed={statusFilter === s}
                  onClick={() => setStatusFilter(s)}
                >
                  {s}
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
              {filtrerade.map((u) => (
                <li key={u.id}>
                  <button type="button" className="card lista-rad" onClick={() => setAktivtUppdragId(u.id)}>
                    <span className="lista-rad__titel">{u.titel}</span>
                    <span className="lista-rad__meta">{larstegLabel(state.larsteg, u.larstegId)}</span>
                    <span className="pill">{ROLL_LABEL[u.ansvarigRoll]}</span>
                    <span className={statusPillClass(u.status)}>{u.status}</span>
                    <span className="lista-rad__nar">{u.nar || '—'}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state" role="status">
              Inga tränaruppdrag matchar filtret.
            </div>
          )}
        </>
      )}
    </div>
  );
}
