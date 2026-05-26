# Atomic Design 2026 — Design System & Components

**Version:** 2.0 (`styles-v2.css`) · **Stylesheet:** `styles-v2.css` · **Script:** `app-v2.js`
**Built for:** the homepage at `Atomic Design 2026 v2.html`. Use this doc as the single source of truth for any additional page in the same system.

The system is dark-first, glow-heavy, and built around one signature gradient (orange → magenta → purple). Components are composed from a small set of primitives: **gradient-border cards**, **mono captions**, **gradient text accents**, and **reveal-on-scroll motion**.

---

## 1. Foundations

### 1.1 Color tokens

All colors live as CSS custom properties on `:root` in `styles-v2.css`. Reference them via `var(--token)` — never hardcode hex elsewhere.

#### Surfaces (background depth)
| Token | Value | Use |
|---|---|---|
| `--bg` | `#000000` | Page root, footer |
| `--bg-1` | `#050309` | Hero, alternate section bg |
| `--bg-2` | `#0c0710` | Pill/eyebrow inner fill |
| `--surface` | `#11091a` | Card body default |
| `--surface-2` | `#181024` | Card hover state |

#### Lines & borders
| Token | Value | Use |
|---|---|---|
| `--line` | `rgba(255,255,255,0.07)` | Default 1px borders, dividers |
| `--line-2` | `rgba(255,255,255,0.16)` | Higher-contrast borders, ghost button border |

#### Text
| Token | Value | Use |
|---|---|---|
| `--text` | `#f5f5f5` | Body & headings |
| `--text-2` | `#b8b0c2` | Subtitles, paragraph copy, secondary links |
| `--text-3` | `#6e6679` | Captions, mono labels, footer meta |

#### Brand
| Token | Value | Use |
|---|---|---|
| `--orange` | `#ff6b1a` | Primary brand, hot dots, glow |
| `--orange-2` | `#ff8a3d` | Hover state, section-tag text |
| `--orange-glow` | `rgba(255,107,26,0.45)` | Glyph & button shadow |
| `--purple` | `#8a3df0` | Secondary brand |
| `--purple-2` | `#b76cff` | Light purple accent |
| `--purple-glow` | `rgba(138,61,240,0.5)` | Hover shadow tail |
| `--magenta` | `#ff3da5` | Middle of gradient |
| `--cyan` | `#3df0e0` | Tertiary, reserved (not used in v2) |

#### Signature gradients
| Token | Value |
|---|---|
| `--grad` | `linear-gradient(120deg, #ff6b1a 0%, #ff3da5 45%, #8a3df0 100%)` |
| `--grad-soft` | Same stops at ~0.18 alpha — for soft fills |
| `--grad-line` | `linear-gradient(90deg, #ff6b1a, #ff3da5, #8a3df0)` — horizontal accent lines |

**Rule of thumb:** the gradient is the brand. Use it for one primary moment per section (heading accent, button, top border, etc.). Don't gradient everything.

#### Per-card accent variants (work cards)
```css
.work-card[data-accent="orange"]  { --accent-1: rgba(255,107,26,0.32); --accent-2: rgba(255,138,61,0.18); }
.work-card[data-accent="magenta"] { --accent-1: rgba(255,61,165,0.30); --accent-2: rgba(255,107,26,0.18); }
.work-card[data-accent="purple"]  { --accent-1: rgba(138,61,240,0.32); --accent-2: rgba(255,61,165,0.18); }
```

---

### 1.2 Typography

#### Fonts
```html
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet" />
```

| Token | Stack |
|---|---|
| `--font-display` | `"Geist", ui-sans-serif, system-ui` |
| `--font-mono` | `"Geist Mono", ui-monospace, "JetBrains Mono", monospace` |

Body defaults: `font-weight: 400`, `letter-spacing: -0.01em`, `text-rendering: optimizeLegibility`, `-webkit-font-smoothing: antialiased`.

