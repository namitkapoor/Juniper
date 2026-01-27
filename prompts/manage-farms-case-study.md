# Manage Small Farms Case Study - Designing for Low-Literacy Farmers

## Project Overview
**Project:** Manage Small Farms Mobile App  
**Role:** Product Designer + UX Researcher  
**Timeline:** 6 months (Academic Project)  
**Platform:** iOS & Android Mobile App  
**Impact:** SUS Score 70 (Above Average Usability)  

---

## Hero Section

```html
<section class="hero-video-nk26" aria-label="Manage Small Farms project introduction">
  <div class="video-container-nk26">
    <!-- B-roll video: Farmer using app in field, checking crop status -->
    <video 
      class="hero-video-element-nk26"
      src="/videos/manage-farms-hero.mp4"
      autoplay
      muted
      playsinline
      aria-label="Farmer using Manage Small Farms app to track crop growth in the field"
    >
      <source src="/videos/manage-farms-hero.webm" type="video/webm">
      <source src="/videos/manage-farms-hero.mp4" type="video/mp4">
    </video>
    
    <div class="video-overlay-nk26" aria-hidden="true"></div>
    
    <div class="hero-content-nk26">
      <h1 class="hero-title-nk26">Designing for Low-Literacy Farmers</h1>
      <p class="hero-subtitle-nk26">
        When your users can't read complex instructions, every icon and color matters
      </p>
    </div>
    
    <div class="scroll-indicator-nk26" aria-label="Scroll to continue">
      <span class="scroll-text-nk26">Scroll</span>
      <svg class="scroll-arrow-nk26" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 4L10 16M10 16L4 10M10 16L16 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </div>
  </div>
</section>
```

---

## Overview Section (Pattern A: 2/3 + 1/3)

```html
<section class="grid-pattern-a-nk26" aria-label="Project overview">
  <div class="grid-container-nk26">
    <!-- 2/3 Main Content -->
    <div class="grid-main-nk26" role="article">
      <h2 class="section-title-nk26">The Challenge</h2>
      <p class="section-text-nk26">
        Small-scale farmers in developing regions face a critical information gap. 
        They manage complex crop rotations, pest control schedules, and market timing 
        - but most farm management apps assume high literacy and smartphone expertise.
      </p>
      
      <p class="section-text-nk26">
        Our challenge: Design a mobile app for farmers with limited reading ability, 
        inconsistent internet access, and varying levels of smartphone experience. 
        The app needed to help them track multiple crops across different plant beds, 
        monitor growth cycles, and receive actionable recommendations - all without 
        relying on text-heavy interfaces.
      </p>
      
      <!-- Context image: Farmers in the field -->
      <div class="image-wrapper-nk26">
        <img 
          src="/images/farms-context-photo.jpg" 
          alt="Small-scale farmer working in crop field with basic tools"
          class="section-image-nk26"
          loading="lazy"
        />
        <figcaption class="image-caption-nk26">
          Our target users: Small-scale farmers managing 0.5-2 acres with mixed crops
        </figcaption>
      </div>
      
      <h3 class="subsection-title-nk26">Key Constraints</h3>
      <ul class="feature-list-nk26">
        <li class="feature-item-nk26">
          <strong>Limited literacy:</strong> Users could recognize words but struggled with 
          complex sentences or technical terminology
        </li>
        <li class="feature-item-nk26">
          <strong>Visual learners:</strong> Preferred icons, colors, and images over written instructions
        </li>
        <li class="feature-item-nk26">
          <strong>Varying smartphone skills:</strong> Some users were first-time smartphone owners
        </li>
        <li class="feature-item-nk26">
          <strong>Field conditions:</strong> App needed to work in bright sunlight with dirty hands
        </li>
        <li class="feature-item-nk26">
          <strong>Offline-first:</strong> Internet connectivity was unreliable
        </li>
      </ul>
    </div>
    
    <!-- 1/3 Meta Info -->
    <aside class="grid-meta-nk26" aria-label="Project metadata">
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Role</span>
        <span class="meta-value-nk26">Product Designer + UX Researcher</span>
      </div>
      
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Timeline</span>
        <span class="meta-value-nk26">6 months (Academic Project)</span>
      </div>
      
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Team</span>
        <span class="meta-value-nk26">Solo + 2 Advisors</span>
      </div>
      
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Platform</span>
        <span class="meta-value-nk26">iOS & Android (React Native)</span>
      </div>
      
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Research Methods</span>
        <span class="meta-value-nk26">Field interviews (12), Usability tests (8), Task analysis</span>
      </div>
      
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">SUS Score</span>
        <span class="meta-value-nk26">70 (Above Average)</span>
      </div>
      
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">WCAG Compliance</span>
        <span class="meta-value-nk26">AAA (Text), AA (Overall)</span>
      </div>
    </aside>
  </div>
</section>
```

---

## User Research (Pattern B: 1/3 + 2/3)

