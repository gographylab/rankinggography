/* global React, Nav, PageCover, SectionHeader, Footer, Marquee, BottomNav */

function ScreenAbout({ theme = 'light', onToggleTheme }) {
  const dark = theme === 'dark';

  const principles = [
    { n: '01', t: 'Pulse over reach', b: 'Engagement velocity beats follower count. Time-decayed, transparent formula.' },
    { n: '02', t: 'One season, one winner', b: 'Highest pulse across all categories. Not split — concentrated.' },
    { n: '03', t: 'Travel is the medium', b: 'Voyageurs photograph on the road. Cashback funds the next trip.' },
  ];

  const team = [
    { name: 'Tul Manoonpong', role: 'Founder · Curator', tag: 'Bangkok' },
    { name: 'Praewa Suwan',    role: 'Editorial Lead',    tag: 'Chiang Mai' },
    { name: 'Anuwat Phon',     role: 'Voyageur Liaison',  tag: 'Mae Hong Son' },
    { name: 'Sirintra L.',     role: 'Community',          tag: 'Phuket' },
  ];

  return (
    <div className="screen">
      <Nav dark={dark} theme={theme} onToggleTheme={onToggleTheme} />
      <PageCover
        eyebrow="— About"
        title="A platform for the long, slow look."
        sub="Gography ranks Thai travel photography by what moves people — not who they follow."
        height={420}
        label="about · cover"
      />

      {/* Body — desktop 2-col → mobile 1-col */}
      <section style={{ padding: '40px 16px 0' }}>
        <div className="mono" style={{ fontSize: 11, letterSpacing: '0.16em', color: 'var(--muted)' }}>
          — Manifesto
        </div>
        <h2 style={{
          margin: '8px 0 16px',
          fontFamily: 'Playfair Display, serif', fontWeight: 700,
          fontSize: 28, lineHeight: 1.05, letterSpacing: '-0.01em',
          textWrap: 'balance',
        }}>
          We started in 2022 from a single road trip across the north.
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--fg)', maxWidth: '38ch' }}>
          What began as a Drive folder of frames between four friends became a season-based competition. We wanted a place where the photographer who slept in a truck for a week stood beside the one who drove to a sunset spot — and let the audience decide.
        </p>
        <p className="th" style={{ fontSize: 14, lineHeight: 1.65, marginTop: 16, color: 'var(--muted)', maxWidth: '34ch' }}>
          เราเชื่อว่าภาพถ่ายที่ดีที่สุดเกิดขึ้นเมื่อช่างภาพใช้เวลาอยู่กับสถานที่ ไม่ใช่แค่ผ่านมัน
        </p>
      </section>

      {/* Stats — desktop 4-col → mobile 2-col */}
      <section style={{ padding: '40px 0 0' }}>
        <div style={{
          margin: '0 16px',
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          border: '1px solid var(--line-strong)',
        }}>
          {[
            ['2022',   'Founded'],
            ['1,047',  'Photographers'],
            ['12,840', 'Frames'],
            ['฿1.2M',  'Cashback paid'],
          ].map(([n, l], i) => (
            <div key={l} className="stat" style={{
              padding: '20px 14px',
              borderRight: i % 2 === 0 ? '1px solid var(--line)' : 0,
              borderBottom: i < 2 ? '1px solid var(--line)' : 0,
            }}>
              <span className="num">{n}</span>
              <span className="lbl">{l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Principles — desktop 3-col → mobile 1-col stacked */}
      <section style={{ padding: '56px 16px 0' }}>
        <SectionHeader num="01 / Principles" title="Three things we don't compromise on." />
        <div style={{ marginTop: 20 }}>
          {principles.map((p, i, a) => (
            <div key={p.n} style={{
              padding: '24px 0',
              borderBottom: i < a.length - 1 ? '1px solid var(--line)' : 0,
              display: 'grid', gridTemplateColumns: '52px 1fr', gap: 16,
            }}>
              <div className="mono" style={{ fontSize: 18, fontWeight: 500 }}>{p.n}</div>
              <div>
                <h3 style={{
                  margin: 0,
                  fontFamily: 'Playfair Display, serif', fontWeight: 700,
                  fontSize: 22, letterSpacing: '-0.01em',
                }}>{p.t}</h3>
                <p style={{ margin: '8px 0 0', fontSize: 14, lineHeight: 1.55, color: 'var(--muted)' }}>{p.b}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team — desktop 2-col → mobile 1-col stack */}
      <section style={{ padding: '56px 16px 0' }}>
        <SectionHeader num="02 / Team" title="Four people, one Drive folder." />
        <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>
          {team.map(t => (
            <div key={t.name} style={{
              display: 'grid', gridTemplateColumns: '88px 1fr', gap: 14,
              padding: '14px 0', borderTop: '1px solid var(--line)',
              alignItems: 'center',
            }}>
              <div className="ph" style={{ aspectRatio: '1', fontSize: 9 }}>portrait</div>
              <div>
                <div style={{
                  fontFamily: 'Playfair Display, serif', fontWeight: 700,
                  fontSize: 18, letterSpacing: '-0.01em',
                }}>{t.name}</div>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--muted)', textTransform: 'uppercase', marginTop: 4 }}>
                  {t.role}
                </div>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.08em', color: 'var(--muted)', marginTop: 2 }}>
                  {t.tag}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ height: 64 }} />
      <Marquee dark={dark} text="◆ Since 2022 ◆ 4 seasons ◆ 1,047 photographers ◆ Bangkok · Chiang Mai ◆" />
      <Footer dark={dark} />
          <BottomNav active="about" dark={dark} />
    </div>
  );
}

window.ScreenAbout = ScreenAbout;