#### Scale
| Role | Size | Weight | Tracking | Class / selector |
|---|---|---|---|---|
| **Display / hero h1** | `clamp(52px, 8vw, 116px)` | 600 | `-0.045em` | `.hero h1` |
| **Big CTA h2** | `clamp(56px, 8vw, 112px)` | 600 | `-0.045em` | `.cta h2` |
| **Section title** | `clamp(40px, 5vw, 72px)` | 600 | `-0.035em` | `.section-title` |
| **Metric (huge stat)** | `clamp(64px, 7vw, 100px)` | 600 | `-0.05em` | `.benefit-metric`, `.diff-num > span:first-child` |
| **Feature card h3** | `38px` | 500 | `-0.025em` | `.service-feature h3` |
| **Process step h4** | `30px` | 500 | `-0.025em` | `.process-step h4`, `.benefit h3` |
| **Card h3** | `26–28px` | 500 | `-0.025em` | `.service h3`, `.work-card-body h3`, `.loc h4` |
| **Lede / large body** | `clamp(18px, 1.6vw, 22px)` | 400 | inherit | `.hero p.lede` |
| **Quote / review** | `18px` | 400 | `-0.01em` | `.review blockquote` |
| **Section sub** | `17px` | 400 | inherit | `.section-sub` |
| **Body** | `14–15px` | 400 | inherit | `p`, `.benefit p` |
| **Caption (mono)** | `11–13px` | 400/500 | `0.06–0.12em` UPPER | `.section-tag`, `.benefit-num`, `.foot-col h5`, `.work-card-tag` |

#### Type rules
- **Headlines mix two voices.** Regular weight + italic-gradient *accent* + optional outlined *stroke* word. Pattern from hero:
  ```html
  <h1>Websites that<br/>
    <span class="accent">think,</span> <span class="stroke">learn,</span> &amp; convert.
  </h1>
  ```
- **`.accent`** = italic 500, gradient text, animated background-position (`gradientShift 6s`)
- **`.stroke`** = 1.5px outlined text (`-webkit-text-stroke`) on transparent fill
- Reuse the same pattern on any new page hero / CTA so headings feel like one family.

#### Mono usage
Mono is for **labels, captions, system text, and section tags** — never body copy. Always uppercase, always tracked (`letter-spacing: 0.06–0.12em`).

---

### 1.3 Spacing & layout rhythm

There's no formal 4/8-px scale exposed as tokens; spacing is composed from a small set of repeating values. Treat these as the spacing scale:

| Token (mental) | Value | Typical use |
|---|---|---|
| xs | `8–12px` | Tight inline gaps, mono caption gaps |
| sm | `16–18px` | Card internal gaps, button padding |
| md | `24–32px` | Card padding inner, nav padding |
| lg | `40–48px` | Card padding outer, process step padding |
| xl | `64–80px` | Section-head bottom margin |
| 2xl | `130–140px` | Section vertical padding (desktop) |
| 3xl | `180–200px` | Hero/CTA vertical padding |

#### Section wrapper
```html
<section class="benefits" data-screen-label="03 Benefits">
  <div class="wrap"> ... </div>
</section>
```
- `section` → `padding: 130px 32px` (responsive: `80px 20px` ≤980px)
- `.wrap` → `max-width: 1280px; margin: 0 auto`
- Always add `data-screen-label="NN Name"` for navigation/scroll tracking

#### Grid system
The site uses **two grid patterns**:

**A. 12-column service grid** (`.service-grid`) — for asymmetric editorial layouts.
```css
.service-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 18px; }
.span-4 / .span-5 / .span-6 / .span-7 / .span-8 / .span-12 { grid-column: span N; }
```
Use combinations that sum to 12: **7+5**, **4+4+4**, **6+6**, **8+4**, **12**.

**B. 3-column equal grid** — for benefit/work/review/loc cards.
```css
.benefits-grid, .work-grid, .review-grid { grid-template-columns: repeat(3, 1fr); gap: 18–20px; }
```

#### Radius
| Token | Value | Use |
|---|---|---|
| `--radius` | `16px` | Inner cards (reviews, loc) |
| `--radius-lg` | `24px` | Hero cards, services, benefits, work cards |
| pill | `999px` | Buttons, eyebrow, market chip |

