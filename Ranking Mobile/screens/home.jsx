/* global React, Nav, FeedTabs, FeedCard, BottomNav, PageCover, SectionHeader, PhotoCard, Footer, Marquee */

// HOME — feed-style top with For You / Following tabs + bottom nav (upload center).
// Photos square so 2 fit per viewport. Lower sections preserved.

function ScreenHome({ theme = 'light', onToggleTheme }) {
  const dark = theme === 'dark';
  const [tab, setTab] = React.useState('foryou');

  const fresh = [
    { label: 'doi inthanon dawn',     author: 'Nuttachai K.',   location: 'Chiang Mai',   likes: 842, voyageur: true,  curator: true,  bookmarked: true },
    { label: 'koh lipe — long tail',  author: 'Praewa Suwan',   location: 'Satun',        likes: 711,                                bookmarked: true },
    { label: 'bangkok overpass',      author: 'Kwan Thirathon', location: 'Bangkok',      likes: 624,                  curator: true },
    { label: 'mae kampong fog',       author: 'Anuwat Phon',    location: 'Chiang Mai',   likes: 588, voyageur: true },
  ];

  const voyageurs = [
    { name: 'Anuwat Phon', tier: 'Voyageur III', region: 'Northern Highlands', pulse: 1240 },
    { name: 'Sirintra L.', tier: 'Voyageur II',  region: 'Andaman Coast',      pulse: 967 },
  ];

  const leaderboard = [
    { rank: 1, name: 'Anuwat Phon',       pulse: 1240, delta: '+22' },
    { rank: 2, name: 'Sirintra L.',       pulse: 967,  delta: '+8'  },
    { rank: 3, name: 'Nuttachai Kirdsuk', pulse: 847,  delta: '+18' },
    { rank: 4, name: 'Praewa Suwan',      pulse: 802,  delta: '+4'  },
    { rank: 5, name: 'Kwan Thirathon',    pulse: 776,  delta: '−2'  },
  ];

  return (
    <div className="screen" style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <Nav dark={dark} theme={theme} onToggleTheme={onToggleTheme} />
      <FeedTabs active={tab} onChange={setTab} dark={dark} />

      {/* FEED — square photos, 2 visible per phone viewport */}
      <section style={{ paddingTop: 4 }}>
        {fresh.map((p, i) => (
          <div key={i} style={{
            borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
            paddingBottom: 4,
          }}>
            <FeedCard {...p} dark={dark} />
          </div>
        ))}
      </section>

      {/* Season banner break */}
      <section style={{
        margin: 0, padding: '28px 16px',
        background: dark ? '#131310' : 'var(--cream)',
        borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'var(--line)'}`,
        borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'var(--line)'}`,
        textAlign: 'center',
      }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', color: 'var(--muted)', textTransform: 'uppercase' }}>
          Season 04 · 37 days left
        </div>
        <h2 style={{
          margin: '12px 0 4px',
          fontFamily: 'Playfair Display, serif', fontWeight: 700,
          fontSize: 28, lineHeight: 1.05, letterSpacing: '-0.01em',
        }}>Ranked by pulse — not influence.</h2>
        <p className="th" style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--muted)', margin: '8px auto 0', maxWidth: '32ch' }}>
          ภาพถ่ายเดินทางจากทั่วประเทศ จัดอันดับตามการมีส่วนร่วม
        </p>
      </section>

      {/* Quick stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        borderBottom: '1px solid var(--line)',
      }}>
        {[
          ['12,840', 'Frames'],
          ['1,047',  'Photographers'],
          ['4',      'Seasons'],
          ['37',     'Days left'],
        ].map(([n, l], i) => (
          <div key={l} className="stat" style={{
            padding: '20px 16px',
            borderRight: i % 2 === 0 ? '1px solid var(--line)' : 0,
            borderBottom: i < 2 ? '1px solid var(--line)' : 0,
          }}>
            <span className="num">{n}</span>
            <span className="lbl">{l}</span>
          </div>
        ))}
      </div>

      {/* STEPS */}
      <section style={{ padding: '40px 16px 0' }}>
        <SectionHeader num="01 / How it works" title="Three steps. One season." />
        <div style={{ marginTop: 20 }}>
          {[
            { n: '01', t: 'Submit your frame', b: 'Upload up to 12 photos per season. Tag location and category.' },
            { n: '02', t: 'Earn pulse',         b: 'Likes × 1, likes 24h × 3, curation bonus. Time-decayed.' },
            { n: '03', t: 'Win the season',     b: 'Highest pulse across all categories takes Season Winner.' },
          ].map((s, i, a) => (
            <div key={s.n} style={{
              padding: '20px 0',
              borderBottom: i < a.length - 1 ? '1px solid var(--line)' : 0,
            }}>
              <div className="mono" style={{ fontSize: 11, letterSpacing: '0.16em', color: 'var(--muted)' }}>STEP {s.n}</div>
              <h3 style={{
                margin: '8px 0 6px',
                fontFamily: 'Playfair Display, serif', fontWeight: 700,
                fontSize: 22, letterSpacing: '-0.01em',
              }}>{s.t}</h3>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: 'var(--muted)', maxWidth: '36ch' }}>{s.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VOYAGEURS */}
      <section style={{ padding: '40px 0 0', background: dark ? '#131310' : 'var(--cream)', marginTop: 40 }}>
        <div style={{ padding: '32px 16px 0' }}>
          <SectionHeader num="02 / Voyageurs" title="On the road this season" link="All" />
        </div>
        <div className="h-scroll" style={{ marginTop: 18, padding: '0 16px 24px' }}>
          {voyageurs.map((v, i) => (
            <article key={i} style={{
              width: 240, background: dark ? '#0a0a0a' : 'var(--bg)',
              border: `1px solid ${dark ? 'rgba(255,255,255,0.14)' : 'var(--line-strong)'}`, padding: 14,
            }}>
              <div className="ph" style={{ aspectRatio: '4 / 5', fontSize: 9 }}>portrait</div>
              <div className="voy" style={{ marginTop: 12 }}>{v.tier}</div>
              <h3 style={{
                margin: '6px 0 2px',
                fontFamily: 'Playfair Display, serif', fontWeight: 700,
                fontSize: 18, letterSpacing: '-0.01em',
              }}>{v.name}</h3>
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', color: 'var(--muted)', textTransform: 'uppercase' }}>
                {v.region}
              </div>
              <div style={{
                marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--line)',
                display: 'flex', justifyContent: 'space-between',
              }}>
                <span className="label" style={{ color: 'var(--muted)' }}>Pulse</span>
                <span className="mono" style={{ fontSize: 13 }}>{v.pulse}</span>
              </div>
            </article>
          ))}
        </div>
        <div style={{ padding: '0 16px 32px' }}>
          <button className="btn btn-block">Become a Voyageur</button>
        </div>
      </section>

      {/* LEADERBOARD */}
      <section style={{ padding: '40px 16px 0' }}>
        <SectionHeader num="03 / Leaderboard" title="Pulse this week" />
        <table style={{
          width: '100%', borderCollapse: 'collapse', marginTop: 16,
          fontFamily: 'IBM Plex Mono, monospace',
        }}>
          <tbody>
            {leaderboard.map(r => (
              <tr key={r.rank} style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '14px 0', width: 28, fontSize: 11, color: 'var(--muted)' }}>
                  {String(r.rank).padStart(2, '0')}
                </td>
                <td style={{ padding: '14px 0', fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500 }}>{r.name}</td>
                <td style={{ padding: '14px 0', textAlign: 'right', fontSize: 13 }}>{r.pulse}</td>
                <td style={{ padding: '14px 0 14px 12px', textAlign: 'right', fontSize: 11, color: 'var(--muted)', width: 44 }}>
                  {r.delta}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <Marquee dark={dark} text="★ Season 04 ★ 37 days left ★ Submit your frame ★" />
      <Footer dark={dark} />

      {/* Bottom nav sticky */}
      <BottomNav active="home" dark={dark} />
    </div>
  );
}

window.ScreenHome = ScreenHome;
