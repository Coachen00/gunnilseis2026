import { useState } from 'react';

export function TextFalt({
  etikett,
  varde,
  redigerbar,
  onSpara,
}: {
  etikett: string;
  varde: string;
  redigerbar: boolean;
  onSpara: (varde: string) => void;
}) {
  const [redigerar, setRedigerar] = useState(false);
  const [utkast, setUtkast] = useState(varde);

  if (!redigerar) {
    return (
      <div className="falt">
        <div className="falt__rad">
          <div className="falt__label">{etikett}</div>
          {redigerbar && (
            <button
              type="button"
              className="link-btn"
              onClick={() => {
                setUtkast(varde);
                setRedigerar(true);
              }}
            >
              Redigera
            </button>
          )}
        </div>
        {varde ? <p className="falt__text">{varde}</p> : <p className="falt__tom">Inte ifyllt ännu</p>}
      </div>
    );
  }

  return (
    <div className="falt falt--redigerar">
      <div className="falt__label">{etikett}</div>
      <textarea
        className="falt__input falt__input--textarea"
        rows={3}
        value={utkast}
        onChange={(e) => setUtkast(e.target.value)}
      />
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

export function SelectFalt({
  etikett,
  varde,
  alternativ,
  redigerbar,
  onSpara,
}: {
  etikett: string;
  varde: string;
  alternativ: { value: string; label: string }[];
  redigerbar: boolean;
  onSpara: (varde: string) => void;
}) {
  const [redigerar, setRedigerar] = useState(false);
  const [utkast, setUtkast] = useState(varde);
  const vardeLabel = alternativ.find((a) => a.value === varde)?.label;

  if (!redigerar) {
    return (
      <div className="falt">
        <div className="falt__rad">
          <div className="falt__label">{etikett}</div>
          {redigerbar && (
            <button
              type="button"
              className="link-btn"
              onClick={() => {
                setUtkast(varde);
                setRedigerar(true);
              }}
            >
              Redigera
            </button>
          )}
        </div>
        {vardeLabel ? <p className="falt__text">{vardeLabel}</p> : <p className="falt__tom">Inte ifyllt ännu</p>}
      </div>
    );
  }

  return (
    <div className="falt falt--redigerar">
      <div className="falt__label">{etikett}</div>
      <select className="falt__input" value={utkast} onChange={(e) => setUtkast(e.target.value)}>
        {alternativ.map((a) => (
          <option key={a.value} value={a.value}>
            {a.label}
          </option>
        ))}
      </select>
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

export function ListFalt({
  etikett,
  poster,
  redigerbar,
  onSpara,
}: {
  etikett: string;
  poster: string[];
  redigerbar: boolean;
  onSpara: (poster: string[]) => void;
}) {
  const [redigerar, setRedigerar] = useState(false);
  const [utkast, setUtkast] = useState<string[]>(poster);
  const [nyRad, setNyRad] = useState('');

  if (!redigerar) {
    return (
      <div className="falt">
        <div className="falt__rad">
          <div className="falt__label">{etikett}</div>
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
          <ul className="falt__lista">
            {poster.map((rad, i) => (
              <li key={i}>{rad}</li>
            ))}
          </ul>
        ) : (
          <p className="falt__tom">Inte ifyllt ännu</p>
        )}
      </div>
    );
  }

  return (
    <div className="falt falt--redigerar">
      <div className="falt__label">{etikett}</div>
      <ul className="falt__lista falt__lista--redigerbar">
        {utkast.map((rad, i) => (
          <li key={i}>
            <input
              className="falt__input"
              value={rad}
              onChange={(e) => setUtkast(utkast.map((r, j) => (j === i ? e.target.value : r)))}
            />
            <button
              type="button"
              className="icon-btn"
              aria-label={`Ta bort rad: ${rad || 'tom'}`}
              onClick={() => setUtkast(utkast.filter((_, j) => j !== i))}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      <div className="falt__ny-rad">
        <input
          className="falt__input"
          placeholder="Lägg till rad"
          value={nyRad}
          onChange={(e) => setNyRad(e.target.value)}
        />
        <button
          type="button"
          className="secondary-action"
          onClick={() => {
            if (!nyRad.trim()) return;
            setUtkast([...utkast, nyRad.trim()]);
            setNyRad('');
          }}
        >
          Lägg till rad
        </button>
      </div>
      <div className="falt__actions">
        <button
          type="button"
          className="primary-action"
          onClick={() => {
            onSpara(utkast.filter((r) => r.trim().length > 0));
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