#### Breakpoints
Single breakpoint at **`max-width: 980px`**. Below that:
- Nav links hide (mobile menu not yet built)
- All `.span-*` collapse to `span 12`
- `.process-grid` → 2 cols
- `.benefits-grid`, `.work-grid`, `.review-grid` → 1 col
- `.foot-grid` → 2 cols
- `.hero` padding → `140px 20px 80px`
- `section` padding → `80px 20px`

---

### 1.4 Motion & animation

The system has **four motion roles**. Reuse — don't invent new ones.

| Role | Keyframes | Duration | Use |
|---|---|---|---|
| **Drift** (atmospheric) | `drift` | 28s | Body background mesh |
| **Spin slow** | `spinSlow`, `spin` | 30–80s | Hero conic blob, CTA orb |
| **Gradient shift** | `gradientShift` | 6–8s | Gradient text headlines, metric numbers |
| **Pulse / breathe** | `pulse`, `logoGlow` | 2–4s | Eyebrow dot, logo halo |
| **Reveal on scroll** | `.reveal` → `.reveal.in` | 1s `cubic-bezier(.2,.7,.2,1)` | Every section block |

#### Reveal pattern (mandatory on new pages)
```html
<div class="section-head reveal">…</div>
<div class="card reveal reveal-d2">…</div>   <!-- delay 0.1s -->
<div class="card reveal reveal-d3">…</div>   <!-- delay 0.2s -->
<div class="card reveal reveal-d4">…</div>   <!-- delay 0.3s -->
```
`.in` is toggled by an IntersectionObserver in `app-v2.js`. Add the class to any new block you want to fade in.

#### Hover motion
- Cards lift: `transform: translateY(-3px to -5px)` over `.35–.4s cubic-bezier(.2,.7,.2,1)`
- Buttons: `translateY(-2px)` + shadow expand
- Glyphs: `scale(1.08) rotate(4deg)` + glow shadow
- Links / icons: `gap` widens `8px → 14px` on hover

---

## 2. Components

Every card-shaped component follows the **gradient-border pattern** — a 1px gradient outline that fades from neutral white to brand gradient on hover. Memorize this; you'll reuse it constantly:

```css
.card { position: relative; isolation: isolate; }
.card::before, .card::after {
  content: ""; position: absolute; inset: 0; border-radius: inherit; padding: 1px;
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude;
  pointer-events: none; transition: opacity .4s;
}
.card::before { background: linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04)); }
.card::after  { background: var(--grad); opacity: 0; }
.card:hover::before { opacity: 0; }
.card:hover::after  { opacity: 1; }
.card > * { position: relative; z-index: 1; }
```

---

### 2.1 Header / Nav (`<header class="nav">`)
Fixed top, 18px padding, blur-saturated translucent background that compacts on scroll.

```html
<header class="nav">
  <a class="nav-logo" href="#">
    <span class="logo-mark"><img src="assets/atomic-round-small.png" class="logo-img"/></span>
    <span>Atomic Design</span>
  </a>
  <nav class="nav-links">
    <a href="#services">Services</a>
    <a href="#process">Process</a>
    <a href="#work">Work</a>
    <a href="#markets">Markets</a>
    <a href="#about">About</a>
  </nav>
  <div class="nav-cta">
    <a href="#" class="btn btn-ghost">Sign in</a>
    <a href="#cta" class="btn btn-primary">Start a project →</a>
  </div>
</header>
```

- **Logo mark** wears an animated orange halo (`@keyframes logoGlow`, 3.4s) via `::before`.
- **Nav links** get an underline animation drawn from `--grad-line` on hover.
- **`.nav.scrolled`** class is toggled by JS once `scrollY > 20`; it compresses padding and increases bg opacity.

---

### 2.2 Buttons (`.btn`)

Two variants, two sizes. Always pill-shaped.

| Class combo | When to use |
|---|---|
| `.btn .btn-primary` | One primary action per section — gradient fill, glow shadow |
| `.btn .btn-primary .btn-lg` | Hero/CTA primary |
| `.btn .btn-ghost` | Secondary actions — translucent, neutral border |
| `.btn .btn-ghost .btn-lg` | Hero secondary, footer email |

```html
<a href="#" class="btn btn-primary">Start a project →</a>
<a href="#" class="btn btn-ghost btn-lg">Explore services</a>
```