```html
<section class="grid-pattern-b-nk26" aria-label="User research findings">
  <div class="grid-container-nk26">
    <!-- 1/3 Text -->
    <div class="grid-text-nk26">
      <h2 class="section-title-nk26">Understanding Our Users</h2>
      <p class="section-text-nk26">
        We conducted field research with 12 small-scale farmers across rural 
        communities to understand their daily workflows, pain points, and 
        relationship with technology.
      </p>
    </div>
    
    <!-- 2/3 Research Findings -->
    <div class="grid-visual-nk26">
      <h3 class="subsection-title-nk26">What We Learned</h3>
      
      <div class="research-insight-card-nk26">
        <div class="insight-number-nk26">1</div>
        <div class="insight-content-nk26">
          <h4 class="insight-title-nk26">Mental Models Over Digital Literacy</h4>
          <p class="insight-text-nk26">
            Farmers had incredibly sophisticated mental models for crop management 
            - they could recite planting dates, growth cycles, and pest patterns 
            from memory. But they struggled with abstract UI concepts like "tabs" 
            or "swipe to delete."
          </p>
          <blockquote class="user-quote-nk26">
            "I know exactly when I planted each bed and what needs water. But I 
            don't know how to find that button again."
            <cite>— José, 54, Farmer for 20 years</cite>
          </blockquote>
        </div>
      </div>
      
      <div class="research-insight-card-nk26">
        <div class="insight-number-nk26">2</div>
        <div class="insight-content-nk26">
          <h4 class="insight-title-nk26">Color = Status, Not Decoration</h4>
          <p class="insight-text-nk26">
            Farmers relied on visual cues in their physical environment (yellow 
            leaves = needs water, brown spots = disease). They wanted the app to 
            use color the same way - as information, not decoration.
          </p>
          <blockquote class="user-quote-nk26">
            "When I see yellow on my plants, I know something's wrong. The app 
            should work the same way."
            <cite>— Maria, 48, Multi-crop farmer</cite>
          </blockquote>
        </div>
      </div>
      
      <div class="research-insight-card-nk26">
        <div class="insight-number-nk26">3</div>
        <div class="insight-content-nk26">
          <h4 class="insight-title-nk26">Maps > Lists for Spatial Thinkers</h4>
          <p class="insight-text-nk26">
            When asked to describe their farm, every farmer drew a map. They 
            thought spatially, not sequentially. A list of crops made no sense 
            - they needed to see their farm layout.
          </p>
        </div>
      </div>
      
      <!-- User journey map image -->
      <div class="image-wrapper-nk26">
        <img 
          src="/images/farms-user-journey.jpg" 
          alt="User journey map showing farmer's daily routine from morning field check to evening planning"
          class="section-image-nk26"
          loading="lazy"
        />
        <figcaption class="image-caption-nk26">
          A typical day: Morning field inspection → Noon watering → Evening record-keeping
        </figcaption>
      </div>
    </div>
  </div>
</section>
```

---

## Design Principles (Full Width)

```html
<section class="grid-pattern-c-nk26" aria-label="Core design principles">
  <div class="grid-container-nk26">
    <h2 class="section-title-full-nk26">Design Principles for Accessibility</h2>
    
    <p class="section-text-nk26">
      Based on research, we established four core principles that guided every 
      design decision.
    </p>
    
    <div class="principles-grid-nk26">
      <div class="principle-card-nk26">
        <div class="principle-icon-nk26">
          <!-- Eye icon -->
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M24 32C28.4183 32 32 28.4183 32 24C32 19.5817 28.4183 16 24 16C19.5817 16 16 19.5817 16 24C16 28.4183 19.5817 32 24 32Z" stroke="currentColor" stroke-width="2"/>
            <path d="M2 24C2 24 10 10 24 10C38 10 46 24 46 24C46 24 38 38 24 38C10 38 2 24 2 24Z" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <h3 class="principle-title-nk26">Show, Don't Tell</h3>
        <p class="principle-description-nk26">
          Use icons, colors, and images instead of text wherever possible. 
          Every interaction should be visually obvious.
        </p>
      </div>
      
      <div class="principle-card-nk26">
        <div class="principle-icon-nk26">
          <!-- Map icon -->
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M6 12L18 6L30 12L42 6V36L30 42L18 36L6 42V12Z" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <h3 class="principle-title-nk26">Think Spatially</h3>
        <p class="principle-description-nk26">
          Organize information geographically, not chronologically. Show the 
          farm as a map, not a list.
        </p>
      </div>
      
      <div class="principle-card-nk26">
        <div class="principle-icon-nk26">
          <!-- Contrast icon -->
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="2"/>
            <path d="M24 4V44" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <h3 class="principle-title-nk26">High Contrast Everything</h3>
        <p class="principle-description-nk26">
          WCAG AAA contrast ratios for text. Bright, distinct colors that work 
          in direct sunlight.
        </p>
      </div>
      
      <div class="principle-card-nk26">
        <div class="principle-icon-nk26">
          <!-- Touch icon -->
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M14 20V10C14 8.89543 14.8954 8 16 8C17.1046 8 18 8.89543 18 10V20M18 20V8C18 6.89543 18.8954 6 20 6C21.1046 6 22 6.89543 22 8V20M22 20V10C22 8.89543 22.8954 8 24 8C25.1046 8 26 8.89543 26 10V20M26 20V14C26 12.8954 26.8954 12 28 12C29.1046 12 30 12.8954 30 14V26C30 32.6274 24.6274 38 18 38H16C10.4772 38 6 33.5228 6 28V24" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <h3 class="principle-title-nk26">Big Touch Targets</h3>
        <p class="principle-description-nk26">
          Minimum 48x48px tap areas. Designed for use with dirty hands and 
          imprecise touches.
        </p>
      </div>
    </div>
  </div>
</section>
```

