import React, { useState, useEffect, useRef } from 'react';

// ─── Inline styles (no Tailwind needed) ────────────────────────────────────
const S = {
  // NAV
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 clamp(1.5rem, 5vw, 4rem)',
    height: '68px',
    background: 'rgba(7,7,13,0.85)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(100,80,255,0.1)',
  },
  navLogo: {
    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.15rem',
    background: 'linear-gradient(135deg, #fff 30%, #8b6fff)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.02em',
  },
  navBtn: {
    padding: '0.5rem 1.4rem', borderRadius: '8px',
    background: 'var(--accent)', color: '#fff', fontFamily: 'var(--font-body)',
    fontWeight: 500, fontSize: '0.88rem', border: 'none', cursor: 'pointer',
    transition: 'background 0.2s, transform 0.15s',
    letterSpacing: '0.01em',
  },

  // HERO
  hero: {
    minHeight: '100vh', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: 'clamp(6rem, 12vh, 10rem) clamp(1.5rem, 5vw, 4rem) 4rem',
    textAlign: 'center', position: 'relative', overflow: 'hidden',
  },
  heroBadge: {
    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
    padding: '0.4rem 1rem', borderRadius: '100px',
    border: '1px solid var(--border-bright)',
    background: 'rgba(100,80,255,0.08)',
    color: 'var(--accent2)', fontFamily: 'var(--font-body)',
    fontSize: '0.8rem', fontWeight: 500, marginBottom: '2rem',
    letterSpacing: '0.04em', textTransform: 'uppercase',
  },
  heroH1: {
    fontFamily: 'var(--font-display)', fontWeight: 800,
    fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', lineHeight: 1.06,
    letterSpacing: '-0.03em', marginBottom: '1.5rem',
    background: 'linear-gradient(160deg, #ffffff 40%, #8b6fff 75%, #6450ff)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    maxWidth: '860px',
  },
  heroSub: {
    fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'var(--text-muted)',
    maxWidth: '560px', lineHeight: 1.7, marginBottom: '2.8rem',
    fontWeight: 300,
  },
  heroCta: {
    padding: '1rem 2.4rem', borderRadius: '12px',
    background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
    color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 700,
    fontSize: '1.05rem', border: 'none', cursor: 'pointer',
    boxShadow: '0 0 40px var(--accent-glow)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    letterSpacing: '-0.01em',
  },

  // HOW IT WORKS
  section: {
    padding: 'clamp(5rem, 10vh, 8rem) clamp(1.5rem, 5vw, 4rem)',
    maxWidth: '1200px', margin: '0 auto',
  },
  sectionLabel: {
    fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 500,
    textTransform: 'uppercase', letterSpacing: '0.1em',
    color: 'var(--accent2)', marginBottom: '0.75rem',
  },
  sectionTitle: {
    fontFamily: 'var(--font-display)', fontWeight: 800,
    fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.03em',
    marginBottom: '3rem', color: 'var(--text)',
  },
  cardsRow: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    background: 'var(--card)', borderRadius: '16px',
    border: '1px solid var(--border)',
    padding: '2rem', transition: 'border-color 0.2s, transform 0.2s',
  },
  cardNum: {
    fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800,
    color: 'var(--accent)', opacity: 0.4, lineHeight: 1, marginBottom: '1rem',
  },
  cardTitle: {
    fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700,
    color: 'var(--text)', marginBottom: '0.6rem', letterSpacing: '-0.01em',
  },
  cardDesc: { fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.65 },

  // FORM SECTION
  formSection: {
    background: 'var(--bg2)',
    borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
    padding: 'clamp(5rem, 10vh, 8rem) clamp(1.5rem, 5vw, 4rem)',
  },
  formInner: { maxWidth: '1200px', margin: '0 auto' },
  textareaGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1.5rem', marginBottom: '2rem',
  },
  textareaWrap: { display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  label: {
    fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 700,
    color: 'var(--text)', letterSpacing: '-0.01em',
  },
  textarea: {
    background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: '12px', color: 'var(--text)', fontFamily: 'var(--font-body)',
    fontSize: '0.9rem', lineHeight: 1.65, padding: '1.1rem',
    resize: 'vertical', minHeight: '320px', outline: 'none',
    transition: 'border-color 0.2s',
    '&:focus': { borderColor: 'var(--accent)' },
  },
  generateBtn: {
    width: '100%', padding: '1.1rem',
    background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
    borderRadius: '12px', color: '#fff', fontFamily: 'var(--font-display)',
    fontWeight: 700, fontSize: '1.05rem', border: 'none', cursor: 'pointer',
    boxShadow: '0 0 30px var(--accent-glow)',
    transition: 'opacity 0.2s, transform 0.15s',
    letterSpacing: '-0.01em',
  },
  generateBtnDisabled: {
    opacity: 0.45, cursor: 'not-allowed', boxShadow: 'none',
  },

  // STATUS
  statusBox: {
    marginTop: '1.5rem', padding: '1.5rem', borderRadius: '12px',
    background: 'var(--card)', border: '1px solid var(--border)',
  },
  statusLine: {
    display: 'flex', alignItems: 'center', gap: '0.8rem',
    color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.4rem',
  },
  statusLineDone: { color: 'var(--success)' },
  statusLineCurrent: { color: 'var(--text)' },

  // SUCCESS CARD
  successCard: {
    marginTop: '1.5rem', padding: '2rem', borderRadius: '12px',
    background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.25)',
  },
  successTitle: {
    display: 'flex', alignItems: 'center', gap: '0.6rem',
    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem',
    color: 'var(--success)', marginBottom: '1.2rem',
  },
  downloadBtn: {
    padding: '0.85rem 2rem', borderRadius: '10px',
    background: 'var(--success)', color: '#fff', fontFamily: 'var(--font-display)',
    fontWeight: 700, fontSize: '0.95rem', border: 'none', cursor: 'pointer',
    marginRight: '1rem', transition: 'opacity 0.2s',
  },
  overleafLink: {
    color: 'var(--accent2)', fontFamily: 'var(--font-body)', fontSize: '0.9rem',
    textDecoration: 'underline', cursor: 'pointer',
  },

  // ERROR CARD
  errorCard: {
    marginTop: '1.5rem', padding: '1.5rem', borderRadius: '12px',
    background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)',
  },
  errorTitle: {
    display: 'flex', alignItems: 'center', gap: '0.6rem',
    fontFamily: 'var(--font-display)', fontWeight: 700,
    color: 'var(--error)', marginBottom: '0.6rem',
  },
  errorMsg: { color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' },
  retryBtn: {
    padding: '0.6rem 1.4rem', borderRadius: '8px',
    border: '1px solid var(--error)', background: 'transparent',
    color: 'var(--error)', fontFamily: 'var(--font-body)', fontSize: '0.88rem',
    cursor: 'pointer', transition: 'background 0.2s',
  },

  // FOOTER
  footer: {
    padding: '2.5rem clamp(1.5rem, 5vw, 4rem)',
    textAlign: 'center', borderTop: '1px solid var(--border)',
    color: 'var(--text-dim)', fontSize: '0.82rem', lineHeight: 1.8,
  },
};

