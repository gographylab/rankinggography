// Landing page — Hero + Featured + Customer section + Category teasers
// Two visual modes: atelier (Aesop-restraint) and editorial (magazine drama)
// Mode switch is driven by [data-mode] on body via tweaks; CSS handles most differentiation,
// JSX adds editorial-only modules (cover number, datelines, etc.)

function PageLanding() {
  const router = useRouter();
  const top = PHOTOS.slice(0, 1)[0];
  const voyageurUsernames = PHOTOGRAPHERS.filter(p => p.isCustomer).map(p => p.username);
  const voyageurPhotos = PHOTOS.filter(p => voyageurUsernames.includes(p.by)).slice().sort((a,b) => b.pulse - a.pulse);
  const byCat = {
    Landscape: PHOTOS.filter(p => p.cat === 'Landscape').slice(0, 3),
    Portrait: PHOTOS.filter(p => p.cat === 'Portrait').slice(0, 3),
    BW: PHOTOS.filter(p => p.cat === 'BW').slice(0, 3),
  };

  // Pulse leaderboard category filter (chips on the leaderboard section)
  const [leaderCat, setLeaderCat] = React.useState('All');
  const voyageurUsernamesSet = new Set(PHOTOGRAPHERS.filter(p => p.isCustomer).map(p => p.username));
  let leaderboardSource;
  if (leaderCat === 'All') leaderboardSource = PHOTOS.slice(0);
  else if (leaderCat === 'Voyageurs') leaderboardSource = PHOTOS.filter(p => voyageurUsernamesSet.has(p.by));
  else leaderboardSource = PHOTOS.filter(p => p.cat === leaderCat);
  const leaderboard = leaderboardSource.slice(0, 8);

  // All-time leaderboard: photos older than 1 week, ranked by lifetime engagement
  // For demo: sort by total likes + favorites (no time decay)
  const [alltimeCat, setAlltimeCat] = React.useState('All');
  // All-time score = total likes × 1 + favorites × 2 (favorites weight higher as "saved forever")
  const computeAlltime = (p) => p.likes + p.favorites * 2;
  let alltimeSource;
  if (alltimeCat === 'All') alltimeSource = PHOTOS.slice();
  else if (alltimeCat === 'Voyageurs') alltimeSource = PHOTOS.filter(p => voyageurUsernamesSet.has(p.by));
  else alltimeSource = PHOTOS.filter(p => p.cat === alltimeCat);
  alltimeSource = alltimeSource.slice().map(p => ({ ...p, _allTimeScore: computeAlltime(p) }));
  alltimeSource.sort((a,b) => b._allTimeScore - a._allTimeScore);
  // Attach an alltimeRank and overload pulse to show the all-time score (for the existing PhotoCard display)
  alltimeSource = alltimeSource.map((p, i) => ({ ...p, rank: i + 1, pulse: p._allTimeScore / 10 })); // Divide by 10 to keep within visual range
  const alltimeBoard = alltimeSource.slice(0, 8);

  // Voyageurs leaderboard filter (no Voyageurs chip — already filtered)
  const [voyageurCat, setVoyageurCat] = React.useState('All');
  const voyageurLeaderboard = (voyageurCat === 'All' ? voyageurPhotos : voyageurPhotos.filter(p => p.cat === voyageurCat)).slice(0, 4);

  return (
    <div className="page-fade">
      {/* ============ HERO ============ */}
      <section style={{ padding: '64px 0 96px' }}>
        <div className="wrap">
          {/* Editorial: cover number + dateline */}
          <div className="editorial-only" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingBottom: 24, marginBottom: 32, borderBottom: '1px solid var(--fg)' }}>
            <div className="mono" style={{ fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase' }}>VOL.01 — ISSUE 03 / MAR 2026</div>
            <div style={{ fontSize: 90, fontWeight: 700, lineHeight: 1, letterSpacing: '-.04em' }}>03</div>
            <div className="mono" style={{ fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase' }}>SPRING 2026 · LIVE</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'end' }}>
            <div>
              <div className="caps atelier-only" style={{ marginBottom: 28, opacity: .55 }}>Gography Photo Awards · Spring 2026</div>
              <h1 className="display-hero th" style={{
                margin: 0,
                fontSize: 'clamp(56px, 6.4vw, 92px)',
              }}>
                ภาพถ่ายที่<br />เล่าเรื่อง
              </h1>
              <p style={{ fontSize: 18, lineHeight: 1.55, marginTop: 32, maxWidth: 440, color: 'var(--fg-soft)' }} className="th">
                เวทีจัดอันดับภาพถ่ายโดยช่างภาพและนักเดินทาง — โหวต ค้นพบ และร่วมเลือกภาพแห่งฤดูกาล
              </p>
              <div style={{ display: 'flex', gap: 16, marginTop: 40 }}>
                <button className="btn btn-solid" onClick={() => router.go('/explore')}>Explore the gallery</button>
                <button className="btn btn-ghost" onClick={() => router.go('/about-ranking')}>How Pulse works</button>
              </div>

              {/* Editorial mode adds an issue mark */}
              <div className="editorial-only" style={{ marginTop: 56, paddingTop: 24, borderTop: '1px solid var(--rule)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, fontFamily: 'var(--mono)', fontSize: 11, lineHeight: 1.6 }}>
                  <div>
                    <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-.02em' }}>{PHOTOS.length * 7}</div>
                    <div style={{ opacity: .55, marginTop: 4 }}>PHOTOS THIS<br />SEASON</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-.02em' }}>{PHOTOGRAPHERS.length * 14}</div>
                    <div style={{ opacity: .55, marginTop: 4 }}>ACTIVE<br />PHOTOGRAPHERS</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-.02em' }}>156K</div>
                    <div style={{ opacity: .55, marginTop: 4 }}>VOTES<br />CAST</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero image */}
            <div style={{ position: 'relative' }} onClick={() => router.go(`/photo/${top.id}`)}>
              <div className="pimg" style={{ aspectRatio: '4/5', cursor: 'pointer', overflow: 'hidden' }}>
                <img src={top.src} alt={top.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ position: 'absolute', top: 16, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ background: 'var(--bg)', padding: '8px 12px' }}>
                  <div className="caps" style={{ fontSize: 10 }}>#1 this week</div>
                </div>
                <div style={{ background: 'var(--bg)', padding: '10px 14px' }}>
                  <div className="pulse"><span className="big" style={{ fontSize: 28 }}>{top.pulse.toFixed(0)}</span><span className="lab">Pulse</span></div>
                </div>
              </div>
              <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 500 }}>{top.title}</div>
                  <div className="pby" style={{ marginTop: 4 }}>{PHOTOGRAPHERS.find(p => p.username === top.by)?.name}</div>
                </div>
                <div className="mono" style={{ fontSize: 11, opacity: .55 }}>{top.exif.camera}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FEATURED — LEADERBOARD with category filter ============ */}
      <section style={{ padding: '40px 0 80px' }}>
        <div className="wrap">
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: 24, marginBottom: 24, borderBottom: '1px solid var(--rule)' }}>
            <div>
              <div className="caps" style={{ opacity: .55, marginBottom: 14 }}>This week</div>
              <h2 className="th" style={{ fontSize: 48, fontWeight: 400, letterSpacing: '-.025em', margin: 0, lineHeight: 1 }}>Pulse Leaderboard</h2>
            </div>
            <button onClick={() => {
              if (leaderCat === 'Voyageurs') router.go('/photographers/voyageurs');
              else if (leaderCat === 'All') router.go('/explore');
              else router.go(`/explore/${leaderCat.toLowerCase()}`);
            }} className="caps" style={{ cursor: 'pointer', borderBottom: '1px solid var(--fg)', paddingBottom: 4 }}>
              See all {
                leaderCat === 'All' ? PHOTOS.length * 7 :
                leaderCat === 'Voyageurs' ? PHOTOS.filter(p => voyageurUsernamesSet.has(p.by)).length * 3 :
                PHOTOS.filter(p => p.cat === leaderCat).length * 7
              } →
            </button>
          </div>

          {/* Category chips */}
          <CategoryChips value={leaderCat} onChange={setLeaderCat} showVoyageurs={true} />

          <div style={{ marginTop: 32 }}>
            <PhotoGrid photos={leaderboard} cols={4} showRank={true} showRankDelta={true} uniform={true} />
          </div>
        </div>
      </section>

      {/* ============ ALL-TIME LEADERBOARD ============ */}
      <section style={{ padding: '0 0 80px' }}>
        <div className="wrap">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: 24, marginBottom: 24, borderBottom: '1px solid var(--rule)' }}>
            <div>
              <div className="caps" style={{ opacity: .55, marginBottom: 14 }}>Beyond this week</div>
              <h2 className="th" style={{ fontSize: 48, fontWeight: 400, letterSpacing: '-.025em', margin: 0, lineHeight: 1 }}>All-time</h2>
              <p className="th" style={{ marginTop: 14, fontSize: 13, color: 'var(--fg-soft)', maxWidth: 540, lineHeight: 1.6 }}>
                ภาพที่อยู่บนเวทีมากกว่า 1 สัปดาห์ — จัดอันดับจากยอดรวมตลอดอายุ (likes + favorites) โดยไม่หักเวลา
              </p>
            </div>
            <button onClick={() => {
              if (alltimeCat === 'Voyageurs') router.go('/photographers/voyageurs');
              else if (alltimeCat === 'All') router.go('/explore');
              else router.go(`/explore/${alltimeCat.toLowerCase()}`);
            }} className="caps" style={{ cursor: 'pointer', borderBottom: '1px solid var(--fg)', paddingBottom: 4 }}>
              See archive →
            </button>
          </div>

          {/* Category chips */}
          <CategoryChips value={alltimeCat} onChange={setAlltimeCat} showVoyageurs={true} />

          <div style={{ marginTop: 32 }}>
            <PhotoGrid photos={alltimeBoard} cols={4} showRank={true} showRankDelta={true} uniform={true} pulseLabel="Total" />
          </div>
        </div>
      </section>

      {/* ============ FEATURED PHOTOGRAPHERS — GENERAL ============ */}
      <section style={{ padding: '40px 0 96px' }}>
        <div className="wrap">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingBottom: 28, marginBottom: 32, borderBottom: '1px solid var(--rule)' }}>
            <div>
              <div className="caps" style={{ opacity: .55, marginBottom: 12 }}>Featured Photographers · Week 12</div>
              <h2 className="th" style={{ fontSize: 'clamp(36px, 4.2vw, 56px)', fontWeight: 400, letterSpacing: '-.025em', margin: 0, lineHeight: 1 }}>
                ช่างภาพประจำสัปดาห์
              </h2>
            </div>
            <button onClick={() => router.go('/photographers')} className="caps" style={{ cursor: 'pointer', borderBottom: '1px solid var(--fg)', paddingBottom: 4 }}>
              View all photographers →
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {PHOTOGRAPHERS.filter(p => !p.isCustomer).slice(0, 4).map(p => (
              <PhotographerCard key={p.username} photographer={p} variant="general" />
            ))}
          </div>
        </div>
      </section>

      {/* ============ CUSTOMER SECTION — ACTIVATION-ORIENTED ============ */}
      <section style={{ padding: '96px 0', background: 'var(--cream)' }} className="rule-top rule-bot">
        <div className="wrap">
          {/* Eyebrow row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingBottom: 32, borderBottom: '1px solid var(--rule)', marginBottom: 56 }}>
            <div className="caps" style={{ opacity: .55, display: 'flex', alignItems: 'center', gap: 8 }}>
              <VoyageurMark size={9} /> The Voyageurs Programme
            </div>
            <div className="mono" style={{ fontSize: 11, opacity: .55 }}>EXCLUSIVE · CUSTOMERS ONLY</div>
          </div>

          {/* Headline + featured photo */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 80, alignItems: 'center' }}>
            <div>
              <h2 className="th" style={{ fontSize: 'clamp(40px, 4.6vw, 64px)', fontWeight: 400, letterSpacing: '-.025em', margin: 0, lineHeight: 1.05 }}>
                เดินทางกับเรามาแล้ว?<br />
                เป็น <em style={{ fontStyle: 'normal', fontWeight: 500 }}>Voyageur</em> ของเรา
              </h2>
              <p style={{ marginTop: 28, fontSize: 17, lineHeight: 1.65, color: 'var(--fg-soft)', maxWidth: 520 }} className="th">
                ลูกค้าที่เคยร่วมทริปกับ Gography จะได้รับสถานะ <strong style={{ color: 'var(--fg)', fontWeight: 500 }}>Voyageur</strong> — มีสิทธิ์ส่งภาพในหมวดพิเศษที่แข่งกันเฉพาะลูกค้าด้วยกัน ผู้ชนะแต่ละฤดูกาลรับ voucher 50,000 บาท และ Top 10 รับ cashback สำหรับทริปครั้งถัดไป
              </p>

              {/* Reward badges row */}
              <div style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap' }}>
                <RewardBadge icon="voucher" label="50,000 THB" sub="Voucher · ต่อหมวด" />
                <RewardBadge icon="cashback" label="3–15%" sub="Cashback · Top 10" />
                <RewardBadge icon="star" label="Voyageur" sub="Public badge · ตลอดชีพ" />
              </div>

              {/* CTA row */}
              <div style={{ display: 'flex', gap: 12, marginTop: 40, flexWrap: 'wrap' }}>
                <button className="btn btn-solid" onClick={() => router.go('/for-customers')}>วิธีเข้าร่วม Voyageurs</button>
                <Link to="/hall-of-fame" className="btn">ผู้ชนะที่ผ่านมา</Link>
              </div>

              <div className="mono" style={{ marginTop: 32, fontSize: 11, opacity: .55, lineHeight: 1.7 }}>
                เคยร่วมทริปแล้วยังไม่ได้รับการยืนยัน? <Link to="/for-customers#verify" style={{ borderBottom: '1px solid currentColor' }}>ขอสถานะที่นี่ →</Link>
              </div>
            </div>

            {/* Featured Voyageur photo */}
            <div>
              <div style={{ position: 'relative' }}>
                <div className="pimg" style={{ aspectRatio: '4/5', overflow: 'hidden', cursor: 'pointer' }} onClick={() => router.go('/photo/p015')}>
                  <img src={PHOTOS.find(p => p.id === 'p015').src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ position: 'absolute', top: 16, left: 16, background: 'var(--bg)', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <VoyageurMark size={8} />
                  <div className="caps" style={{ fontSize: 9 }}>Voyageur Pick</div>
                </div>
              </div>
              <div style={{ marginTop: 20, fontSize: 13, color: 'var(--fg-soft)', lineHeight: 1.7 }} className="th">
                <em style={{ fontStyle: 'normal', fontWeight: 500, color: 'var(--fg)' }}>"แสงแรกของวัน — Patagonia"</em> โดย <Link to="/photographer/pim.travels" style={{ borderBottom: '1px solid currentColor' }}>Pim Asanachinda</Link> · Gography Patagonia 2025
              </div>
            </div>
          </div>

          {/* 3-step process */}
          <div style={{ marginTop: 80, paddingTop: 56, borderTop: '1px solid var(--rule)' }}>
            <div className="caps" style={{ opacity: .55, marginBottom: 32 }}>How it works · 3 steps</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 56 }}>
              <Step n="01" t="รับการยืนยันสถานะ" b="หลังจบทริป ทีม Gography จะ mark บัญชีของคุณเป็น 'Voyageur' — คุณจะเห็น badge บนโปรไฟล์ภายใน 7 วัน" />
              <Step n="02" t="อัพโหลดภาพจากทริป" b="เลือกภาพที่ดีที่สุดของคุณจากทริปที่ผ่านมา · ส่งได้วันละ 1 รูปต่อบัญชี · ส่งสะสมต่อเนื่องตลอดฤดูกาล (4 เดือน)" />
              <Step n="03" t="ลุ้นรางวัล" b="ปลายฤดูกาล ทีมงานเลือกภาพดีที่สุดต่อหมวด — ผู้ชนะ 50,000 THB voucher และ Top 10 ได้ cashback 3–15% สำหรับทริปครั้งถัดไป" />
            </div>
          </div>
        </div>
      </section>

      {/* ============ VOYAGEURS — FEATURED CUSTOMER PHOTOGRAPHERS ============ */}
      <section style={{ padding: '96px 0' }}>
        <div className="wrap">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingBottom: 28, marginBottom: 32, borderBottom: '1px solid var(--fg)', borderBottomWidth: 2 }}>
            <div>
              <div className="caps" style={{ opacity: .55, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <VoyageurMark size={9} /> Voyageurs · Featured this season
              </div>
              <h2 className="th" style={{ fontSize: 'clamp(36px, 4.2vw, 56px)', fontWeight: 400, letterSpacing: '-.025em', margin: 0, lineHeight: 1 }}>
                ภาพถ่ายลูกค้า<br />จากทริป Gography
              </h2>
              <p className="th" style={{ marginTop: 18, fontSize: 14, color: 'var(--fg-soft)', maxWidth: 540, lineHeight: 1.7 }}>
                Voyageurs คือลูกค้าทริปของเรา ที่นำภาพจากการเดินทางมาร่วมประกวด — แข่งกันเองเพื่อชิงรางวัลพิเศษเฉพาะลูกค้า
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', gap: 18, marginBottom: 16 }}>
                <RewardBadge icon="voucher" label="50,000 THB" sub="Best photo · per category" />
                <RewardBadge icon="cashback" label="3–15%" sub="Cashback · Top 10" />
              </div>
              <button onClick={() => router.go('/for-customers')} className="caps" style={{ cursor: 'pointer', borderBottom: '1px solid var(--fg)', paddingBottom: 4 }}>
                Become a Voyageur →
              </button>
            </div>
          </div>

          {/* Voyageurs Pulse Leaderboard — top photos by customer photographers this season */}
          <div style={{ marginBottom: 56 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
              <div className="caps" style={{ opacity: .55, display: 'flex', alignItems: 'center', gap: 8 }}>
                <VoyageurMark size={8} /> Voyageurs Pulse · Spring 2026
              </div>
              <button onClick={() => router.go('/hall-of-fame')} className="caps" style={{ cursor: 'pointer', borderBottom: '1px solid var(--rule)', paddingBottom: 4, opacity: .65 }}>
                See full leaderboard →
              </button>
            </div>
            <CategoryChips value={voyageurCat} onChange={setVoyageurCat} />
            <div style={{ marginTop: 24 }}>
              {voyageurLeaderboard.length > 0 ? (
                <PhotoGrid photos={voyageurLeaderboard} cols={4} showRank={true} showRankDelta={true} uniform={true} />
              ) : (
                <div style={{ padding: '64px 0', textAlign: 'center', color: 'var(--fg-soft)', border: '1px solid var(--rule)' }} className="th">
                  ยังไม่มีภาพในหมวด {voyageurCat} จาก Voyageur ในฤดูกาลนี้
                </div>
              )}
            </div>
          </div>

          {/* Voyageur photographers */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24, paddingTop: 32, borderTop: '1px solid var(--rule)' }}>
            <div className="caps" style={{ opacity: .55 }}>Featured Voyageurs</div>
            <button onClick={() => router.go('/photographers/voyageurs')} className="caps" style={{ cursor: 'pointer', borderBottom: '1px solid var(--rule)', paddingBottom: 4, opacity: .65 }}>
              View all Voyageurs →
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {PHOTOGRAPHERS.filter(p => p.isCustomer).slice(0, 4).map(p => (
              <PhotographerCard key={p.username} photographer={p} variant="voyageur" />
            ))}
          </div>
        </div>
      </section>

      {/* ============ EDITOR'S NOTE ============ */}
      <section style={{ padding: '80px 0' }} className="rule-top">
        <div className="wrap">
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 300px', gap: 64, alignItems: 'start' }}>
            <div className="caps" style={{ opacity: .55 }}>Editor's note</div>
            <div>
              <p style={{ fontSize: 22, lineHeight: 1.5, margin: 0, letterSpacing: '-.005em' }} className="th">
                "ในฤดูกาลนี้ เราเห็นการเปลี่ยนแปลงของแสง — จากเทือกเขาทางเหนือ สู่ห้องสตูดิโอในกรุงเทพ ฯ ภาพเหล่านี้ไม่ได้อยู่ในที่เดียวกัน แต่หายใจในจังหวะเดียวกัน"
              </p>
              <div className="mono" style={{ marginTop: 32, fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', opacity: .65 }}>
                — Gography Editorial Team, March 2026
              </div>
            </div>
            <div />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

window.PageLanding = PageLanding;

function Step({ n, t, b }) {
  return (
    <div>
      <div className="mono" style={{ fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', opacity: .55 }}>{n}</div>
      <h3 style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-.01em', margin: '12px 0 0', lineHeight: 1.25 }} className="th">{t}</h3>
      <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--fg-soft)', marginTop: 14 }} className="th">{b}</p>
    </div>
  );
}

// Category filter chips — used on Pulse Leaderboard sections
// Click filters in-place; ↗ button opens /explore/:category in full
// `showVoyageurs` adds a luxury Voyageurs chip (gold, crown icon)
function CategoryChips({ value, onChange, showVoyageurs = false }) {
  const router = useRouter();
  const cats = [
    { v: 'All', l: 'All' },
    { v: 'Landscape', l: 'Landscape' },
    { v: 'Portrait', l: 'Portrait' },
    { v: 'BW', l: 'Black & White' },
  ];
  if (showVoyageurs) cats.push({ v: 'Voyageurs', l: 'Voyageurs', luxury: true });

  const GOLD = '#b08e54';

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {cats.map(c => {
          const active = value === c.v;
          const lux = c.luxury;
          // Borders & backgrounds:
          // - Active luxury: solid gold with white crown
          // - Inactive luxury: thin gold border, gold text, gold crown
          // - Active regular: solid black
          // - Inactive regular: thin grey border
          const bg = active ? (lux ? GOLD : 'var(--fg)') : 'transparent';
          const border = (lux ? GOLD : (active ? 'var(--fg)' : 'var(--rule)'));
          const fg = active ? (lux ? '#fff' : 'var(--bg)') : (lux ? GOLD : 'var(--fg)');
          return (
            <div key={c.v} style={{ display: 'flex' }}>
              <button
                onClick={() => onChange(c.v)}
                style={{
                  padding: '9px 14px',
                  border: '1px solid ' + border,
                  background: bg, color: fg,
                  fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'background .15s, border-color .15s, color .15s',
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                }}>
                {lux && <CrownIcon />}
                <span>{c.l}</span>
              </button>
              {/* Jump-to-explore link button — appears when category chip is active */}
              {active && c.v !== 'All' && c.v !== 'Voyageurs' && (
                <button
                  onClick={() => router.go(`/explore/${c.v.toLowerCase()}`)}
                  title={`Open ${c.l} category`}
                  style={{
                    padding: '9px 10px',
                    border: '1px solid var(--fg)',
                    borderLeft: 0,
                    background: 'var(--fg)', color: 'var(--bg)',
                    fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 500,
                    cursor: 'pointer',
                  }}>
                  ↗
                </button>
              )}
              {active && c.v === 'Voyageurs' && (
                <button
                  onClick={() => router.go('/photographers/voyageurs')}
                  title="Open Voyageurs directory"
                  style={{
                    padding: '9px 10px',
                    border: '1px solid ' + GOLD,
                    borderLeft: 0,
                    background: GOLD, color: '#fff',
                    fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 500,
                    cursor: 'pointer',
                  }}>
                  ↗
                </button>
              )}
            </div>
          );
        })}
      </div>
      <div className="mono" style={{ fontSize: 10.5, opacity: .55, letterSpacing: '.1em' }}>
        ↗ OPENS FULL CATEGORY PAGE
      </div>
    </div>
  );
}

function RewardBadge({ icon, label, sub }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 14px', border: '1px solid var(--rule)', minWidth: 180 }}>
      <div style={{ paddingTop: 2 }}>
        <RewardIcon kind={icon} size={20} />
      </div>
      <div style={{ textAlign: 'left' }}>
        <div className="mono" style={{ fontSize: 14, fontWeight: 500, letterSpacing: '-.01em', lineHeight: 1.1 }}>{label}</div>
        <div className="caps" style={{ opacity: .55, fontSize: 9.5, marginTop: 4 }}>{sub}</div>
      </div>
    </div>
  );
}
