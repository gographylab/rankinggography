/* global React, Nav, PageCover, SectionHeader, PhotoCard, Footer, Marquee, BottomNav */

function ScreenExplore({ theme = 'light', onToggleTheme }) {
  const dark = theme === 'dark';
  const [sort, setSort] = React.useState('Fresh');
  const [cat, setCat] = React.useState('All');

  const grid = [
    { label: 'doi inthanon dawn',   author: 'Nuttachai K.', location: 'Chiang Mai',   likes: 842, voyageur: true,  ratio: '4 / 5' },
    { label: 'pai valley fog',      author: 'Anuwat P.',    location: 'Mae Hong Son', likes: 967, voyageur: true,  ratio: '4 / 5' },
    { label: 'koh lipe long tail',  author: 'Praewa S.',    location: 'Satun',         likes: 711,                  ratio: '4 / 5' },
    { label: 'bangkok overpass',    author: 'Kwan T.',      location: 'Bangkok',       likes: 624,                  ratio: '4 / 5' },
    { label: 'silver lake',         author: 'Nuttachai K.', location: 'Nan',           likes: 521, voyageur: true,  ratio: '4 / 5' },
    { label: 'phang nga channels',  author: 'Sirintra L.',  location: 'Phang Nga',     likes: 488, voyageur: true,  ratio: '4 / 5' },
  ];

  const trending = ['Anuwat P.', 'Sirintra L.', 'Nuttachai K.', 'Praewa S.'];

  return (
    <div className="screen">
      <Nav dark={dark} theme={theme} onToggleTheme={onToggleTheme} />

      {/* Tight cover */}
      <div style={{ padding: '32px 16px 0' }}>
        <div className="mono" style={{ fontSize: 11, letterSpacing: '0.18em', color: 'var(--muted)' }}>
          — Explore
        </div>
        <h1 style={{
          margin: '8px 0 14px',
          fontFamily: 'Playfair Display, serif', fontWeight: 700,
          fontSize: 36, lineHeight: 1.02, letterSpacing: '-0.02em',
          textWrap: 'balance',
        }}>This season's frames</h1>
        <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--muted)', margin: 0, maxWidth: '36ch' }}>
          {grid.length} of 12,840 frames. Updated continuously.
        </p>
      </div>

      {/* SortBlocks — desktop 2-col (Hirest / Fresh) → mobile keeps 2-col, tappable */}
      <div style={{ padding: '24px 16px 0' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          border: '1px solid var(--line-strong)',
        }}>
          {[
            { k: 'Hirest', sub: 'Top pulse' },
            { k: 'Fresh',  sub: 'Newest first' },
          ].map((s, i) => {
            const active = sort === s.k;
            return (
              <button key={s.k} onClick={() => setSort(s.k)} style={{
                padding: '16px 14px', cursor: 'pointer',
                background: active ? 'var(--fg)' : 'transparent',
                color: active ? 'var(--bg)' : 'var(--fg)',
                border: 0, borderRight: i === 0 ? '1px solid var(--line-strong)' : 0,
                textAlign: 'left', fontFamily: 'inherit',
              }}>
                <div style={{
                  fontFamily: 'Playfair Display, serif', fontWeight: 700,
                  fontSize: 22, letterSpacing: '-0.01em', lineHeight: 1,
                }}>{s.k}</div>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 8, opacity: 0.7 }}>
                  {s.sub}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category chips (horizontal scroll on mobile) */}
      <div className="h-scroll" style={{ marginTop: 16 }}>
        {['All', 'Landscape', 'Portrait', 'B&W', 'Urban', 'Coastal'].map(c => {
          const active = cat === c;
          return (
            <button key={c} onClick={() => setCat(c)} style={{
              height: 36, padding: '0 14px',
              border: `1px solid ${active ? 'var(--fg)' : 'var(--line-strong)'}`,
              background: active ? 'var(--fg)' : 'transparent',
              color: active ? 'var(--bg)' : 'var(--fg)',
              fontFamily: 'IBM Plex Mono, monospace', fontSize: 11,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              cursor: 'pointer', flex: '0 0 auto',
            }}>{c}</button>
          );
        })}
      </div>

      {/* Photo grid — desktop 3-col + sidebar → mobile 2-col */}
      <div style={{ padding: '24px 16px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {grid.map((p, i) => <PhotoCard key={i} {...p} />)}
        </div>
        <button className="btn btn-block" style={{ marginTop: 28 }}>Load 24 more</button>
      </div>

      {/* Trending sidebar — moved BELOW grid on mobile */}
      <section style={{ padding: '56px 0 0', background: 'var(--cream)' }}>
        <div style={{ padding: '32px 16px 0' }}>
          <SectionHeader num="—" title="Trending photographers" link="All" />
        </div>
        <div className="h-scroll" style={{ marginTop: 18, padding: '0 16px 32px' }}>
          {trending.map((n, i) => (
            <div key={n} style={{ width: 140, flex: '0 0 140px' }}>
              <div className="ph" style={{ aspectRatio: '1', fontSize: 9 }}>portrait</div>
              <div style={{ marginTop: 10, fontSize: 13, fontWeight: 500 }}>{n}</div>
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.08em', color: 'var(--muted)', marginTop: 2, textTransform: 'uppercase' }}>
                Pulse {1240 - i * 150}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Marquee dark={dark} text="◆ 12,840 frames ◆ Season 04 ◆ Updated continuously ◆" />
      <Footer dark={dark} />
          <BottomNav active="explore" dark={dark} />
    </div>
  );
}

window.ScreenExplore = ScreenExplore;
