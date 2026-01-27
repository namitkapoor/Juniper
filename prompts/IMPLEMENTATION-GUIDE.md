# Portfolio Redesign - Master Implementation Guide

## Project Overview

This project redesigns Namit's portfolio website to showcase his Product Designer + Engineer skillset with emphasis on design thinking methodology, motion design craft, and shipped products. The portfolio positions him for Product Designer roles while demonstrating technical implementation capabilities.

---

## File Structure & Purpose

### 1. **case-study-template.md**
**Purpose:** Reusable component library and patterns  
**Contains:**
- Hero video section with masking transition
- Grid pattern variations (2/3 + 1/3, 1/3 + 2/3, full width nested)
- Before/after slider component (vertical divider)
- Technical notes component (terminal style)
- Lottie animation embeds
- Sticky scroll animation system
- All base CSS and JavaScript

**When to use:** Reference this file first for any case study page. It defines all reusable components.

---

### 2. **christine-valmy-case-study.md**
**Purpose:** Full case study content and structure  
**Project:** AI enrollment assistant for beauty trade school  
**Key narrative:** User research killed the bento grid design  
**Emphasis:** Design iteration, pivot story, user feedback  
**Impact:** 143% increase in enrollment submissions  

**Structure:**
- Hero with After Effects b-roll video
- Problem overview (traditional forms → AI assistant)
- Initial concept (Student ID card + Bento grid)
- User research twist (Sticky scroll with visual swap)
- Design iterations (3 major changes with before/after sliders)
- Final design (simplified: Form + Social media + Chat)
- Micro-interactions showcase (Lottie animations)
- Impact metrics + user quotes
- Technical implementation (WordPress plugin)

**Assets needed:**
- 13 images (wireframes, mockups, final screens)
- 2 videos (hero b-roll, social media iteration)
- 4 Lottie files (animations)

---

### 3. **manage-farms-case-study.md**
**Purpose:** Full case study content and structure  
**Project:** Mobile app for low-literacy farmers  
**Key narrative:** Accessibility through visual design  
**Emphasis:** WCAG compliance, color-coded status, micro-animations  
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
- Final screens gallery (4 screens)
- Impact metrics + testing results

**Assets needed:**
- 12 images (context photos, mockups, screens, diagrams)
- 3 videos (hero b-roll, status change animation, text comparison)
- 3 Lottie files (bed selection, crop switch, growth timeline)

---

### 4. **my-influency-case-study.md**
**Purpose:** Full case study content and structure  
**Project:** B2B influencer marketing platform  
**Key narrative:** Motion design explorations that didn't ship  
**Emphasis:** Subway metaphor, animation methodology, technical reality  
**Impact:** 28% fewer missed milestones  

**Structure:**
- Hero with subway line animation
- Problem overview (tracking multiple influencers)
- Subway metaphor explanation (why it works)
- Motion design explorations (3 detailed concepts with Lottie)
  1. Stage progression animation
  2. Attention-seeking pulse
  3. New contract line drawing
