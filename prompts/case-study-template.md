# Case Study Template - Design System

## Overview
This template provides reusable components for case study pages with:
- Responsive rule-of-thirds grid patterns
- Masking transitions from homepage
- Video b-roll hero sections
- Technical annotation system
- Before/after comparison sliders
- Lottie animation embeds
- Mobile-first, accessible markup

All classnames use `-nk26` suffix to avoid conflicts and include ARIA labels for screen readers.

---

## Hero Section - Full Screen Video

```html
<section class="hero-video-nk26" aria-label="Project introduction video">
  <div class="video-container-nk26">
    <!-- Video b-roll (10-15s, no loop) -->
    <video 
      class="hero-video-element-nk26"
      src="/videos/[project-name]-hero.mp4"
      autoplay
      muted
      playsinline
      aria-label="Project demonstration video"
    >
    </video>
    
    <!-- Overlay gradient for text readability -->
    <div class="video-overlay-nk26" aria-hidden="true"></div>
    
    <!-- Project title -->
    <div class="hero-content-nk26">
      <h1 class="hero-title-nk26">Project Title</h1>
      <p class="hero-subtitle-nk26">Brief tagline or hook</p>
    </div>
    
    <!-- Scroll indicator -->
    <div class="scroll-indicator-nk26" aria-label="Scroll to continue">
      <span class="scroll-text-nk26">Scroll</span>
      <svg class="scroll-arrow-nk26" aria-hidden="true">
        <!-- Arrow down icon -->
      </svg>
    </div>
  </div>
</section>
```

### CSS (Mobile-First)
```css
/* Hero Video Section */
.hero-video-nk26 {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.video-container-nk26 {
  position: relative;
  width: 100%;
  height: 100%;
}

.hero-video-element-nk26 {
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  transform: translate(-50%, -50%);
  object-fit: cover;
}

.video-overlay-nk26 {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.6) 100%
  );
  pointer-events: none;
}

.hero-content-nk26 {
  position: absolute;
  bottom: 20%;
  left: 5%;
  right: 5%;
  color: #fff;
  z-index: 2;
}

.hero-title-nk26 {
  font-family: 'CabinetGrotesk', sans-serif;
  font-weight: 200;
  font-size: clamp(2rem, 8vw, 5rem);
  line-height: 1.1;
  margin: 0 0 1rem 0;
}

.hero-subtitle-nk26 {
  font-family: 'Satoshi', sans-serif;
  font-size: clamp(1rem, 3vw, 1.5rem);
  opacity: 0.9;
  max-width: 600px;
}

.scroll-indicator-nk26 {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #fff;
  z-index: 2;
  animation: bounce-nk26 2s infinite;
}

.scroll-text-nk26 {
  font-family: 'Satoshi', sans-serif;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.scroll-arrow-nk26 {
  width: 20px;
  height: 20px;
}

@keyframes bounce-nk26 {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(10px); }
}

/* Tablet and up */
@media (min-width: 768px) {
  .hero-content-nk26 {
    left: 8%;
    right: 8%;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .hero-content-nk26 {
    left: 10%;
    right: auto;
    max-width: 60%;
  }
}
```

---

## Grid Patterns - Rule of Thirds

### Pattern A: 2/3 Content + 1/3 Meta (Left Heavy)

```html
<section class="grid-pattern-a-nk26" aria-label="Section name">
  <div class="grid-container-nk26">
    <!-- 2/3 Main Content -->
    <div class="grid-main-nk26" role="article">
      <h2 class="section-title-nk26">Section Title</h2>
      <p class="section-text-nk26">Content goes here...</p>
      <!-- Image placeholder -->
      <div class="image-wrapper-nk26">
        <img 
          src="/images/placeholder-main.jpg" 
          alt="[Describe image content for screen readers]"
          class="section-image-nk26"
          loading="lazy"
        />
        <figcaption class="image-caption-nk26">Image caption</figcaption>
      </div>
    </div>
    
    <!-- 1/3 Meta Info -->
    <aside class="grid-meta-nk26" aria-label="Project metadata">
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Role</span>
        <span class="meta-value-nk26">Product Designer + Engineer</span>
      </div>
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Timeline</span>
        <span class="meta-value-nk26">4 months</span>
      </div>
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Impact</span>
        <span class="meta-value-nk26">143% increase</span>
      </div>
    </aside>
  </div>
</section>
```

