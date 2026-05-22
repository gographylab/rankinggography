// About — manifesto-style page

function PageAbout() {
  return (
    <div className="page-fade">
      <section style={{ padding: '120px 0 96px' }}>
        <div className="wrap-narrow">
          <div className="caps" style={{ opacity: .55, marginBottom: 24, textAlign: 'center' }}>Gography Photo Awards</div>
          <h1 className="display-hero th" style={{ fontSize: 'clamp(48px, 6vw, 88px)', margin: 0, textAlign: 'center' }}>
            แพลตฟอร์มของช่างภาพ<br />ที่ไม่เคยหยุดเดินทาง
          </h1>
        </div>
      </section>

      <section style={{ padding: '0 0 96px' }}>
        <div className="wrap-narrow">
          <p style={{ fontSize: 22, lineHeight: 1.6, letterSpacing: '-.005em', color: 'var(--fg)' }} className="th">
            Gography เริ่มต้นจากบริษัททัวร์ — เราออกแบบทริปถ่ายภาพในที่ที่นักเดินทางไม่กี่คนได้ไป Patagonia, Iceland, Atacama, Mongolia เราอยากเห็นภาพเหล่านั้นมารวมตัวอยู่ในที่เดียว
          </p>
          <div className="magrule" style={{ margin: '48px 0' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--fg-soft)' }} className="th">
              500px ถูกขายไปนานแล้ว Instagram กลายเป็นที่ของ reel ที่เร่งจังหวะให้เร็วเกินกว่าภาพจะหายใจ เราเห็นช่องว่าง — ที่สำหรับภาพถ่ายที่ทำด้วยใจ ไม่ใช่ algorithm
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--fg-soft)' }} className="th">
              Gography Photo Awards คือเวทีที่นั่น คะแนนจัดอันดับเปิดเผยทั้งหมด ทุก 4 เดือนเราเลือกภาพที่ดีที่สุดของฤดูกาล มอบ Voucher 50,000 บาท และเก็บไว้ใน Hall of Fame ตลอดไป
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: '96px 0', background: 'var(--cream)' }} className="rule-top rule-bot">
        <div className="wrap">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 48 }} className="mono">
            <BigStat n="2026" l="Launched" />
            <BigStat n="3" l="Categories at launch" />
            <BigStat n="50K" l="THB voucher per season" />
            <BigStat n="∞" l="Hall of Fame slots" />
          </div>
        </div>
      </section>

      <section style={{ padding: '96px 0' }}>
        <div className="wrap-narrow">
          <SectionHeader title="ทีมงาน" eyebrow="Editorial team" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
            {[
              { name: 'Anan Khamthuan', role: 'Editor in Chief', loc: 'Bangkok' },
              { name: 'Sasin Phongphan', role: 'Curation Director', loc: 'Chiang Mai' },
              { name: 'Vichai Sasiprapha', role: 'Travel Lead, Gography', loc: 'Bangkok' },
              { name: 'Naree Suwannapong', role: 'Community', loc: 'Bangkok' },
            ].map(p => (
              <div key={p.name} style={{ paddingBottom: 32, borderBottom: '1px solid var(--rule)' }}>
                <h4 style={{ fontSize: 22, fontWeight: 400, letterSpacing: '-.015em', margin: 0 }}>{p.name}</h4>
                <div className="caps" style={{ opacity: .55, marginTop: 8 }}>{p.role} · {p.loc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '96px 0 120px' }} className="rule-top">
        <div className="wrap-narrow" style={{ textAlign: 'center' }}>
          <h2 className="th" style={{ fontSize: 44, fontWeight: 400, letterSpacing: '-.02em', margin: 0, lineHeight: 1.15 }}>
            อยากเป็นส่วนหนึ่งของเรา?
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 32 }}>
            <button className="btn btn-solid">Apply as photographer</button>
            <button className="btn">Travel with Gography</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function BigStat({ n, l }) {
  return (
    <div>
      <div style={{ fontSize: 56, fontWeight: 500, letterSpacing: '-.03em', lineHeight: 1 }}>{n}</div>
      <div style={{ fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', opacity: .55, marginTop: 16 }}>{l}</div>
    </div>
  );
}

window.PageAbout = PageAbout;