---

## Map View Design (Pattern A: 2/3 + 1/3)

```html
<section class="grid-pattern-a-nk26" aria-label="Map view interface design">
  <div class="grid-container-nk26">
    <div class="grid-main-nk26">
      <h2 class="section-title-nk26">The Map View: Making Space Tangible</h2>
      <p class="section-text-nk26">
        The map view became the app's core interface. Instead of lists or cards, 
        farmers see their actual farm layout with visual status indicators.
      </p>
      
      <!-- Full map mockup -->
      <div class="image-wrapper-nk26">
        <img 
          src="/images/farms-map-full.jpg" 
          alt="Farm map interface showing multiple plant beds color-coded by crop health status"
          class="section-image-nk26"
          loading="lazy"
        />
        <figcaption class="image-caption-nk26">
          The map view: Each plant bed shows crop type, health status, and days until harvest
        </figcaption>
      </div>
      
      <h3 class="subsection-title-nk26">Color-Coded Status System</h3>
      <p class="section-text-nk26">
        We developed a color language that matched farmers' existing mental models:
      </p>
      
      <div class="color-legend-nk26">
        <div class="color-item-nk26">
          <div class="color-swatch-nk26" style="background: #22c55e;" aria-label="Green color"></div>
          <div class="color-info-nk26">
            <span class="color-name-nk26">Green</span>
            <span class="color-meaning-nk26">Healthy, on schedule</span>
          </div>
        </div>
        
        <div class="color-item-nk26">
          <div class="color-swatch-nk26" style="background: #eab308;" aria-label="Yellow color"></div>
          <div class="color-info-nk26">
            <span class="color-name-nk26">Yellow</span>
            <span class="color-meaning-nk26">Needs attention (water, fertilizer)</span>
          </div>
        </div>
        
        <div class="color-item-nk26">
          <div class="color-swatch-nk26" style="background: #ef4444;" aria-label="Red color"></div>
          <div class="color-info-nk26">
            <span class="color-name-nk26">Red</span>
            <span class="color-meaning-nk26">Urgent issue (disease, pests, overdue harvest)</span>
          </div>
        </div>
        
        <div class="color-item-nk26">
          <div class="color-swatch-nk26" style="background: #3b82f6;" aria-label="Blue color"></div>
          <div class="color-info-nk26">
            <span class="color-name-nk26">Blue</span>
            <span class="color-meaning-nk26">Recently planted, establishing</span>
          </div>
        </div>
        
        <div class="color-item-nk26">
          <div class="color-swatch-nk26" style="background: #8b5cf6;" aria-label="Purple color"></div>
          <div class="color-info-nk26">
            <span class="color-name-nk26">Purple</span>
            <span class="color-meaning-nk26">Ready to harvest</span>
          </div>
        </div>
      </div>
      
      <div class="tech-note-nk26" role="complementary" aria-label="Technical implementation details">
        <div class="tech-note-header-nk26">
          <svg class="tech-note-icon-nk26" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M6 4L10 8L6 12M10 8H14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span class="tech-note-label-nk26">Accessibility Compliance</span>
        </div>
        <div class="tech-note-content-nk26">
          <p class="tech-note-text-nk26">
            Color alone is not enough for accessibility. Each bed also shows:
            • Icon (✓ checkmark, ⚠ warning, ✕ urgent)
            • Pattern (dots, stripes, solid)
            • Text label (for screen readers)
            
            This triple-coding ensures color-blind users can still interpret status. 
            Tested with Deuteranopia and Protanopia simulators to verify 
            distinguishability.
          </p>
        </div>
      </div>
    </div>
    
    <aside class="grid-meta-nk26" aria-label="Map view features">
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Tap Targets</span>
        <span class="meta-value-nk26">Minimum 60x60px (exceeds 48px standard)</span>
      </div>
      
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Color Contrast</span>
        <span class="meta-value-nk26">7:1 minimum (WCAG AAA)</span>
      </div>
      
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Zoom</span>
        <span class="meta-value-nk26">Pinch to zoom 50%-200%</span>
      </div>
      
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Offline Support</span>
        <span class="meta-value-nk26">Full functionality without internet</span>
      </div>
    </aside>
  </div>
</section>
```