**Specs:**
- Base padding `11px 20px`, `font-size: 14px`, `font-weight: 500`
- `.btn-lg` → padding `15px 26px`, `font-size: 15px`
- Primary hover → background slides 0% → 100% of gradient, lifts 2px, expands to magenta+purple glow shadow
- Use an inline `→` arrow at end of primary CTAs (text, not an SVG)
- States needed: default, hover, focus (rely on browser focus ring — add `outline: 2px solid var(--orange-2); outline-offset: 2px;` if building a form)

---

### 2.3 Eyebrow / pill labels (`.eyebrow`)
Gradient-bordered pill with a pulsing dot. One per hero or top-of-section moment.

```html
<div class="eyebrow"><span class="pulse"></span> AI AGENCY · EST. 1996 · REBUILT FOR 2026</div>
```

---

### 2.4 Section tag (`.section-tag`)
Smaller, orange-tinted pill used in `.section-head`. Always paired with a section title.

```html
<div class="section-tag">What we do</div>
```
- Has a glowing orange dot (`::before`)
- Background: `rgba(255,107,26,0.08)`, border `rgba(255,107,26,0.25)`, color `--orange-2`
- Pass `style="margin-bottom: 0;"` when used inline (markets row)

---

### 2.5 Section head (`.section-head`)
Two-column header: title on left, supporting sub on right, ending baseline-aligned.

```html
<div class="section-head reveal">
  <div>
    <div class="section-tag">What we do</div>
    <h2 class="section-title">A full-stack AI agency built around outcomes, not deliverables.</h2>
  </div>
  <p class="section-sub">Six disciplines under one roof…</p>
</div>
```

- Margin-bottom: `72px`
- Wraps to stacked on mobile

---

### 2.6 Hero (`.hero`)
```html
<section class="hero" data-screen-label="01 Hero">
  <canvas id="hero-canvas" class="hero-canvas"></canvas>
  <div class="hero-content">
    <div class="eyebrow">…</div>
    <h1>Headline with <span class="accent">accent</span> + <span class="stroke">stroke</span> words.</h1>
    <p class="lede">…</p>
    <div class="hero-actions">
      <a class="btn btn-primary btn-lg">Primary →</a>
      <a class="btn btn-ghost btn-lg">Secondary</a>
    </div>
    <div class="hero-meta">
      <span><strong>30</strong> years…</span>
      <span>Rochester · Nashville · Atlanta · Nationwide</span>
      <span><strong>1,200+</strong> brands launched</span>
    </div>
  </div>
</section>
```

- Min-height: `100vh`, padding `200px 32px 140px`
- Behind h1: huge conic-gradient blob (`::before`) rotating at 30s
- Optional `<canvas id="hero-canvas">` driven by `app-v2.js` for particle field
- `.hero-meta` row uses mono caption type with `<strong>` for emphasis numbers

---

### 2.7 Marquee (`.marquee`)
Auto-scrolling horizontal strip of mono labels with gradient dots between, fade-mask edges.

```html
<div class="marquee" aria-hidden="true">
  <div class="marquee-track" id="marquee-track"></div>
</div>
```
Items injected by JS via `marquee-item` template:
```html
<span class="marquee-item"><span class="dot"></span>SEO &amp; GEO</span>
```
- Track is `width: max-content` translating `-50%` over 38s
- Edges fade to `--bg` via `::before`/`::after`

---

### 2.8 Service card (`.service`)
Used in the 12-col `.service-grid`. Pattern: glyph + number + h3 + paragraph + foot row (+ optional "see also").

```html
<div class="service span-7 reveal">
  <div>
    <div class="service-glyph"><svg>…</svg></div>
    <span class="service-num">01</span>
    <h3>Title</h3>
    <p>Body copy…</p>
  </div>
  <div>
    <div class="service-foot">
      <span>Tag 1</span><span>Tag 2</span><span>Tag 3</span>
    </div>
    <div class="service-seealso">
      <span class="seealso-label">See also</span>
      <a href="#">Related page</a>
      <a href="#">Related page</a>
    </div>
  </div>
</div>
```