### Pattern B: 1/3 Meta + 2/3 Visual (Right Heavy)

```html
<section class="grid-pattern-b-nk26" aria-label="Section name">
  <div class="grid-container-nk26">
    <!-- 1/3 Text -->
    <div class="grid-text-nk26">
      <h2 class="section-title-nk26">Section Title</h2>
      <p class="section-text-nk26">Explanation text...</p>
    </div>
    
    <!-- 2/3 Visual -->
    <div class="grid-visual-nk26">
      <img 
        src="/images/placeholder-visual.jpg" 
        alt="[Describe visual content]"
        class="section-image-nk26"
        loading="lazy"
      />
    </div>
  </div>
</section>
```

### Pattern C: Full Width with Nested Split

```html
<section class="grid-pattern-c-nk26" aria-label="Section name">
  <div class="grid-container-nk26">
    <!-- Full width title -->
    <h2 class="section-title-full-nk26">Section Title</h2>
    
    <!-- Nested 2/3 + 1/3 split -->
    <div class="grid-nested-nk26">
      <div class="nested-main-nk26">
        <!-- 2/3 content -->
        <p class="section-text-nk26">Main content...</p>
      </div>
      <div class="nested-aside-nk26">
        <!-- 1/3 supplementary -->
        <blockquote class="quote-nk26">
          "User quote or important callout"
        </blockquote>
      </div>
    </div>
  </div>
</section>
```

### CSS for Grid Patterns (Mobile-First)

```css
/* Base Grid Container */
.grid-container-nk26 {
  max-width: 1400px;
  margin: 0 auto;
  padding: 4rem 5%;
  display: grid;
  gap: 2rem;
}

/* Mobile: Everything stacks */
.grid-main-nk26,
.grid-meta-nk26,
.grid-text-nk26,
.grid-visual-nk26 {
  width: 100%;
}

.section-title-nk26 {
  font-family: 'CabinetGrotesk', sans-serif;
  font-weight: 200;
  font-size: clamp(1.75rem, 5vw, 3rem);
  line-height: 1.2;
  margin: 0 0 1.5rem 0;
  color: var(--text-primary);
}

.section-text-nk26 {
  font-family: 'Satoshi', sans-serif;
  font-size: clamp(1rem, 2vw, 1.125rem);
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

/* Tablet: Start introducing grid */
@media (min-width: 768px) {
  .grid-container-nk26 {
    padding: 5rem 8%;
    gap: 3rem;
  }
  
  /* Pattern A: 2/3 + 1/3 */
  .grid-pattern-a-nk26 .grid-container-nk26 {
    grid-template-columns: 2fr 1fr;
  }
  
  /* Pattern B: 1/3 + 2/3 */
  .grid-pattern-b-nk26 .grid-container-nk26 {
    grid-template-columns: 1fr 2fr;
  }
  
  /* Pattern C: Nested splits */
  .grid-nested-nk26 {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
    margin-top: 2rem;
  }
}

/* Desktop: Full layout */
@media (min-width: 1024px) {
  .grid-container-nk26 {
    padding: 6rem 10%;
    gap: 4rem;
  }
}

/* Meta Sidebar Styling */
.meta-item-nk26 {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.meta-item-nk26:last-child {
  border-bottom: none;
}

.meta-label-nk26 {
  font-family: 'Satoshi', sans-serif;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-tertiary);
}

.meta-value-nk26 {
  font-family: 'Satoshi', sans-serif;
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--text-primary);
}

/* Images */
.image-wrapper-nk26 {
  margin: 2rem 0;
}

.section-image-nk26 {
  width: 100%;
  height: auto;
  border-radius: 8px;
  display: block;
}

.image-caption-nk26 {
  font-family: 'Satoshi', sans-serif;
  font-size: 0.875rem;
  color: var(--text-tertiary);
  margin-top: 0.75rem;
  font-style: italic;
}
```

---

## Technical Notes Component (Terminal Style)