---

## Micro-Animations Showcase (Full Width)

```html
<section class="grid-pattern-c-nk26" aria-label="Micro-animations and interactions">
  <div class="grid-container-nk26">
    <h2 class="section-title-full-nk26">Micro-Animations That Guide Users</h2>
    
    <p class="section-text-nk26">
      Animations aren't decoration - they communicate state changes and provide 
      feedback for users who might not read confirmation messages.
    </p>
    
    <div class="micro-interaction-showcase-nk26">
      <!-- Animation 1: Plant bed selection -->
      <div class="micro-interaction-item-nk26">
        <div class="lottie-animation-nk26">
          <div 
            id="lottie-bed-select" 
            class="lottie-player-nk26"
            role="img"
            aria-label="Animation showing plant bed expanding and highlighting when selected"
          ></div>
        </div>
        <div class="micro-interaction-description-nk26">
          <h3 class="subsection-title-nk26">Plant Bed Selection</h3>
          <p class="section-text-nk26">
            When a farmer taps a bed, it scales up 10% and shows a subtle glow. 
            This confirms the tap registered - crucial for users with imprecise touches.
          </p>
          
          <div class="tech-note-nk26" role="complementary" aria-label="Animation details">
            <div class="tech-note-header-nk26">
              <svg class="tech-note-icon-nk26" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M6 4L10 8L6 12M10 8H14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <span class="tech-note-label-nk26">Technical Note</span>
            </div>
            <div class="tech-note-content-nk26">
              <p class="tech-note-text-nk26">
                Built with Framer Motion: transform: scale(1.1), box-shadow with 
                8px blur. Duration: 200ms with ease-out curve. Added haptic feedback 
                (Haptics.impactAsync) on iOS for tactile confirmation.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Animation 2: Crop switching -->
      <div class="micro-interaction-item-nk26">
        <div class="lottie-animation-nk26">
          <div 
            id="lottie-crop-switch" 
            class="lottie-player-nk26"
            role="img"
            aria-label="Animation showing crop icon morphing when changing plant bed type"
          ></div>
        </div>
        <div class="micro-interaction-description-nk26">
          <h3 class="subsection-title-nk26">Crop Type Switching</h3>
          <p class="section-text-nk26">
            When farmers change a bed from tomatoes to lettuce, the icon morphs 
            smoothly. This visual continuity prevents confusion - they see the 
            change happen rather than a jarring jump.
          </p>
          
          <div class="tech-note-nk26" role="complementary" aria-label="Animation details">
            <div class="tech-note-header-nk26">
              <svg class="tech-note-icon-nk26" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M6 4L10 8L6 12M10 8H14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <span class="tech-note-label-nk26">Technical Note</span>
            </div>
            <div class="tech-note-content-nk26">
              <p class="tech-note-text-nk26">
                Lottie animation with 15-frame morph sequence. Each crop has a unique 
                shape primitive (circle for tomato, leaf for lettuce) that transitions 
                via path interpolation. File size: 12KB per animation.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Animation 3: Growth timeline -->
      <div class="micro-interaction-item-nk26">
        <div class="lottie-animation-nk26">
          <div 
            id="lottie-growth-timeline" 
            class="lottie-player-nk26"
            role="img"
            aria-label="Animation showing plant growth stages progressing from seedling to harvest"
          ></div>
        </div>
        <div class="micro-interaction-description-nk26">
          <h3 class="subsection-title-nk26">Growth Timeline Visualization</h3>
          <p class="section-text-nk26">
            Instead of text like "Day 14 of 60," we show a visual timeline with 
            a plant icon that "grows" as time progresses. Farmers see at a glance 
            where each crop is in its lifecycle.
          </p>
          
          <p class="section-text-nk26">
            The timeline animates when opened, drawing attention to crops nearing 
            harvest (purple icon) or needing attention (yellow/red).
          </p>
          
          <div class="tech-note-nk26" role="complementary" aria-label="Animation details">
            <div class="tech-note-header-nk26">
              <svg class="tech-note-icon-nk26" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M6 4L10 8L6 12M10 8H14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <span class="tech-note-label-nk26">Technical Note</span>
            </div>
            <div class="tech-note-content-nk26">
              <p class="tech-note-text-nk26">
                SVG-based timeline with CSS animations. Plant icon scales from 0.3 → 1.0 
                based on (currentDay / totalDays). Color transitions via CSS linear-gradient 
                keyed to growth percentage. Accessible alternative: Text percentage shown 
                on long-press for screen readers.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Animation 4: Status change -->
      <div class="micro-interaction-item-nk26">
        <div class="video-comparison-nk26">
          <video 
            class="iteration-video-nk26"
            src="/videos/farms-status-change.mp4"
            autoplay
            loop
            muted
            playsinline
            aria-label="Video showing plant bed color smoothly transitioning from green to yellow when watering is due"
          >
            <source src="/videos/farms-status-change.webm" type="video/webm">
            <source src="/videos/farms-status-change.mp4" type="video/mp4">
          </video>
        </div>
        <div class="micro-interaction-description-nk26">
          <h3 class="subsection-title-nk26">Real-Time Status Updates</h3>
          <p class="section-text-nk26">
            When a plant bed's status changes (e.g., green → yellow for watering 
            needed), the color transitions smoothly over 500ms. A subtle pulse 
            animation draws attention to the change.
          </p>
          
          <p class="section-text-nk26">
            This slow transition prevents "flashing" that could startle users and 
            makes the change noticeable even in peripheral vision.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## Design Iterations (Vertical Stack with Before/After)

```html
<section class="grid-pattern-a-nk26" aria-label="Design iterations">
  <div class="grid-container-nk26">
    <div class="grid-main-nk26">
      <h2 class="section-title-nk26">Design Evolution</h2>
      <p class="section-text-nk26">
        We went through multiple iterations based on usability testing with farmers. 
        Each change addressed a specific confusion point or accessibility barrier.
      </p>
      
      <!-- Iteration 1: Wireframe to visual design -->
      <div class="iteration-container-nk26">
        <h3 class="subsection-title-nk26">From Wireframe to High-Fidelity</h3>
        
        <div class="before-after-slider-nk26" aria-label="Before and after comparison of wireframe to final visual design">
          <div class="slider-container-nk26">
            <div class="before-image-wrapper-nk26">
              <img 
                src="/images/farms-wireframe.jpg" 
                alt="Early wireframe showing basic layout with placeholder icons and grayscale colors"
                class="comparison-image-nk26"
              />
              <span class="image-label-nk26 label-before-nk26">Wireframe</span>
            </div>
            
            <div class="after-image-wrapper-nk26">
              <img 
                src="/images/farms-final-design.jpg" 
                alt="Final design with high-contrast colors, detailed crop icons, and visual status indicators"
                class="comparison-image-nk26"
              />
              <span class="image-label-nk26 label-after-nk26">Final Design</span>
            </div>
            
            <div class="slider-divider-nk26" role="slider" aria-label="Drag to compare before and after" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" tabindex="0">
              <div class="divider-line-nk26" aria-hidden="true"></div>
              <div class="divider-handle-nk26" aria-hidden="true">
                <svg class="handle-icon-nk26" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M8 4L16 12L8 20" stroke="currentColor" stroke-width="2"/>
                  <path d="M16 4L8 12L16 20" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
            </div>
          </div>
          
          <p class="slider-caption-nk26">
            <strong>Key Changes:</strong> Increased color saturation 40%, replaced generic 
            icons with crop-specific illustrations, added texture/pattern to status colors 
            for color-blind accessibility, enlarged all text to minimum 16px.
          </p>
        </div>
      </div>
      
      <!-- Iteration 2: Icon clarity -->
      <div class="iteration-container-nk26">
        <h3 class="subsection-title-nk26">Icon Refinement for Recognition</h3>
        
        <div class="image-wrapper-nk26">
          <img 
            src="/images/farms-icon-evolution.jpg" 
            alt="Evolution of crop icons from abstract symbols to realistic illustrations"
            class="section-image-nk26"
            loading="lazy"
          />
          <figcaption class="image-caption-nk26">
            Icon evolution: Abstract → Simplified → Realistic (left to right)
          </figcaption>
        </div>
        
        <p class="section-text-nk26">
          <strong>The Problem:</strong> Early icons were too abstract. Farmers couldn't 
          tell tomatoes from peppers at a glance.
        </p>
        
        <p class="section-text-nk26">
          <strong>The Solution:</strong> We worked with farmers to identify the most 
          distinctive features of each crop (tomato vine structure, lettuce rosette, 
          pepper shape) and created realistic but simplified icons. Testing showed 
          95% recognition accuracy vs 60% with abstract icons.
        </p>
      </div>
      
      <!-- Iteration 3: Text size -->
      <div class="iteration-container-nk26">
        <h3 class="subsection-title-nk26">Readable Text in Bright Sunlight</h3>
        
        <div class="video-comparison-nk26">
          <video 
            class="iteration-video-nk26"
            src="/videos/farms-text-comparison.mp4"
            controls
            playsinline
            aria-label="Video comparing text readability at different sizes in outdoor lighting"
          >
            <source src="/videos/farms-text-comparison.webm" type="video/webm">
            <source src="/videos/farms-text-comparison.mp4" type="video/mp4">
          </video>
          <figcaption class="image-caption-nk26">
            Field testing revealed 14px text was unreadable in sunlight
          </figcaption>
        </div>
        
        <p class="section-text-nk26">
          <strong>Research Insight:</strong> Field testing in actual farm conditions 
          showed that our initial 14px body text became illegible in direct sunlight. 
          Screen glare + small text = frustration.
        </p>
        
        <p class="section-text-nk26">
          <strong>Design Change:</strong> Increased minimum text size to 18px for body, 
          24px for headings. Added semi-transparent dark overlay behind text on light 
          backgrounds. Result: 100% readability even at noon.
        </p>
        
        <div class="tech-note-nk26" role="complementary" aria-label="WCAG compliance details">
          <div class="tech-note-header-nk26">
            <svg class="tech-note-icon-nk26" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M6 4L10 8L6 12M10 8H14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span class="tech-note-label-nk26">WCAG Compliance</span>
          </div>
          <div class="tech-note-content-nk26">
            <p class="tech-note-text-nk26">
              Final text contrast ratios:
              • Body text (18px): 7.2:1 (WCAG AAA)
              • Headings (24px+): 8.5:1 (WCAG AAA)
              • Status labels: 10:1 (Exceeds AAA)
              
              Tested with WebAIM Contrast Checker and verified on-device in 
              bright sunlight (3500 nits outdoor equivalent).
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <aside class="grid-meta-nk26" aria-label="Design iteration statistics">
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Iterations</span>
        <span class="meta-value-nk26">8 major versions</span>
      </div>
      
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Usability Tests</span>
        <span class="meta-value-nk26">3 rounds, 8 farmers each</span>
      </div>
      
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Icon Recognition</span>
        <span class="meta-value-nk26">95% (final) vs 60% (initial)</span>
      </div>
      
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Task Completion</span>
        <span class="meta-value-nk26">88% success rate</span>
      </div>
    </aside>
  </div>
