/* global React, Nav, BottomNav, SectionHeader, Footer, Marquee */

// PHOTOGRAPHER PROFILE — Instagram-style layout, GOGRAPHY brand (mono + gold for Voyageur only).

function ProfileTopBar({ dark }) {
  const c = dark ? '#fff' : '#000';
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 30,
      background: dark ? 'rgba(10,10,10,0.96)' : 'rgba(255,255,255,0.96)',
      backdropFilter: 'blur(8px)',
      borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: 52, padding: '0 14px',
    }}>
      {/* + add */}
      <button aria-label="Add" style={{
        width: 36, height: 36, background: 'transparent', border: 0, cursor: 'pointer',
        color: c, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M12 5v14M5 12h14"/>
        </svg>
      </button>
      {/* username with dropdown + status dot */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: c }}>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em' }}>
          @nkphoto_
        </span>
        <svg width="11" height="7" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 1l5 5 5-5"/>
        </svg>
        <span style={{
          width: 6, height: 6, background: 'var(--gold)',
          transform: 'rotate(45deg)', display: 'inline-block', marginLeft: 4,
        }} title="Voyageur active"/>
      </div>
      {/* right side: notif + hamburger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <button aria-label="Notifications" style={{
          width: 36, height: 36, background: 'transparent', border: 0, cursor: 'pointer',
          color: c, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          <span className="wordmark" style={{
            fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 18,
          }}>G</span>
          <span style={{
            position: 'absolute', top: 2, right: 4,
            minWidth: 16, height: 14, padding: '0 4px',
            background: 'var(--gold)', color: '#000',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'IBM Plex Mono, monospace', fontSize: 9, fontWeight: 600,
          }}>9+</span>
        </button>
        <button aria-label="Menu" style={{
          width: 36, height: 36, background: 'transparent', border: 0, cursor: 'pointer',
          color: c, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="22" height="14" viewBox="0 0 22 14">
            <rect y="1"  width="22" height="1.6" fill={c}/>
            <rect y="6"  width="22" height="1.6" fill={c}/>
            <rect y="11" width="14" height="1.6" fill={c}/>
          </svg>
        </button>
      </div>
    </header>
  );
}

function ScreenPhotographer({ theme = 'light', onToggleTheme }) {
  const dark = theme === 'dark';
  const c = dark ? '#fff' : '#000';
  const [tab, setTab] = React.useState('grid');

  const grid = Array.from({ length: 12 }).map((_, i) => ({
    label: ['doi inthanon', 'pai fog', 'silver lake', 'andaman', 'isaan road', 'phang nga',
            'bangkok overpass', 'koh lipe', 'mae kampong', 'nan hills', 'tak midnight', 'krabi cliffs'][i],
    voyageur: [0, 2, 4, 7, 10].includes(i),
    curator: [0, 5].includes(i),
  }));

  return (
    <div className="screen" style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <ProfileTopBar dark={dark} />

      {/* Cover banner */}
      <div style={{ position: 'relative', width: '100%', height: 160 }}>
        <div className="ph ph-dark" style={{ position: 'absolute', inset: 0, fontSize: 9 }}>
          cover · doi inthanon dawn
        </div>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.5) 100%)',
        }}/>
        {/* Voyageur tag on cover */}
        <div className="voy" style={{
          position: 'absolute', left: 16, bottom: 12, zIndex: 2,
          color: 'var(--gold)',
          background: 'rgba(0,0,0,0.5)',
          padding: '4px 8px',
          backdropFilter: 'blur(4px)',
        }}>Voyageur II · Season 04</div>
      </div>

      {/* Identity row: avatar (overlapping cover) + 3 stat cells */}
      <div style={{ padding: '0 16px 0', display: 'flex', alignItems: 'flex-end', gap: 22, marginTop: -42 }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            width: 86, height: 86, borderRadius: '50%',
            background: 'var(--tile)',
            border: `3px solid ${dark ? '#0a0a0a' : '#fff'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'IBM Plex Mono, monospace', fontSize: 22, fontWeight: 600,
            backgroundImage: 'repeating-linear-gradient(135deg, transparent 0 14px, rgba(0,0,0,0.05) 14px 15px)',
          }}>NK</div>
        </div>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', textAlign: 'center', paddingBottom: 6 }}>
          {[
            ['305',   'frames'],
            ['1,527', 'followers'],
            ['1,123', 'following'],
          ].map(([n, l]) => (
            <div key={l}>
              <div className="mono" style={{ fontSize: 18, fontWeight: 500, letterSpacing: '-0.01em' }}>{n}</div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 }}>
                {l}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bio */}
      <div style={{ padding: '16px 16px 0' }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>
          Nuttachai Kirdsuk <span className="voy" style={{ marginLeft: 6, verticalAlign: 'middle' }}>Voyageur II</span>
        </div>
        <p className="th" style={{ fontSize: 13, lineHeight: 1.55, margin: '6px 0 8px', maxWidth: '36ch' }}>
          ช่างภาพภูมิทัศน์ภาคเหนือ — แสงสนธยา หมอกหุบเขา ใช้ชีวิตในรถปิคอัพ
        </p>
        <div className="mono" style={{ fontSize: 12, letterSpacing: '0.04em' }}>
          gography.net/nkphoto<br/>
          chiang mai → mae hong son
        </div>
      </div>

      {/* Pulse dashboard banner */}
      <div style={{ padding: '14px 16px 0' }}>
        <div style={{
          padding: '12px 14px',
          background: dark ? '#1a1916' : 'var(--tile)',
          border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'var(--line)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17l4-8 3 6 3-3" />
            </svg>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Pulse · 847</div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 1 }}>
                ↑ 18% past 7 days · rank 03
              </div>
            </div>
          </div>
          <svg width="64" height="20" viewBox="0 0 64 20" preserveAspectRatio="none">
            <polyline points="0,15 8,12 16,13 24,9 32,11 40,6 48,8 56,4 64,5"
              fill="none" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ padding: '14px 16px 0', display: 'flex', gap: 8 }}>
        <button className="btn btn-solid" style={{ flex: 1 }}>Edit profile</button>
        <button className="btn" style={{ flex: 1 }}>Share</button>
        <button className="btn" style={{ width: 44, padding: 0 }} aria-label="Add">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="8" r="4"/>
            <path d="M2 21c1.2-3.5 3.8-5.5 7-5.5"/>
            <path d="M19 11v6M16 14h6"/>
          </svg>
        </button>
      </div>

      {/* Tab strip — 4 icon tabs */}
      <div style={{ height: 20 }} />
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'var(--line)'}`,
      }}>
        {[
          { id: 'grid',    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><rect x="0" y="0" width="6" height="6"/><rect x="7" y="0" width="6" height="6"/><rect x="14" y="0" width="6" height="6"/><rect x="0" y="7" width="6" height="6"/><rect x="7" y="7" width="6" height="6"/><rect x="14" y="7" width="6" height="6"/><rect x="0" y="14" width="6" height="6"/><rect x="7" y="14" width="6" height="6"/><rect x="14" y="14" width="6" height="6"/></svg> },
          { id: 'curated', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M8 4h8v3a4 4 0 1 1-8 0V4zM5 6h3M16 6h3M9 13v3h6v-3M8 20h8"/></svg> },
          { id: 'seasons', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16"/><path d="M3 10h18M8 3v4M16 3v4"/></svg> },
          { id: 'tagged',  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="9" r="4"/><path d="M4 21c1.2-4 4.2-6 8-6s6.8 2 8 6"/></svg> },
        ].map(t => {
          const on = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '14px 0', background: 'transparent', cursor: 'pointer',
              border: 0,
              borderBottom: `2px solid ${on ? c : 'transparent'}`,
              color: on ? c : 'var(--muted)',
              display: 'inline-flex', justifyContent: 'center', alignItems: 'center',
            }}>{t.icon}</button>
          );
        })}
      </div>

      {/* 3-col edge-to-edge grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
        {grid.map((g, i) => (
          <div key={i} style={{ position: 'relative', aspectRatio: '1 / 1', background: 'var(--tile)' }}>
            <div className={`ph ${dark ? 'ph-dark' : ''}`} style={{ position: 'absolute', inset: 0, fontSize: 8 }}>{g.label}</div>
            {(g.voyageur || g.curator) && (
              <div style={{
                position: 'absolute', top: 6, right: 6,
                display: 'flex', gap: 4,
              }}>
                {g.curator && (
                  <div style={{
                    width: 18, height: 18, background: 'rgba(0,0,0,0.6)', color: '#fff',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M8 4h8v3a4 4 0 1 1-8 0V4zM9 13v3h6v-3"/>
                    </svg>
                  </div>
                )}
                {g.voyageur && (
                  <div style={{
                    width: 10, height: 10, background: 'var(--gold)',
                    transform: 'rotate(45deg)', marginTop: 4,
                  }} title="Voyageur"/>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ height: 28 }} />
      <BottomNav active="profile" dark={dark} />
    </div>
  );
}

window.ScreenPhotographer = ScreenPhotographer;