#### Variants
- **`.service-feature`** — large hero card (typically `.span-7`). 400px min-height, dual radial-gradient bg, h3 jumps to 38px, p caps at 460px.
- **Standard** — 320px min-height, h3 26px.

#### Anatomy
- `.service-glyph` — 56px gradient-tinted rounded-square holding a 24–26px stroked SVG icon (1.6 stroke). Rotates+scales on card hover.
- `.service-num` — absolutely positioned top-right, mono `12px`, muted.
- `.service-foot` — dash-prefixed mono tags listing tech/disciplines.
- `.service-seealso` — dashed top divider, mono tag "See also" + gradient-text links with `↗`.
- **Cursor glow** — `.service .glow` follows the cursor (JS sets `--mx`/`--my`), opacity 0 → 1 on hover.

---

### 2.9 Process step (`.process-step`)
Four columns separated by vertical 1px lines. No card chrome — just typography in a divided grid.

```html
<section class="process">
  <div class="wrap">
    <div class="section-head">…</div>
    <div class="process-grid">
      <div class="process-step reveal">
        <div class="num">// 01 — Attract</div>
        <h4>Get found by the right people &amp; agents.</h4>
        <p>Body…</p>
        <div class="ico"><svg>→</svg></div>
      </div>
      <!-- 3 more -->
    </div>
  </div>
</section>
```

- Top of grid: 1px gradient line (`::before` with `--grad-line`)
- Step padding: `48px 30px`
- Hover: orange tint wash fades in (`::before opacity 0→1`), arrow `translateX(8px)` and brightens
- `.num` is gradient text (`// 01 — Name` format)

---

### 2.10 Differentiator stat (`.diff-stat`)
Vertical gradient bar on the left, oversized gradient number, label, paragraph.

```html
<section class="diff">
  <div class="wrap">
    <div class="diff-head reveal">
      <div class="diff-head-text">
        <div class="section-tag">Why Atomic</div>
        <h2 class="section-title">Headline…</h2>
        <p class="section-sub" style="max-width:540px;margin-top:24px;">…</p>
      </div>
    </div>
    <div class="diff-grid">
      <div class="diff-stat reveal reveal-d2">
        <div class="diff-num">
          <span data-count="30" data-format="int">0</span>
          <span class="diff-suffix">years</span>
        </div>
        <div class="diff-label">Building the web since 1996.</div>
        <p>Body…</p>
      </div>
      <!-- second stat -->
    </div>
  </div>
</section>
```

- 2-col grid, 64px gap (collapses to 1 col below 980px)
- `data-count` is read by `app-v2.js` to animate counting from 0 → target on reveal
- `data-suffix="+"` appends after count
- Number renders at `clamp(72px, 9vw, 132px)` with gradient text + animated background-position

---

### 2.11 Benefit card (`.benefit`)
3-up. Each card has a number, huge metric, metric-label, h3, copy, and a mono footer with a gradient-text link.

```html
<div class="benefit reveal">
  <div class="benefit-num">01</div>
  <div class="benefit-metric">Top&nbsp;3</div>
  <div class="benefit-metric-label">local search results across 8 markets</div>
  <h3>Top of Google.</h3>
  <p>Body…</p>
  <div class="benefit-foot">
    SEO · Local SEO · Programmatic · <a href="#">See: Case study</a>
  </div>
</div>
```

#### Metric formatting
- Bare number: `<div class="benefit-metric">Top&nbsp;3</div>`
- With unit: `<div class="benefit-metric">+3<span class="metric-unit">×</span></div>`
- Ordinal: `1<span class="metric-unit">st</span>`
- The metric is `clamp(64px, 7vw, 100px)`, weight 600, tnum, gradient-text with animated background-position.

#### Benefit footer CTA
After the grid:
```html
<div class="benefits-cta reveal">
  <p>Curious what we could move for your business?</p>
  <a class="btn btn-primary btn-lg">See an ROI projection →</a>
</div>
```

---

### 2.12 Work card (`.work-card`) — case-study tile

The case-study card is **image-first**: a reference photograph fills the visual area with an animated SVG glow overlay; all text lives in the body below.