- Technical reality check (why animations didn't ship)
- Static vs animated comparison (before/after slider)
- Other micro-animations (4 examples)
- Impact metrics (static version still effective)
- Honest learnings (motion as tool, not goal)
- Design process artifacts gallery

**Assets needed:**
- 13 images (old interface, mockups, storyboards, specs)
- 2 videos (hero animation, line appear comparison)
- 7 Lottie files (3 explorations + 4 micro-interactions)

---

### 5. **design-system-guidelines.md**
**Purpose:** Visual language and technical specifications  
**Contains:**
- Typography system (Craftwork Grotesk + Satoshi + PP Mondwest/Neue Bit Bold)
- Color palette (light mode default, dark mode optional)
- Spacing scale (8px base)
- Grid system (rule of thirds responsive patterns)
- Component library (cards, buttons, lists, quotes, technical notes)
- Animation system (easing curves, durations, common animations)
- Accessibility guidelines (WCAG AAA compliance)
- Responsive breakpoints (mobile-first: 768px, 1024px)
- Performance optimizations
- Browser support targets

**When to use:** Reference for all styling decisions, CSS variables, and component patterns.

---

## Portfolio Structure

```
HOME
├─ Hero (existing animations)
├─ Featured Case Studies (3 cards)
│  ├─ Christine Valmy (pivot story)
│  ├─ Manage Small Farms (accessibility)
│  └─ My Influency (motion design)
└─ About / Contact

CASE STUDY PAGE TEMPLATE
├─ Hero (full-screen video with masking transition)
├─ Overview (2/3 + 1/3 grid)
├─ Context/Problem (various patterns)
├─ Solution/Process (scrollable narrative)
├─ Iterations (before/after sliders)
├─ Micro-interactions (Lottie showcases)
├─ Impact (metrics grid)
└─ Next Project (teaser)
```

---

## Design Principles

### 1. **Light Mode Default**
- Background: #f5f5f5
- Text: #1a1a1a (primary), #4a4a4a (secondary)
- High contrast for readability (7:1+ WCAG AAA)

### 2. **Rule of Thirds Grid**
- Mobile: Stack everything vertically
- Tablet/Desktop: 2/3 + 1/3 variations
- Different pattern per section for visual rhythm

### 3. **Motion with Purpose**
- Animations communicate state changes
- Technical notes explain implementation
- Lottie for complex animations, CSS for simple transitions

### 4. **Accessibility First**
- All classnames have `-nk26` suffix (unique, no conflicts)
- ARIA labels on every interactive element
- Keyboard navigation supported
- Screen reader friendly

### 5. **Mobile-First Responsive**
- Design for mobile (320px)
- Enhance for tablet (768px+)
- Optimize for desktop (1024px+)
- Max width 1400px

---

## Key Technical Details

### Classname Convention
```
.component-name-nk26        # Base component
.component-name-nk26:hover  # State
.is-active                  # Modifier
```

### All classnames end with `-nk26` to avoid conflicts

### Grid Patterns
```css
/* Pattern A: 2/3 Left + 1/3 Right */
.grid-pattern-a-nk26 .grid-container-nk26 {
  grid-template-columns: 2fr 1fr;
}

/* Pattern B: 1/3 Left + 2/3 Right */
.grid-pattern-b-nk26 .grid-container-nk26 {
  grid-template-columns: 1fr 2fr;
}

/* Pattern C: Full width with nested split */
.grid-pattern-c-nk26 .grid-nested-nk26 {
  grid-template-columns: 2fr 1fr;
}
```

### Typography Stack
```css
--font-display: 'Craftwork Grotesk', sans-serif;  /* Headings */
--font-body: 'Satoshi', sans-serif;               /* Body text */
--font-mono: 'PP Mondwest', monospace;            /* Technical notes */
```

### Color Variables
```css
--text-primary: #1a1a1a;
--text-secondary: #4a4a4a;
--accent-primary: #6366f1;  /* Purple/Indigo */
--tech-note-bg: rgba(0, 0, 0, 0.03);
--tech-note-border: rgba(0, 0, 0, 0.15);
```

---

## Component Usage Guide

### Hero Video Section
```html
<section class="hero-video-nk26" aria-label="Project introduction">
  <video class="hero-video-element-nk26" src="[path]" autoplay muted playsinline>
  <div class="hero-content-nk26">
    <h1 class="hero-title-nk26">Title</h1>
    <p class="hero-subtitle-nk26">Subtitle</p>
  </div>
</section>
```

### Before/After Slider
```html
<div class="before-after-slider-nk26">
  <div class="slider-container-nk26">
    <div class="before-image-wrapper-nk26">
      <img src="[before]" alt="[describe]" />
    </div>
    <div class="after-image-wrapper-nk26">
      <img src="[after]" alt="[describe]" />
    </div>
    <div class="slider-divider-nk26" role="slider"></div>
  </div>
</div>
```

### Technical Note
```html
<div class="tech-note-nk26" role="complementary">
  <div class="tech-note-header-nk26">
    <span class="tech-note-label-nk26">Technical Note</span>
  </div>
  <div class="tech-note-content-nk26">
    <p class="tech-note-text-nk26">Implementation details...</p>
  </div>
</div>
```

### Lottie Animation
```html
<div class="lottie-animation-nk26">
  <div id="lottie-[unique-id]" class="lottie-player-nk26" role="img" aria-label="[describe]">
  </div>
  <figcaption class="lottie-caption-nk26">Caption text</figcaption>
</div>
```

---

## Asset Requirements

### Images (All Case Studies)
**Format:** JPG for photos, PNG for UI screenshots  
**Size:** Max width 2400px, optimize for web  
**Naming:** `[project]-[description].jpg` (e.g., `cv-bento-grid-mockup.jpg`)

**Christine Valmy:** 13 images  
**Manage Farms:** 12 images  
**My Influency:** 13 images  

### Videos
**Format:** MP4 (primary) + WebM (fallback)  
**Codec:** H.264 for MP4, VP9 for WebM  
**Size:** 1920x1080 or 1280x720, <10MB per video  
**Length:** 10-15 seconds for hero videos, 5-10 seconds for demonstrations  

**Christine Valmy:** 2 videos  
**Manage Farms:** 3 videos  
**My Influency:** 2 videos  

### Lottie Files
**Format:** JSON  
**Size:** <20KB per file for performance  
**Frame rate:** 30fps or 60fps  
**Loop:** Specify per animation (some loop, some don't)

**Christine Valmy:** 4 Lottie files  
**Manage Farms:** 3 Lottie files  
**My Influency:** 7 Lottie files  

---

## Implementation Checklist

### Phase 1: Foundation
- [ ] Set up design system CSS (variables, typography, colors)
- [ ] Create base grid system (mobile-first)
- [ ] Build reusable components from template
- [ ] Test accessibility (keyboard nav, screen readers)

### Phase 2: Case Studies
- [ ] Christine Valmy
  - [ ] Hero section with video
  - [ ] Sticky scroll pivot animation
  - [ ] 3 before/after sliders
  - [ ] Technical notes
  - [ ] Lottie animations
  - [ ] Impact metrics
  
- [ ] Manage Small Farms
  - [ ] Hero section with video
  - [ ] Color system showcase
  - [ ] 4 micro-animations with Lottie
  - [ ] Accessibility features highlight
  - [ ] Screen gallery
  
- [ ] My Influency
  - [ ] Hero with subway animation
  - [ ] 3 motion design explorations
  - [ ] Static vs animated comparison
  - [ ] Process artifacts gallery
  - [ ] Honest learnings section

### Phase 3: Polish
- [ ] Optimize images (WebP with JPG fallback)
- [ ] Compress videos (<5MB each)
- [ ] Test Lottie performance (pause when off-screen)
- [ ] Test responsive layouts (320px → 1920px)
- [ ] Test dark mode (if implementing)
- [ ] Run accessibility audit (aXe, WAVE)
- [ ] Test keyboard navigation
- [ ] Test with screen readers (VoiceOver, NVDA)

### Phase 4: Performance
- [ ] Lazy load images (`loading="lazy"`)
- [ ] Lazy load Lottie animations (Intersection Observer)
- [ ] Optimize font loading (`font-display: swap`)
- [ ] Minify CSS and JS
- [ ] Test on slow connections (3G)
- [ ] Lighthouse audit (aim for 90+ performance)

---

## Common Pitfalls to Avoid

### 1. **Typography**
❌ Don't use CabinetGrotesk  
✅ Use Craftwork Grotesk (correct font)

### 2. **Classnames**
❌ `.grid-container` (conflicts with existing styles)  
✅ `.grid-container-nk26` (unique suffix)

### 3. **Responsive Grid**
❌ Desktop-first with `max-width` media queries  
✅ Mobile-first with `min-width` media queries

### 4. **Animations**
❌ Animate everything all the time  
✅ Purposeful motion with `prefers-reduced-motion` support

### 5. **Accessibility**
❌ Color-only status indicators  
✅ Color + icon + pattern (triple coding)

### 6. **Performance**
❌ Load all Lottie files on page load  
✅ Lazy load with Intersection Observer, pause when off-screen

### 7. **Images**
❌ Use placeholder images forever  
✅ Replace with actual project screenshots and mockups

### 8. **Technical Notes**
❌ Use standard `<aside>` styling  
✅ Use terminal-style with monospace font and dotted border

---

## Success Criteria

### Visual Quality
- [ ] Matches design system guidelines
- [ ] Consistent spacing and typography
- [ ] Professional, polished appearance
- [ ] High-quality images and videos

### Accessibility
- [ ] WCAG AAA text contrast (7:1+)
- [ ] All interactive elements keyboard accessible
- [ ] ARIA labels on all components
- [ ] Screen reader tested and functional

### Performance
- [ ] Lighthouse score 90+ (performance)
- [ ] First Contentful Paint <1.5s
- [ ] Largest Contentful Paint <2.5s
- [ ] No layout shift (CLS <0.1)

### Responsiveness
- [ ] Works on 320px (small mobile)
- [ ] Optimized for 768px (tablet)
- [ ] Enhanced for 1024px+ (desktop)
- [ ] No horizontal scroll at any width

### Functionality
- [ ] Before/after sliders work (mouse + touch + keyboard)
- [ ] Lottie animations play on scroll
- [ ] Videos autoplay (muted, inline)
- [ ] Sticky scroll triggers correctly
- [ ] All links and buttons functional

---

## Next Steps After Implementation

### Content
1. Replace all image placeholders with actual screenshots
2. Create missing videos in After Effects/Jitter
3. Design Lottie animations in After Effects + Bodymovin export
4. Proof-read all copy for typos
5. Get feedback from designers/developers

### Testing
1. Cross-browser testing (Chrome, Firefox, Safari, Edge)
2. Mobile device testing (iOS Safari, Chrome Android)
3. Accessibility audit with real users
4. Performance testing on slow connections
5. Usability testing with portfolio reviewers

### Deployment
1. Optimize assets (compress, resize)
2. Set up CDN for media files
3. Configure caching headers
4. Set up analytics (Google Analytics 4)
5. Launch and monitor

---

## File Reference Quick Links

**Template & Components:**  
→ `case-study-template.md` - All reusable patterns

**Case Study Content:**  
→ `christine-valmy-case-study.md` - Enrollment assistant  
→ `manage-farms-case-study.md` - Farmer mobile app  
→ `my-influency-case-study.md` - Influencer platform

**Design System:**  
→ `design-system-guidelines.md` - Colors, fonts, spacing, components

---

## Contact & Support

**Designer:** Namit  
**Positioning:** Product Designer who codes  
**Tech Stack:** React, Three.js, Unity, Figma  
**Current Status:** Actively job seeking  

**Portfolio Goal:** Demonstrate design thinking + technical execution for Product Designer roles  

---

## Final Notes

This redesign emphasizes:
1. **Clear narratives** over pixel perfection
2. **Design process** over just final outputs
3. **Honest learnings** (what didn't work and why)
4. **Accessibility** as core requirement, not afterthought
5. **Motion design** as communication tool, not decoration

The three case studies showcase different strengths:
- **Christine Valmy:** User research → Iteration → Pivot
- **Manage Small Farms:** Accessibility → Visual design → Micro-interactions
- **My Influency:** Motion design → Technical reality → Honest reflection

Together, they demonstrate Namit as a thoughtful designer who:
- Conducts user research and acts on findings
- Designs for accessibility constraints
- Understands technical limitations
- Iterates based on feedback
- Ships products that solve real problems

**This is a portfolio for someone who gets hired, not just interviewed.**

---

**Ready to build. All files are in `/home/claude/`**