```html
<!-- In-content technical annotation -->
<div class="tech-note-nk26" role="complementary" aria-label="Technical implementation details">
  <div class="tech-note-header-nk26">
    <svg class="tech-note-icon-nk26" aria-hidden="true">
      <!-- Code icon -->
    </svg>
    <span class="tech-note-label-nk26">Technical Note</span>
  </div>
  <div class="tech-note-content-nk26">
    <p class="tech-note-text-nk26">
      Implemented as a lazy-loaded React component using Intersection Observer. 
      Reviews fetch from Shopify API with 2s debounce to avoid rate limits. 
      Star ratings use SVG animations triggered on viewport entry.
    </p>
  </div>
</div>
```

### CSS for Technical Notes

```css
.tech-note-nk26 {
  margin: 2rem 0;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.03);
  border: 2px dotted rgba(0, 0, 0, 0.15);
  border-radius: 4px;
}

.tech-note-header-nk26 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tech-note-icon-nk26 {
  width: 20px;
  height: 20px;
  color: var(--text-tertiary);
}

.tech-note-label-nk26 {
  font-family: 'PP Mondwest', 'PP Neue Bit Bold', monospace;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-tertiary);
}

.tech-note-content-nk26 {
  font-family: 'PP Mondwest', 'PP Neue Bit Bold', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--text-secondary);
}

.tech-note-text-nk26 {
  margin: 0;
}

/* Dark mode variant (if needed) */
[data-theme="dark"] .tech-note-nk26 {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.15);
}
```

---

## Before/After Slider Component

```html
<div class="before-after-slider-nk26" aria-label="Before and after comparison">
  <div class="slider-container-nk26">
    <!-- Before Image (Full) -->
    <div class="before-image-wrapper-nk26">
      <img 
        src="/images/before-placeholder.jpg" 
        alt="Design before changes - [describe specific elements]"
        class="comparison-image-nk26"
      />
      <span class="image-label-nk26 label-before-nk26">Before</span>
    </div>
    
    <!-- After Image (Clipped) -->
    <div class="after-image-wrapper-nk26">
      <img 
        src="/images/after-placeholder.jpg" 
        alt="Design after changes - [describe improvements]"
        class="comparison-image-nk26"
      />
      <span class="image-label-nk26 label-after-nk26">After</span>
    </div>
    
    <!-- Vertical Divider -->
    <div class="slider-divider-nk26" role="slider" aria-label="Drag to compare before and after" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" tabindex="0">
      <div class="divider-line-nk26" aria-hidden="true"></div>
      <div class="divider-handle-nk26" aria-hidden="true">
        <svg class="handle-icon-nk26">
          <!-- Left/Right arrows -->
        </svg>
      </div>
    </div>
  </div>
  
  <!-- Caption explaining changes -->
  <p class="slider-caption-nk26">
    Explain what changed and why this iteration was necessary
  </p>
</div>
```

### CSS for Before/After Slider

```css
.before-after-slider-nk26 {
  margin: 3rem 0;
}

.slider-container-nk26 {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 8px;
  cursor: ew-resize;
}

.before-image-wrapper-nk26,
.after-image-wrapper-nk26 {
  position: absolute;
  inset: 0;
}

.after-image-wrapper-nk26 {
  clip-path: inset(0 50% 0 0);
}

.comparison-image-nk26 {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.image-label-nk26 {
  position: absolute;
  top: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  font-family: 'Satoshi', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 4px;
  pointer-events: none;
}

.label-before-nk26 {
  left: 1rem;
}

.label-after-nk26 {
  right: 1rem;
}

.slider-divider-nk26 {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 4px;
  transform: translateX(-50%);
  z-index: 10;
}

.divider-line-nk26 {
  position: absolute;
  inset: 0;
  background: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.divider-handle-nk26 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

.handle-icon-nk26 {
  width: 24px;
  height: 24px;
  color: var(--text-primary);
}

.slider-caption-nk26 {
  font-family: 'Satoshi', sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin-top: 1rem;
  text-align: center;
}

/* Keyboard accessibility */
.slider-divider-nk26:focus {
  outline: 2px solid var(--accent-color);
  outline-offset: 4px;
}
```

### JavaScript for Slider Interaction

