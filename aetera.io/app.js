/* =========================================================
   aetera v5 · main app
   ========================================================= */

// Hero cruise speed constant
const HERO_SPEED = 300;


// ============ i18n ===================================
// Translations and setLang() are defined in i18n.js (loaded before this file).
// window.LANG, window.I18N, window.setLang are available globally.

// ============ Content model =====================

const MAIN_HTML = `
<!-- ============ THESIS ============ -->
<section class="blk thesis" id="thesis" data-screen-label="02 Thesis">
  <div class="container">
    <div class="sec-head">
      <div class="sec-num">§ 01 / INVESTMENT THESIS</div>
      <div>
        <h2 class="sec-title" data-i18n="thesis.title">A new category. Not a better train.</h2>
        <div class="sec-sub" data-i18n="thesis.sub">Transport infrastructure has compounded at ~0.4% / yr for 150 years. Every major system — road, rail, metro, aviation — shares the same physical constraints: fixed corridors, fleets, terminals, schedules. aetera is the first architecture that doesn't.</div>
      </div>
    </div>

    <div class="thesis-grid">
      <div class="thesis-lede" data-i18n="thesis.lede">
        We are designing technology to move <strong>people and cargo</strong> at <span class="hi">300+ km/h</span> between <strong>any two points</strong>, without roads, rails, or fixed fleets — at <span class="hi">1 / 250th</span> the per-km cost of metro and a <span class="hi">6× faster</span> door-to-door time.
      </div>
      <aside class="thesis-aside">
        <div>
          <h4 data-i18n="thesis.why1">Why now</h4>
          <p data-i18n="thesis.why1.p">A <strong>$6.3T</strong> global infrastructure backlog by 2040. Rising land costs. Rising climate friction. Municipalities are out of runway with legacy systems.</p>
        </div>
        <div>
          <h4 data-i18n="thesis.why2">Why us</h4>
          <p data-i18n="thesis.why2.p">PCT application filed. Engineering model validated. First-principles architecture with <strong>no network dependency</strong> — every deployment is a standalone economic unit.</p>
        </div>
        <div>
          <h4 data-i18n="thesis.why3">Why defensible</h4>
          <p data-i18n="thesis.why3.p">Core IP locked. Known substitutes require 2–3 orders of magnitude more capital. Unit economics break even on day one of operation.</p>
        </div>
      </aside>
      <div class="thesis-pills">
        <span class="pill hi">▲ category-zero</span>
        <span class="pill">PCT filed</span>
        <span class="pill">pre-revenue</span>
        <span class="pill">hardware + software</span>
        <span class="pill">B2G · B2B</span>
        <span class="pill">250-yr asset life</span>
        <span class="pill">autonomous units</span>
      </div>
    </div>
  </div>
</section>

<!-- ============ SPECS · scrollytelling ============ -->
<section class="blk specs" id="specs" data-screen-label="03 Specs">
  <div class="container">
    <div class="sec-head">
      <div class="sec-num">§ 02 / ENGINEERING SPECS</div>
      <div>
        <h2 class="sec-title" data-i18n="specs.title">Performance envelope.</h2>
        <div class="sec-sub" data-i18n="specs.sub">Design targets derived from validated physics models. Figures below are nominal operating specifications, not demonstrated records.</div>
      </div>
    </div>
  </div>

  <div class="spec-steps">
    <div class="spec-rail">
      <div class="spec-bg-grid"></div>
      <div class="spec-progress" id="spec-progress"></div>
      <div id="spec-stage"></div>
    </div>
    <div id="spec-scroller"></div>
  </div>
  <div class="container">
    <div class="specs-footnote mono-xs" data-i18n="specs.footnote" style="margin-top:2rem; opacity:0.4; text-align:right;"></div>
  </div>
</section>

<!-- ============ COMPARE ============ -->
<section class="blk compare" id="compare" data-screen-label="04 Compare">
  <div class="container">
    <div class="sec-head">
      <div class="sec-num">§ 03 / SIDE-BY-SIDE</div>
      <div>
        <h2 class="sec-title" data-i18n="compare.title">Versus every legacy mode.</h2>
        <div class="sec-sub" data-i18n="compare.sub">All figures normalised per operational km, reviewed against public data from Federal Highway Admin (US), UIC (rail), and municipal metro disclosures (Paris, Singapore, Moscow 2022–2024).</div>
      </div>
    </div>

    <div class="cmp-nav-mobile">
      <span class="mono-xs" style="color:var(--ink-dim);letter-spacing:0.1em;">SCROLL TABLE</span>
      <div class="cmp-nav-btns">
        <button class="cmp-btn" id="cmp-prev" aria-label="previous column">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button class="cmp-btn" id="cmp-next" aria-label="next column">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </div>

    <div class="cmp-table-wrap" id="cmp-table-wrap">
      <table class="cmp-table">
        <thead>
          <tr>
            <th data-i18n="compare.col.param">Parameter</th>
            <th class="col-aetera">aetera</th>
            <th data-i18n="compare.col.road">Road</th>
            <th data-i18n="compare.col.railway">Railway</th>
            <th data-i18n="compare.col.metro">Metro</th>
          </tr>
        </thead>
        <tbody id="cmp-body"></tbody>
      </table>
    </div>
    <div class="cmp-foot">
      <span>Source: aetera engineering model, 2026</span>
      <span>confidence: high · figures disclosed in full under NDA</span>
    </div>
  </div>
</section>

<!-- ============ ECONOMICS ============ -->
<section class="blk economics" id="economics" data-screen-label="05 Economics">
  <div class="container">
    <div class="sec-head">
      <div class="sec-num">§ 04 / UNIT ECONOMICS</div>
      <div>
        <h2 class="sec-title" data-i18n="econ.title">The numbers that close the deal.</h2>
        <div class="sec-sub" data-i18n="econ.sub">Financial model based on 50-km reference corridor with 620 pax/hr (nominal) capacity. Full assumptions included in the NDA-level dossier.</div>
      </div>
    </div>

    <div class="econ-grid">
      <div class="econ-card">
        <div class="econ-card-head">
          <div>
            <div class="econ-card-title" data-i18n="econ.card1.title">Build cost / km</div>
            <div class="econ-card-sub" data-i18n="econ.card1.sub">CAPEX · $ thousand · log scale</div>
          </div>
          <div class="econ-card-tag">250× Δ</div>
        </div>
        <div class="bar-chart" data-chart="cost">
          <div class="bar-col hi"><div class="bar-value">$120K</div><div class="bar-body aetera" data-h="12"></div><div class="bar-label">aetera</div></div>
          <div class="bar-col"><div class="bar-value">$400K</div><div class="bar-body" data-h="24"></div><div class="bar-label">road</div></div>
          <div class="bar-col"><div class="bar-value">$5M</div><div class="bar-body" data-h="40"></div><div class="bar-label">railway</div></div>
          <div class="bar-col"><div class="bar-value">$30M</div><div class="bar-body" data-h="100"></div><div class="bar-label">metro</div></div>
        </div>
      </div>

      <div class="econ-card">
        <div class="econ-card-head">
          <div>
            <div class="econ-card-title" data-i18n="econ.card2.title">Door-to-door speed</div>
            <div class="econ-card-sub" data-i18n="econ.card2.sub">pt-to-pt · km/h · effective</div>
          </div>
          <div class="econ-card-tag">6.0× Δ</div>
        </div>
        <div class="bar-chart" data-chart="speed">
          <div class="bar-col hi"><div class="bar-value">300</div><div class="bar-body aetera" data-h="100"></div><div class="bar-label">aetera</div></div>
          <div class="bar-col"><div class="bar-value">~70</div><div class="bar-body" data-h="22"></div><div class="bar-label">rail</div></div>
          <div class="bar-col"><div class="bar-value">~50</div><div class="bar-body" data-h="16"></div><div class="bar-label">road</div></div>
          <div class="bar-col"><div class="bar-value">~40</div><div class="bar-body" data-h="13"></div><div class="bar-label">metro</div></div>
        </div>
      </div>

      <div class="econ-card">
        <div class="econ-card-head">
          <div>
            <div class="econ-card-title" data-i18n="econ.card3.title">Payback curve</div>
            <div class="econ-card-sub" data-i18n="econ.card3.sub">cumulative cash · 50 km corridor · $M</div>
          </div>
          <div class="econ-card-tag">3.2 yr PBP</div>
        </div>
        <div class="payback-chart" id="payback-chart"></div>
      </div>

      <div class="econ-card">
        <div class="econ-card-head">
          <div>
            <div class="econ-card-title" data-i18n="econ.card4.title">Unit economics · per 50 km node</div>
            <div class="econ-card-sub" data-i18n="econ.card4.sub">annual, steady state · $M</div>
          </div>
          <div class="econ-card-tag">78% EBITDA</div>
        </div>
        <div class="ledger">
          <div class="ledger-row"><span class="ledger-k" data-i18n="econ.ledger.rev">Revenue (pax + cargo)</span><span class="ledger-v pos">+ 48.0</span></div>
          <div class="ledger-row"><span class="ledger-k" data-i18n="econ.ledger.energy">Energy</span><span class="ledger-v neg">− 3.6</span></div>
          <div class="ledger-row"><span class="ledger-k" data-i18n="econ.ledger.maint">Maintenance</span><span class="ledger-v neg">− 4.2</span></div>
          <div class="ledger-row"><span class="ledger-k" data-i18n="econ.ledger.ops">Operations</span><span class="ledger-v neg">− 2.8</span></div>
          <div class="ledger-row"><span class="ledger-k" data-i18n="econ.ledger.sga">SG&amp;A (allocated)</span><span class="ledger-v neg">− 0.9</span></div>
          <div class="ledger-row total"><span class="ledger-k" data-i18n="econ.ledger.ebitda">EBITDA</span><span class="ledger-v">+ 36.5</span></div>
        </div>
        <div class="econ-foot">
          <span>Capex / node · $6.0M</span>
          <span>IRR (10y) · 42%</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============ MARKET ============ -->
<section class="blk market" id="market" data-screen-label="06 Market">
  <div class="container">
    <div class="sec-head">
      <div class="sec-num">§ 05 / ADDRESSABLE MARKET</div>
      <div>
        <h2 class="sec-title" data-i18n="market.title">Corridors, not customers.</h2>
        <div class="sec-sub" data-i18n="market.sub">Every pair of points with persistent intercity demand is a potential deployment. 24 priority corridors identified across 4 continents; 6 in active conversation.</div>
      </div>
    </div>

    <div class="market-layout">
      <div class="market-tam">
        <div class="tam-item">
          <div class="tam-k" data-i18n="tam.1.k">TAM · global transport infra</div>
          <div class="tam-v" translate="no">$9.4<span class="unit">trillion / yr</span></div>
          <div class="tam-desc" data-i18n="tam.1.desc">OECD 2040 projection, all modes</div>
        </div>
        <div class="tam-item">
          <div class="tam-k" data-i18n="tam.2.k">SAM · high-density corridors</div>
          <div class="tam-v" translate="no">$1.2<span class="unit">trillion / yr</span></div>
          <div class="tam-desc" data-i18n="tam.2.desc">Top 400 intercity pairs, 500–5000 km</div>
        </div>
        <div class="tam-item">
          <div class="tam-k" data-i18n="tam.3.k">SOM · year-10 realistic</div>
          <div class="tam-v" translate="no">$28<span class="unit">billion / yr</span></div>
          <div class="tam-desc" data-i18n="tam.3.desc">22 corridors at 2.3% capture</div>
        </div>
        <div class="tam-item">
          <div class="tam-k" data-i18n="tam.4.k">First pilot target</div>
          <div class="tam-v" translate="no">50<span class="unit">km</span></div>
          <div class="tam-desc" data-i18n="tam.4.desc">Deployable &lt; 18 months post Series A</div>
        </div>
      </div>

      <div>
        <div class="map-wrap">
          <svg viewBox="0 0 1000 500" id="world-map" preserveAspectRatio="xMidYMid meet"></svg>
        </div>
        <div class="map-legend">
          <div><span class="leg-swatch" style="background:var(--map-active)"></span>Active conversation (6)</div>
          <div><span class="leg-swatch" style="background:var(--map-sec)"></span>Priority corridor (24)</div>
          <div><span class="leg-swatch" style="background:var(--ink-faint)"></span>Secondary (80+)</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============ SCENARIOS ============ -->
<section class="scenarios" id="scenarios" data-screen-label="07 Scenarios">
  <div class="container">
    <div class="scenarios-head">
      <div>
        <div class="sec-num">§ 06 / DEPLOYMENT</div>
        <h2 class="sec-title" style="margin-top:20px;" data-i18n="scenarios.title">Where it lives.</h2>
      </div>
      <div class="scenarios-nav">
        <button class="scn-btn" id="scn-prev" aria-label="previous">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button class="scn-btn" id="scn-next" aria-label="next">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </div>

    <div class="scn-strip" id="scn-strip"></div>
  </div>
</section>

<!-- ============ ADVANTAGES ============ -->
<section class="blk advantages" id="advantages">
  <div class="container">
    <div class="sec-head">
      <div class="sec-num">§ 07 / STRATEGIC EDGE</div>
      <div>
        <h2 class="sec-title" data-i18n="adv.title">What makes it uninvestable to copy.</h2>
      </div>
    </div>
    <div class="adv-grid">
      <div class="adv-cell">
        <div>
          <div class="adv-idx">A1</div>
          <h4 style="margin-top:12px;" data-i18n="adv.1.title">Rapid deployment</h4>
          <p data-i18n="adv.1.p">No multi-year construction. First commercial corridor targeted within 36 months of Series A close.</p>
        </div>
        <div class="foot">MOS · 18–36 mo</div>
      </div>
      <div class="adv-cell">
        <div>
          <div class="adv-idx">A2</div>
          <h4 style="margin-top:12px;" data-i18n="adv.2.title">Minimal footprint</h4>
          <p data-i18n="adv.2.p">Negligible land acquisition. Permitting scope closer to utility easement than infrastructure project.</p>
        </div>
        <div class="foot">&lt; 1% of rail footprint</div>
      </div>
      <div class="adv-cell">
        <div>
          <div class="adv-idx">A3</div>
          <h4 style="margin-top:12px;" data-i18n="adv.3.title">Unbounded TAM</h4>
          <p data-i18n="adv.3.p">Every two points on earth are a potential route. No network dependency, no hub constraint, no demand cannibalization.</p>
        </div>
        <div class="foot">N² addressable pairs</div>
      </div>
      <div class="adv-cell">
        <div>
          <div class="adv-idx">A4</div>
          <h4 style="margin-top:12px;" data-i18n="adv.4.title">Uncontested markets</h4>
          <p data-i18n="adv.4.p">Operates where roads can't — national parks, heritage sites, low-density terrain. No direct competition in the primary segments.</p>
        </div>
        <div class="foot">category-zero entry</div>
      </div>
    </div>
  </div>
</section>

<!-- ============ ROADMAP ============ -->
<section class="blk roadmap" id="roadmap" data-screen-label="08 Roadmap">
  <div class="container">
    <div class="sec-head">
      <div class="sec-num">§ 08 / EXECUTION</div>
      <div>
        <h2 class="sec-title" data-i18n="roadmap.title">Four phases. Two rounds. One pilot.</h2>
        <div class="sec-sub" data-i18n="roadmap.sub">Capital plan aligned to de-risked milestones. Each phase produces a hard gate before the next opens.</div>
      </div>
    </div>

    <div class="rm-header">
      <div data-i18n="rm.col.phase">Phase</div>
      <div data-i18n="rm.col.capital">Capital</div>
      <div data-i18n="rm.col.milestones">Milestones</div>
      <div data-i18n="rm.col.technical">Technical</div>
      <div data-i18n="rm.col.timeline">Timeline</div>
    </div>

    <div class="rm-row">
      <div class="rm-phase"><span data-i18n="rm.p1.name">01 Foundation</span> <span class="badge done" data-i18n="rm.badge.done">complete</span></div>
      <div class="rm-cell" data-i18n="rm.r1.cap"><span class="k">Self-funded</span>IP filing + engineering model</div>
      <div class="rm-cell" data-i18n="rm.r1.miles"><ul><li>PCT application filed</li><li>Physics validated</li><li>Ops model drafted</li></ul></div>
      <div class="rm-cell dim" data-i18n="rm.r1.tech"><span class="k">TRL 2–3</span>Paper design, simulation</div>
      <div class="rm-cell dim">2023 – 2025</div>
    </div>

    <div class="rm-row">
      <div class="rm-phase"><span data-i18n="rm.p2.name">02 Prototype</span> <span class="badge active" data-i18n="rm.badge.active">active</span></div>
      <div class="rm-cell" data-i18n="rm.r2.cap"><span class="k">Pre-seed · $1.5M</span>current round</div>
      <div class="rm-cell" data-i18n="rm.r2.miles"><ul><li>Bench prototype</li><li>Regulatory scoping</li><li>Founding team → 5</li></ul></div>
      <div class="rm-cell" data-i18n="rm.r2.tech"><span class="k">TRL 4</span>Component validation</div>
      <div class="rm-cell">Q2 2026 – Q4 2026</div>
    </div>

    <div class="rm-row">
      <div class="rm-phase"><span data-i18n="rm.p3.name">03 Scale</span> <span class="badge" data-i18n="rm.badge.upcoming">upcoming</span></div>
      <div class="rm-cell" data-i18n="rm.r3.cap"><span class="k">Series A · $18M</span>targeted H1 2027</div>
      <div class="rm-cell" data-i18n="rm.r3.miles"><ul><li>Full-scale prototype</li><li>First corridor LOI</li><li>Manufacturing partner</li></ul></div>
      <div class="rm-cell" data-i18n="rm.r3.tech"><span class="k">TRL 6</span>Full-scale demo</div>
      <div class="rm-cell">2027 – 2028</div>
    </div>

    <div class="rm-row">
      <div class="rm-phase"><span data-i18n="rm.p4.name">04 Deploy</span> <span class="badge" data-i18n="rm.badge.upcoming">upcoming</span></div>
      <div class="rm-cell" data-i18n="rm.r4.cap"><span class="k">Series B · $80M+</span>targeted 2028</div>
      <div class="rm-cell" data-i18n="rm.r4.miles"><ul><li>First 50-km pilot live · Q4 2027*</li><li>Revenue &gt; $15M</li><li>2 additional corridors signed</li></ul></div>
      <div class="rm-cell" data-i18n="rm.r4.tech"><span class="k">TRL 8–9</span>Commercial deployment</div>
      <div class="rm-cell">Q4 2027 – 2029</div>
    </div>

    <div class="rm-note" data-i18n="rm.note">* Pilot timeline contingent on Series A close; compression possible with accelerated funding.</div>

    <div class="rm-strip">
      <div class="rm-strip-fill"></div>
    </div>
    <div class="rm-strip-markers">
      <span>2023</span><span>2025</span><span>2026 ∞ NOW</span><span>2027</span><span>2029</span>
    </div>
  </div>
</section>

<!-- ============ ABOUT / IP ============ -->
<section class="blk about" id="about" data-screen-label="09 About">
  <div class="container">
    <div class="about-grid">
      <div class="about-quote">
        <div class="sec-num" style="margin-bottom:24px;">§ 09 / FOUNDERS</div>
        <span data-i18n="about.quote">aetera was founded on a single observation: every major transport system built in the last 150 years shares the same fundamental constraints. <span class="hi">We found a way around them.</span><br><br>The <strong>technology is covered by a filed PCT application</strong> and disclosed in full under NDA. What we can say publicly: it operates at scale, costs a fraction of existing infrastructure, and requires no roads or rails.</span>
      </div>
      <div class="ip-card">
        <h4 data-i18n="ip.head">IP · Intellectual property</h4>
        <div class="ip-title" data-i18n="ip.subtitle">Core architecture filed under PCT framework; disclosure restricted.</div>
        <dl>
          <dt data-i18n="ip.type.k">Application type</dt><dd data-i18n="ip.type.v">PCT international</dd>
          <dt data-i18n="ip.status.k">Filing status</dt><dd data-i18n="ip.status.v">Filed · pending</dd>
          <dt data-i18n="ip.breadth.k">Claim breadth</dt><dd data-i18n="ip.breadth.v">System + method + mechanism</dd>
          <dt data-i18n="ip.territory.k">Territorial entry</dt><dd data-i18n="ip.territory.v">EU, US, JP, CN, IN, RU targeted</dd>
          <dt data-i18n="ip.date.k">Priority date</dt><dd data-i18n="ip.date.v">Disclosed under NDA</dd>
          <dt data-i18n="ip.freedom.k">Substitute freedom</dt><dd data-i18n="ip.freedom.v">None known in art</dd>
        </dl>
      </div>
    </div>
  </div>
</section>

<!-- ============ FAQ ============ -->
<section class="blk faq" id="faq" data-screen-label="10 FAQ">
  <div class="container">
    <div class="sec-head">
      <div class="sec-num">§ 10 / FAQ</div>
      <div>
        <h2 class="sec-title" data-i18n="faq.title">What you'll ask next.</h2>
      </div>
    </div>
    <div class="faq-list" id="faq-list"></div>
  </div>
</section>

<!-- ============ CONTACT ============ -->
<section class="blk contact" id="contact" data-screen-label="11 Contact">
  <div class="container">
    <div class="contact-grid">
      <div class="contact-side">
        <div class="sec-num">§ 11 / ACCESS</div>
        <div class="lg-title" data-i18n="contact.title">Request<br>access.</div>
        <div class="contact-note" data-i18n="contact.note">Restricted channel. Full technical documentation, financial model, and IP summary are available exclusively under NDA. We respond personally, typically within 48 hours.</div>
        <div class="contact-signals">
          <div class="row"><span data-i18n="cs.sla.k">Response SLA</span><span class="v" data-i18n="cs.sla.v">&lt; 48h</span></div>
          <div class="row"><span data-i18n="cs.nda.k">NDA mechanism</span><span class="v" data-i18n="cs.nda.v">mutual · email · no wet-sign</span></div>
          <div class="row"><span data-i18n="cs.aud.k">Audience</span><span class="v" translate="no">VC · strategic · LP</span></div>
          <div class="row"><span data-i18n="cs.stage.k">Stage</span><span class="v" data-i18n="cs.stage.v">pre-seed · active</span></div>
          <div class="row"><span data-i18n="cs.round.k">Round target</span><span class="v" translate="no">$1.5M</span></div>
          <div class="row"><span data-i18n="cs.direct.k">Direct</span><span class="v" translate="no">info@aetera.io</span></div>
        </div>
        <div class="contact-connect">
          <div class="connect-label mono-xs">CONNECT</div>
          <div class="connect-social">
            <a href="mailto:info@aetera.io" class="soc-btn" title="Email">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </a>
            <a href="https://x.com/aetera_official" target="_blank" rel="noopener" class="soc-btn" title="X / Twitter">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L2.25 2.25h6.961l4.265 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://linkedin.com/company/aetera/" target="_blank" rel="noopener" class="soc-btn" title="LinkedIn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="https://t.me/aetera_official" target="_blank" rel="noopener" class="soc-btn" title="Telegram">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            </a>
          </div>
        </div>
      </div>
      <form class="cform" id="cform" novalidate>
        <div class="fgroup"><label for="fullname" data-i18n="form.fullname">Full name</label><input type="text" id="fullname" name="fullname" required></div>
        <div class="fgroup"><label for="email" data-i18n="form.email">Work email</label><input type="email" id="email" name="email" required></div>
        <div class="fgroup"><label for="company" data-i18n="form.company">Company / Fund</label><input type="text" id="company" name="company" required></div>
        <div class="fgroup"><label for="linkedin" data-i18n="form.linkedin">LinkedIn URL (Optional)</label><input type="url" id="linkedin" name="linkedin"></div>
        <div class="fgroup"><label for="notes" data-i18n="form.notes">Notes / Areas of Interest (Optional)</label><textarea id="notes" name="notes" rows="2" placeholder="e.g., Requesting engineering dossier / scheduling a call" data-i18n-ph="form.notes.ph"></textarea></div>
        <div class="form-error" id="form-error" style="display:none;font-family:var(--ff-mono);font-size:12px;color:#e86060;margin-top:-8px;"></div>
        <button type="submit" class="btn-primary" style="align-self:start;margin-top:8px;">
          <span id="cform-label" data-i18n="form.submit">Request Access</span><span class="arrow">→</span>
        </button>
        <div class="form-social-mobile">
          <span class="mono-xs" style="color:var(--ink-dim);letter-spacing:0.1em;">CONNECT</span>
          <div class="form-social-links">
            <a href="mailto:info@aetera.io" class="soc-btn" title="Email">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </a>
            <a href="https://x.com/aetera_official" target="_blank" rel="noopener" class="soc-btn" title="X / Twitter">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L2.25 2.25h6.961l4.265 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://linkedin.com/company/aetera/" target="_blank" rel="noopener" class="soc-btn" title="LinkedIn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="https://t.me/aetera_official" target="_blank" rel="noopener" class="soc-btn" title="Telegram">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            </a>
          </div>
        </div>
      </form>
    </div>
  </div>
</section>

<!-- ============ FOOTER ============ -->
<footer>
  <div class="foot">
    <div>
      <div class="foot-brand">
        aetera<small>engineering-grade mobility · 2026</small>
      </div>
    </div>
    <div class="foot-col">
      <h5 data-i18n="foot.explore">Explore</h5>
      <a href="#thesis" data-i18n="foot.thesis">Thesis</a>
      <a href="#specs" data-i18n="foot.specs">Specs</a>
      <a href="#economics" data-i18n="foot.economics">Economics</a>
      <a href="#market" data-i18n="foot.market">Market</a>
    </div>
    <div class="foot-col">
      <h5 data-i18n="foot.company">Company</h5>
      <a href="#about" data-i18n="foot.about">About</a>
      <a href="#roadmap" data-i18n="foot.roadmap">Roadmap</a>
      <a href="#contact" data-i18n="foot.contact">Contact</a>
    </div>
    <div class="foot-col">
      <h5 data-i18n="foot.connect">Connect</h5>
      <a href="mailto:info@aetera.io">info@aetera.io</a>
      <a href="https://x.com/aetera_official" target="_blank" rel="noopener">X</a>
      <a href="https://linkedin.com/company/aetera/" target="_blank" rel="noopener">LinkedIn</a>
      <a href="https://t.me/aetera_official" target="_blank" rel="noopener">Telegram</a>
    </div>
  </div>
  <div class="foot-bottom">
    <span data-i18n="foot.copy">© 2026 Aetera · All rights reserved</span>
    <span>PHASE 02 · PRE-SEED · ACTIVE</span>
  </div>
</footer>
`;