</section>
```

---

## Accessibility Features (Pattern B: 1/3 + 2/3)

```html
<section class="grid-pattern-b-nk26" aria-label="Accessibility features">
  <div class="grid-container-nk26">
    <div class="grid-text-nk26">
      <h2 class="section-title-nk26">Building for Everyone</h2>
      <p class="section-text-nk26">
        Accessibility wasn't an afterthought - it was the foundation of every 
        design decision.
      </p>
    </div>
    
    <div class="grid-visual-nk26">
      <div class="accessibility-feature-nk26">
        <h3 class="subsection-title-nk26">Voice Input (Optional)</h3>
        <p class="section-text-nk26">
          For farmers with limited literacy, we added voice input for note-taking. 
          Instead of typing "Bed 3 needs watering," they can speak it.
        </p>
        
        <div class="image-wrapper-nk26">
          <img 
            src="/images/farms-voice-input.jpg" 
            alt="Interface showing voice input button with waveform visualization during recording"
            class="section-image-nk26"
            loading="lazy"
          />
        </div>
      </div>
      
      <div class="accessibility-feature-nk26">
        <h3 class="subsection-title-nk26">Screen Reader Support</h3>
        <p class="section-text-nk26">
          Every visual element has an ARIA label. Plant beds announce: "Bed 3, 
          tomatoes, healthy, 12 days until harvest" when focused.
        </p>
        
        <div class="tech-note-nk26" role="complementary" aria-label="Screen reader implementation">
          <div class="tech-note-header-nk26">
            <svg class="tech-note-icon-nk26" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M6 4L10 8L6 12M10 8H14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span class="tech-note-label-nk26">Technical Note</span>
          </div>
          <div class="tech-note-content-nk26">
            <p class="tech-note-text-nk26">
              Used React Native Accessibility API with role="button", 
              accessibilityLabel, and accessibilityHint. Custom hook 
              useAccessibilityAnnouncement() triggers TalkBack/VoiceOver 
              updates on status changes. Tested with NVDA (Windows) and 
              VoiceOver (iOS).
            </p>
          </div>
        </div>
      </div>
      
      <div class="accessibility-feature-nk26">
        <h3 class="subsection-title-nk26">Large Touch Targets</h3>
        <p class="section-text-nk26">
          All interactive elements are minimum 60x60px - larger than the 48px 
          WCAG standard. This accounts for imprecise touches from users with 
          dirty hands or limited fine motor control.
        </p>
        
        <div class="image-wrapper-nk26">
          <img 
            src="/images/farms-touch-targets.jpg" 
            alt="Diagram showing touch target sizing with 60px minimum dimensions highlighted"
            class="section-image-nk26"
            loading="lazy"
          />
          <figcaption class="image-caption-nk26">
            Touch target sizing: 60x60px minimum with 8px spacing between elements
          </figcaption>
        </div>
      </div>
      
      <div class="accessibility-feature-nk26">
        <h3 class="subsection-title-nk26">Offline-First Architecture</h3>
        <p class="section-text-nk26">
          Farmers don't always have internet in their fields. The app works fully 
          offline, syncing changes when connectivity returns.
        </p>
        
        <div class="tech-note-nk26" role="complementary" aria-label="Offline implementation">
          <div class="tech-note-header-nk26">
            <svg class="tech-note-icon-nk26" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M6 4L10 8L6 12M10 8H14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span class="tech-note-label-nk26">Technical Note</span>
          </div>
          <div class="tech-note-content-nk26">
            <p class="tech-note-text-nk26">
              AsyncStorage (React Native) for local data persistence. Redux state 
              syncs to IndexedDB-like storage. When online, background sync using 
              NetInfo listener uploads queued changes. Conflict resolution: 
              last-write-wins with timestamp comparison.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## Final Screens (Full Width Gallery)