```html
<a href="#" class="work-card reveal" data-accent="orange">
  <div class="work-card-visual">
    <img class="wv-ref" src="assets/case-XXX.png" alt="">
    <div class="wv-shimmer"></div>
    <svg class="wv-overlay" viewBox="0 0 W H" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="orb">
          <stop offset="0%"   stop-color="#ffe4c0" stop-opacity="1"/>
          <stop offset="40%"  stop-color="#ff7a4a" stop-opacity="0.85"/>
          <stop offset="100%" stop-color="#ff3d6e" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <g class="wv-glows">
        <circle class="wv-glow d0" cx="…" cy="…" r="38" fill="url(#orb)"/>
        <circle class="wv-glow d2" cx="…" cy="…" r="42" fill="url(#orb)"/>
        <circle class="wv-ping d0" cx="…" cy="…" r="32" stroke="#ffd0a0"/>
        <circle class="wv-firefly d3" cx="…" cy="…" r="5" fill="#ffd0a0"/>
      </g>
    </svg>
  </div>
  <div class="work-card-body">
    <div class="work-card-meta">
      <span class="work-card-num">01</span>
      <span class="work-card-tag">National event staffing · Programmatic SEO</span>
    </div>
    <h3>TSM Agency</h3>
    <p class="work-card-sub">National Trade Show &amp; Event Staffing Company</p>
    <span class="work-card-link">View case study <span class="arr">→</span></span>
  </div>
</a>
```

#### Accent variants (set via `data-accent`)
- `data-accent="orange"` (warm)
- `data-accent="magenta"` (pink)
- `data-accent="purple"` — **also brightens the underlying image** (`filter: brightness(2.2) saturate(1.3); mix-blend-mode: lighten`) for darker source photos

#### Overlay primitives
| Class | Animation | Use |
|---|---|---|
| `.wv-glow` | `wvGlowPulse 2s` — opacity 0.25↔1, scale 0.7↔1.6 | Light bulbs, terminal screws, booth lamps |
| `.wv-ping` | `wvPing 2.6s` — expanding stroked ring, fades out | Hero hot spots (one per card) |
| `.wv-firefly` | `wvFireflyTwinkle 1.6s` — fast twinkle | Background accent dots |
| `.wv-plate-pulse` | `wvPlatePulse 2.6s` — breathing ellipse | Single feature-area glow |

#### Stagger delays
Apply `.d0` through `.d8` on any animated overlay node to space pulses out (`0.16s` increments).

#### Other animations on the visual
- `.wv-ref` — `wvDrift 14s alternate` slow ken-burns
- `.wv-shimmer` — `wvShimmer 5s` vertical light sweep
- `.work-card-visual::after` — fixed vignette + faint grid

#### Body layout
- `.work-card-body` → padding `28px 28px 32px`, flex column, `gap: 16px`
- `.work-card-meta` → row with mono caption + badge-style number chip (`[01]` outlined pill, 10px mono)
- `h3` → 26px, weight 500
- `.work-card-sub` → 13px secondary
- `.work-card-link` → mono, top-border separator, gradient text + widening gap on card hover

---

### 2.13 Market chip (`.market`)
Single horizontal row of city pills with a section tag inline.

```html
<section class="markets" id="markets">
  <div class="wrap markets-row reveal">
    <div class="markets-label">
      <div class="section-tag" style="margin-bottom: 0;">Markets we serve</div>
    </div>
    <div class="markets-list">
      <a href="#" class="market">
        <span class="market-city">Rochester</span>
        <span class="market-region">New York</span>
      </a>
      <!-- more -->
      <span class="markets-more">+ clients nationwide</span>
    </div>
  </div>
</section>
```
- Smaller padding: `56px 32px` (not a full section)
- Chips: pill, neutral border → orange tint on hover; city name shifts to gradient text on hover

---

### 2.14 Location card (`.loc`)
Larger card variant for full-bleed market pages (not currently used on home, but defined for sub-pages).

```html
<div class="loc">
  <div class="pin"><svg>📍</svg></div>
  <h4>Nashville</h4>
  <div class="region">Tennessee · TN-MSA</div>
  <p>Body copy about the market…</p>
  <a href="#">See Nashville work →</a>
</div>
```

---

### 2.15 Review card (`.review`)
3-up testimonial cards.