// inject
document.getElementById('main-content').innerHTML = MAIN_HTML;

// ============ Optimized Noise ============
(function initNoise() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const size = 128;
  canvas.width = size;
  canvas.height = size;
  
  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const v = Math.random() * 255;
    data[i] = v;
    data[i+1] = v;
    data[i+2] = v;
    data[i+3] = 20; // very subtle opacity
  }
  
  ctx.putImageData(imgData, 0, 0);
  const noiseEl = document.getElementById('noise');
  if (noiseEl) {
    noiseEl.style.backgroundImage = `url(${canvas.toDataURL()})`;
  }
})();

// Fix iOS Safari 100vh bug — sets --vh CSS variable to actual visible height
function fixVH(){
  document.documentElement.style.setProperty('--vh', window.innerHeight * 0.01 + 'px');
}
fixVH();
window.addEventListener('resize', fixVH);

// ============ SPECS data & scrollytelling ============
const SPECS = [
  { idx:'S01', big:'300', unit:'km/h', label:'Cruise velocity', title:'Intercity speed. Effective, door-to-door.',
    desc:'Operational cruise speed. 3× intercity rail. 6× road traffic. No stops, no terminals, no transfers. Peak design envelope reaches 400 km/h.',
    stats:[['cruise speed', '300 km/h'],['peak', '400 km/h'],['energy/unit', '13.4–13.8 kWh / 100 km'],['noise', '< 55 dB']],
    ru:{ label:'Крейсерская скорость', title:'Межгородская скорость. Эффективная, от двери до двери.',
      desc:'Рабочая крейсерская скорость — в 3 раза выше межгородской железной дороги и в 6 раз — автопотока. Никаких остановок, терминалов и пересадок. Пиковый конструктивный потолок — 400 км/ч.',
      stats:[['крейсерская', '300 км/ч'],['пик', '400 км/ч'],['энергия/юнит', '13.4–13.8 кВт·ч / 100 км'],['шум', '< 55 дБ']] }
  },
  { idx:'S02', big:'Up to 620', unit:'pax/hr', label:'Nominal throughput', title:'High-frequency corridor capacity.',
    desc:'Nominal per-direction capacity based on 62% target utilization. Scalable to 100M+ tons/yr for cargo-only configurations.',
    stats:[['dir', '2-way'],['pax/unit', '8'],['headway', '28 s'],['util target', '62%']],
    ru:{ label:'Рабочая мощность', title:'Пропускная способность коридора.',
      desc:'Номинальная мощность в одном направлении при целевой утилизации 62%. Масштабируется до 100 млн+ тонн/год в грузовых конфигурациях.',
      stats:[['направление', '2-стороннее'],['пас/состав', '8'],['интервал', '28 с'],['утилизация', '62%']] }
  },
  { idx:'S03', big:'From $120', unit:'K / km', label:'Build cost', title:'Per-km CAPEX at deployment scale.',
    desc:'Target unit build cost (excl. land). Baseline configuration. Substantial cost-down potential (20–30%) projected after initial optimization.',
    stats:[['ratio vs metro', '1 / 250'],['construction', '< 6 mo / 10 km'],['permitting', 'utility-grade'],['land take', '< 0.3 ha/km']],
    ru:{ label:'Стоимость строительства', title:'CAPEX на км при развёртывании в масштабе.',
      desc:'Целевая стоимость строительства (без учета земли). Базовая конфигурация. Потенциал снижения CAPEX еще на 20–30% по мере оптимизации.',
      stats:[['к метро', '1 / 250'],['строительство', '< 6 мес. / 10 км'],['согласования', 'утил. уровень'],['земля', '< 0,3 га/км']] }
  },
  { idx:'S04', big:'< $10K', unit:'/ unit', label:'Vehicle cost', title:'Mass-producible fleet economics.',
    desc:'Hyper-lightweight autonomous units. Free from heavy onboard batteries, driver cabins, and complex compute. Radically cheaper than conventional rolling stock.',
    stats:[['capacity', '1–4+ pax'],['propulsion', 'track-integrated']],
    ru:{ label:'Стоимость юнита', title:'Экономика массового производства.',
      desc:'Сверхлегкие автономные капсулы. Без тяжелых батарей, кабин машинистов и сложной электроники. Радикально дешевле традиционных поездов и электромобилей.',
      stats:[['вместимость', '1–4 и более'],['двигатель', 'встроен в путепровод']] }
  },
  { idx:'S05', big:'0', unit:'emissions', label:'Direct CO₂', title:'Fully electric operation.',
    desc:'No internal combustion. No on-route emissions. 100% grid-powered; net-zero compatible on a renewables supply.',
    stats:[['scope-1', '0 t/yr'],['scope-2', 'grid-tied'],['lifecycle', '< rail'],['recyclable', '94%']],
    ru:{ label:'Прямые выбросы CO₂', title:'Полностью электрическая работа.',
      desc:'Никакого ДВС. Никаких выбросов на маршруте. 100% питание от сети — полная совместимость с углеродной нейтральностью при возобновляемой генерации.',
      stats:[['охват 1', '0 т/год'],['охват 2', 'сетевой'],['жизн. цикл', '< ж/д'],['переработка', '94%']] }
  },
  { idx:'S06', big:'24/7', unit:'uptime', label:'Availability', title:'On-demand. No schedule.',
    desc:'Continuous operation with scheduled maintenance windows. Weather-independent within design envelope.',
    stats:[['MTBF', '8,600 hr'],['service', 'overnight'],['redundancy', 'N + 1'],['wind limit', '32 m/s']],
    ru:{ label:'Доступность', title:'По требованию. Без расписания.',
      desc:'Непрерывная работа с плановыми окнами технического обслуживания. Не зависит от погоды в пределах расчётного диапазона.',
      stats:[['MTBF', '8 600 ч'],['обслуживание', 'ночное'],['резервирование', 'N + 1'],['лимит ветра', '32 м/с']] }
  },
  { idx:'S07', big:'Micro', unit:'footprint', label:'Infrastructure load', title:'Minimal land use.',
    desc:'Points of origin and destination require minimal fixed infrastructure. Light nodes. No fleet storage or heavy depots required.',
    stats:[['station cost', 'minimal'],['parking', 'none'],['maint yard', 'shared'],['land impact', '< 1%']],
    ru:{ label:'Инфраструктурная нагрузка', title:'Минимальное использование земли.',
      desc:'Точки отправления и назначения требуют минимальной фиксированной инфраструктуры. Легкие узлы. Никаких тяжелых депо или парковок.',
      stats:[['стоимость узла', 'минимальна'],['парковка', 'не нужна'],['депо', 'общее'],['земел. след', '< 1%']] }
  },
  { idx:'S08', big:'250+', unit:'yrs', label:'Lifespan', title:'Built once. Renewed indefinitely.',
    desc:'Structural design life exceeds 250 years. Beyond that, in-situ robotic renewal extends operational life without replacement. Effectively perpetual infrastructure.',
    stats:[['design life', '250+ yrs'],['renewal', 'autonomous · in-situ'],['downtime / cycle', '< 0.5%'],['total horizon', 'unbounded']],
    ru:{ label:'Срок службы', title:'Строится один раз. Обновляется бесконечно.',
      desc:'Расчётный срок службы конструкции — более 250 лет. После этого роботизированное обслуживание продлевает ресурс без замены. Фактически — бесконечная инфраструктура.',
      stats:[['расчётный срок', '250+ лет'],['обновление', 'автоном. · на месте'],['простой / цикл', '< 0,5%'],['горизонт', 'не ограничен']] }
  }
];