```html
<section class="grid-pattern-c-nk26" aria-label="Final application screens">
  <div class="grid-container-nk26">
    <h2 class="section-title-full-nk26">Final Application</h2>
    
    <p class="section-text-nk26">
      The shipped product balances visual simplicity with functional depth. 
      Every screen serves a specific farmer need.
    </p>
    
    <div class="screen-gallery-nk26">
      <div class="screen-item-nk26">
        <img 
          src="/images/farms-screen-home.jpg" 
          alt="Home screen showing farm map with color-coded plant beds"
          class="screen-image-nk26"
          loading="lazy"
        />
        <p class="screen-caption-nk26">Home: Farm map with status overview</p>
      </div>
      
      <div class="screen-item-nk26">
        <img 
          src="/images/farms-screen-detail.jpg" 
          alt="Plant bed detail screen showing crop info, growth timeline, and action buttons"
          class="screen-image-nk26"
          loading="lazy"
        />
        <p class="screen-caption-nk26">Detail: Individual bed information</p>
      </div>
      
      <div class="screen-item-nk26">
        <img 
          src="/images/farms-screen-timeline.jpg" 
          alt="Timeline view showing all crops in chronological order with growth stages"
          class="screen-image-nk26"
          loading="lazy"
        />
        <p class="screen-caption-nk26">Timeline: Growth stage visualization</p>
      </div>
      
      <div class="screen-item-nk26">
        <img 
          src="/images/farms-screen-notes.jpg" 
          alt="Notes screen with voice input button and previous notes list"
          class="screen-image-nk26"
          loading="lazy"
        />
        <p class="screen-caption-nk26">Notes: Voice input for observations</p>
      </div>
    </div>
  </div>
</section>
```

