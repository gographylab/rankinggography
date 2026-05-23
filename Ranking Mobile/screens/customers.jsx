/* global React, Nav, PageCover, SectionHeader, Footer, Marquee, BottomNav */

function ScreenForCustomers({ theme = 'light', onToggleTheme }) {
  const dark = theme === 'dark';

  const rewards = [
    { t: 'Print credit',  v: '฿800',  d: 'Toward a fine-art print of any winning frame' },
    { t: 'Travel cashback', v: '5%',  d: 'On accommodation bookings via partner stays' },
    { t: 'Season tote',   v: 'Free', d: 'Limited-run cotton tote for top 100 voters' },
  ];

  const rules = [
    { n: '01', t: '1 like, 1 vote',     b: 'No anonymous accounts.' },
    { n: '02', t: 'Weight decays',      b: 'Likes in first 24h count 3×.' },
    { n: '03', t: 'No vote trading',    b: 'Detected rings get flagged.' },
    { n: '04', t: 'One season',          b: 'Pulse resets each cycle.' },
  ];

  const steps = [
    { n: '01', t: 'Browse', b: 'Open Explore. Sort by Fresh or Hirest. Filter by category if you like.' },
    { n: '02', t: 'Pulse',  b: 'Tap the heart on frames that move you. Within 24h, your like counts more.' },
    { n: '03', t: 'Claim',  b: 'After Season close, top 100 voters get the season tote + ฿800 print credit.' },
  ];

  return (
    <div className="screen">
      <Nav dark={dark} theme={theme} onToggleTheme={onToggleTheme} />
      <PageCover
        eyebrow="— For Customers"
        title="Vote with your eye. Get something back."
        sub="Your likes shape the season ranking — and earn rewards."
        height={400}
        label="for customers cover"
      />

      {/* Rewards — desktop 3-col → mobile 1-col */}
      <section style={{ padding: '40px 16px 0' }}>
        <SectionHeader num="01 / Rewards" title="What you take home" />
        <div style={{ marginTop: 18, display: 'grid', gap: 0, border: '1px solid var(--line-strong)' }}>
          {rewards.map((r, i, a) => (
            <div key={r.t} style={{
              padding: 18,
              borderBottom: i < a.length - 1 ? '1px solid var(--line)' : 0,
              display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'baseline', gap: 12,
            }}>
              <div>
                <h3 style={{
                  margin: 0,
                  fontFamily: 'Playfair Display, serif', fontWeight: 700,
                  fontSize: 22, letterSpacing: '-0.01em',
                }}>{r.t}</h3>
                <p style={{ margin: '6px 0 0', fontSize: 13, lineHeight: 1.55, color: 'var(--muted)' }}>{r.d}</p>
              </div>
              <div className="mono" style={{ fontSize: 20, fontWeight: 500 }}>{r.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Rules — desktop 4-col → mobile 2-col */}
      <section style={{ padding: '56px 0 0', background: 'var(--cream)' }}>
        <div style={{ padding: '40px 16px 0' }}>
          <SectionHeader num="02 / Rules" title="Four lines, no asterisks" />
        </div>
        <div style={{
          padding: '20px 16px 40px',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
          margin: '20px 16px 40px',
          marginLeft: 16, marginRight: 16,
          border: '1px solid var(--line-strong)',
        }}>
          {rules.map((r, i) => (
            <div key={r.n} style={{
              padding: 16,
              background: 'var(--bg)',
              borderRight: i % 2 === 0 ? '1px solid var(--line)' : 0,
              borderBottom: i < 2 ? '1px solid var(--line)' : 0,
            }}>
              <div className="mono" style={{ fontSize: 14, fontWeight: 500 }}>{r.n}</div>
              <div style={{
                fontFamily: 'Playfair Display, serif', fontWeight: 700,
                fontSize: 17, letterSpacing: '-0.01em', lineHeight: 1.2,
                marginTop: 8,
              }}>{r.t}</div>
              <div style={{ fontSize: 12, lineHeight: 1.45, color: 'var(--muted)', marginTop: 6 }}>{r.b}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Steps — desktop 3-col → mobile 1-col */}
      <section style={{ padding: '56px 16px 0' }}>
        <SectionHeader num="03 / Steps" title="Three taps to participate" />
        <div style={{ marginTop: 20 }}>
          {steps.map((s, i, a) => (
            <div key={s.n} style={{
              padding: '24px 0',
              borderBottom: i < a.length - 1 ? '1px solid var(--line)' : 0,
              display: 'grid', gridTemplateColumns: '44px 1fr', gap: 14,
            }}>
              <div className="mono" style={{ fontSize: 22, fontWeight: 500 }}>{s.n}</div>
              <div>
                <h3 style={{
                  margin: 0,
                  fontFamily: 'Playfair Display, serif', fontWeight: 700,
                  fontSize: 22, letterSpacing: '-0.01em',
                }}>{s.t}</h3>
                <p style={{ margin: '8px 0 0', fontSize: 14, lineHeight: 1.55, color: 'var(--muted)' }}>{s.b}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '56px 16px', textAlign: 'center', background: '#000', color: '#fff', marginTop: 56 }}>
        <div className="mono" style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.6 }}>
          Season 04
        </div>
        <h2 style={{
          margin: '14px 0 22px',
          fontFamily: 'Playfair Display, serif', fontWeight: 700,
          fontSize: 32, lineHeight: 1.05, letterSpacing: '-0.02em',
        }}>Start voting.</h2>
        <button className="btn btn-block" style={{
          background: '#fff', color: '#000', borderColor: '#fff',
        }}>Open Explore</button>
      </section>

      <Marquee dark={dark} text="★ Top 100 voters get a season tote ★ ฿800 print credit ★" />
      <Footer dark={dark} />
          <BottomNav active="home" dark={dark} />
    </div>
  );
}

window.ScreenForCustomers = ScreenForCustomers;
