import type { ViewProps } from '../App';
import { useAppState } from '../store/useAppState';
import { statusPillClass } from './status';

export default function Larprogram({ onNavigate }: ViewProps) {
  const { state, setAktivtLarstegId } = useAppState();
  const ordnadeSteg = state.larprogram.larstegIds
    .map((id) => state.larsteg.find((steg) => steg.id === id))
    .filter((steg): steg is NonNullable<typeof steg> => Boolean(steg));

  function oppna(id: string) {
    setAktivtLarstegId(id);
    onNavigate('larsteg');
  }

  if (ordnadeSteg.length === 0) {
    return (
      <div className="view-stub">
        <h1>Lärprogram</h1>
        <div className="empty-state" role="status">
          Inga lärsteg ännu. Här visas de sju stegen i lärprogrammet med status.
        </div>
      </div>
    );
  }

  return (
    <div className="view">
      <h1>{state.larprogram.titel}</h1>
      <ol className="stepper">
        {ordnadeSteg.map((steg) => (
          <li key={steg.id} className="stepper__item">
            <button type="button" className="stepper__row card" onClick={() => oppna(steg.id)}>
              <span className="stepper__nr">{steg.stegnummer}</span>
              <span className="stepper__body">
                <span className="stepper__titel">{steg.titel}</span>
                <span className="stepper__sammanfattning">{steg.sammanfattning || 'Inte ifyllt ännu'}</span>
              </span>
              <span className={statusPillClass(steg.status)}>{steg.status}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