```javascript
// Initialize all sliders on page
document.addEventListener('DOMContentLoaded', () => {
  const sliders = document.querySelectorAll('.before-after-slider-nk26');
  
  sliders.forEach(slider => {
    const container = slider.querySelector('.slider-container-nk26');
    const afterWrapper = slider.querySelector('.after-image-wrapper-nk26');
    const divider = slider.querySelector('.slider-divider-nk26');
    
    let isDragging = false;
    
    const updatePosition = (x) => {
      const rect = container.getBoundingClientRect();
      const position = Math.max(0, Math.min(x - rect.left, rect.width));
      const percentage = (position / rect.width) * 100;
      
      afterWrapper.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
      divider.style.left = `${percentage}%`;
      divider.setAttribute('aria-valuenow', Math.round(percentage));
    };
    
    // Mouse events
    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      updatePosition(e.clientX);
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      updatePosition(e.clientX);
    });
    
    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
    
    // Touch events
    container.addEventListener('touchstart', (e) => {
      isDragging = true;
      updatePosition(e.touches[0].clientX);
    });
    
    document.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      updatePosition(e.touches[0].clientX);
    });
    
    document.addEventListener('touchend', () => {
      isDragging = false;
    });
    
    // Keyboard accessibility
    divider.addEventListener('keydown', (e) => {
      const step = 5; // 5% per keypress
      const currentValue = parseInt(divider.getAttribute('aria-valuenow'));
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const newValue = Math.max(0, currentValue - step);
        const rect = container.getBoundingClientRect();
        updatePosition((newValue / 100) * rect.width + rect.left);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const newValue = Math.min(100, currentValue + step);
        const rect = container.getBoundingClientRect();
        updatePosition((newValue / 100) * rect.width + rect.left);
      }
    });
  });
});
```

---

## Lottie Animation Embed

```html
<div class="lottie-animation-nk26" aria-label="Animated diagram showing [describe animation content]">
  <div 
    id="lottie-container-[unique-id]" 
    class="lottie-player-nk26"
    role="img"
    aria-label="[Detailed description of animation]"
  ></div>
  <figcaption class="lottie-caption-nk26">
    Animation caption explaining what's being shown
  </figcaption>
</div>
```

### CSS for Lottie

```css
.lottie-animation-nk26 {
  margin: 3rem 0;
}

.lottie-player-nk26 {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  aspect-ratio: 16 / 9;
}

.lottie-caption-nk26 {
  font-family: 'Satoshi', sans-serif;
  font-size: 0.875rem;
  color: var(--text-tertiary);
  margin-top: 1rem;
  text-align: center;
  font-style: italic;
}

/* Mobile: Smaller aspect ratio */
@media (max-width: 767px) {
  .lottie-player-nk26 {
    aspect-ratio: 4 / 3;
  }
}
```

### JavaScript for Lottie (using lottie-web)

```javascript
import lottie from 'lottie-web';

// Load Lottie animation
const loadLottieAnimation = (containerId, animationPath, loop = false) => {
  const container = document.getElementById(containerId);
  
  if (!container) return;
  
  const animation = lottie.loadAnimation({
    container: container,
    renderer: 'svg',
    loop: loop,
    autoplay: true,
    path: animationPath
  });
  
  // Pause animation when out of view (performance)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animation.play();
      } else {
        animation.pause();
      }
    });
  });
  
  observer.observe(container);
  
  return animation;
};

// Example usage
loadLottieAnimation(
  'lottie-container-design-process',
  '/lottie/design-process.json',
  false // Don't loop
);
```

---

## Sticky Scroll Animation (For CV Pivot Story)

