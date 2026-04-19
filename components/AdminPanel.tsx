'use client';

import { useMemo, useState } from 'react';
import type { SiteContent, VisitRecord } from '@/lib/types';
import { formatDateTime } from '@/lib/utils';

function inferTopCities(visits: VisitRecord[]) {
  const map = new Map<string, number>();
  for (const visit of visits) {
    const key = [visit.city, visit.region, visit.country].filter(Boolean).join(' - ') || 'Não identificado';
    map.set(key, (map.get(key) || 0) + 1);
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
}

export function AdminPanel({ initialContent, initialVisits }: { initialContent: SiteContent; initialVisits: VisitRecord[] }) {
  const [form, setForm] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [visits, setVisits] = useState(initialVisits);

  const topCities = useMemo(() => inferTopCities(visits), [visits]);

  function updateField<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function saveContent() {
    setSaving(true);
    setMessage('');
    setError('');

    const response = await fetch('/api/site-content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const payload = await response.json();
    setSaving(false);

    if (!response.ok) {
      setError(payload.error || 'Erro ao salvar.');
      return;
    }

    setMessage('Conteúdo salvo com sucesso.');
    setForm(payload.data);
  }

  async function uploadLogo(file?: File) {
    if (!file) return;
    setUploading(true);
    setMessage('');
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload-logo', {
      method: 'POST',
      body: formData
    });

    const payload = await response.json();
    setUploading(false);

    if (!response.ok) {
      setError(payload.error || 'Falha ao enviar a logo.');
      return;
    }

    updateField('hero_logo_url', payload.url);
    setMessage('Logo enviada com sucesso. Salve o conteúdo para manter a alteração.');
  }

  async function refreshVisits() {
    const response = await fetch('/api/visits');
    const payload = await response.json();
    if (response.ok) {
      setVisits(payload.data || []);
    }
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }

  const totalVisits = visits.length;
  const todayVisits = visits.filter((visit) => {
    const now = new Date();
    const date = new Date(visit.created_at);
    return now.toDateString() === date.toDateString();
  }).length;
  const uniqueIps = new Set(visits.map((visit) => visit.ip_address).filter(Boolean)).size;

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1 style={{ margin: 0, fontSize: 44 }}>Painel do site</h1>
            <p className="lead" style={{ margin: '8px 0 0', fontSize: 18 }}>
              Edite o conteúdo, envie a logo e acompanhe visitas com IP e cidade aproximada.
            </p>
          </div>
          <div className="action-row" style={{ marginTop: 0 }}>
            <button className="button button-secondary" onClick={refreshVisits}>Atualizar visitas</button>
            <button className="button button-secondary" onClick={logout}>Sair</button>
          </div>
        </div>

        <div className="stats-grid" style={{ marginBottom: 18 }}>
          <div className="stat-card">
            <span className="stat-label">Total de visitas</span>
            <div className="stat-value">{totalVisits}</div>
          </div>
          <div className="stat-card">
            <span className="stat-label">Visitas hoje</span>
            <div className="stat-value">{todayVisits}</div>
          </div>
          <div className="stat-card">
            <span className="stat-label">IPs únicos</span>
            <div className="stat-value">{uniqueIps}</div>
          </div>
        </div>

        <div className="admin-grid">
          <div className="admin-card">
            <h2 style={{ marginTop: 0 }}>Conteúdo da landing page</h2>
            <div className="field-grid">
              <div className="field">
                <label>Nome da marca</label>
                <input value={form.brand_name} onChange={(e) => updateField('brand_name', e.target.value)} />
              </div>
              <div className="field">
                <label>Número do WhatsApp</label>
                <input value={form.whatsapp_number} onChange={(e) => updateField('whatsapp_number', e.target.value)} placeholder="5585..." />
              </div>

              <div className="field-full">
                <label>Título principal</label>
                <input value={form.headline} onChange={(e) => updateField('headline', e.target.value)} />
              </div>

              <div className="field-full">
                <label>Subtítulo</label>
                <textarea value={form.subheadline} onChange={(e) => updateField('subheadline', e.target.value)} />
              </div>

              <div className="field-full">
                <label>Mensagem inicial do WhatsApp</label>
                <textarea value={form.whatsapp_message} onChange={(e) => updateField('whatsapp_message', e.target.value)} />
              </div>

              <div className="field">
                <label>Cor principal</label>
                <input value={form.primary_color} onChange={(e) => updateField('primary_color', e.target.value)} placeholder="#0f172a" />
              </div>
              <div className="field">
                <label>Cor secundária</label>
                <input value={form.secondary_color} onChange={(e) => updateField('secondary_color', e.target.value)} placeholder="#111827" />
              </div>
              <div className="field">
                <label>Cor de destaque</label>
                <input value={form.accent_color} onChange={(e) => updateField('accent_color', e.target.value)} placeholder="#22c55e" />
              </div>
              <div className="field">
                <label>URL da logo</label>
                <input value={form.hero_logo_url || ''} onChange={(e) => updateField('hero_logo_url', e.target.value || null)} placeholder="https://..." />
              </div>

              <div className="field-full">
                <label>Enviar nova logo</label>
                <input type="file" accept="image/*" onChange={(e) => uploadLogo(e.target.files?.[0])} />
                <span className="small">O arquivo será enviado para o bucket <strong>branding</strong> no Supabase Storage.</span>
                {uploading ? <span className="small">Enviando logo...</span> : null}
              </div>

              <div className="field">
                <label>Bloco 1 - título</label>
                <input value={form.info_card_1_title} onChange={(e) => updateField('info_card_1_title', e.target.value)} />
              </div>
              <div className="field">
                <label>Bloco 1 - valor</label>
                <input value={form.info_card_1_value} onChange={(e) => updateField('info_card_1_value', e.target.value)} />
              </div>
              <div className="field">
                <label>Bloco 2 - título</label>
                <input value={form.info_card_2_title} onChange={(e) => updateField('info_card_2_title', e.target.value)} />
              </div>
              <div className="field">
                <label>Bloco 2 - valor</label>
                <input value={form.info_card_2_value} onChange={(e) => updateField('info_card_2_value', e.target.value)} />
              </div>
              <div className="field">
                <label>Bloco 3 - título</label>
                <input value={form.info_card_3_title} onChange={(e) => updateField('info_card_3_title', e.target.value)} />
              </div>
              <div className="field">
                <label>Bloco 3 - valor</label>
                <input value={form.info_card_3_value} onChange={(e) => updateField('info_card_3_value', e.target.value)} />
              </div>

              <div className="field-full">
                <label>Texto da política de privacidade</label>
                <textarea value={form.privacy_policy_text} onChange={(e) => updateField('privacy_policy_text', e.target.value)} />
              </div>
            </div>

            {message ? <p className="message-success">{message}</p> : null}
            {error ? <p className="message-error">{error}</p> : null}

            <div className="action-row">
              <button className="button button-primary" style={{ background: '#22c55e' }} onClick={saveContent} disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar alterações'}
              </button>
              <a className="button button-secondary" href="/" target="_blank" rel="noreferrer">
                Abrir site
              </a>
            </div>
          </div>

          <div className="admin-card">
            <h2 style={{ marginTop: 0 }}>Top cidades</h2>
            <div className="visit-list">
              {topCities.length === 0 ? <p className="muted">Ainda não há visitas registradas.</p> : null}
              {topCities.map(([city, count]) => (
                <div className="visit-card" key={city}>
                  <strong>{city}</strong>
                  <div className="muted">{count} visita(s)</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="admin-card" style={{ marginTop: 18 }}>
          <h2 style={{ marginTop: 0 }}>Últimas visitas</h2>
          <div className="visit-list">
            {visits.length === 0 ? <p className="muted">Nenhum acesso registrado ainda.</p> : null}
            {visits.map((visit) => (
              <div className="visit-card" key={visit.id}>
                <div className="visit-top">
                  <div>
                    <strong>{visit.city || 'Cidade não identificada'}{visit.region ? `, ${visit.region}` : ''}</strong>
                    <div className="muted">{visit.country || 'País não identificado'}</div>
                  </div>
                  <div className="chip">{formatDateTime(visit.created_at)}</div>
                </div>

                <div className="field-grid">
                  <div>
                    <span className="small">IP</span>
                    <div>{visit.ip_address || 'Não disponível'}</div>
                  </div>
                  <div>
                    <span className="small">Página</span>
                    <div>{visit.page_path}</div>
                  </div>
                  <div>
                    <span className="small">Dispositivo</span>
                    <div>{visit.device_type || 'Não identificado'}</div>
                  </div>
                  <div>
                    <span className="small">Referer</span>
                    <div style={{ wordBreak: 'break-word' }}>{visit.referer || 'Direto'}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