```html
<div class="review reveal">
  <div class="stars">★★★★★</div>
  <blockquote>"Quote text…"</blockquote>
  <cite><strong>Jenna R.</strong> · VP Marketing, B2B SaaS</cite>
</div>
```
- Stars are gradient text — five UTF-8 stars in a row, no SVG
- Quote: `18px`, line-height 1.5, in `<blockquote>` (no quotes inside markup; type them in the copy)
- `<cite>` rendered with font-style normal, mono `12px`, name in `<strong>` and white

---

### 2.16 Big CTA (`.cta`)
Closing call-to-action with a rotating orb decoration.

```html
<section class="cta" id="cta">
  <div class="cta-orb"><span class="cta-orb-dot"></span></div>
  <div class="wrap" style="position:relative;z-index:1;">
    <div class="reveal">
      <h2>Let's build the<br/><span class="accent">next thing.</span></h2>
      <p>Tell us where you're going…</p>
      <div class="hero-actions">
        <a class="btn btn-primary btn-lg">Book a strategy call →</a>
        <a class="btn btn-ghost btn-lg">hello@atomicdesign.net</a>
      </div>
    </div>
  </div>
</section>
```
- Padding: `180px 32px`
- `.cta-orb` is a 720px circle with two inner concentric rings (`::before`, `::after` at scale 0.72 and 0.44) and a gradient dot at 12 o'clock. Rotates 360° over 80s.

---

### 2.17 Footer
Four-column grid: brand + 3 link columns. Bottom row holds copyright meta.

```html
<footer>
  <div class="foot-grid">
    <div class="foot-brand">
      <a class="nav-logo" href="#">
        <span class="logo-mark"><img src="assets/atomic-round-small.png" class="logo-img"/></span>
        <span>Atomic Design</span>
      </a>
      <p>Tagline / one-line description.</p>
    </div>
    <div class="foot-col">
      <h5>Services</h5>
      <ul>
        <li><a href="#">Link</a></li>
      </ul>
    </div>
    <!-- more cols -->
  </div>
  <div class="foot-bottom">
    <span>© 2026 Atomic Design</span>
    <span>Built since 1996</span>
  </div>
</footer>
```
- Grid: `2fr 1fr 1fr 1fr` (collapses to 2 cols ≤980px)
- 1px gradient hairline at top edge
- Column headers: mono 11px, uppercase, `--text-3`
- Footer logo mark uses `width:44px; height:44px` override

---

### 2.18 Forms (defined here — not yet on home)

The home page has no form yet. When you build one (lead capture, intake, contact), follow these specs to stay in-system:

```html
<form class="form">
  <label class="field">
    <span class="field-label">Full name</span>
    <input class="input" type="text" placeholder="Jane Doe" />
  </label>
  <label class="field">
    <span class="field-label">Email</span>
    <input class="input" type="email" placeholder="you@company.com" />
  </label>
  <label class="field">
    <span class="field-label">Project budget</span>
    <select class="input">
      <option>Select range</option>
    </select>
  </label>
  <label class="field">
    <span class="field-label">Tell us about your project</span>
    <textarea class="input" rows="5"></textarea>
  </label>
  <button type="submit" class="btn btn-primary btn-lg">Send →</button>
</form>
```

Add these styles to `styles-v2.css` (NEW — define when needed):
```css
.form { display: flex; flex-direction: column; gap: 20px; max-width: 520px; }
.field { display: flex; flex-direction: column; gap: 8px; }
.field-label {
  font-family: var(--font-mono);
  font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--text-3);
}
.input {
  background: var(--surface);
  border: 1px solid var(--line-2);
  border-radius: 12px;
  color: var(--text);
  font: inherit; font-size: 15px;
  padding: 14px 16px;
  transition: border-color .25s, box-shadow .25s, background .25s;
}
.input::placeholder { color: var(--text-3); }
.input:hover { border-color: rgba(255,255,255,0.28); }
.input:focus {
  outline: none;
  border-color: var(--orange);
  background: var(--surface-2);
  box-shadow: 0 0 0 4px rgba(255,107,26,0.18);
}
.input[aria-invalid="true"] {
  border-color: #ff4655;
  box-shadow: 0 0 0 4px rgba(255,70,85,0.18);
}
.field-help { font-family: var(--font-mono); font-size: 11px; color: var(--text-3); }
.field-error { font-family: var(--font-mono); font-size: 11px; color: #ff4655; }
textarea.input { resize: vertical; min-height: 120px; }
```

