import { lazy, Suspense, useState } from 'react';
import type { ComponentType } from 'react';
import { useAppState } from './store/useAppState';
import type { Roll } from './domain/types';
import { supabase } from './integrations/supabase/client';
import './views/views.css';

export type Section =
  | 'oversikt'
  | 'larprogram'
  | 'larsteg'
  | 'identiteter'
  | 'spelomraden'
  | 'uppdrag'
  | 'matchbevis';

export interface ViewProps {
  onNavigate: (section: Section) => void;
}

const views: Record<Section, ReturnType<typeof lazy<ComponentType<any>>>> = {
  oversikt: lazy(() => import('./views/Oversikt')),
  larprogram: lazy(() => import('./views/Larprogram')),
  larsteg: lazy(() => import('./views/Larsteg')),
  identiteter: lazy(() => import('./views/Identiteter')),
  spelomraden: lazy(() => import('./views/Spelomraden')),
  uppdrag: lazy(() => import('./views/Uppdrag')),
  matchbevis: lazy(() => import('./views/Matchbevis')),
};

const navGroups: { label: string; items: { id: Section; label: string }[] }[] = [
  {
    label: 'Program',
    items: [
      { id: 'oversikt', label: 'Översikt' },
      { id: 'larprogram', label: 'Lärprogram' },
      { id: 'larsteg', label: 'Lärsteg' },
    ],
  },
  {
    label: 'Innehåll',
    items: [
      { id: 'identiteter', label: 'Identiteter' },
      { id: 'spelomraden', label: 'Spelområden' },
    ],
  },
  {
    label: 'Uppföljning',
    items: [
      { id: 'uppdrag', label: 'Tränaruppdrag' },
      { id: 'matchbevis', label: 'Matchbevis' },
    ],
  },
];

const rollLabel: Record<Roll, string> = {
  huvudtranare: 'Huvudtränare',
  tranarteam: 'Tränarteam',
  spelare: 'Spelare',
};

function App() {
  const [section, setSection] = useState<Section>('oversikt');
  const { roll, setRoll } = useAppState();

  const ActiveView = views[section];
  const activeLabel = navGroups.flatMap((g) => g.items).find((i) => i.id === section)?.label ?? '';

  return (
    <div className="app-shell">
      <nav className="sidebar" aria-label="Huvudnavigation">
        <div className="sidebar__brand">Var förberedd</div>
        {navGroups.map((group) => (
          <div className="nav-group" key={group.label}>
            <div className="nav-group__label">{group.label}</div>
            {group.items.map((item) => (
              <button
                key={item.id}
                type="button"
                className="nav-link"
                aria-current={section === item.id ? 'page' : undefined}
                onClick={() => setSection(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="main">
        <header className="topbar">
          <div className="topbar__title">{activeLabel}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="role-badge">{rollLabel[roll]}</span>
            <button type="button" className="sign-out" onClick={() => supabase?.auth.signOut()}>
              Logga ut
            </button>
            <div className="role-switch" role="group" aria-label="Byt roll">
              {(Object.keys(rollLabel) as Roll[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  className="role-switch__btn"
                  aria-pressed={roll === r}
                  onClick={() => setRoll(r)}
                >
                  {rollLabel[r]}
                </button>
              ))}
            </div>
          </div>
        </header>

        <main className="workspace">
          <Suspense fallback={<div className="empty-state">Laddar…</div>}>
            <ActiveView onNavigate={setSection} />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default App;
