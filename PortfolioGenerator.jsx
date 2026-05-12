// src/PortfolioGenerator.jsx
import React, { useState, useRef } from 'react';

/* ─── Inject Google Fonts once ─── */
(function () {
  if (document.getElementById('folio-fonts')) return;
  const l = document.createElement('link');
  l.id = 'folio-fonts';
  l.rel = 'stylesheet';
  l.href =
    'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap';
  document.head.appendChild(l);
})();

/* ─── Global styles ─── */
const CSS = `
  .folio-app { min-height:100vh; background:#0d0d0d; color:#e8e2d6; font-family:'DM Sans',sans-serif; }
  .folio-nav { border-bottom:1px solid #222; padding:18px 40px; display:flex; align-items:center; justify-content:space-between; }
  .folio-logo { font-family:'Playfair Display',serif; font-size:20px; font-weight:700; letter-spacing:-0.5px; color:#e8e2d6; }
  .folio-logo span { color:#c8a96e; }
  .folio-badge { font-family:'DM Mono',monospace; font-size:11px; color:#555; letter-spacing:1px; text-transform:uppercase; }

  .folio-form-stage { max-width:760px; margin:0 auto; padding:60px 40px 100px; }
  .folio-headline { font-family:'Playfair Display',serif; font-size:clamp(38px,6vw,68px); font-weight:900; line-height:1.0; color:#e8e2d6; margin-bottom:12px; letter-spacing:-2px; }
  .folio-headline em { font-style:italic; color:#c8a96e; }
  .folio-sub { font-size:15px; color:#555; margin-bottom:48px; font-weight:300; }

  .folio-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
  .folio-group { display:flex; flex-direction:column; gap:8px; }
  .folio-group.full { grid-column:1/-1; }
  .folio-group.divider { grid-column:1/-1; border-top:1px solid #1a1a1a; padding-top:28px; margin-top:8px; }
  .folio-group.half-divider { border-top:1px solid #1a1a1a; padding-top:28px; margin-top:8px; }
  .folio-group label { font-family:'DM Mono',monospace; font-size:11px; color:#666; letter-spacing:1.2px; text-transform:uppercase; }
  .folio-group input, .folio-group textarea {
    background:#111; border:1px solid #222; border-radius:6px; color:#e8e2d6;
    font-family:'DM Sans',sans-serif; font-size:14px; padding:12px 14px;
    outline:none; transition:border-color 0.2s; width:100%; resize:vertical;
  }
  .folio-group input:focus, .folio-group textarea:focus { border-color:#c8a96e; }
  .folio-group input::placeholder, .folio-group textarea::placeholder { color:#2e2e2e; }

  .folio-tone-row { display:flex; gap:10px; flex-wrap:wrap; }
  .folio-tone-btn { background:#111; border:1px solid #222; border-radius:20px; color:#777; font-family:'DM Sans',sans-serif; font-size:13px; padding:7px 16px; cursor:pointer; transition:all 0.15s; }
  .folio-tone-btn:hover { border-color:#444; color:#aaa; }
  .folio-tone-btn.active { background:#1a1508; border-color:#c8a96e; color:#c8a96e; }

  .folio-generate-btn { margin-top:36px; background:#c8a96e; border:none; border-radius:6px; color:#0d0d0d; font-family:'DM Sans',sans-serif; font-size:15px; font-weight:600; padding:15px 36px; cursor:pointer; transition:all 0.2s; display:inline-flex; align-items:center; gap:10px; }
  .folio-generate-btn:hover { background:#debb82; transform:translateY(-1px); }
  .folio-generate-btn:active { transform:translateY(0); }
  .folio-generate-btn:disabled { opacity:0.5; cursor:not-allowed; transform:none; }

  .folio-error { background:#1a0808; border:1px solid #3a1010; border-radius:8px; color:#c88; font-family:'DM Mono',monospace; font-size:13px; padding:14px 18px; margin-top:16px; }

  .folio-loading { min-height:80vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:20px; }
  .folio-spinner { width:44px; height:44px; border:2px solid #222; border-top-color:#c8a96e; border-radius:50%; animation:folio-spin 0.9s linear infinite; }
  @keyframes folio-spin { to { transform:rotate(360deg); } }
  .folio-loading-text { font-family:'DM Mono',monospace; font-size:12px; color:#444; letter-spacing:1px; }
  .folio-dots::after { content:''; animation:folio-dots 1.5s steps(4,end) infinite; }
  @keyframes folio-dots { 0%,100%{content:''} 25%{content:'.'} 50%{content:'..'} 75%{content:'...'} }

  .folio-output-stage { max-width:900px; margin:0 auto; padding:40px 40px 100px; }
  .folio-toolbar { display:flex; align-items:center; justify-content:space-between; margin-bottom:36px; }
  .folio-toolbar-label { font-family:'DM Mono',monospace; font-size:11px; color:#444; letter-spacing:1.2px; text-transform:uppercase; }
  .folio-toolbar-actions { display:flex; gap:10px; }
  .folio-action-btn { background:#111; border:1px solid #222; border-radius:6px; color:#777; font-family:'DM Sans',sans-serif; font-size:13px; padding:8px 16px; cursor:pointer; transition:all 0.15s; display:inline-flex; align-items:center; gap:6px; }
  .folio-action-btn:hover { border-color:#444; color:#ccc; }
  .folio-action-btn.primary { background:#1a1508; border-color:#c8a96e; color:#c8a96e; }
  .folio-action-btn.primary:hover { background:#241e0a; }
  .folio-action-btn.success { background:#0a180a; border-color:#4a8a4a; color:#7ac97a; }

  .p-card { background:#111; border:1px solid #1e1e1e; border-radius:16px; overflow:hidden; }
  .p-hero { padding:60px 60px 48px; border-bottom:1px solid #1a1a1a; position:relative; }
  .p-hero::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,#9e7a3e,#c8a96e,#e8c88a,#c8a96e,#9e7a3e); }
  .p-name { font-family:'Playfair Display',serif; font-size:clamp(40px,7vw,76px); font-weight:900; line-height:1.0; color:#e8e2d6; letter-spacing:-2px; margin-bottom:10px; }
  .p-title { font-family:'DM Mono',monospace; font-size:13px; color:#c8a96e; letter-spacing:2.5px; text-transform:uppercase; margin-bottom:28px; }
  .p-tagline { font-family:'Playfair Display',serif; font-size:clamp(17px,2.5vw,24px); font-style:italic; color:#777; font-weight:400; line-height:1.55; max-width:600px; }

  .p-body { display:grid; grid-template-columns:1fr 1fr; }
  .p-section { padding:36px 48px; border-right:1px solid #1a1a1a; border-bottom:1px solid #1a1a1a; }
  .p-section:nth-child(even) { border-right:none; }
  .p-section.full { grid-column:1/-1; border-right:none; }
  .p-section-label { font-family:'DM Mono',monospace; font-size:10px; color:#444; letter-spacing:2px; text-transform:uppercase; margin-bottom:16px; }
  .p-section-content { font-size:14px; color:#888; line-height:1.8; font-weight:300; }

  .p-chips { display:flex; flex-wrap:wrap; gap:8px; }
  .p-chip { background:#161616; border:1px solid #252525; border-radius:4px; color:#777; font-family:'DM Mono',monospace; font-size:12px; padding:5px 11px; }

  .p-project { margin-bottom:22px; padding-bottom:22px; border-bottom:1px solid #1a1a1a; }
  .p-project:last-child { margin-bottom:0; padding-bottom:0; border-bottom:none; }
  .p-project-name { font-family:'Playfair Display',serif; font-size:17px; font-weight:700; color:#c8b89a; margin-bottom:7px; }
  .p-project-desc { font-size:13px; color:#5a5a5a; line-height:1.7; font-weight:300; }

  .p-contact { display:flex; flex-direction:column; gap:11px; }
  .p-contact-row { display:flex; align-items:center; gap:14px; }
  .p-contact-key { font-family:'DM Mono',monospace; font-size:11px; color:#3a3a3a; width:72px; }
  .p-contact-val { font-size:13px; color:#777; }

  .p-footer { padding:22px 48px; border-top:1px solid #1a1a1a; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; }
  .p-footer-note { font-family:'DM Mono',monospace; font-size:11px; color:#2e2e2e; }
  .p-footer-cta { font-family:'Playfair Display',serif; font-size:14px; font-style:italic; color:#c8a96e; }

  @media (max-width:600px) {
    .folio-nav { padding:14px 20px; }
    .folio-form-stage { padding:40px 20px 60px; }
    .folio-grid { grid-template-columns:1fr; }
    .folio-output-stage { padding:24px 16px 60px; }
    .p-hero { padding:36px 28px 32px; }
    .p-body { grid-template-columns:1fr; }
    .p-section { border-right:none; padding:28px; }
    .p-footer { padding:18px 28px; }
  }
`;

