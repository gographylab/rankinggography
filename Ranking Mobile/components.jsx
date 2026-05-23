/* global React */
// GOGRAPHY shared components — mobile-first

// ─── Phone frame: 375 × 812 with thin browser chrome (web responsive, not native) ───
function PhoneFrame({ children, dark = false, label, w = 375, h = 812 }) {
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 12 }}>
      {label &&
      <div style={{
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase',
        color: 'rgba(0,0,0,0.55)'
      }}>{label}</div>
      }
      <div style={{
        width: w, height: h, position: 'relative',
        background: dark ? '#0a0a0a' : '#fff',
        boxShadow: '0 30px 60px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        fontFamily: 'Inter, system-ui'
      }}>
        {/* Browser chrome */}
        <div style={{
          height: 32, padding: '0 12px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: dark ? '#000' : '#FAFAF7',
          borderBottom: dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
          fontFamily: 'IBM Plex Mono, monospace', fontSize: 10,
          color: dark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)',
          letterSpacing: '0.06em'
        }}>
          <span>9:41</span>
          <span style={{ flex: 1, textAlign: 'center', letterSpacing: '0.04em' }}>
            gography.net
          </span>
          <span style={{ display: 'inline-flex', gap: 4 }}>
            <span>▮▮▮</span>
          </span>
        </div>
        {/* Page content */}
        <div className={`gpa${dark ? ' dark' : ''}`} style={{
          width: '100%', height: 'calc(100% - 32px)',
          overflowY: 'auto', overflowX: 'hidden',
          background: dark ? '#0a0a0a' : '#fff',
          color: dark ? '#fff' : '#000'
        }}>
          {children}
        </div>
      </div>
    </div>);

}

// ─── Nav (mobile: hamburger + wordmark + theme + avatar) ───
function Nav({ dark = false, theme = 'light', onToggleTheme }) {
  const c = dark ? '#fff' : '#000';
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 30,
      background: dark ? 'rgba(10,10,10,0.92)' : 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(8px)',
      borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`
    }}>
      <div style={{
        height: 56, padding: '0 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 12
      }}>
        {/* Hamburger */}
        <button aria-label="Menu" style={{
          width: 44, height: 44, padding: 0, background: 'transparent',
          border: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', marginLeft: -8
        }}>
          <svg width="20" height="14" viewBox="0 0 20 14">
            <rect y="0" width="20" height="1.5" fill={c} />
            <rect y="6" width="20" height="1.5" fill={c} />
            <rect y="12" width="14" height="1.5" fill={c} />
          </svg>
        </button>
        {/* Wordmark */}
        <div className="wordmark" style={{
          fontFamily: 'Playfair Display, serif', fontWeight: 700,
          fontSize: 20, letterSpacing: '-0.01em', color: c
        }}>GOGRAPHY</div>
        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {/* Theme toggle (sun/moon pill) */}
          <button onClick={onToggleTheme} aria-label="Toggle theme" style={{
            width: 44, height: 28, padding: 0,
            border: `1px solid ${c}`, background: 'transparent',
            display: 'inline-flex', position: 'relative', cursor: 'pointer'
          }}>
            <span style={{
              position: 'absolute', top: 2, bottom: 2,
              left: theme === 'dark' ? 'calc(50% + 1px)' : 2,
              width: 'calc(50% - 4px)', background: c,
              transition: 'left .2s'
            }} />
            <span style={{
              flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              color: theme === 'dark' ? c : dark ? '#000' : '#fff',
              fontSize: 10
            }}>☀</span>
            <span style={{
              flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              color: theme === 'dark' ? dark ? '#000' : '#fff' : c,
              fontSize: 9
            }}>☾</span>
          </button>
          {/* Avatar */}
          <div style={{
            width: 32, height: 32, marginLeft: 4,
            background: dark ? '#222' : '#f1efe9',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, fontWeight: 600,
            color: c, border: `1px solid ${dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'}`
          }}>NK</div>
        </div>
      </div>
    </header>);

}

// ─── PageCover (mobile-tightened insets: 16/16/24) ───
function PageCover({ eyebrow, title, sub, height = 360, label = 'hero photo', dark = true }) {
  return (
    <div className="cover" style={{ height }}>
      <div className={`ph ${dark ? 'ph-dark' : ''}`} style={{
        position: 'absolute', inset: 0, fontSize: 9
      }}>{label}</div>
      <div className="cover-overlay" />
      <div className="cover-inner">
        {eyebrow && <div className="cover-eyebrow">{eyebrow}</div>}
        <div className="cover-title" style={{ fontSize: "35px" }}>{title}</div>
        {sub && <div className="cover-sub">{sub}</div>}
      </div>
    </div>);

}

