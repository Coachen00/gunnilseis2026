import { useEffect, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../integrations/supabase/client';
import './auth.css';

export default function AuthGate({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setChecking(false);
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setChecking(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      setChecking(false);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  if (checking) {
    return <div className="auth-screen" role="status">Verifierar inloggning…</div>;
  }

  if (!supabase) {
    return <div className="auth-screen" role="alert">Inloggningen är inte konfigurerad. Lägg till Supabase-variablerna i deploymentens miljö.</div>;
  }

  if (!session) return <LoginScreen />;
  return <>{children}</>;
}

function LoginScreen() {
  const client = supabase;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!client) return null;

  async function loggaIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    const { error: authError } = await client!.auth.signInWithPassword({ email, password });
    if (authError) setError('E-post eller lösenord stämmer inte.');
    setSubmitting(false);
  }

  return (
    <main className="auth-screen">
      <section className="auth-card" aria-labelledby="auth-title">
        <div className="auth-card__eyebrow">VAR FÖRBEREDD</div>
        <h1 id="auth-title">Logga in för att fortsätta</h1>
        <p>Spelmodell, principer och matchinformation är endast för behöriga ledare och spelare.</p>
        <form onSubmit={loggaIn}>
          <label>
            E-post
            <input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label>
            Lösenord
            <input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>
          {error && <div className="auth-error" role="alert">{error}</div>}
          <button type="submit" disabled={submitting}>{submitting ? 'Loggar in…' : 'Logga in'}</button>
        </form>
      </section>
    </main>
  );
}
