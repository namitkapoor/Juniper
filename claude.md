# Juniper Portfolio - Codebase Documentation

## Overview

A React-based portfolio website showcasing UX case studies with rich animations, 3D elements, and theme switching. Built for optimal performance with code splitting and lazy loading.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 18.3 |
| Build Tool | Vite 5.4.7 |
| Routing | React Router 6.26.2 |
| Animations | Framer Motion 11.15.0, Lottie React 2.4.1 |
| 3D Graphics | Three.js 0.166.1, @react-three/fiber, @react-three/drei |
| Smooth Scroll | Lenis 1.3.13 |
| UI Library | Ant Design 5.21.2 |
| Analytics | Google Analytics 4, Microsoft Clarity |
| Deployment | Vercel |

## Directory Structure

```
/src
├── /Pages                    # Main page components
│   ├── Home.jsx             # Landing page with hero + case studies grid
│   ├── About.jsx            # About page with 3D particle model
│   ├── Explore.jsx          # Experiments showcase
│   ├── App.jsx              # Router and global providers
│   └── /CaseStudies
│       ├── ManageFarms.jsx          # Farm management app case study
│       └── InfluencerMarketing.jsx  # B2B influencer platform case study
│
├── /components
│   ├── /layout              # Navbar, ThemeContext, PageTransition, MaskTransition
│   ├── /ui                  # Button, LoaderScreen, IframeLoader, OptimizedImage
│   ├── /sections            # Contact, OtherProjects, FeaturedShowcase
│   ├── /grids               # BentoGrid, ProjectBentoGrid, RuleOfThirdsGrid
│   ├── /case-study          # All case study section components
│   └── /media               # ImageCarousel, MediaRenderer, 3D Model viewers
│
├── /contexts                # ThemeContext, TransitionContext, HeroAnimationContext
├── /hooks                   # useLenis, useGoogleAnalytics, useClarity
├── /data                    # Static content data files
├── /shaders                 # GLSL shaders for 3D effects
├── /style                   # CSS files (one per component/page)
├── /config                  # Analytics configuration
└── main.jsx                 # React entry point

/public
├── /3d models/              # GLB files for Three.js
├── /fonts/                  # Satoshi, CabinetGrotesk (WOFF2)
├── /images/                 # Project covers, case study assets
├── /lottie/                 # Lottie animation JSON files
├── /videos/                 # Case study preview videos
└── /files/                  # Downloadable assets (resume, etc.)
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | Home | Landing page with hero section and case studies |
| `/about` | About | About page with 3D particle background |
| `/explore` | Explore | Experiments and side projects |
| `/case-study/manage-farms` | ManageFarms | Farm management app case study |
| `/case-study/influencer-marketing` | InfluencerMarketing | B2B influencer platform |

## Theming System

CSS custom properties drive the theme system. Toggle via `data-theme` attribute on `<html>`.

### Key CSS Variables

```css
/* Backgrounds */
--background           /* Page background */
--bento-background     /* Grid card background */
--card-background      /* Card components */

/* Text */
--text-primary         /* Main text color */
--text-secondary       /* Subdued text */
--text-tertiary        /* Muted text */

/* Accents */
--accent-success       /* Success/highlight color */
--gradient-text        /* Gradient for headings */
--gradient-card        /* Card gradient overlays */

/* Borders */
--bento-border         /* Grid borders */
```

### Color Palettes

**Dark Mode (Default):**
- Background: `#1d1d1d`
- Text: `#c0c0c0`

**Light Mode:**
- Background: `#d6cccc` (warm beige)
- Text: `#2e2d2d`

## Animation System

### Framer Motion
- Hero letter-by-letter and word-by-word animations
- Page transitions with circular mask reveal from click origin
- Expandable sections with height/opacity transitions
- Staggered animations via variants

### Lottie
- Hero decorative animation (`/public/lottie/hero-name.json`)
- Tagline animation
- Pixel smile blinking