// ─── Spinner ──────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" style={{ animation: 'spin 0.8s linear infinite', flexShrink: 0 }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="9" cy="9" r="7" fill="none" stroke="var(--accent2)" strokeWidth="2" strokeDasharray="30" strokeDashoffset="10" />
    </svg>
  );
}

// ─── Background grid ──────────────────────────────────────────────────────
function GridBg() {
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
      backgroundImage: `
        radial-gradient(ellipse 80% 60% at 50% 0%, rgba(100,80,255,0.18) 0%, transparent 70%),
        linear-gradient(rgba(100,80,255,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(100,80,255,0.04) 1px, transparent 1px)
      `,
      backgroundSize: '100% 100%, 60px 60px, 60px 60px',
    }} />
  );
}

const STEPS = [
  'Analyzing job description…',
  'Rewriting resume with Claude…',
  'Converting to LaTeX…',
  'Compiling PDF on Overleaf…',
  'Done!',
];

// ─── Main App ─────────────────────────────────────────────────────────────
export default function App() {
  const [jd, setJd] = useState('');
  const [resume, setResume] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [currentStep, setCurrentStep] = useState(-1);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [errorProjectUrl, setErrorProjectUrl] = useState(null);
  const formRef = useRef(null);

  const canSubmit = jd.trim().length > 0 && resume.trim().length > 0 && status !== 'loading';

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const handleGenerate = async () => {
    if (!canSubmit) return;
    setStatus('loading');
    setResult(null);
    setErrorMsg('');
    setErrorProjectUrl(null);
    setCurrentStep(0);

    // Simulate step progression while waiting
    const stepTimers = [1200, 2500, 4500, 6000];
    const timers = stepTimers.map((delay, i) =>
      setTimeout(() => setCurrentStep(i + 1), delay)
    );

    try {
      const resp = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: jd, currentResume: resume }),
      });

      timers.forEach(clearTimeout);
      const data = await resp.json();

      if (data.status === 'success') {
        setCurrentStep(4);
        setResult(data);
        setStatus('success');
      } else {
        throw Object.assign(new Error(data.message || 'Unknown error'), { projectUrl: data.projectUrl });
      }
    } catch (err) {
      timers.forEach(clearTimeout);
      setErrorMsg(err.message);
      setErrorProjectUrl(err.projectUrl || null);
      setStatus('error');
    }
  };

  const handleDownload = () => {
    if (!result?.pdfBase64) return;
    const bytes = atob(result.pdfBase64);
    const arr = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
    const blob = new Blob([arr], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'tailored_resume.pdf'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* NAV */}
      <nav style={S.nav}>
        <span style={S.navLogo}>ATS Resume Tailor</span>
        <button style={S.navBtn} onClick={scrollToForm}
          onMouseEnter={e => e.target.style.background = 'var(--accent2)'}
          onMouseLeave={e => e.target.style.background = 'var(--accent)'}>
          Generate Resume
        </button>
      </nav>

      {/* HERO */}
      <section style={S.hero}>
        <GridBg />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={S.heroBadge}>
            <span>✦</span> Powered by Claude AI
          </div>
          <h1 style={S.heroH1}>Beat the ATS.<br />Land the interview.</h1>
          <p style={S.heroSub}>
            Paste your resume and a job description. Get a perfectly tailored, keyword-optimized,
            recruiter-ready PDF in under a minute — powered by Claude.
          </p>
          <button style={S.heroCta} onClick={scrollToForm}
            onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 0 60px var(--accent-glow)'; }}
            onMouseLeave={e => { e.target.style.transform = ''; e.target.style.boxShadow = '0 0 40px var(--accent-glow)'; }}>
            Tailor My Resume →
          </button>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <div style={S.section}>
        <div style={S.sectionLabel}>The Process</div>
        <h2 style={S.sectionTitle}>Three steps to your dream job</h2>
        <div style={S.cardsRow}>
          {[
            ['01', 'Paste your resume & the JD', 'Drop your current resume and the full job description into the two text fields below.'],
            ['02', 'Claude rewrites & optimizes', 'Our AI rewrites your resume from scratch — injecting every keyword the ATS is scanning for.'],
            ['03', 'Download your tailored PDF', 'Receive a beautifully formatted, one-page PDF compiled with LaTeX. Ready to submit.'],
          ].map(([num, title, desc]) => (
            <div key={num} style={S.card}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-bright)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = ''; }}>
              <div style={S.cardNum}>{num}</div>
              <div style={S.cardTitle}>{title}</div>
              <div style={S.cardDesc}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* GENERATOR FORM */}
      <div id="generator" ref={formRef} style={S.formSection}>
        <div style={S.formInner}>
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={S.sectionLabel}>AI Resume Generator</div>
            <h2 style={S.sectionTitle}>Generate your tailored resume</h2>
          </div>

          <div style={S.textareaGrid}>
            <div style={S.textareaWrap}>
              <label style={S.label}>Job Description</label>
              <textarea
                style={{ ...S.textarea, ...(jd ? { borderColor: 'var(--border-bright)' } : {}) }}
                placeholder="Paste the full job description here…"
                value={jd}
                onChange={e => setJd(e.target.value)}
                disabled={status === 'loading'}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = jd ? 'var(--border-bright)' : 'var(--border)'}
              />
            </div>
            <div style={S.textareaWrap}>
              <label style={S.label}>Your Current Resume</label>
              <textarea
                style={{ ...S.textarea, ...(resume ? { borderColor: 'var(--border-bright)' } : {}) }}
                placeholder="Paste your current resume text here…"
                value={resume}
                onChange={e => setResume(e.target.value)}
                disabled={status === 'loading'}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = resume ? 'var(--border-bright)' : 'var(--border)'}
              />
            </div>
          </div>

          <button
            style={{ ...S.generateBtn, ...(canSubmit ? {} : S.generateBtnDisabled) }}
            disabled={!canSubmit}
            onClick={handleGenerate}
            onMouseEnter={e => canSubmit && (e.target.style.transform = 'translateY(-1px)')}
            onMouseLeave={e => (e.target.style.transform = '')}>
            {status === 'loading' ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}>
                <Spinner /> Processing…
              </span>
            ) : 'Generate ATS Resume'}
          </button>

          {/* STATUS STEPS */}
          {status === 'loading' && (
            <div style={S.statusBox}>
              {STEPS.map((step, i) => {
                const done = i < currentStep;
                const current = i === currentStep;
                return (
                  <div key={i} style={{
                    ...S.statusLine,
                    ...(done ? S.statusLineDone : {}),
                    ...(current ? S.statusLineCurrent : {}),
                    opacity: i > currentStep ? 0.35 : 1,
                  }}>
                    {done ? '✓' : current ? <Spinner /> : '○'}
                    <span>{step}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* SUCCESS */}
          {status === 'success' && result && (
            <div style={S.successCard}>
              <div style={S.successTitle}>
                <span>✅</span> Your tailored resume is ready.
              </div>
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <button style={S.downloadBtn} onClick={handleDownload}
                  onMouseEnter={e => e.target.style.opacity = '0.85'}
                  onMouseLeave={e => e.target.style.opacity = '1'}>
                  ⬇ Download PDF
                </button>
                {result.projectUrl && (
                  <a href={result.projectUrl} target="_blank" rel="noopener noreferrer" style={S.overleafLink}>
                    Open project in Overleaf ↗
                  </a>
                )}
              </div>
            </div>
          )}

          {/* ERROR */}
          {status === 'error' && (
            <div style={S.errorCard}>
              <div style={S.errorTitle}>⚠ Something went wrong</div>
              <div style={S.errorMsg}>{errorMsg}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <button style={S.retryBtn} onClick={() => setStatus('idle')}
                  onMouseEnter={e => e.target.style.background = 'rgba(239,68,68,0.1)'}
                  onMouseLeave={e => e.target.style.background = 'transparent'}>
                  Try again
                </button>
                {errorProjectUrl && (
                  <a href={errorProjectUrl} target="_blank" rel="noopener noreferrer" style={S.overleafLink}>
                    View LaTeX on Overleaf ↗
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <footer style={S.footer}>
        <div>© {new Date().getFullYear()} ATS Resume Tailor. All rights reserved.</div>
        <div style={{ marginTop: '0.3rem', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
          Your resume and job description are processed in-memory and never stored.
        </div>
      </footer>
    </>
  );
}
