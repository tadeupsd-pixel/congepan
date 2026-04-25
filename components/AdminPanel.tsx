'use client';

import { useMemo, useState } from 'react';
import type { SiteContent, VisitRecord } from '@/lib/types';
import { formatDateTime } from '@/lib/utils';

type DashPeriod = 'day' | 'week' | 'month';

function startOf(period: DashPeriod): Date {
  const now = new Date();
  if (period === 'day') {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  if (period === 'week') {
    const d = new Date(now);
    d.setDate(d.getDate() - 6);
    d.setHours(0, 0, 0, 0);
    return d;
  }
  // month
  const d = new Date(now);
  d.setDate(d.getDate() - 29);
  d.setHours(0, 0, 0, 0);
  return d;
}

function buildDayBuckets(visits: VisitRecord[], period: DashPeriod) {
  const start = startOf(period);
  const filtered = visits.filter((v) => new Date(v.created_at) >= start);

  const buckets: Record<string, number> = {};
  const days = period === 'day' ? 1 : period === 'week' ? 7 : 30;

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
    buckets[key] = 0;
  }

  for (const v of filtered) {
    const d = new Date(v.created_at);
    const key = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
    if (key in buckets) buckets[key]++;
  }

  return Object.entries(buckets);
}

function inferTopCities(visits: VisitRecord[]) {
  const map = new Map<string, number>();
  for (const visit of visits) {
    const key =
      [visit.city, visit.region, visit.country].filter(Boolean).join(' - ') ||
      'Não identificado';
    map.set(key, (map.get(key) || 0) + 1);
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
}

function VisitChart({ visits }: { visits: VisitRecord[] }) {
  const [period, setPeriod] = useState<DashPeriod>('week');
  const buckets = useMemo(() => buildDayBuckets(visits, period), [visits, period]);
  const max = Math.max(...buckets.map(([, v]) => v), 1);
  const total = buckets.reduce((s, [, v]) => s + v, 0);

  return (
    <div className="chart-wrap">
      <div className="chart-header">
        <div>
          <span className="chart-total">{total}</span>
          <span className="chart-total-label"> visitas no período</span>
        </div>
        <div className="chart-tabs">
          {(['day', 'week', 'month'] as DashPeriod[]).map((p) => (
            <button
              key={p}
              className={`chart-tab${period === p ? ' active' : ''}`}
              onClick={() => setPeriod(p)}
            >
              {p === 'day' ? 'Hoje' : p === 'week' ? '7 dias' : '30 dias'}
            </button>
          ))}
        </div>
      </div>
      <div className="chart-bars">
        {buckets.map(([label, count]) => (
          <div key={label} className="chart-bar-col">
            <div className="chart-bar-track">
              <div
                className="chart-bar-fill"
                style={{ height: `${(count / max) * 100}%` }}
                title={`${count} visita(s)`}
              />
            </div>
            {(period === 'day' || buckets.length <= 7) && (
              <span className="chart-bar-label">{label}</span>
            )}
            {period !== 'day' && buckets.length > 7 && (
              <span className="chart-bar-label">
                {buckets.indexOf(buckets.find(([l]) => l === label)!) % 5 === 0 ? label : ''}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="toggle-label">
      <div className={`toggle-track${checked ? ' on' : ''}`} onClick={() => onChange(!checked)}>
        <div className="toggle-thumb" />
      </div>
      <span>{label}</span>
    </label>
  );
}

type AdminTab = 'conteudo' | 'videos' | 'secoes' | 'visitas';

export function AdminPanel({
  initialContent,
  initialVisits,
}: {
  initialContent: SiteContent;
  initialVisits: VisitRecord[];
}) {
  const [form, setForm] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [visits, setVisits] = useState(initialVisits);
  const [tab, setTab] = useState<AdminTab>('conteudo');

  const topCities = useMemo(() => inferTopCities(visits), [visits]);

  function updateField<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function saveContent() {
    try {
      setSaving(true);
      setMessage('');
      setError('');
      const response = await fetch('/api/site-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const payload = await response.json();
      setSaving(false);
      if (!response.ok) return setError(payload.error || 'Erro ao salvar.');
      setForm(payload.data);
      setMessage('Conteúdo salvo com sucesso!');
    } catch {
      setSaving(false);
      setError('Erro ao salvar conteúdo.');
    }
  }

  async function uploadImage(
    file: File | undefined,
    field: 'hero_logo_url' | 'banner_1_url' | 'banner_2_url' | 'banner_3_url'
  ) {
    if (!file) return;
    try {
      setUploadingField(field);
      setMessage('');
      setError('');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', field === 'hero_logo_url' ? 'branding' : 'banners');
      const response = await fetch('/api/upload-logo', { method: 'POST', body: formData });
      const payload = await response.json();
      setUploadingField(null);
      if (!response.ok) return setError(payload.error || 'Falha ao enviar a imagem.');
      updateField(field, payload.url);
      setMessage('Imagem enviada com sucesso. Clique em "Salvar alterações".');
    } catch {
      setUploadingField(null);
      setError('Erro no upload da imagem.');
    }
  }

  async function refreshVisits() {
    const response = await fetch('/api/visits?limit=500');
    const payload = await response.json();
    if (response.ok) setVisits(payload.data || []);
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }

  const totalVisits = visits.length;
  const todayVisits = visits.filter(
    (v) => new Date(v.created_at).toDateString() === new Date().toDateString()
  ).length;
  const uniqueIps = new Set(visits.map((v) => v.ip_address).filter(Boolean)).size;
  const weekVisits = visits.filter((v) => {
    const d = new Date(v.created_at);
    const w = new Date(); w.setDate(w.getDate() - 7);
    return d >= w;
  }).length;

  const TABS: { id: AdminTab; label: string; icon: string }[] = [
    { id: 'conteudo', label: 'Conteúdo', icon: '✏️' },
    { id: 'videos', label: 'Vídeos', icon: '🎬' },
    { id: 'secoes', label: 'Seções', icon: '🧩' },
    { id: 'visitas', label: 'Visitas', icon: '📊' },
  ];

  return (
    <div className="admin-page congepan-admin-bg">
      <div className="container">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1 style={{ margin: 0, fontSize: 38 }}>Painel Congepan</h1>
            <p className="lead" style={{ margin: '6px 0 0', fontSize: 16 }}>
              Edite textos, imagens, vídeos, seções e acompanhe visitas.
            </p>
          </div>
          <div className="action-row" style={{ marginTop: 0 }}>
            <a className="button button-secondary" href="/" target="_blank" rel="noreferrer">
              Ver site
            </a>
            <button className="button button-secondary" onClick={logout}>Sair</button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ marginBottom: 20 }}>
          <div className="stat-card">
            <span className="stat-label">Total de visitas</span>
            <div className="stat-value">{totalVisits}</div>
          </div>
          <div className="stat-card">
            <span className="stat-label">Hoje</span>
            <div className="stat-value">{todayVisits}</div>
          </div>
          <div className="stat-card">
            <span className="stat-label">Últimos 7 dias</span>
            <div className="stat-value">{weekVisits}</div>
          </div>
          <div className="stat-card">
            <span className="stat-label">IPs únicos</span>
            <div className="stat-value">{uniqueIps}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`admin-tab${tab === t.id ? ' active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {/* Mensagens */}
        {message && <p className="message-success" style={{ marginTop: 12 }}>{message}</p>}
        {error && <p className="message-error" style={{ marginTop: 12 }}>{error}</p>}

        {/* ── TAB: CONTEÚDO ── */}
        {tab === 'conteudo' && (
          <div className="admin-card" style={{ marginTop: 16 }}>
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
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="color" value={form.primary_color} onChange={(e) => updateField('primary_color', e.target.value)} style={{ width: 48, height: 36, padding: 2, borderRadius: 8, cursor: 'pointer' }} />
                  <input value={form.primary_color} onChange={(e) => updateField('primary_color', e.target.value)} style={{ flex: 1 }} />
                </div>
              </div>
              <div className="field">
                <label>Cor dourada</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="color" value={form.secondary_color} onChange={(e) => updateField('secondary_color', e.target.value)} style={{ width: 48, height: 36, padding: 2, borderRadius: 8, cursor: 'pointer' }} />
                  <input value={form.secondary_color} onChange={(e) => updateField('secondary_color', e.target.value)} style={{ flex: 1 }} />
                </div>
              </div>
              <div className="field">
                <label>Cor botão/CTA</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="color" value={form.accent_color} onChange={(e) => updateField('accent_color', e.target.value)} style={{ width: 48, height: 36, padding: 2, borderRadius: 8, cursor: 'pointer' }} />
                  <input value={form.accent_color} onChange={(e) => updateField('accent_color', e.target.value)} style={{ flex: 1 }} />
                </div>
              </div>
              <div className="field-full">
                <label>Logo (URL)</label>
                <input value={form.hero_logo_url || ''} onChange={(e) => updateField('hero_logo_url', e.target.value || null)} />
              </div>
              <div className="field-full">
                <label>Upload da logo</label>
                <input type="file" accept="image/*" onChange={(e) => uploadImage(e.target.files?.[0], 'hero_logo_url')} />
                <span className="small">{uploadingField === 'hero_logo_url' ? 'Enviando...' : 'Envie a logo por aqui.'}</span>
              </div>
              {(['banner_1_url', 'banner_2_url', 'banner_3_url'] as const).map((field, i) => (
                <div className="field-full" key={field}>
                  <label>Banner {i + 1} (URL)</label>
                  <input value={form[field] || ''} onChange={(e) => updateField(field, e.target.value || null)} />
                  <input type="file" accept="image/*" style={{ marginTop: 6 }} onChange={(e) => uploadImage(e.target.files?.[0], field)} />
                  <span className="small">{uploadingField === field ? 'Enviando...' : `Envie o banner ${i + 1} por aqui.`}</span>
                </div>
              ))}
              <div className="field-full"><label>Frase check 1</label><input value={form.bullet_1} onChange={(e) => updateField('bullet_1', e.target.value)} /></div>
              <div className="field-full"><label>Frase check 2</label><input value={form.bullet_2} onChange={(e) => updateField('bullet_2', e.target.value)} /></div>
              <div className="field-full"><label>Frase check 3</label><input value={form.bullet_3} onChange={(e) => updateField('bullet_3', e.target.value)} /></div>
              <div className="field"><label>Card 1 título</label><input value={form.card_1_title} onChange={(e) => updateField('card_1_title', e.target.value)} /></div>
              <div className="field"><label>Card 1 texto</label><input value={form.card_1_text} onChange={(e) => updateField('card_1_text', e.target.value)} /></div>
              <div className="field"><label>Card 2 título</label><input value={form.card_2_title} onChange={(e) => updateField('card_2_title', e.target.value)} /></div>
              <div className="field"><label>Card 2 texto</label><input value={form.card_2_text} onChange={(e) => updateField('card_2_text', e.target.value)} /></div>
              <div className="field"><label>Card 3 título</label><input value={form.card_3_title} onChange={(e) => updateField('card_3_title', e.target.value)} /></div>
              <div className="field"><label>Card 3 texto</label><input value={form.card_3_text} onChange={(e) => updateField('card_3_text', e.target.value)} /></div>
              <div className="field-full"><label>Título "Sobre"</label><input value={form.about_title} onChange={(e) => updateField('about_title', e.target.value)} /></div>
              <div className="field-full"><label>Texto "Sobre"</label><textarea value={form.about_text} onChange={(e) => updateField('about_text', e.target.value)} /></div>
              <div className="field-full"><label>Título CTA</label><input value={form.cta_title} onChange={(e) => updateField('cta_title', e.target.value)} /></div>
              <div className="field-full"><label>Texto CTA</label><textarea value={form.cta_text} onChange={(e) => updateField('cta_text', e.target.value)} /></div>
              <div className="field-full"><label>Texto do botão</label><input value={form.cta_button_text} onChange={(e) => updateField('cta_button_text', e.target.value)} /></div>
              <div className="field-full"><label>Rodapé</label><textarea value={form.footer_text} onChange={(e) => updateField('footer_text', e.target.value)} /></div>
              <div className="field-full"><label>Política de privacidade</label><textarea value={form.privacy_policy_text} onChange={(e) => updateField('privacy_policy_text', e.target.value)} /></div>
            </div>
            <div className="action-row" style={{ marginTop: 20 }}>
              <button className="button button-primary" style={{ background: '#0f7a3f' }} onClick={saveContent} disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </div>
          </div>
        )}

        {/* ── TAB: VÍDEOS ── */}
        {tab === 'videos' && (
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {([
              { n: 1, urlKey: 'video_1_url', titleKey: 'video_1_title', descKey: 'video_1_description', visKey: 'video_1_visible', label: 'Vídeo 1 — Apresentação da empresa', emoji: '🏢' },
              { n: 2, urlKey: 'video_2_url', titleKey: 'video_2_title', descKey: 'video_2_description', visKey: 'video_2_visible', label: 'Vídeo 2 — Depoimentos de clientes', emoji: '💬' },
              { n: 3, urlKey: 'video_3_url', titleKey: 'video_3_title', descKey: 'video_3_description', visKey: 'video_3_visible', label: 'Vídeo 3 — Qualidade do pão / Dúvidas', emoji: '🌟' },
            ] as const).map((v) => (
              <div className="admin-card" key={v.n}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <h3 style={{ margin: 0, fontSize: 18 }}>{v.emoji} {v.label}</h3>
                  <Toggle
                    checked={form[v.visKey] as boolean}
                    onChange={(val) => updateField(v.visKey, val)}
                    label={form[v.visKey] ? 'Visível' : 'Oculto'}
                  />
                </div>
                <div className="field-grid">
                  <div className="field-full">
                    <label>URL do vídeo (YouTube, Vimeo ou MP4)</label>
                    <input
                      value={(form[v.urlKey] as string | null) || ''}
                      onChange={(e) => updateField(v.urlKey, e.target.value || null)}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                    <span className="small">Cole o link do YouTube ou Vimeo aqui.</span>
                  </div>
                  <div className="field-full">
                    <label>Título do vídeo</label>
                    <input
                      value={form[v.titleKey] as string}
                      onChange={(e) => updateField(v.titleKey, e.target.value)}
                    />
                  </div>
                  <div className="field-full">
                    <label>Descrição (aparece ao lado do vídeo)</label>
                    <textarea
                      value={form[v.descKey] as string}
                      onChange={(e) => updateField(v.descKey, e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            ))}
            <div className="action-row">
              <button className="button button-primary" style={{ background: '#0f7a3f' }} onClick={saveContent} disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar vídeos'}
              </button>
            </div>
          </div>
        )}

        {/* ── TAB: SEÇÕES ── */}
        {tab === 'secoes' && (
          <div className="admin-card" style={{ marginTop: 16 }}>
            <h2 style={{ marginTop: 0 }}>Visibilidade das seções</h2>
            <p className="muted" style={{ marginBottom: 20 }}>Ative ou desative seções do site sem precisar apagar o conteúdo.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {([
                { key: 'section_cards_visible', label: '🃏 Cards de produtos (Tradicionais, Linha Extra, Pedido)' },
                { key: 'section_about_visible', label: '📖 Seção "Sobre" (Pão, Propósito e Paixão)' },
                { key: 'section_videos_visible', label: '🎬 Seção de Vídeos' },
                { key: 'section_cta_visible', label: '📲 Seção de CTA / WhatsApp' },
              ] as const).map((s) => (
                <div key={s.key} className="section-toggle-row">
                  <Toggle
                    checked={form[s.key] as boolean}
                    onChange={(val) => updateField(s.key, val)}
                    label={s.label}
                  />
                </div>
              ))}
            </div>
            <div className="action-row" style={{ marginTop: 24 }}>
              <button className="button button-primary" style={{ background: '#0f7a3f' }} onClick={saveContent} disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar configurações'}
              </button>
            </div>
          </div>
        )}

        {/* ── TAB: VISITAS ── */}
        {tab === 'visitas' && (
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="admin-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2 style={{ margin: 0 }}>Dashboard de visitas</h2>
                <button className="button button-secondary" onClick={refreshVisits}>Atualizar</button>
              </div>
              <VisitChart visits={visits} />
            </div>

            <div className="admin-grid">
              <div className="admin-card">
                <h2 style={{ marginTop: 0 }}>Top cidades</h2>
                <div className="visit-list">
                  {topCities.length === 0 && <p className="muted">Ainda não há visitas registradas.</p>}
                  {topCities.map(([city, count]) => (
                    <div className="visit-card" key={city} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: 14 }}>{city}</strong>
                      <div className="chip">{count} visita{count !== 1 ? 's' : ''}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="admin-card">
                <h2 style={{ marginTop: 0 }}>Últimas visitas</h2>
                <div className="visit-list">
                  {visits.length === 0 && <p className="muted">Nenhum acesso registrado ainda.</p>}
                  {visits.slice(0, 30).map((visit) => (
                    <div className="visit-card" key={visit.id}>
                      <div className="visit-top">
                        <div>
                          <strong>{visit.city || 'Cidade não identificada'}{visit.region ? `, ${visit.region}` : ''}</strong>
                          <div className="muted">{visit.country || 'País não identificado'}</div>
                        </div>
                        <div className="chip">{formatDateTime(visit.created_at)}</div>
                      </div>
                      <div className="field-grid" style={{ marginTop: 8 }}>
                        <div><span className="small">IP</span><div>{visit.ip_address || 'N/A'}</div></div>
                        <div><span className="small">Dispositivo</span><div>{visit.device_type || 'N/A'}</div></div>
                        <div><span className="small">Referer</span><div style={{ wordBreak: 'break-word' }}>{visit.referer || 'Direto'}</div></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