### Smooth Scrolling (Lenis)
- Global instance at `window.lenis`
- Custom easing: `(t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))`

### Page Transitions
- MaskTransition component creates circular reveal
- Video overlay during transition (case study specific)
- 600ms duration with easing `[0.43, 0.13, 0.23, 0.96]`

## Case Study Components

Located in `/src/components/case-study/`:

| Component | Purpose |
|-----------|---------|
| `Overview.jsx` | Project overview section |
| `BusinessChallenge.jsx` | Problem statement + image carousel |
| `ResearchInsights.jsx` | User research findings |
| `StrategicApproach.jsx` | Methodology phases |
| `DesignChanges.jsx` | Before/after comparisons |
| `VisualEvolution.jsx` | Design progression timeline |
| `MeasurableResults.jsx` | Metrics and impact |
| `ImplementationPlan.jsx` | Development roadmap |
| `IterativeTimeline.jsx` | Timeline with progress tracking |
| `ProcessFlow.jsx` | Process visualization |
| `SolutionFramework.jsx` | Solution architecture |
| `DecisionCriteria.jsx` | Design decision cards |
| `PhaseContent.jsx` | Phase-based content renderer |

## Data Files

Case study content lives in `/src/data/`:

```
/data
├── overviewData.js           # Project overviews
├── businessChallengeData.js  # Problem statements
├── carouselImages.js         # Image carousel paths
├── caseStudies.js            # Case study metadata
├── designChangesData.js      # Design iterations
├── measurableResultsData.js  # Metrics and impact
├── visualEvolutionData.js    # Design evolution
├── projectsData.js           # Projects listing
├── projectBentoData.js       # Bento grid content
├── aboutContent.js           # About page sections
└── /strategic/               # Strategic approach phase data
```

## Key Contexts

### ThemeContext
```jsx
const { theme, toggleTheme } = useTheme();
// theme: 'light' | 'dark'
```

### TransitionContext
```jsx
const { startTransition, endTransition, transitionData } = useTransition();
// transitionData: { path, videoSrc, originX, originY }
```

### HeroAnimationContext
- Controls 25+ animation timing properties
- Dev mode: Leva GUI for tweaking
- Persists to localStorage

## Build & Deploy

### Development
```bash
npm run dev     # Start Vite dev server
```

### Production Build
```bash
npm run build   # Output to /dist
```

### Code Splitting (Manual Chunks)
- `react-vendor` - React, ReactDOM, Router
- `three-vendor` - Three.js, R3F
- `animation-vendor` - Framer Motion, Lottie
- `ui-vendor` - Ant Design

### Deployment
- Platform: Vercel
- SPA rewrites configured
- Caching: 1s max-age + 59s stale-while-revalidate

## Styling Conventions

- **File naming:** One CSS file per component/page in `/src/style/`
- **Class naming:** BEM-style (`block__element--modifier`)
- **Responsive:** Mobile breakpoint at 768px
- **Layout:** CSS Grid for page layouts, Flexbox for components
- **Typography:**
  - Body: Satoshi (regular, medium, bold)
  - Display: CabinetGrotesk (extra light)
  - Responsive sizing with `clamp()`

## Current Case Studies

| Name | Route | Metric | Status |
|------|-------|--------|--------|
| Manage Small Farms | `/case-study/manage-farms` | SUS 70 | Active |
| Influencer Marketing | `/case-study/influencer-marketing` | 28% Less Clicks | Active |
| Product Recommendations | External (chekout.ai) | 23% More Purchases | External |
| Student Enrollment | Coming Soon | 143% More Submissions | In Progress |

## Analytics

- **GA4:** `VITE_GA_MEASUREMENT_ID` env var
- **Clarity:** `VITE_CLARITY_PROJECT_ID` env var
- Production-only via `import.meta.env.PROD`

## Development Notes

### Adding a New Case Study