// ─── Section header (number + title + optional link) ───
function SectionHeader({ num, title, link }) {
  return (
    <div>
      {num && <div className="sh-num">— {num}</div>}
      <div className="sh" style={{ marginTop: num ? 6 : 0 }}>
        <div className="sh-title">{title}</div>
        {link && <a className="sh-link" href="#">{link} →</a>}
      </div>
    </div>);

}

// ─── PhotoCard (mobile-responsive: 1 col phone, 2 col tablet, N col desktop) ───
function PhotoCard({ label = 'photo', author, location, likes, voyageur, ratio = '4 / 5', liked: initialLiked = false }) {
  const [liked, setLiked] = React.useState(initialLiked);
  return (
    <article style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{
        position: 'relative', width: '100%', aspectRatio: ratio,
        background: 'var(--tile)'
      }}>
        <div className="ph" style={{ position: 'absolute', inset: 0 }}>{label}</div>
        <button className={`heart${liked ? ' liked' : ''}`}
        onClick={() => setLiked(!liked)}
        style={{
          position: 'absolute', right: 0, bottom: 0
        }}>
          <svg width="16" height="14" viewBox="0 0 24 22" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
            <path d="M12 20s-8-5.2-8-11.4A4.6 4.6 0 0 1 12 6a4.6 4.6 0 0 1 8 2.6C20 14.8 12 20 12 20z" />
          </svg>
        </button>
      </div>
      <div style={{ paddingTop: 10, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
          }}>
            {author}{voyageur && <span className="gold" style={{ marginLeft: 6 }}>◆</span>}
          </div>
          {location &&
          <div className="mono" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.08em', marginTop: 2, textTransform: 'uppercase' }}>
              {location}
            </div>
          }
        </div>
        {likes !== undefined &&
        <div className="mono" style={{ fontSize: 11, fontVariantNumeric: 'tabular-nums' }}>
            ♥ {likes}
          </div>
        }
      </div>
    </article>);

}

// ─── Footer (mobile: stacks columns) ───
function Footer({ dark = false }) {
  const cols = [
  { h: 'Awards', items: ['Hall of Fame', 'Season 04', 'Voyageurs', 'Ambassadors'] },
  { h: 'Discover', items: ['Explore', 'Photographers', 'Categories', 'Search'] },
  { h: 'Customers', items: ['Cashback', 'Rewards', 'Rules', 'How it works'] },
  { h: 'About', items: ['Mission', 'Team', 'Press', 'Contact'] }];

  return (
    <footer style={{
      background: dark ? '#000' : 'var(--cream)',
      color: dark ? '#fff' : 'var(--fg)',
      borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'var(--line)'}`
    }}>
      <div style={{ padding: '40px 16px 24px' }}>
        <div className="wordmark" style={{
          fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 28,
          letterSpacing: '-0.01em', marginBottom: 4
        }}>GOGRAPHY</div>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.6 }}>
          Photo Awards · Season 04
        </div>
        <p className="th" style={{ marginTop: 18, fontSize: 13, lineHeight: 1.6, opacity: 0.78, maxWidth: '34ch' }}>
          เวทีรางวัลภาพถ่ายไทยรายฤดูกาล สำหรับช่างภาพอิสระและนักเดินทาง
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px 16px', marginTop: 32 }}>
          {cols.map((c) =>
          <div key={c.h}>
              <div className="label" style={{ opacity: 0.6, marginBottom: 10 }}>{c.h}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
                {c.items.map((i) =>
              <li key={i} style={{ fontSize: 13 }}>{i}</li>
              )}
              </ul>
            </div>
          )}
        </div>
        <div className="hr" style={{ margin: '32px 0 14px' }} />
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 8,
          fontFamily: 'IBM Plex Mono, monospace', fontSize: 10,
          letterSpacing: '0.1em', opacity: 0.55, textTransform: 'uppercase'
        }}>
          <span>© 2026 Gography</span>
          <span>Bangkok · Thailand</span>
        </div>
      </div>
    </footer>);

}

// ─── Marquee (text scroller used at section breaks) ───
function Marquee({ text = '★ Pulse rising ★ Season 04 ★ Submissions open until 12.31 ★', dark = false }) {
  return (
    <div style={{
      overflow: 'hidden', whiteSpace: 'nowrap',
      borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.12)' : 'var(--line)'}`,
      borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.12)' : 'var(--line)'}`,
      padding: '14px 0',
      fontFamily: 'IBM Plex Mono, monospace', fontSize: 12,
      letterSpacing: '0.18em', textTransform: 'uppercase'
    }}>
      <div style={{ animation: 'marquee 30s linear infinite', display: 'inline-block' }}>
        {Array(4).fill(text).join('   ')}
      </div>
    </div>);

}

