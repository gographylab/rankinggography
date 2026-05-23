/* global React, Nav, PageCover, SectionHeader, Footer, Marquee, BottomNav */

function ScreenHallOfFame({ theme = 'light', onToggleTheme }) {
  const dark = theme === 'dark';

  const seasons = [
    { s: '04', y: '2026', winner: 'Anuwat Phon',     title: 'Mae Hong Son, blue hour', pulse: 1240 },
    { s: '03', y: '2025', winner: 'Sirintra L.',     title: 'Phang Nga channels',       pulse: 1108 },
    { s: '02', y: '2025', winner: 'Nuttachai Kirdsuk', title: 'Doi Inthanon dawn',     pulse: 982 },
    { s: '01', y: '2024', winner: 'Tul Manoonpong',  title: 'Bangkok last light',       pulse: 874 },
  ];

  const tiers = [
    { t: 'Voyageur III', p: '฿15,000', l: '8% cashback', tag: 'top tier' },
    { t: 'Voyageur II',  p: '฿8,000',  l: '5% cashback', tag: '' },
    { t: 'Voyageur I',   p: '฿3,000',  l: '3% cashback', tag: '' },
  ];

  return (
    <div className="screen">
      <Nav dark={dark} theme={theme} onToggleTheme={onToggleTheme} />
      <PageCover
        eyebrow="— Hall of Fame"
        title="Four seasons. Four winners."
        sub="Highest pulse across all categories. One frame per season."
        height={420}
        label="hall of fame cover"
      />

      {/* Featured winner (Season 04) — desktop 1.1fr 1fr → mobile stacked */}
      <section style={{ padding: '40px 16px 0' }}>
        <div className="mono" style={{ fontSize: 11, letterSpacing: '0.16em', color: 'var(--muted)' }}>
          Season 04 · Reigning
        </div>
        <div className="ph" style={{
          marginTop: 14, aspectRatio: '4 / 5',
          fontSize: 9,
        }}>winning frame · mae hong son</div>

        <h2 style={{
          margin: '24px 0 8px',
          fontFamily: 'Playfair Display, serif', fontWeight: 700,
          fontSize: 30, lineHeight: 1.05, letterSpacing: '-0.01em',
          textWrap: 'balance',
        }}>
          "Mae Hong Son, <em>blue hour</em>"
        </h2>
        <div className="voy">Anuwat Phon · Voyageur III</div>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--muted)', marginTop: 16, maxWidth: '40ch' }}>
          Shot at 5:47am in Pang Mapha district. Three nights of waiting for the fog to break through the valley.
        </p>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          marginTop: 20, border: '1px solid var(--line-strong)',
        }}>
          {[
            ['1,240', 'Pulse'],
            ['8,420', 'Likes'],
            ['142',   'Hours to peak'],
            ['◆',     'Curator pick'],
          ].map(([n, l], i) => (
            <div key={l} className="stat" style={{
              padding: '16px 14px',
              borderRight: i % 2 === 0 ? '1px solid var(--line)' : 0,
              borderBottom: i < 2 ? '1px solid var(--line)' : 0,
            }}>
              <span className="num" style={n === '◆' ? { color: 'var(--gold)', fontFamily: 'Inter, sans-serif' } : {}}>{n}</span>
              <span className="lbl">{l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Past winners — list */}
      <section style={{ padding: '56px 16px 0' }}>
        <SectionHeader num="01 / Archive" title="Past winners" />
        <div style={{ marginTop: 18 }}>
          {seasons.slice(1).map((w, i, a) => (
            <article key={w.s} style={{
              padding: '20px 0',
              borderTop: '1px solid var(--line)',
              borderBottom: i === a.length - 1 ? '1px solid var(--line)' : 0,
              display: 'grid', gridTemplateColumns: '92px 1fr', gap: 14,
            }}>
              <div className="ph" style={{ aspectRatio: '4 / 5', fontSize: 9 }}>S{w.s}</div>
              <div>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.16em', color: 'var(--muted)', textTransform: 'uppercase' }}>
                  Season {w.s} · {w.y}
                </div>
                <h3 style={{
                  margin: '4px 0 6px',
                  fontFamily: 'Playfair Display, serif', fontWeight: 700,
                  fontSize: 20, letterSpacing: '-0.01em', lineHeight: 1.15,
                }}>"{w.title}"</h3>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{w.winner}</div>
                <div className="mono" style={{
                  marginTop: 8, fontSize: 11,
                  display: 'inline-block', padding: '4px 8px',
                  border: '1px solid var(--line-strong)',
                }}>Pulse {w.pulse}</div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Cashback tiers — desktop 3-col → mobile 1-col */}
      <section style={{ padding: '56px 0 0', background: 'var(--cream)' }}>
        <div style={{ padding: '40px 16px 0' }}>
          <SectionHeader num="02 / Tiers" title="Voyageur cashback" />
          <p className="th" style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--muted)', marginTop: 12, maxWidth: '34ch' }}>
            ผู้เข้าร่วมที่ผ่านการคัดเลือกจะได้รับส่วนแบ่งจากค่าโฆษณาฤดูกาล
          </p>
        </div>
        <div style={{ padding: '20px 16px 40px', display: 'grid', gap: 12 }}>
          {tiers.map((t, i) => (
            <div key={t.t} style={{
              padding: 18,
              background: i === 0 ? '#000' : 'var(--bg)',
              color: i === 0 ? '#fff' : 'var(--fg)',
              border: i === 0 ? '1px solid #000' : '1px solid var(--line-strong)',
              position: 'relative',
            }}>
              <div className="voy" style={{ color: 'var(--gold)' }}>{t.t}</div>
              <div className="mono" style={{
                marginTop: 14, fontSize: 28, fontWeight: 500, letterSpacing: '-0.01em',
              }}>{t.p}</div>
              <div className="label" style={{ marginTop: 4, opacity: i === 0 ? 0.6 : 0.55 }}>per season · {t.l}</div>
              {t.tag && (
                <div className="mono" style={{
                  position: 'absolute', top: 14, right: 14,
                  fontSize: 9, letterSpacing: '0.14em',
                  padding: '3px 6px',
                  border: '1px solid var(--gold)', color: 'var(--gold)',
                  textTransform: 'uppercase',
                }}>{t.tag}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      <div style={{ height: 48 }} />
      <Marquee dark={dark} text="◆ 4 seasons ◆ 4 winners ◆ ฿1.2M cashback paid ◆" />
      <Footer dark={dark} />
          <BottomNav active="home" dark={dark} />
    </div>
  );
}

window.ScreenHallOfFame = ScreenHallOfFame;