1. Create page component in `/src/Pages/CaseStudies/`
2. Add route in `App.jsx`
3. Create data files in `/src/data/`
4. Add assets to `/public/images/` and `/public/videos/`
5. Update home page case study grid

### Animation Timing (Hero)
Controlled via HeroAnimationContext. In dev mode, use Leva panel to adjust. Values persist to localStorage.

### Performance Considerations
- Lazy load pages with `React.lazy()`
- Use `React.memo()` for expensive components
- Optimize images with sharp during build
- Limit Three.js DPR for performance

---

## Redesign Implementation Plan

### Goal
Redesign portfolio to showcase Product Designer + Engineer skillset with emphasis on:
- Design thinking methodology
- Motion design craft
- Shipped products with measurable impact

### Three Case Studies to Build

#### 1. Christine Valmy (NEW)
**Route:** `/case-study/christine-valmy`
**Project:** AI enrollment assistant for beauty trade school
**Narrative:** User research killed the bento grid design
**Impact:** 143% increase in enrollment submissions

**Structure:**
- Hero with After Effects b-roll video
- Problem overview (traditional forms → AI assistant)
- Initial concept (Student ID card + Bento grid)
- User research twist (Sticky scroll with visual swap)
- Design iterations (3 before/after sliders)
- Final design (Form + Social media + Chat)
- Micro-interactions showcase (4 Lottie animations)
- Impact metrics + user quotes
- Technical implementation (WordPress plugin)

**Assets:** 13 images, 2 videos, 4 Lottie files

#### 2. Manage Small Farms (REVAMP)
**Route:** `/case-study/manage-farms`
**Project:** Mobile app for low-literacy farmers
**Narrative:** Accessibility through visual design
**Impact:** SUS score 70 (above average usability)