```html
<section class="sticky-scroll-section-nk26" aria-label="Design evolution narrative">
  <div class="sticky-container-nk26">
    <!-- Sticky Visual (Left) -->
    <div class="sticky-visual-nk26" aria-live="polite">
      <div class="visual-card-nk26 active" data-step="1">
        <img src="/images/bento-grid-concept.jpg" alt="Initial bento grid concept with multiple topic tiles" />
      </div>
      <div class="visual-card-nk26" data-step="2">
        <img src="/images/final-design.jpg" alt="Final simplified design with social media panel" />
      </div>
    </div>
    
    <!-- Scrollable Content (Right) -->
    <div class="sticky-content-nk26">
      <div class="content-block-nk26" data-trigger="1">
        <h3 class="content-title-nk26">Initial Concept</h3>
        <p class="content-text-nk26">
          We designed a bento grid with topic tiles for Alumni Stats, Location, 
          Finances, Eligibility, and Course Scheduling. Each tile would reveal 
          detailed information and help us understand student priorities.
        </p>
        <ul class="feature-list-nk26">
          <li class="feature-item-nk26">Alumni Stats</li>
          <li class="feature-item-nk26">Location Information</li>
          <li class="feature-item-nk26">Finances & Tuition</li>
          <li class="feature-item-nk26">Eligibility Requirements</li>
          <li class="feature-item-nk26">Course Scheduling</li>
        </ul>
      </div>
      
      <div class="content-block-nk26" data-trigger="2">
        <h3 class="content-title-nk26">User Research Revealed</h3>
        <p class="content-text-nk26">
          Through user interviews, we discovered that prospective students 
          prioritize social media stalking over academic information. They 
          wanted to see the school's Instagram before anything else.
        </p>
        <blockquote class="user-quote-nk26">
          "The first thing I do after talking to someone about a school is 
          check out their Instagram. That tells me more than any brochure."
        </blockquote>
      </div>
      
      <div class="content-block-nk26" data-trigger="3">
        <h3 class="content-title-nk26">Final Design</h3>
        <p class="content-text-nk26">
          We stripped down to essentials: Inquiry form, Social media panel, 
          and Chat assistant. Sometimes the best design is admitting your 
          clever solution wasn't what users needed.
        </p>
        <ul class="feature-list-nk26 feature-list-final-nk26">
          <li class="feature-item-nk26">Inquiry Form</li>
          <li class="feature-item-nk26">Social Media Links</li>
          <li class="feature-item-nk26">Chat Assistant</li>
        </ul>
      </div>
    </div>
  </div>
</section>
```

### CSS for Sticky Scroll

```css
.sticky-scroll-section-nk26 {
  padding: 4rem 5%;
}

.sticky-container-nk26 {
  max-width: 1400px;
  margin: 0 auto;
}

/* Mobile: Stack */
.sticky-visual-nk26,
.sticky-content-nk26 {
  width: 100%;
}

.sticky-visual-nk26 {
  margin-bottom: 2rem;
}

.visual-card-nk26 {
  opacity: 0;
  transition: opacity 0.6s ease;
}

.visual-card-nk26.active {
  opacity: 1;
}

.visual-card-nk26 img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.content-block-nk26 {
  margin-bottom: 4rem;
  padding-bottom: 4rem;
  border-bottom: 1px solid var(--border-color);
}

.content-block-nk26:last-child {
  border-bottom: none;
}

.content-title-nk26 {
  font-family: 'CabinetGrotesk', sans-serif;
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.content-text-nk26 {
  font-family: 'Satoshi', sans-serif;
  font-size: 1.125rem;
  line-height: 1.7;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.feature-list-nk26 {
  list-style: none;
  padding: 0;
  margin: 2rem 0;
}

.feature-item-nk26 {
  font-family: 'Satoshi', sans-serif;
  font-size: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-color);
  position: relative;
  padding-left: 1.5rem;
}

.feature-item-nk26::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--text-tertiary);
}

.user-quote-nk26 {
  font-family: 'Satoshi', sans-serif;
  font-size: 1.125rem;
  font-style: italic;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.03);
  border-left: 4px solid var(--accent-color);
  margin: 2rem 0;
  color: var(--text-secondary);
}

/* Tablet and up: Side-by-side with sticky */
@media (min-width: 768px) {
  .sticky-scroll-section-nk26 {
    padding: 6rem 8%;
  }
  
  .sticky-container-nk26 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
  }
  
  .sticky-visual-nk26 {
    position: sticky;
    top: 2rem;
    height: fit-content;
    margin-bottom: 0;
  }
}

/* Desktop: Wider spacing */
@media (min-width: 1024px) {
  .sticky-scroll-section-nk26 {
    padding: 8rem 10%;
  }
  
  .sticky-container-nk26 {
    grid-template-columns: 5fr 7fr;
  }
}
```

### JavaScript for Sticky Scroll Triggers

```javascript
document.addEventListener('DOMContentLoaded', () => {
  const visualCards = document.querySelectorAll('.visual-card-nk26');
  const contentBlocks = document.querySelectorAll('.content-block-nk26');
  
  // Intersection Observer for content blocks
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const trigger = entry.target.dataset.trigger;
        
        // Hide all visual cards
        visualCards.forEach(card => card.classList.remove('active'));
        
        // Show corresponding visual card
        const activeCard = document.querySelector(`.visual-card-nk26[data-step="${trigger}"]`);
        if (activeCard) {
          activeCard.classList.add('active');
        }
      }
    });
  }, {
    threshold: 0.5,
    rootMargin: '-100px 0px'
  });
  
  // Observe all content blocks
  contentBlocks.forEach(block => observer.observe(block));
});
```

