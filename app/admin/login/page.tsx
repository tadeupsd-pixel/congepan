'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault(); setLoading(true); setError('');
    const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
    const payload = await response.json();
    if (!response.ok) { setLoading(false); setError(payload.error || 'Não foi possível entrar.'); return; }
    router.push('/admin'); router.refresh();
  }

  return (
    <main className="login-page congepan-admin-bg"><div className="container" style={{ maxWidth: 560 }}><div className="login-card"><h1 style={{ fontSize: 40, marginTop: 0 }}>Entrar no painel</h1><p className="lead" style={{ fontSize: 18 }}>Use a senha definida na variável <strong>ADMIN_PASSWORD</strong>.</p><form onSubmit={onSubmit}><div className="field-full"><label>Senha</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Digite a senha do painel" required /></div>{error ? <p className="message-error">{error}</p> : null}<div className="action-row"><button className="button button-primary" style={{ background: '#0f7a3f' }} disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button><a className="button button-secondary" href="/">Voltar ao site</a></div></form></div></div></main>
  );
}