const SPEC_SCROLLER = document.getElementById('spec-scroller');
const SPEC_STAGE = document.getElementById('spec-stage');
const SPEC_PROGRESS = document.getElementById('spec-progress');

function specT(s){ return (window.LANG === 'ru' && s.ru) ? s.ru : s; }

SPECS.forEach((s, i) => {
  const step = document.createElement('div');
  step.className = 'scroll-step';
  step.dataset.i = i;
  SPEC_SCROLLER.appendChild(step);

  const t = specT(s);
  const card = document.createElement('div');
  card.className = 'spec-card' + (i === 0 ? ' active' : '');
  card.dataset.i = i;
  card.innerHTML = `
    <div class="spec-idx" translate="no">${s.idx}</div>
    <div class="spec-big" translate="no">${s.big}<span class="unit">${s.unit}</span></div>
    <div class="spec-meta">
      <div class="spec-label">${t.label}</div>
      <div class="spec-title">${t.title}</div>
      <div class="spec-desc">${t.desc}</div>
      <div class="spec-stat" translate="no">
        ${t.stats.map(([k,v]) => `<div class="spec-stat-k">${k}</div><div class="spec-stat-v">${v}</div>`).join('')}
      </div>
    </div>
  `;
  SPEC_STAGE.appendChild(card);

  const tick = document.createElement('div');
  tick.className = 'spec-tick' + (i === 0 ? ' active' : '');
  SPEC_PROGRESS.appendChild(tick);
});