---

## Impact & Results (Pattern A: 2/3 + 1/3)

```html
<section class="grid-pattern-a-nk26" aria-label="Project impact and results">
  <div class="grid-container-nk26">
    <div class="grid-main-nk26">
      <h2 class="section-title-nk26">Testing & Validation</h2>
      
      <p class="section-text-nk26">
        We conducted formal usability testing using the System Usability Scale 
        (SUS) with 8 farmers who matched our target demographic.
      </p>
      
      <div class="results-grid-nk26">
        <div class="result-card-nk26">
          <div class="result-number-nk26">70</div>
          <div class="result-label-nk26">SUS Score</div>
          <p class="result-description-nk26">
            Above average (industry average: 68). Indicates good usability.
          </p>
        </div>
        
        <div class="result-card-nk26">
          <div class="result-number-nk26">88%</div>
          <div class="result-label-nk26">Task Completion Rate</div>
          <p class="result-description-nk26">
            Users successfully completed 7 out of 8 core tasks
          </p>
        </div>
        
        <div class="result-card-nk26">
          <div class="result-number-nk26">3.2 min</div>
          <div class="result-label-nk26">Avg. Time to Add Crop</div>
          <p class="result-description-nk26">
            Fast enough for field use, including voice note recording
          </p>
        </div>
        
        <div class="result-card-nk26">
          <div class="result-number-nk26">95%</div>
          <div class="result-label-nk26">Icon Recognition</div>
          <p class="result-description-nk26">
            Farmers correctly identified crop types at first glance
          </p>
        </div>
      </div>
      
      <h3 class="subsection-title-nk26">What Farmers Said</h3>
      
      <blockquote class="user-quote-nk26">
        "This makes sense. I can see my whole farm on one screen. The colors 
        tell me what needs attention - I don't have to read anything."
        <cite>— Carlos, 62, Small-scale farmer</cite>
      </blockquote>
      
      <blockquote class="user-quote-nk26">
        "The voice thing is great. I'm not good at typing, but I can just say 
        what I see and it writes it down."
        <cite>— Ana, 51, Multi-crop farmer</cite>
      </blockquote>
      
      <blockquote class="user-quote-nk26">
        "I showed this to my neighbor and he wants it too. It's like having 
        your farm in your pocket."
        <cite>— Miguel, 45, Organic farmer</cite>
      </blockquote>
    </div>
    
    <aside class="grid-meta-nk26" aria-label="Testing metadata">
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Test Participants</span>
        <span class="meta-value-nk26">8 farmers (5 male, 3 female, ages 45-65)</span>
      </div>
      
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Test Location</span>
        <span class="meta-value-nk26">On-farm, real field conditions</span>
      </div>
      
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Test Duration</span>
        <span class="meta-value-nk26">45 minutes per participant</span>
      </div>
      
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Accessibility Tested</span>
        <span class="meta-value-nk26">Color blindness, low vision, low literacy</span>
      </div>
      
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Devices</span>
        <span class="meta-value-nk26">Android (budget phones 4-6" screens)</span>
      </div>
    </aside>
  </div>
</section>
```