---

## Masking Transition from Homepage

```javascript
// Add to homepage project cards
const projectCards = document.querySelectorAll('.project-card-nk26');

projectCards.forEach(card => {
  card.addEventListener('click', (e) => {
    const targetUrl = card.dataset.url;
    const videoSrc = card.dataset.video;
    
    // Get click position
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Create mask overlay
    const mask = document.createElement('div');
    mask.className = 'mask-transition-nk26';
    mask.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: radial-gradient(circle at ${x}px ${y}px, transparent 0%, black 0%);
      pointer-events: none;
    `;
    document.body.appendChild(mask);
    
    // Animate mask expansion
    mask.animate([
      { background: `radial-gradient(circle at ${x}px ${y}px, transparent 0%, black 0%)` },
      { background: `radial-gradient(circle at ${x}px ${y}px, transparent 100%, black 100%)` }
    ], {
      duration: 800,
      easing: 'cubic-bezier(0.43, 0.13, 0.23, 0.96)',
      fill: 'forwards'
    }).finished.then(() => {
      window.location.href = targetUrl;
    });
  });
});
```

---

## CSS Custom Properties (Light Mode Default)

```css
:root {
  /* Colors */
  --background: #f5f5f5;
  --text-primary: #1a1a1a;
  --text-secondary: #4a4a4a;
  --text-tertiary: #8a8a8a;
  --accent-color: #6366f1;
  --border-color: rgba(0, 0, 0, 0.1);
  
  /* Typography */
  --font-display: 'CabinetGrotesk', sans-serif;
  --font-body: 'Satoshi', sans-serif;
  --font-mono: 'PP Mondwest', 'PP Neue Bit Bold', monospace;
  
  /* Spacing */
  --space-xs: 0.5rem;
  --space-sm: 1rem;
  --space-md: 1.5rem;
  --space-lg: 2rem;
  --space-xl: 3rem;
  --space-2xl: 4rem;
  
  /* Animation */
  --transition-fast: 0.2s ease;
  --transition-base: 0.3s ease;
  --transition-slow: 0.6s ease;
}

/* Dark mode overrides (if needed) */
[data-theme="dark"] {
  --background: #1a1a1a;
  --text-primary: #f5f5f5;
  --text-secondary: #c0c0c0;
  --text-tertiary: #808080;
  --border-color: rgba(255, 255, 255, 0.1);
}
```

---

## Accessibility Checklist

✅ All interactive elements have `aria-label` or `aria-labelledby`  
✅ All images have descriptive `alt` text  
✅ Color contrast meets WCAG AA (4.5:1 for body text)  
✅ Focus states visible on all interactive elements  
✅ Keyboard navigation supported (Tab, Arrow keys)  
✅ Screen reader announcements for dynamic content (`aria-live`)  
✅ Semantic HTML (`<section>`, `<article>`, `<aside>`, `<nav>`)  
✅ Skip links for keyboard users  
✅ Reduced motion support for animations

```css
/* Respect user's motion preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Performance Optimizations

1. **Lazy loading images**: Use `loading="lazy"` attribute
2. **Video optimization**: Serve compressed MP4 with fallback poster
3. **Lottie performance**: Pause animations when out of viewport
4. **Code splitting**: Load components on-demand
5. **CSS containment**: Use `contain: layout style paint` on isolated components

```css
/* Example: Contain expensive components */
.grid-container-nk26 {
  contain: layout style;
}

.before-after-slider-nk26 {
  contain: layout style paint;
}
```

---

## Next Steps

1. Create individual case study content files (Christine Valmy, Manage Farms, My Influency)
2. Replace all image placeholders with actual assets
3. Implement masking transition logic on homepage
4. Add Lottie animation files
5. Test keyboard navigation and screen reader support
6. Optimize video file sizes (<5MB for mobile)
7. Add Google Analytics events for interaction tracking

---

**Ready to build the first case study: Christine Valmy**