function patchSpecs(lang) {
  document.querySelectorAll('.spec-card').forEach((card, i) => {
    const s = SPECS[i]; if (!s) return;
    const t = (lang === 'ru' && s.ru) ? s.ru : s;
    card.querySelector('.spec-label').textContent = t.label;
    card.querySelector('.spec-title').textContent = t.title;
    card.querySelector('.spec-desc').textContent  = t.desc;
    const ks = card.querySelectorAll('.spec-stat-k');
    const vs = card.querySelectorAll('.spec-stat-v');
    t.stats.forEach(([k, v], j) => {
      if (ks[j]) ks[j].textContent = k;
      if (vs[j]) vs[j].textContent = v;
    });
  });
}

// Observe each step, activate matching card
// rootMargin changed from -40% to -20% for faster/more responsive scrolling
// First step uses -50% for faster initial trigger
const specObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const i = +e.target.dataset.i;
      document.querySelectorAll('.spec-card').forEach(c => c.classList.toggle('active', +c.dataset.i === i));
      document.querySelectorAll('.spec-tick').forEach((t, j) => t.classList.toggle('active', j === i));
    }
  });
}, { rootMargin: '-20% 0px -20% 0px', threshold: 0 });

const specObsFirst = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const i = 0;
      document.querySelectorAll('.spec-card').forEach(c => c.classList.toggle('active', +c.dataset.i === i));
      document.querySelectorAll('.spec-tick').forEach((t, j) => t.classList.toggle('active', j === i));
    }
  });
}, { rootMargin: '-60% 0px -40% 0px', threshold: 0 });

