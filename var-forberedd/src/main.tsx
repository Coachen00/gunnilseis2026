import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AppStateProvider } from './store/useAppState.tsx'

const App = lazy(() => import('./App.tsx'))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppStateProvider>
      <Suspense fallback={<div className="auth-screen" role="status">Laddar…</div>}>
        <App />
      </Suspense>
    </AppStateProvider>
  </StrictMode>,
)