// CSS for marquee
if (typeof document !== 'undefined' && !document.getElementById('gpa-anim')) {
  const s = document.createElement('style');s.id = 'gpa-anim';
  s.textContent = '@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }';
  document.head.appendChild(s);
}

// ─── Feed tabs (For You / Following) ───
function FeedTabs({ active = 'foryou', onChange, dark = false }) {
  const c = dark ? '#fff' : '#000';
  const muted = dark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)';
  const tabs = [
    { id: 'foryou',   label: 'For You' },
    { id: 'following', label: 'Following' },
  ];
  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 28,
      padding: '14px 16px 12px',
      borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
      background: dark ? '#0a0a0a' : '#fff',
      position: 'sticky', top: 56, zIndex: 20,
    }}>
      {tabs.map(t => {
        const on = active === t.id;
        return (
          <button key={t.id} onClick={() => onChange && onChange(t.id)} style={{
            background: 'transparent', border: 0, padding: '4px 2px',
            cursor: 'pointer', position: 'relative',
            fontFamily: 'Inter, sans-serif',
            fontSize: on ? 17 : 15, fontWeight: on ? 600 : 500,
            color: on ? c : muted,
            letterSpacing: '-0.01em',
          }}>
            {t.label}
            {on && (
              <span style={{
                position: 'absolute', left: '50%', bottom: -3,
                transform: 'translateX(-50%)',
                width: 28, height: 2, background: 'var(--gold)',
              }} />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── BottomNav — 5 items, upload elevated center ───
function BottomNav({ active = 'home', dark = false, onUpload }) {
  const c = dark ? '#fff' : '#000';
  const muted = dark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)';
  const bg = dark ? 'rgba(10,10,10,0.96)' : 'rgba(255,255,255,0.96)';

  const Icon = ({ name, size = 22 }) => {
    const stroke = 1.7;
    const items = {
      home: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" />
        </svg>
      ),
      explore: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M15.5 8.5l-2 5-5 2 2-5z" />
        </svg>
      ),
      pulse: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12h4l2-7 4 14 2-7h6" />
        </svg>
      ),
      profile: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
        </svg>
      ),
    };
    return items[name];
  };

  const items = [
    { id: 'home',     icon: 'home',    label: 'Home' },
    { id: 'explore',  icon: 'explore', label: 'Explore' },
    { id: 'upload',   icon: 'upload',  label: 'Submit', center: true },
    { id: 'pulse',    icon: 'pulse',   label: 'Pulse' },
    { id: 'profile',  icon: 'profile', label: 'Me' },
  ];

  return (
    <nav style={{
      position: 'sticky', bottom: 0, left: 0, right: 0, zIndex: 40,
      background: bg, backdropFilter: 'blur(12px)',
      borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
      display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
      paddingTop: 8, paddingBottom: 10,
    }}>
      {items.map(it => {
        if (it.center) {
          return (
            <div key={it.id} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <button onClick={onUpload} aria-label="Submit a frame" style={{
                width: 52, height: 52, padding: 0,
                background: c, color: dark ? '#000' : '#fff',
                border: 0, cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                marginTop: -22,
                boxShadow: dark
                  ? '0 6px 18px rgba(255,255,255,0.18), 0 0 0 4px #0a0a0a'
                  : '0 6px 18px rgba(0,0,0,0.18), 0 0 0 4px #fff',
                position: 'relative',
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
                <span style={{
                  position: 'absolute', bottom: -16, left: '50%', transform: 'translateX(-50%)',
                  fontFamily: 'IBM Plex Mono, monospace', fontSize: 9,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: c, whiteSpace: 'nowrap',
                }}>Submit</span>
              </button>
            </div>
          );
        }
        const on = active === it.id;
        return (
          <button key={it.id} style={{
            background: 'transparent', border: 0, cursor: 'pointer',
            padding: '4px 0',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            color: on ? c : muted,
            fontFamily: 'IBM Plex Mono, monospace', fontSize: 9,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            minHeight: 44,
          }}>
            <Icon name={it.icon} />
            <span style={{ fontWeight: on ? 600 : 400 }}>{it.label}</span>
            {on && (
              <span style={{
                position: 'absolute', bottom: 4,
                width: 4, height: 4, background: c, marginTop: 2,
              }} />
            )}
          </button>
        );
      })}
    </nav>
  );
}

// ─── Feed photo card — image-forward, square ratio, with curator + bookmark corners ───
function FeedCard({ label = 'photo', author, location, likes, voyageur, curator, bookmarked: bm0 = false, ratio = '1 / 1', dark = false }) {
  const [liked, setLiked] = React.useState(false);
  const [bookmark, setBookmark] = React.useState(bm0);
  const c = dark ? '#fff' : '#000';
  return (
    <article style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{
        position: 'relative', width: '100%', aspectRatio: ratio,
        background: 'var(--tile)',
      }}>
        <div className={`ph ${dark ? 'ph-dark' : ''}`} style={{ position: 'absolute', inset: 0, fontSize: 10 }}>{label}</div>

        {/* Top-right: curator badge + bookmark flag */}
        <div style={{
          position: 'absolute', top: 12, right: 12, zIndex: 2,
          display: 'flex', gap: 8, alignItems: 'flex-start',
        }}>
          {curator && (
            <div style={{
              width: 36, height: 28,
              background: 'rgba(0,0,0,0.55)', color: '#fff',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.25)',
            }} title="Curator pick">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M8 4h8v3a4 4 0 1 1-8 0V4zM5 6h3M16 6h3M9 13v3h6v-3M8 20h8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
          <button onClick={() => setBookmark(!bookmark)} aria-label="Bookmark" style={{
            width: 28, height: 36, padding: 0, border: 0, cursor: 'pointer',
            background: bookmark ? '#fff' : 'rgba(255,255,255,0.92)',
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)',
            display: 'inline-flex', alignItems: 'flex-start', justifyContent: 'center',
            paddingTop: 6,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24"
              fill={bookmark ? 'var(--gold)' : 'none'}
              stroke="var(--gold)" strokeWidth="1.6" strokeLinejoin="round">
              <path d="M12 2l2.9 6.5 7.1.8-5.3 4.9 1.5 7-6.2-3.6L5.8 21l1.5-7L2 9.3l7.1-.8z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Author row */}
      <div style={{
        padding: '12px 16px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
          <div style={{
            width: 30, height: 30, flexShrink: 0,
            background: dark ? '#222' : '#f1efe9',
            border: `1px solid ${dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'}`,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, fontWeight: 600,
            color: c,
          }}>{author.split(' ').map(w => w[0]).join('').slice(0, 2)}</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{
              fontSize: 14, fontWeight: 500,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {author}{voyageur && <span className="gold" style={{ marginLeft: 6 }}>◆</span>}
            </div>
            {location && (
              <div className="mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 1 }}>
                {location}{likes !== undefined ? ` · ♥ ${likes}` : ''}
              </div>
            )}
          </div>
        </div>
        <button onClick={() => setLiked(!liked)} aria-label="Like" style={{
          width: 36, height: 36, padding: 0, background: 'transparent',
          border: 0, cursor: 'pointer', color: c,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="22" height="20" viewBox="0 0 24 22"
            fill={liked ? 'currentColor' : 'none'}
            stroke="currentColor" strokeWidth="1.6">
            <path d="M12 20s-8-5.2-8-11.4A4.6 4.6 0 0 1 12 6a4.6 4.6 0 0 1 8 2.6C20 14.8 12 20 12 20z"/>
          </svg>
        </button>
        <button aria-label="More" style={{
          width: 32, height: 36, padding: 0, background: 'transparent',
          border: 0, cursor: 'pointer', color: c,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="20" height="6" viewBox="0 0 20 6">
            <circle cx="2" cy="3" r="1.8" fill="currentColor"/>
            <circle cx="10" cy="3" r="1.8" fill="currentColor"/>
            <circle cx="18" cy="3" r="1.8" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </article>
  );
}

Object.assign(window, { PhoneFrame, Nav, PageCover, SectionHeader, PhotoCard, Footer, Marquee, FeedTabs, BottomNav, FeedCard });