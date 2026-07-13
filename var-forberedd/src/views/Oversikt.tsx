import type { ViewProps } from '../App';
import { useAppState } from '../store/useAppState';
import { statusBucket, statusPillClass } from './status';

export default function Oversikt({ onNavigate }: ViewProps) {
  const { state, setAktivtLarstegId } = useAppState();
  const { larprogram, larsteg, aktivtLarstegId } = state;
  const ordnadeSteg = [...larsteg].sort((a, b) => a.stegnummer - b.stegnummer);
  const aktuelltSteg = larsteg.find((steg) => steg.id === aktivtLarstegId);

  const sammanstallning = ordnadeSteg.reduce(
    (acc, steg) => {
      acc[statusBucket(steg.status)] += 1;
      return acc;
    },
    { etablerat: 0, pagar: 0, 'ej-paborjat': 0 } as Record<'etablerat' | 'pagar' | 'ej-paborjat', number>,
  );

  function oppnaSteg(id: string) {
    setAktivtLarstegId(id);
    onNavigate('larsteg');
  }

  if (ordnadeSteg.length === 0) {
    return (
      <div className="view-stub">
        <h1>Översikt</h1>
        <div className="empty-state" role="status">
          Inga lärsteg ännu. Här visas aktuellt lärsteg, progression per lärsteg och nästa steg när innehållet är på plats.
        </div>
      </div>
    );
  }

  return (
    <div className="view">
      <section className="card oversikt-hero">
        <h1>{larprogram.titel}</h1>
        {larprogram.beskrivning ? <p>{larprogram.beskrivning}</p> : <p className="falt__tom">Inte ifyllt ännu</p>}
      </section>

      {aktuelltSteg ? (
        <section className="card oversikt-aktuellt">
          <div className="oversikt-aktuellt__label">Aktuellt lärsteg</div>
          <h2>
            Steg {aktuelltSteg.stegnummer} · {aktuelltSteg.titel}
          </h2>
          <p>{aktuelltSteg.sammanfattning || 'Inte ifyllt ännu'}</p>
          <div className="oversikt-aktuellt__meta">
            <span className={statusPillClass(aktuelltSteg.status)}>{aktuelltSteg.status}</span>
            <div className="progress-bar" aria-label={`Progression ${aktuelltSteg.progression} procent`}>
              <div className="progress-bar__fill" style={{ width: `${aktuelltSteg.progression}%` }} />
            </div>
            <span className="progress-bar__label">{aktuelltSteg.progression}%</span>
          </div>
          <button type="button" className="primary-action" onClick={() => oppnaSteg(aktuelltSteg.id)}>
            Öppna lärsteg
          </button>
        </section>
      ) : (
        <div className="empty-state" role="status">
          Inget aktuellt lärsteg valt ännu. Öppna lärprogrammet och välj ett steg.
        </div>
      )}

      <section className="card">
        <h2>Progression per lärsteg</h2>
        <ol className="steg-grid">
          {ordnadeSteg.map((steg) => (
            <li key={steg.id}>
              <button type="button" className="steg-grid__item" onClick={() => oppnaSteg(steg.id)}>
                <span className="steg-grid__nr">{steg.stegnummer}</span>
                <span className="steg-grid__titel">{steg.titel}</span>
                <span className={statusPillClass(steg.status)}>{steg.status}</span>
              </button>
            </li>
          ))}
        </ol>
      </section>

      <section className="card">
        <h2>Sammanställning</h2>
        <dl className="sammanstallning">
          <div>
            <dt>Etablerat</dt>
            <dd>{sammanstallning.etablerat}</dd>
          </div>
          <div>
            <dt>Pågår</dt>
            <dd>{sammanstallning.pagar}</dd>
          </div>
          <div>
            <dt>Ej påbörjat</dt>
            <dd>{sammanstallning['ej-paborjat']}</dd>
          </div>
        </dl>
      </section>

      <section className="card">
        <h2>Nästa steg</h2>
        {aktuelltSteg?.nastaSteg ? <p>{aktuelltSteg.nastaSteg}</p> : <p className="falt__tom">Inte ifyllt ännu</p>}
        <button type="button" className="secondary-action" onClick={() => onNavigate('larprogram')}>
          Öppna lärprogrammet
        </button>
      </section>
    </div>
  );
}