---

## Learnings (Full Width)

```html
<section class="grid-pattern-c-nk26" aria-label="Project learnings">
  <div class="grid-container-nk26">
    <h2 class="section-title-full-nk26">What I Learned</h2>
    
    <div class="grid-nested-nk26">
      <div class="nested-main-nk26">
        <h3 class="subsection-title-nk26">1. Don't Assume Digital Literacy</h3>
        <p class="section-text-nk26">
          I initially designed with assumptions about how people use apps (swipe 
          gestures, hamburger menus, long-press actions). Field testing revealed 
          these were completely foreign to my users. Simplicity isn't dumbing down 
          - it's respecting different mental models.
        </p>
        
        <h3 class="subsection-title-nk26">2. Color is Information, Not Decoration</h3>
        <p class="section-text-nk26">
          Farmers taught me that color should communicate meaning, not just look 
          pretty. Green = healthy, yellow = warning, red = urgent. This universal 
          color language transcends literacy and works instantly.
        </p>
        
        <h3 class="subsection-title-nk26">3. Test in Real Conditions</h3>
        <p class="section-text-nk26">
          Lab testing was useless. I needed to see farmers use the app while standing 
          in direct sunlight, with dirty hands, interruptions from animals, and 
          unreliable connectivity. Real conditions revealed problems my lab tests missed.
        </p>
        
        <h3 class="subsection-title-nk26">4. Icons Beat Text, Every Time</h3>
        <p class="section-text-nk26">
          When given a choice between reading a label or recognizing an icon, users 
          chose icons 95% of the time. This validated our visual-first approach and 
          reinforced that good iconography is universal.
        </p>
        
        <h3 class="subsection-title-nk26">5. Accessibility = Better Design for Everyone</h3>
        <p class="section-text-nk26">
          Large touch targets, high contrast, voice input - features we added for 
          accessibility improved the experience for ALL users. The farmer with 
          perfect vision still appreciated the big buttons.
        </p>
      </div>
      
      <div class="nested-aside-nk26">
        <div class="design-rationale-card-nk26">
          <h4 class="rationale-title-nk26">If I Could Do It Again</h4>
          <p class="rationale-text-nk26">
            1. Start field testing earlier - week 2, not week 8
          </p>
          <p class="rationale-text-nk26">
            2. Build low-fidelity prototypes farmers can touch/test
          </p>
          <p class="rationale-text-nk26">
            3. Involve farmers in icon design from day 1
          </p>
          <p class="rationale-text-nk26">
            4. Test with worst-case scenarios (bright sun, no connectivity) first
          </p>
          <p class="rationale-text-nk26">
            5. Add even more visual feedback - you can never have too much confirmation
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## Next Project Teaser

```html
<section class="next-project-nk26" aria-label="Next case study">
  <div class="next-project-container-nk26">
    <h3 class="next-project-label-nk26">Next Project</h3>
    <h2 class="next-project-title-nk26">My Influency</h2>
    <p class="next-project-description-nk26">
      Using motion design to simplify complex B2B influencer tracking workflows
    </p>
    <a href="/case-study/my-influency" class="next-project-link-nk26">
      View Case Study →
    </a>
  </div>
</section>
```

---

## Image Asset List (Placeholders)

**Required Images:**
- `/images/farms-context-photo.jpg` - Farmers working in field
- `/images/farms-user-journey.jpg` - Daily routine journey map
- `/images/farms-map-full.jpg` - Full map interface with colored beds
- `/images/farms-wireframe.jpg` - Early wireframe design
- `/images/farms-final-design.jpg` - Final high-fidelity design
- `/images/farms-icon-evolution.jpg` - Icon design progression
- `/images/farms-voice-input.jpg` - Voice input interface
- `/images/farms-touch-targets.jpg` - Touch target sizing diagram
- `/images/farms-screen-home.jpg` - Home screen
- `/images/farms-screen-detail.jpg` - Plant bed detail screen
- `/images/farms-screen-timeline.jpg` - Growth timeline view
- `/images/farms-screen-notes.jpg` - Notes screen with voice input

**Required Videos:**
- `/videos/manage-farms-hero.mp4` - B-roll of farmer using app
- `/videos/farms-status-change.mp4` - Color transition animation
- `/videos/farms-text-comparison.mp4` - Sunlight readability test

**Required Lottie Files:**
- `/lottie/farms-bed-select.json` - Plant bed selection animation
- `/lottie/farms-crop-switch.json` - Crop type switching morph
- `/lottie/farms-growth-timeline.json` - Growth stage progression

---

**Ready to create: My Influency Case Study next**