**Structure:**
- Hero with farmer using app in field
- Problem overview (low literacy, field conditions)
- User research findings (3 key insights)
- Design principles (Show don't tell, think spatially, high contrast, big touches)
- Map view design (color-coded plant beds)
- Micro-animations showcase (4 animations with technical notes)
- Design evolution (wireframe → high-fidelity)
- Accessibility features (voice input, screen reader, offline)
- Final screens gallery
- Impact metrics + testing results

**Assets:** 12 images, 3 videos, 3 Lottie files

#### 3. My Influency (REVAMP)
**Route:** `/case-study/influencer-marketing`
**Project:** B2B influencer marketing platform
**Narrative:** Motion design explorations that didn't ship
**Impact:** 28% fewer missed milestones

**Structure:**
- Hero with subway line animation
- Problem overview (tracking multiple influencers)
- Subway metaphor explanation
- Motion design explorations (3 concepts with Lottie)
  1. Stage progression animation
  2. Attention-seeking pulse
  3. New contract line drawing
- Technical reality check (why animations didn't ship)
- Static vs animated comparison (before/after slider)
- Other micro-animations (4 examples)
- Impact metrics (static version still effective)
- Honest learnings (motion as tool, not goal)

**Assets:** 13 images, 2 videos, 7 Lottie files

---

## New Components to Build

### Hero Video Section
Full-screen video with masking transition from home page click origin.

```jsx
<section className="hero-video-nk26">
  <video src="..." autoPlay muted playsInline />
  <div className="hero-content-nk26">
    <h1>Title</h1>
    <p>Subtitle</p>
  </div>
</section>
```

### Before/After Slider
Vertical divider slider for design iteration comparisons.

```jsx
<BeforeAfterSlider
  before={{ src: "...", alt: "..." }}
  after={{ src: "...", alt: "..." }}
/>
```

### Technical Note (Terminal Style)
Monospace, dotted border for implementation details.

```jsx
<TechnicalNote>
  Implementation details about animation timing,
  easing curves, or code decisions...
</TechnicalNote>
```

### Sticky Scroll Animation
Content that swaps/transforms as user scrolls through section.

### Grid Patterns
```css
/* Pattern A: 2/3 Left + 1/3 Right */
.grid-pattern-a-nk26 { grid-template-columns: 2fr 1fr; }

/* Pattern B: 1/3 Left + 2/3 Right */
.grid-pattern-b-nk26 { grid-template-columns: 1fr 2fr; }

/* Pattern C: Full width with nested split */
.grid-pattern-c-nk26 .grid-nested-nk26 { grid-template-columns: 2fr 1fr; }
```

---

## Design System Updates

### Typography Changes
| Role | Current | New |
|------|---------|-----|
| Display | CabinetGrotesk | Craftwork Grotesk |
| Body | Satoshi | Satoshi (keep) |
| Technical | - | PP Mondwest / Neue Bit Bold |

### Color Updates (Light Mode Default)
```css
--background: #f5f5f5;           /* Light gray */
--text-primary: #1a1a1a;         /* Near black */
--text-secondary: #4a4a4a;       /* Dark gray */
--accent-primary: #6366f1;       /* Purple/Indigo */
--tech-note-bg: rgba(0,0,0,0.03);
--tech-note-border: rgba(0,0,0,0.15);
```

### Classname Convention
All new classes must end with `-nk26` suffix to avoid conflicts:
```css
.component-name-nk26        /* Base */
.component-name-nk26:hover  /* State */
.is-active                  /* Modifier */
```

### Accessibility Requirements
- WCAG AAA text contrast (7:1+)
- ARIA labels on all interactive elements
- Keyboard navigation support
- `prefers-reduced-motion` support
- Triple coding for status: color + icon + pattern

---

## Implementation Checklist

### Phase 1: Foundation
- [ ] Add Craftwork Grotesk font
- [ ] Add PP Mondwest font
- [ ] Update CSS variables for light mode default
- [ ] Create base grid patterns (A, B, C)
- [ ] Build HeroVideo component
- [ ] Build BeforeAfterSlider component
- [ ] Build TechnicalNote component
- [ ] Build StickyScrollSection component

### Phase 2: Case Studies
- [ ] Christine Valmy (new)
- [ ] Manage Small Farms (revamp)
- [ ] My Influency (revamp)

### Phase 3: Polish
- [ ] Optimize images (WebP with fallback)
- [ ] Compress videos (<5MB each)
- [ ] Lazy load Lottie (pause when off-screen)
- [ ] Run accessibility audit
- [ ] Lighthouse 90+ performance

---

## Asset Requirements Summary

| Project | Images | Videos | Lottie |
|---------|--------|--------|--------|
| Christine Valmy | 13 | 2 | 4 |
| Manage Farms | 12 | 3 | 3 |
| My Influency | 13 | 2 | 7 |
| **Total** | **38** | **7** | **14** |

**Image specs:** JPG for photos, PNG for UI, max 2400px width
**Video specs:** MP4 + WebM, 1920x1080 or 1280x720, <10MB
**Lottie specs:** JSON, <20KB, 30/60fps

---

## Design Principles

1. **Light Mode Default** - #f5f5f5 background, high contrast
2. **Rule of Thirds Grid** - Mobile stack, tablet/desktop 2/3 + 1/3 variations
3. **Motion with Purpose** - Animations communicate state, technical notes explain
4. **Accessibility First** - WCAG AAA, keyboard nav, screen reader friendly
5. **Mobile-First** - Design 320px, enhance 768px+, optimize 1024px+

---

## Pitfalls to Avoid

| Don't | Do |
|-------|-----|
| Use CabinetGrotesk for new sections | Use Craftwork Grotesk |
| `.grid-container` (conflicts) | `.grid-container-nk26` |
| Desktop-first media queries | Mobile-first with `min-width` |
| Animate everything | Purposeful motion + reduced-motion support |
| Color-only status indicators | Color + icon + pattern |
| Load all Lottie on page load | Lazy load with Intersection Observer |

---

*Last updated: January 2026*