(function () {
  if (document.getElementById('folio-styles')) return;
  const s = document.createElement('style');
  s.id = 'folio-styles';
  s.textContent = CSS;
  document.head.appendChild(s);
})();

const TONES = ['Professional', 'Creative', 'Technical', 'Bold & Direct', 'Warm & Human'];

const BLANK = {
  name:'', title:'', bio:'', skills:'',
  project1Name:'', project1Desc:'',
  project2Name:'', project2Desc:'',
  project3Name:'', project3Desc:'',
  email:'', github:'', linkedin:'', website:'',
};

export default function PortfolioGenerator() {
  const [stage, setStage]       = useState('form');
  const [form, setForm]         = useState(BLANK);
  const [tone, setTone]         = useState('Professional');
  const [portfolio, setPortfolio] = useState(null);
  const [error, setError]       = useState('');
  const [copied, setCopied]     = useState(false);
  const cardRef = useRef(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const prompt = () => {
    const proj = [1,2,3].map(n =>
      form[`project${n}Name`] && `- ${form[`project${n}Name`]}: ${form[`project${n}Desc`] || 'No description'}`
    ).filter(Boolean).join('\n') || 'None';

    return `You are a world-class portfolio copywriter.
NAME: ${form.name}
TITLE: ${form.title}
BIO: ${form.bio || 'Not provided'}
SKILLS: ${form.skills || 'Not provided'}
PROJECTS:\n${proj}
CONTACT: email=${form.email} github=${form.github} linkedin=${form.linkedin} website=${form.website}
TONE: ${tone}

Return ONLY valid JSON (no markdown, no backticks):
{
  "tagline": "One evocative sentence, max 18 words, no clichés",
  "about": "3-4 compelling sentences in ${tone} tone",
  "skills": ["chip-sized strings, max 20 chars each"],
  "projects": [{"name":"...","description":"2-3 sentences on impact and tech"}],
  "ctaLine": "Short collaboration invite, max 12 words"
}
Omit projects with no name. No filler.`;
  };

  const generate = async () => {
    if (!form.name.trim() || !form.title.trim()) {
      setError('Please provide at least your Name and Professional Title.');
      return;
    }
    setError('');
    setStage('loading');
    try {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt() }],
        }),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const d = await r.json();
      const raw = (d.content?.find(b => b.type === 'text')?.text || '').trim();
      const parsed = JSON.parse(raw.replace(/^```(?:json)?|```$/gm, '').trim());
      setPortfolio({ ...parsed, form: { ...form } });
      setStage('output');
    } catch (e) {
      console.error(e);
      setError('Generation failed — please try again. Check console for details.');
      setStage('form');
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(cardRef.current?.innerText || '').catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="folio-app">
      <nav className="folio-nav">
        <div className="folio-logo">folio<span>.</span>ai</div>
        <div className="folio-badge">AI Portfolio Generator</div>
      </nav>

      {stage === 'form' && (
        <div className="folio-form-stage">
          <h1 className="folio-headline">Your story,<br /><em>beautifully</em> told.</h1>
          <p className="folio-sub">Fill in your details — Claude crafts a compelling portfolio in seconds.</p>

          <div className="folio-grid">
            <div className="folio-group">
              <label>Full Name *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Alex Johnson" />
            </div>
            <div className="folio-group">
              <label>Professional Title *</label>
              <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Full-Stack Engineer" />
            </div>
            <div className="folio-group full">
              <label>Bio / Background</label>
              <textarea rows={4} value={form.bio} onChange={e => set('bio', e.target.value)} placeholder="Your journey, passions, experience..." />
            </div>
            <div className="folio-group full">
              <label>Skills (comma-separated)</label>
              <input value={form.skills} onChange={e => set('skills', e.target.value)} placeholder="React, TypeScript, Node.js, AWS..." />
            </div>

            {[1, 2, 3].map(n => (
              <React.Fragment key={n}>
                <div className={`folio-group full${n === 1 ? ' divider' : ''}`}>
                  <label>Project {n} — Name</label>
                  <input value={form[`project${n}Name`]} onChange={e => set(`project${n}Name`, e.target.value)} placeholder="Project name" />
                </div>
                <div className="folio-group full">
                  <label>Project {n} — Description</label>
                  <textarea rows={2} value={form[`project${n}Desc`]} onChange={e => set(`project${n}Desc`, e.target.value)} placeholder="What did you build? What was the impact?" />
                </div>
              </React.Fragment>
            ))}

            <div className="folio-group half-divider">
              <label>Email</label>
              <input value={form.email} onChange={e => set('email', e.target.value)} placeholder="alex@example.com" />
            </div>
            <div className="folio-group half-divider">
              <label>GitHub</label>
              <input value={form.github} onChange={e => set('github', e.target.value)} placeholder="github.com/alexj" />
            </div>
            <div className="folio-group">
              <label>LinkedIn</label>
              <input value={form.linkedin} onChange={e => set('linkedin', e.target.value)} placeholder="linkedin.com/in/alexj" />
            </div>
            <div className="folio-group">
              <label>Website</label>
              <input value={form.website} onChange={e => set('website', e.target.value)} placeholder="alexjohnson.dev" />
            </div>

            <div className="folio-group full divider">
              <label>Tone</label>
              <div className="folio-tone-row">
                {TONES.map(t => (
                  <button key={t} className={`folio-tone-btn${tone === t ? ' active' : ''}`} onClick={() => setTone(t)}>{t}</button>
                ))}
              </div>
            </div>
          </div>

          {error && <div className="folio-error">{error}</div>}
          <button className="folio-generate-btn" onClick={generate}>✦ Generate My Portfolio</button>
        </div>
      )}

      {stage === 'loading' && (
        <div className="folio-loading">
          <div className="folio-spinner" />
          <div className="folio-loading-text">Crafting your portfolio<span className="folio-dots" /></div>
        </div>
      )}

      {stage === 'output' && portfolio && (
        <div className="folio-output-stage">
          <div className="folio-toolbar">
            <div className="folio-toolbar-label">✦ Your Portfolio</div>
            <div className="folio-toolbar-actions">
              <button className="folio-action-btn" onClick={() => { setStage('form'); setPortfolio(null); }}>← Edit</button>
              <button className={`folio-action-btn ${copied ? 'success' : 'primary'}`} onClick={copy}>
                {copied ? '✓ Copied!' : '⎘ Copy Text'}
              </button>
            </div>
          </div>

          <div className="p-card" ref={cardRef}>
            <div className="p-hero">
              <div className="p-name">{portfolio.form.name}</div>
              <div className="p-title">{portfolio.form.title}</div>
              <div className="p-tagline">"{portfolio.tagline}"</div>
            </div>

            <div className="p-body">
              <div className="p-section full">
                <div className="p-section-label">About</div>
                <div className="p-section-content">{portfolio.about}</div>
              </div>

              {portfolio.skills?.length > 0 && (
                <div className="p-section">
                  <div className="p-section-label">Skills & Tools</div>
                  <div className="p-chips">
                    {portfolio.skills.map((s, i) => <span key={i} className="p-chip">{s}</span>)}
                  </div>
                </div>
              )}

              <div className="p-section">
                <div className="p-section-label">Contact</div>
                <div className="p-contact">
                  {[['Email', portfolio.form.email], ['GitHub', portfolio.form.github],
                    ['LinkedIn', portfolio.form.linkedin], ['Website', portfolio.form.website]]
                    .filter(([, v]) => v)
                    .map(([k, v]) => (
                      <div key={k} className="p-contact-row">
                        <span className="p-contact-key">{k}</span>
                        <span className="p-contact-val">{v}</span>
                      </div>
                    ))}
                </div>
              </div>

              {portfolio.projects?.length > 0 && (
                <div className="p-section full">
                  <div className="p-section-label">Selected Work</div>
                  {portfolio.projects.map((p, i) => (
                    <div key={i} className="p-project">
                      <div className="p-project-name">{p.name}</div>
                      <div className="p-project-desc">{p.description}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-footer">
              <div className="p-footer-note">Generated with folio.ai × Claude</div>
              <div className="p-footer-cta">{portfolio.ctaLine}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