**States required:** default, hover, focus, error (`aria-invalid="true"`), disabled (`opacity: 0.5; cursor: not-allowed;`). Always pair invalid inputs with `.field-error` text.

---

## 3. Utilities & helpers

### Gradient text
```html
<span class="grad-text">anything gradient</span>
```
Auto-animates `gradientShift 8s`.

### Reveal-on-scroll
Add `.reveal` to any element you want to fade up on scroll; add `.reveal-d2` / `.reveal-d3` / `.reveal-d4` for staggered delays.

### Screen labels
Every top-level section needs `data-screen-label="NN Name"` so comments/edit mode can anchor to it.

### Layout safety
- Always wrap in `<div class="wrap">` to cap width at 1280px.
- Default section padding is `130px 32px` — don't shrink without a reason.
- Stack-collapse threshold is `980px`. Mobile is essentially a 1-column document.

---

## 4. Iconography

- **Inline SVG only** — no icon font, no external sprite.
- Stroke style: `stroke="currentColor" stroke-width="1.6"`, no fill (`fill="none"`).
- Sizes: 22–26px in card glyphs, 22px in process step arrows.
- Color: inherits text color, or `var(--orange)` for process step arrows.
- When in doubt: use the arrow `<svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>` — that's the system's CTA arrow icon.

---

## 5. Composing a new page

**Standard skeleton:**
```html
<header class="nav">…</header>

<section class="hero" data-screen-label="01 Hero">…</section>

<div class="marquee">…</div>

<section class="services" id="services" data-screen-label="02 Services">
  <div class="wrap">
    <div class="section-head reveal">…</div>
    <div class="service-grid">…</div>
  </div>
</section>

<!-- repeat the section pattern for each block -->

<section class="cta" id="cta" data-screen-label="07 CTA">…</section>

<footer data-screen-label="08 Footer">…</footer>

<script src="app-v2.js"></script>
```

**Rules:**
1. Link `styles-v2.css` and load Geist + Geist Mono before the stylesheet.
2. Open every major block with a `.section-head` (tag + title + sub).
3. Pair primary + ghost buttons; never two primaries in a row.
4. Use the gradient once per section — not twice. Pick: gradient text in headline **or** primary button **or** gradient border — never all three.
5. Numbers/metrics should always be in gradient text. Plain bold + dark text feels off-brand here.
6. Every card-shaped element gets the **gradient-border pattern** (`::before` neutral, `::after` gradient on hover).
7. Every animated block gets `.reveal`. Stagger siblings with `.reveal-d2/d3/d4`.

---

## 6. File layout

```
/
├── Atomic Design 2026 v2.html      Live home page
├── styles-v2.css                   System stylesheet (single source of truth)
├── app-v2.js                       Reveal IntersectionObserver, marquee dup, hero canvas, counters, cursor glow
└── assets/
    ├── atomic-round-small.png      Logo mark (used in nav + footer)
    ├── case-booths.png             Work-card 01 reference
    ├── case-house.png              Work-card 02 reference
    └── case-panel.png              Work-card 03 reference
```

Replace the case-study images with your own when adding new work cards — keep them landscape, dark-backgrounded, with one or more "hot spots" your `.wv-glow` overlays can sit on top of.

---

## 7. Don'ts

- **Don't introduce new hex colors.** If you need a new shade, derive it via `oklch()` from existing tokens.
- **Don't use the cyan token** (`--cyan` is reserved; nothing in v2 ships with it).
- **Don't add a second display font.** Geist + Geist Mono is the whole system.
- **Don't use emoji** as UI. Use inline SVG or mono caption text.
- **Don't put text on top of work-card images.** All text lives in `.work-card-body` below the visual.
- **Don't put two `.btn-primary` next to each other** — pick one primary action per block.
- **Don't skip `data-screen-label`** on top-level sections.