// Apply different observers to first and rest
document.querySelectorAll('.scroll-step').forEach((s, i) => {
  if (i === 0) specObsFirst.observe(s);
  else specObs.observe(s);
});

// ============ COMPARE table ============
const CMP_ROWS = [
  ['Build cost · $ / km', '$120K', '$400K', '$5M', '$30M'],
  ['Vehicle unit cost', '< $10K', '—', '—', '—'],
  ['Operational speed (door-to-door)', '300 km/h', '~50 km/h', '~70 km/h', '~40 km/h'],
  ['Throughput · pax / hr / dir', '620', '~2,200 (lane)', '~2,500', '~30,000'],
  ['Deployment time · 10 km', '< 6 mo', '12–18 mo', '3–5 yr', '7–10 yr'],
  ['Land take · ha / km', '< 0.3', '2.5', '3.2', '< 0.1 (under)'],
  ['Direct CO₂ · kg / pax·km', '0', '118', '41', '0'],
  ['Schedule dependency', 'none · on demand', 'none', 'fixed', 'fixed'],
  ['Terminals required', 'none', 'none', 'yes', 'yes'],
];
const CMP_ROWS_RU_LABELS = [
  'Стоимость строительства · $ / км',
  'Стоимость транспортного юнита',
  'Операционная скорость (от двери до двери)',
  'Пропускная способность · пас / ч / напр.',
  'Время развёртывания · 10 км',
  'Земельный след · га / км',
  'Прямые выбросы CO₂ · кг / пас·км',
  'Зависимость от расписания',
  'Требуются терминалы',
];

function patchCompare(lang) {
  document.querySelectorAll('#cmp-body .cmp-metric').forEach((td, i) => {
    td.textContent = (lang === 'ru' && CMP_ROWS_RU_LABELS[i]) ? CMP_ROWS_RU_LABELS[i] : CMP_ROWS[i][0];
  });
}

const cmpBody = document.getElementById('cmp-body');
CMP_ROWS.forEach(r => {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td class="cmp-metric">${r[0]}</td>
    <td class="col-aetera" translate="no">${r[1]}</td>
    <td translate="no">${r[2]}</td>
    <td translate="no">${r[3]}</td>
    <td translate="no">${r[4]}</td>
  `;
  cmpBody.appendChild(tr);
});

// Compare table — mobile arrow nav
(function(){
  const wrap = document.getElementById('cmp-table-wrap');
  const prev = document.getElementById('cmp-prev');
  const next = document.getElementById('cmp-next');
  if (!wrap || !prev || !next) return;
  // scroll ~1 column width per click
  const COL = 190;
  prev.addEventListener('click', () => wrap.scrollBy({left: -COL, behavior: 'smooth'}));
  next.addEventListener('click', () => wrap.scrollBy({left:  COL, behavior: 'smooth'}));
  // dim arrows at scroll extremes
  function updateArrows(){
    prev.style.opacity = wrap.scrollLeft <= 4 ? '0.3' : '1';
    next.style.opacity = wrap.scrollLeft >= wrap.scrollWidth - wrap.clientWidth - 4 ? '0.3' : '1';
  }
  wrap.addEventListener('scroll', updateArrows, {passive:true});
  updateArrows();
})();

// ============ Payback chart ============
function drawPayback(){
  const el = document.getElementById('payback-chart');
  if (!el) return;
  const w = 560, h = 220;
  // years 0..10, cumulative cash
  // capex upfront -4M; revenue 36.5M/yr EBITDA; slightly ramped 50%, 80%, 100%
  const pts = [];
  let cum = -6;
  pts.push([0, cum]);
  const ebitda = [0, 18, 29, 36, 36.5, 36.5, 36.5, 36.5, 36.5, 36.5, 36.5];
  for (let y = 1; y <= 10; y++){ cum += ebitda[y]; pts.push([y, cum]); }

  const maxY = 320; const minY = -10;
  const pad = {l: 36, r: 16, t: 20, b: 28};
  const xs = (x) => pad.l + (x / 10) * (w - pad.l - pad.r);
  const ys = (y) => pad.t + (1 - (y - minY) / (maxY - minY)) * (h - pad.t - pad.b);
  const path = pts.map((p, i) => `${i ? 'L' : 'M'}${xs(p[0]).toFixed(1)} ${ys(p[1]).toFixed(1)}`).join(' ');
  const area = `${path} L${xs(10).toFixed(1)} ${ys(minY).toFixed(1)} L${xs(0).toFixed(1)} ${ys(minY).toFixed(1)} Z`;
  // zero line y
  const y0 = ys(0);
  el.innerHTML = `
    <svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pbfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style="stop-color:var(--copper-500);stop-opacity:0.28"/>
          <stop offset="100%" style="stop-color:var(--copper-500);stop-opacity:0"/>
        </linearGradient>
      </defs>
      <!-- gridlines -->
      ${[0, 80, 160, 240, 320].map(g => `<line x1="${pad.l}" x2="${w - pad.r}" y1="${ys(g)}" y2="${ys(g)}" stroke="rgba(24,26,31,0.06)"/>`).join('')}
      <line x1="${pad.l}" x2="${w - pad.r}" y1="${y0}" y2="${y0}" stroke="rgba(24,26,31,0.25)" stroke-dasharray="3 3"/>
      <!-- area -->
      <path d="${area}" fill="url(#pbfill)"/>
      <!-- line -->
      <path d="${path}" fill="none" style="stroke:var(--copper-300)" stroke-width="1.5"/>
      <!-- dots -->
      ${pts.map(p => `<circle cx="${xs(p[0])}" cy="${ys(p[1])}" r="2.5" style="fill:var(--copper-50)"/>`).join('')}
      <!-- x labels -->
      ${[0, 2, 4, 6, 8, 10].map(x => `<text x="${xs(x)}" y="${h - 8}" fill="#6a6a70" font-family="Onest, sans-serif" font-size="10" text-anchor="middle">y${x}</text>`).join('')}
      <!-- y labels -->
      ${[0, 160, 320].map(v => `<text x="${pad.l - 8}" y="${ys(v) + 3}" fill="#6a6a70" font-family="Onest, sans-serif" font-size="10" text-anchor="end">${v}</text>`).join('')}
      <!-- payback marker -->
      <line x1="${xs(3.2)}" x2="${xs(3.2)}" y1="${y0}" y2="${ys(cum)}" style="stroke:var(--copper-500);stroke-opacity:0.4" stroke-dasharray="2 2"/>
      <circle cx="${xs(3.2)}" cy="${y0}" r="4" fill="none" style="stroke:var(--copper-300)"/>
      <text x="${xs(3.2) + 8}" y="${y0 - 8}" style="fill:var(--copper-300)" font-family="Onest, sans-serif" font-size="10">PBP · 3.2y</text>
    </svg>
  `;
}
drawPayback();

// ============ Bar chart reveal ============
const barObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.bar-body').forEach((b, i) => {
        const h = b.dataset.h + '%';
        setTimeout(() => b.style.height = h, i * 100 + 120);
      });
      barObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.bar-chart').forEach(c => barObs.observe(c));

// ============ World map ============
(function drawMap(){
  const svg = document.getElementById('world-map');
  if (!svg) return;
  const W = 1000, H = 500;
  const step = 8;

  // rough land polygons
  const LAND = [
    'M120,90 L240,70 L280,90 L300,150 L260,220 L180,240 L150,220 L100,160 Z',
    'M230,250 L280,260 L290,340 L260,420 L220,430 L210,350 Z',
    'M460,90 L560,100 L560,160 L490,180 L460,150 Z',
    'M490,190 L580,210 L590,300 L540,390 L490,370 L470,280 Z',
    'M570,80 L820,90 L850,180 L780,240 L700,230 L620,200 L570,150 Z',
    'M680,210 L720,240 L700,280 L670,260 Z',
    'M770,250 L850,260 L870,290 L820,310 L770,290 Z',
    'M820,340 L900,340 L920,400 L850,420 L810,390 Z',
  ];

  let dotsHTML = '';
  
  // Performance optimization: Cache dots in localStorage
  let cachedDots = null;
  try { cachedDots = localStorage.getItem('aetera-map-dots-v2'); } catch(e){}

  if (cachedDots) {
    dotsHTML = cachedDots;
  } else {
    const pathEl = document.createElementNS('http://www.w3.org/2000/svg','path');
    pathEl.setAttribute('d', LAND.join(' '));
    svg.appendChild(pathEl);

    for (let y = 20; y < H - 10; y += step){
      for (let x = 10; x < W - 10; x += step){
        const pt = svg.createSVGPoint(); pt.x = x; pt.y = y;
        if (pathEl.isPointInFill(pt)){
          dotsHTML += `<circle cx="${x}" cy="${y}" r="0.9" class="map-base-dot"/>`;
        }
      }
    }
    svg.removeChild(pathEl);
    try { localStorage.setItem('aetera-map-dots-v2', dotsHTML); } catch(e){}
  }

  // corridors (active)
  const CORRIDORS = [
    // [x1,y1,x2,y2, type]
    // Europe
    [470, 130, 500, 140, 'active', 'Stockholm–Helsinki'],
    [495, 145, 510, 158, 'active', 'Berlin–Munich'],
    // N. America
    [200, 150, 260, 170, 'active', 'SF–LA'],
    [260, 130, 290, 145, 'active', 'Boston–NY–DC'],
    // Asia
    [770, 140, 810, 150, 'active', 'Tokyo–Osaka'],
    [740, 180, 760, 190, 'active', 'Shanghai–Shenzhen'],
    // priority
    [640, 100, 680, 110, 'pri', 'Moscow–SPB'],
    [450, 120, 475, 125, 'pri', 'London–Paris'],
    [520, 130, 540, 140, 'pri', 'Warsaw–Krakow'],
    [700, 220, 720, 230, 'pri', 'Delhi–Agra'],
    [850, 365, 880, 380, 'pri', 'Sydney–Canberra'],
    [510, 220, 530, 240, 'pri', 'Cairo–Alex'],
    [250, 380, 270, 400, 'pri', 'Rio–SP'],
    [560, 300, 580, 320, 'pri', 'Lagos–Abuja'],
    [730, 150, 755, 165, 'pri', 'Beijing–Xian'],
    [780, 260, 800, 275, 'pri', 'KL–Singapore'],
  ];

  let routesHTML = '';
  let dotsMarkersHTML = '';

  CORRIDORS.forEach(c => {
    const [x1,y1,x2,y2,type,label] = c;
    const color = type === 'active' ? 'var(--map-active)' : 'var(--map-sec)';
    const dash = type === 'active' ? '' : 'stroke-dasharray="3 3"';
    routesHTML += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${type==='active'?1.2:0.8}" ${dash} opacity="0.85"/>`;
    dotsMarkersHTML += `<circle cx="${x1}" cy="${y1}" r="${type==='active'?2.5:1.8}" class="map-dot ${type==='active'?'corridor':''}"/>`;
    dotsMarkersHTML += `<circle cx="${x2}" cy="${y2}" r="${type==='active'?2.5:1.8}" class="map-dot ${type==='active'?'corridor':''}"/>`;
    if (type === 'active'){
      dotsMarkersHTML += `<circle cx="${x1}" cy="${y1}" class="pulse-ring"/>`;
    }
  });

  // coordinate labels
  let gridHTML = '';
  for (let x = 0; x <= W; x += 100){
    gridHTML += `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="rgba(242,240,234,0.03)"/>`;
  }
  for (let y = 0; y <= H; y += 50){
    gridHTML += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="rgba(242,240,234,0.03)"/>`;
  }

  svg.innerHTML = gridHTML + dotsHTML + routesHTML + dotsMarkersHTML
    + `<text x="12" y="22" fill="#4a4a50" font-family="Onest, sans-serif" font-size="10" letter-spacing="1">PRIORITY CORRIDORS · 2026</text>`
    + `<text x="${W-12}" y="${H-12}" fill="#4a4a50" font-family="Onest, sans-serif" font-size="10" letter-spacing="1" text-anchor="end">n = 24 · 6 active</text>`;
})();

// ============ Scenarios ============
const SCENARIOS = [
  { bg:'./img/scenario-1.webp', idx:'01', metric:'10 min / 20 km', title:'Commute',
    desc:'Live outside the city. Be in center in 10 minutes. No traffic. No schedule. Point-to-point on demand.',
    stats:[['modal share', '14%'],['avg saving', '38 min']],
    ru:{ metric:'10 мин / 20 км', title:'Пригород',
      desc:'Живёте за городом — в центре через 10 минут. Без пробок, без расписания. По требованию, точка — точка.',
      stats:[['доля маршрута', '14%'],['экономия', '38 мин']] }
  },
  { bg:'./img/scenario-2.webp', idx:'02', metric:'0 emissions', title:'Environment',
    desc:'No roads through forests. No tunnels. No noise envelope. Landscape stays intact.',
    stats:[['footprint', '< 1% rail'],['noise', '55 dB']],
    ru:{ metric:'0 выбросов', title:'Экология',
      desc:'Никаких дорог через леса. Никаких тоннелей. Никакого шума. Ландшафт остаётся нетронутым.',
      stats:[['след', '< 1% ж/д'],['шум', '55 дБ']] }
  },
  { bg:'./img/scenario-3.webp', idx:'03', metric:'no terrain limit', title:'Access',
    desc:'National parks, heritage sites, mountain resorts. Places conventional transport cannot go.',
    stats:[['incline', 'any'],['terrain', 'any']],
    ru:{ metric:'любой рельеф', title:'Доступность',
      desc:'Национальные парки, объекты наследия, горные курорты. Места, куда обычный транспорт не дотянется.',
      stats:[['уклон', 'любой'],['рельеф', 'любой']] }
  },
  { bg:'./img/scenario-4.webp', idx:'04', metric:'$120K / km', title:'Cities',
    desc:'Entire metro lines replaced at 1% cost. No excavation. No decade of construction. Operational within months.',
    stats:[['vs metro', '1 / 250'],['build', '< 6 mo']],
    ru:{ metric:'$120K / км', title:'Города',
      desc:'Целые линии метро заменяются за 1% стоимости. Никаких раскопок. Никаких десятилетий стройки. Ввод в эксплуатацию — за месяцы.',
      stats:[['к метро', '1 / 250'],['строительство', '< 6 мес.']] }
  },
  { bg:'./img/scenario-5.webp', idx:'05', metric:'620 pax/hr', title:'Scale',
    desc:'Airports, campuses, cities, resorts. One architecture. Deploy once. Connect any two points.',
    stats:[['throughput', 'nominal'],['TAM', 'unbounded']],
    ru:{ metric:'620 пас/ч', title:'Масштаб',
      desc:'Аэропорты, кампусы, города, курорты. Одна архитектура. Разворачивается один раз. Соединяет любые две точки.',
      stats:[['пропускная спос.', 'номинал'],['TAM', 'не ограничен']] }
  },
  { bg:'./img/scenario-6.webp', idx:'06', metric:'300 km/h', title:'Logistics',
    desc:'Goods move at 300 km/h on demand. No fleet. No schedule. Just delivery.',
    stats:[['latency', '< 10 min'],['payload', 'pallet-grade']],
    ru:{ metric:'300 км/ч', title:'Логистика',
      desc:'Грузы движутся на скорости 300 км/ч по требованию. Никакого автопарка. Никакого расписания. Просто доставка.',
      stats:[['задержка', '< 10 мин'],['груз', 'паллетный уровень']] }
  },
];

const strip = document.getElementById('scn-strip');
SCENARIOS.forEach(s => {
  const t = (window.LANG === 'ru' && s.ru) ? s.ru : s;
  const card = document.createElement('div');
  card.className = 'scn-card';
  card.innerHTML = `
    <img src="${s.bg}" class="scn-bg" loading="lazy" decoding="async" alt="${t.title} - ${t.metric}">
    <div class="scn-veil"></div>
    <div class="scn-content">
      <div class="scn-top">
        <span class="scn-idx">${s.idx}</span>
        <span class="scn-metric">${t.metric}</span>
      </div>
      <div class="scn-bottom">
        <h3>${t.title}</h3>
        <p>${t.desc}</p>
        <div class="scn-stats">
          ${t.stats.map(([k,v]) => `<div><span class="scn-stat-k">${k}</span><span class="scn-stat-v">${v}</span></div>`).join('')}
        </div>
      </div>
    </div>
  `;
  strip.appendChild(card);
});

function patchScenarios(lang) {
  document.querySelectorAll('.scn-card').forEach((card, i) => {
    const s = SCENARIOS[i]; if (!s) return;
    const t = (lang === 'ru' && s.ru) ? s.ru : s;
    card.querySelector('.scn-metric').textContent = t.metric;
    card.querySelector('h3').textContent = t.title;
    card.querySelector('p').textContent  = t.desc;
    const ks = card.querySelectorAll('.scn-stat-k');
    const vs = card.querySelectorAll('.scn-stat-v');
    t.stats.forEach(([k, v], j) => {
      if (ks[j]) ks[j].textContent = k;
      if (vs[j]) vs[j].textContent = v;
    });
  });
}

document.getElementById('scn-prev').addEventListener('click', () => strip.scrollBy({left:-440,behavior:'smooth'}));
document.getElementById('scn-next').addEventListener('click', () => strip.scrollBy({left:440,behavior:'smooth'}));

// ============ FAQ ============
const FAQS = [
  ['01', 'What happens after I submit the form?', 'We review every submission personally. If there is a fit, you receive a written response within 48 hours. A mutual NDA is provided by email for your review and written confirmation — no third-party signing platform required. After confirmation, the full technical package is shared through your designated contact.'],
  ['02', 'How long does the NDA review process take?', 'The NDA is a concise mutual confidentiality agreement sent by email. Review and confirmation are handled entirely in writing — no calls or wet signatures. Most parties confirm within one to three business days. The full technical package follows by email upon confirmation.'],
  ['03', 'Is the technology proven or still conceptual?', 'The operating principles have been validated through engineering analysis and physics modelling. A PCT application is filed. Full technical documentation — including the theoretical framework, calculations, and design parameters — is available under NDA.'],
  ['04', 'What stage is the company at?', 'Pre-seed · active. PCT filed. We are in early-stage written discussions with potential strategic partners. Open to conversations with qualified investors and co-development partners about first pilot deployment.'],
  ['05', 'Who is this for?', 'We are looking for strategic industrial partners, infrastructure-focused investors, and deep-tech funds who can participate in co-development or first pilot deployment. We do not raise from the general public. All inquiries are reviewed individually; access to full materials requires NDA.'],
  ['06', 'What is the target round size and valuation?', 'Pre-seed: $1.5M on a SAFE-equivalent instrument. Terms and valuation are disclosed on a per-investor basis under NDA, alongside the full financial model and IP summary.'],
];

const FAQS_RU = [
  ['01', 'Что происходит после отправки формы?', 'Мы просматриваем каждую заявку лично. При наличии совпадения интересов вы получите письменный ответ в течение 48 часов. Взаимное NDA направляется по электронной почте — для ознакомления и письменного подтверждения, без платформ электронной подписи. После подтверждения полный технический пакет передаётся вашему контактному лицу.'],
  ['02', 'Сколько времени занимает процесс NDA?', 'NDA — лаконичное взаимное соглашение о конфиденциальности, направляемое по email. Ознакомление и подтверждение — исключительно в письменном виде: без звонков, без «живых» подписей. Большинство сторон подтверждают в течение 1–3 рабочих дней. Полный технический пакет поступает по email сразу после подтверждения.'],
  ['03', 'Технология доказана или ещё концептуальна?', 'Рабочие принципы валидированы в ходе инженерного анализа и физического моделирования. Заявка PCT подана. Полная техническая документация — включая теоретическую базу, расчёты и конструктивные параметры — доступна под NDA.'],
  ['04', 'На какой стадии находится компания?', 'Пре-сид · активный раунд. Патент PCT подан. Ведутся ранние письменные переговоры с потенциальными стратегическими партнёрами. Открыты к диалогу с квалифицированными инвесторами и партнёрами по совместной разработке первого пилота.'],
  ['05', 'Для кого это предназначено?', 'Мы ищем стратегических промышленных партнёров, инвесторов, специализирующихся на инфраструктуре, и deep-tech фонды, готовые к участию в совместной разработке или первом пилоте. Розничное привлечение не ведётся. Каждый запрос рассматривается индивидуально; доступ к полным материалам требует NDA.'],
  ['06', 'Каковы целевой размер раунда и оценка?', 'Пре-сид: $1,5M на инструменте типа SAFE. Условия и оценка раскрываются индивидуально под NDA — вместе с полной финансовой моделью и сводкой ИС.'],
];

const faqList = document.getElementById('faq-list');
FAQS.forEach(([idx, q, a], i) => {
  const item = document.createElement('div');
  item.className = 'faq-item';
  item.innerHTML = `
    <button class="faq-q" aria-expanded="false">
      <span class="idx">${idx}</span>
      <span class="q">${q}</span>
      <span class="ico"></span>
    </button>
    <div class="faq-a"><div class="faq-a-inner">${a}</div></div>
  `;
  faqList.appendChild(item);
  item.querySelector('.faq-q').addEventListener('click', () => {
    const open = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(x => x.classList.remove('open'));
    if (!open) item.classList.add('open');
  });
});

function patchFaqs(lang) {
  document.querySelectorAll('.faq-item').forEach((item, i) => {
    const row = (lang === 'ru' && FAQS_RU[i]) ? FAQS_RU[i] : FAQS[i];
    if (!row) return;
    item.querySelector('.q').textContent = row[1];
    item.querySelector('.faq-a-inner').textContent = row[2];
  });
}

// ============ HERO CANVAS · grid network animation ============
(function heroAnim(){
  // Animation removed as requested
})();

// Counters
function animateCounter(el, to, duration = 1800, fmt = v => Math.round(v)){
  if (!el) return;
  const start = performance.now();
  function step(now){
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = fmt(to * eased);
    if (t < 1) requestAnimationFrame(step);
    else el.textContent = fmt(to);
  }
  requestAnimationFrame(step);
}

// kick off counters when hero visible
const heroObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting){
      animateCounter(document.getElementById('m-speed'), HERO_SPEED, 1800);
      animateCounter(document.getElementById('m-cost'), 120, 1600);
      animateCounter(document.getElementById('m-life'), 250, 1800);
      animateCounter(document.getElementById('m-tam'), 1.2, 1600, v => v.toFixed(1));
      heroObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
heroObs.observe(document.querySelector('.hero'));

// ============ Scroll progress bar ============
const progEl = document.getElementById('progress');
window.addEventListener('scroll', () => {
  const doc = document.documentElement;
  const scrolled = (doc.scrollTop) / (doc.scrollHeight - doc.clientHeight);
  progEl.style.width = (scrolled * 100) + '%';
}, { passive: true });


// ============ Lang switch ============
// Re-patch dynamic components when language changes
document.addEventListener('langchange', (e) => {
  patchSpecs(e.detail.lang);
  patchScenarios(e.detail.lang);
  patchFaqs(e.detail.lang);
  patchCompare(e.detail.lang);
});

// Restore saved language on load
(function(){
  try {
    const saved = localStorage.getItem('aetera-lang');
    if (saved && window.I18N[saved]) setLang(saved);
  } catch(e){}
})();

document.addEventListener('click', e => {
  const btn = e.target.closest('.lang-btn');
  if (!btn) return;
  setLang(btn.dataset.lang);
});

// ============================================================
// FORM SUBMIT — CSRF + fetch to submit.php
// ============================================================
(function initForm(){

  const form  = document.getElementById('cform');
  const label = document.getElementById('cform-label');
  const errEl = document.getElementById('form-error');

  function showError(msg){ errEl.textContent = msg; errEl.style.display = 'block'; }
  function clearError(){ errEl.style.display = 'none'; errEl.textContent = ''; }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearError();

    const payload = {
      fullname: form.fullname.value.trim(),
      email:    form.email.value.trim(),
      company:  form.company.value.trim(),
      linkedin: form.linkedin.value.trim(),
      notes:    form.notes.value.trim(),
    };

    if (!payload.fullname){ showError('Full name is required.'); return; }
    if (!payload.email)   { showError('Work email is required.'); return; }
    if (!payload.company) { showError('Company / Fund is required.'); return; }

    label.textContent = 'Sending…';
    form.querySelector('button').disabled = true;

    try {
      const tokenRes = await fetch('/submit.php?token=1');
      const { token } = await tokenRes.json();

      const res = await fetch('/submit.php', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': token },
        body:    JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success){
        label.textContent = (window.LANG === 'ru') ? 'Отправлено ✓' : 'Sent ✓';
        form.reset();
      } else {
        showError(data.error || 'Something went wrong. Please try again.');
        label.textContent = (window.LANG === 'ru') ? 'Отправить запрос' : 'Submit Request';
        form.querySelector('button').disabled = false;
      }
    } catch {
      showError('Network error. Please try again or email info@aetera.io directly.');
      label.textContent = (window.LANG === 'ru') ? 'Отправить запрос' : 'Submit Request';
      form.querySelector('button').disabled = false;
    }
  });
})();

// ============================================================
// ANALYTICS — per-section time tracking + sendBeacon
// ============================================================
(function initAnalytics() {
  const t0       = Date.now();
  const secMs      = {};       // accumulated ms per section label
  const secEnter   = {};       // enter timestamp per section label
  const secVisited = new Set(); // ALL sections ever seen (even 0s)
  let sent = false;

  function flush() {
    const now = Date.now();
    Object.entries(secEnter).forEach(([lbl, ts]) => {
      secMs[lbl] = (secMs[lbl] || 0) + (now - ts);
      secEnter[lbl] = now; // reset to avoid double-count on re-flush
    });
  }

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        const lbl = e.target.dataset.screenLabel;
        if (!lbl) return;
        if (e.isIntersecting) {
          secVisited.add(lbl);
          secEnter[lbl] = Date.now();
        } else {
          if (secEnter[lbl] != null) {
            secMs[lbl] = (secMs[lbl] || 0) + (Date.now() - secEnter[lbl]);
            delete secEnter[lbl];
          }
        }
      });
    }, { threshold: 0.15 }); // lower threshold — catch quick scrolls

    document.querySelectorAll('[data-screen-label]').forEach(el => obs.observe(el));
  }

  function buildPayload() {
    flush();
    const st = {};
    // Include ALL visited sections, even those with 0 seconds
    secVisited.forEach(k => { st[k] = Math.round((secMs[k] || 0) / 1000); });
    return JSON.stringify({
      time:          Math.round((Date.now() - t0) / 1000),
      sections_time: st,
      screen:        screen.width + 'x' + screen.height,
      lang:          document.documentElement.lang || localStorage.getItem('aetera-lang') || 'en',
    });
  }

  function send() {
    if (sent) return;
    sent = true;
    const body = buildPayload();
    navigator.sendBeacon?.('/track.php', body)
      || fetch('/track.php', { method: 'POST', body, keepalive: true }).catch(() => {});
  }

  // visibilitychange is the most reliable trigger, especially on iOS
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') send();
  });
  window.addEventListener('pagehide',     send);
  window.addEventListener('beforeunload', send);
  // Fallback: send after 3 min if still on page
  setTimeout(() => { if (!sent) send(); }, 180_000);
})();

// ============================================================
// HEARTBEAT — real-time "who is online" tracking
// ============================================================
(function initHeartbeat() {
  function ping() {
    fetch('/heartbeat.php', { method: 'POST' }).catch(() => {});
  }
  ping(); // fire immediately on page load
  setInterval(ping, 30_000); // every 30 seconds
})();

// ============================================================
// MOBILE MENU
// ============================================================
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const links = document.querySelectorAll('.mobile-nav-link, .mobile-nav-cta');

  if (!hamburger || !mobileMenu) return;

  function toggleMenu() {
    const isActive = hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = isActive ? 'hidden' : '';
  }

  hamburger.addEventListener('click', toggleMenu);

  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
})();
