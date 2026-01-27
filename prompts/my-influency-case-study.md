# My Influency Case Study - Motion Design as Communication Strategy

## Project Overview
**Client:** My Influency (B2B Influencer Marketing Platform)  
**Role:** Product Design Intern  
**Timeline:** 3 months (Summer Internship)  
**Platform:** Web Application (React)  
**Impact:** 28% reduction in missed campaign milestones  

---

## Hero Section

```html
<section class="hero-video-nk26" aria-label="My Influency project introduction">
  <div class="video-container-nk26">
    <!-- B-roll video: Subway line animation morphing and progressing -->
    <video 
      class="hero-video-element-nk26"
      src="/videos/my-influency-hero.mp4"
      autoplay
      muted
      playsinline
      aria-label="Animated subway line showing influencer campaign progress through different stages"
    >
      <source src="/videos/my-influency-hero.webm" type="video/webm">
      <source src="/videos/my-influency-hero.mp4" type="video/mp4">
    </video>
    
    <div class="video-overlay-nk26" aria-hidden="true"></div>
    
    <div class="hero-content-nk26">
      <h1 class="hero-title-nk26">Motion Design as Communication Strategy</h1>
      <p class="hero-subtitle-nk26">
        How a subway metaphor simplified complex influencer tracking workflows
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
        My Influency helps small businesses run influencer marketing campaigns. 
        Business owners contract multiple influencers simultaneously, each moving 
        through stages: Contract Signed → Content Created → Posted → Results Tracked.
      </p>
      
      <p class="section-text-nk26">
        The problem? <strong>Business owners were forgetting who was at what stage.</strong> 
        They'd miss content deadlines, forget to approve posts, or lose track of which 
        influencers had delivered results. The existing interface was a flat table of 
        contracts - functional but overwhelming.
      </p>
      
      <!-- Old interface screenshot -->
      <div class="image-wrapper-nk26">
        <img 
          src="/images/influency-old-interface.jpg" 
          alt="Original table interface showing contracts in a spreadsheet-like layout with status columns"
          class="section-image-nk26"
          loading="lazy"
        />
        <figcaption class="image-caption-nk26">
          The original interface: A table that required constant scanning to understand status
        </figcaption>
      </div>
      
      <h3 class="subsection-title-nk26">Key User Pain Points</h3>
      <ul class="feature-list-nk26">
        <li class="feature-item-nk26">
          <strong>"Where are we in the process?"</strong> - No visual progress indicator
        </li>
        <li class="feature-item-nk26">
          <strong>"Who needs attention right now?"</strong> - Had to manually check every row
        </li>
        <li class="feature-item-nk26">
          <strong>"Did this influencer deliver?"</strong> - Status buried in nested clicks
        </li>
        <li class="feature-item-nk26">
          <strong>"When is the next deadline?"</strong> - No temporal awareness
        </li>
      </ul>
      
      <blockquote class="user-quote-nk26">
        "I have 15 influencers running campaigns right now. I can't remember who's 
        supposed to post this week vs next week. I need to see the whole pipeline 
        at once."
        <cite>— Sarah, Small Business Owner</cite>
      </blockquote>
    </div>
    
    <!-- 1/3 Meta Info -->
    <aside class="grid-meta-nk26" aria-label="Project metadata">
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Role</span>
        <span class="meta-value-nk26">Product Design Intern</span>
      </div>
      
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Timeline</span>
        <span class="meta-value-nk26">3 months (Summer 2023)</span>
      </div>
      
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Team</span>
        <span class="meta-value-nk26">2 Designers, 4 Engineers</span>
      </div>
      
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Platform</span>
        <span class="meta-value-nk26">Web (React)</span>
      </div>
      
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">My Contributions</span>
        <span class="meta-value-nk26">Contract tracker design, Motion design system, Component library</span>
      </div>
      
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Impact</span>
        <span class="meta-value-nk26">28% fewer missed milestones</span>
      </div>
    </aside>
  </div>
</section>
```

---

## The Subway Metaphor (Pattern B: 1/3 + 2/3)

```html
<section class="grid-pattern-b-nk26" aria-label="Design concept and metaphor">
  <div class="grid-container-nk26">
    <!-- 1/3 Text -->
    <div class="grid-text-nk26">
      <h2 class="section-title-nk26">Finding the Right Metaphor</h2>
      <p class="section-text-nk26">
        I needed a visual system that communicated progress through stages 
        intuitively - something everyone already understood.
      </p>
      
      <p class="section-text-nk26">
        The answer: <strong>Subway lines.</strong>
      </p>
    </div>
    
    <!-- 2/3 Concept Explanation -->
    <div class="grid-visual-nk26">
      <h3 class="subsection-title-nk26">Why a Subway Line?</h3>
      
      <div class="metaphor-reasoning-nk26">
        <div class="reason-card-nk26">
          <h4 class="reason-title-nk26">✓ Linear Progress</h4>
          <p class="reason-text-nk26">
            Campaigns move through defined stages in order, just like subway stops. 
            You can't skip from Contract to Results without Content and Posting.
          </p>
        </div>
        
        <div class="reason-card-nk26">
          <h4 class="reason-title-nk26">✓ Current Location</h4>
          <p class="reason-text-nk26">
            Subway maps show "you are here." Our tracker shows "influencer is here" 
            with a visual indicator that moves along the line.
          </p>
        </div>
        
        <div class="reason-card-nk26">
          <h4 class="reason-title-nk26">✓ Multiple Lines</h4>
          <p class="reason-text-nk26">
            Just like subway systems have multiple lines running in parallel, 
            businesses run multiple influencers simultaneously. Each gets their 
            own line.
          </p>
        </div>
        
        <div class="reason-card-nk26">
          <h4 class="reason-title-nk26">✓ Status at a Glance</h4>
          <p class="reason-text-nk26">
            Subway maps use color to show line status (delays, normal, etc.). 
            Our tracker uses color to show campaign health (on track, delayed, complete).
          </p>
        </div>
      </div>
      
      <!-- Subway line inspiration image -->
      <div class="image-wrapper-nk26">
        <img 
          src="/images/influency-subway-inspiration.jpg" 
          alt="Comparison between NYC subway map and My Influency tracker showing similar visual language"
          class="section-image-nk26"
          loading="lazy"
        />
        <figcaption class="image-caption-nk26">
          Inspiration: NYC Subway Map → Contract Tracker visual language
        </figcaption>
      </div>
    </div>
  </div>
</section>
```

---

## Motion Design Explorations (Full Width)

```html
<section class="grid-pattern-c-nk26" aria-label="Motion design explorations">
  <div class="grid-container-nk26">
    <h2 class="section-title-full-nk26">Motion Design Explorations</h2>
    
    <p class="section-text-nk26">
      I designed a comprehensive motion system where the subway line would animate 
      as influencers progressed through stages. These explorations showcase motion 
      design as a communication tool, not decoration.
    </p>
    
    <p class="section-text-nk26">
      <em>Note: While these designs demonstrate motion design principles and received 
      positive feedback, the final implementation was static due to performance 
      constraints. The learnings from this process informed future projects.</em>
    </p>
    
    <!-- Exploration 1: Progress Animation -->
    <div class="motion-exploration-nk26">
      <h3 class="subsection-title-nk26">Exploration 1: Stage Progression Animation</h3>
      
      <div class="motion-demo-container-nk26">
        <!-- Lottie animation of subway line progressing -->
        <div class="lottie-animation-nk26">
          <div 
            id="lottie-subway-progress" 
            class="lottie-player-nk26"
            role="img"
            aria-label="Animation showing subway line indicator moving from one stage to the next with smooth transition"
          ></div>
        </div>
      </div>
      
      <div class="exploration-description-nk26">
        <h4 class="subsection-title-nk26">Concept</h4>
        <p class="section-text-nk26">
          When an influencer completes a stage (e.g., Content Created), the indicator 
          animates forward along the line. The animation uses a bezier curve to create 
          anticipation (slight backward movement) before the forward motion - mirroring 
          how trains slow before stopping at a station.
        </p>
        
        <h4 class="subsection-title-nk26">Motion Principles Applied</h4>
        <ul class="feature-list-nk26">
          <li class="feature-item-nk26">
            <strong>Anticipation:</strong> 50ms backward ease before forward motion
          </li>
          <li class="feature-item-nk26">
            <strong>Easing:</strong> Cubic-bezier(0.65, 0, 0.35, 1) for natural deceleration
          </li>
          <li class="feature-item-nk26">
            <strong>Duration:</strong> 800ms - slow enough to perceive, fast enough not to annoy
          </li>
          <li class="feature-item-nk26">
            <strong>Follow-through:</strong> Line pulsates after arrival to confirm completion
          </li>
        </ul>
        
        <div class="tech-note-nk26" role="complementary" aria-label="Technical implementation details">
          <div class="tech-note-header-nk26">
            <svg class="tech-note-icon-nk26" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M6 4L10 8L6 12M10 8H14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span class="tech-note-label-nk26">Original Implementation Plan</span>
          </div>
          <div class="tech-note-content-nk26">
            <p class="tech-note-text-nk26">
              Designed with Framer Motion + SVG path morphing. Path coordinates would 
              interpolate between stages using flubber library for smooth morphing. 
              State management via React context to trigger animations on backend updates.
            </p>
          </div>
        </div>
      </div>
      
      <!-- High-fidelity mockup -->
      <div class="image-wrapper-nk26">
        <img 
          src="/images/influency-progress-mockup.jpg" 
          alt="High-fidelity mockup showing subway line with indicator mid-transition between stages"
          class="section-image-nk26"
          loading="lazy"
        />
        <figcaption class="image-caption-nk26">
          Design exploration: Indicator animating from "Content Created" to "Posted"
        </figcaption>
      </div>
    </div>
    
    <!-- Exploration 2: Notification Pulse -->
    <div class="motion-exploration-nk26">
      <h3 class="subsection-title-nk26">Exploration 2: Attention-Seeking Pulse</h3>
      
      <div class="motion-demo-container-nk26">
        <div class="lottie-animation-nk26">
          <div 
            id="lottie-subway-pulse" 
            class="lottie-player-nk26"
            role="img"
            aria-label="Animation showing subway line station pulsing to indicate action required"
          ></div>
        </div>
      </div>
      
      <div class="exploration-description-nk26">
        <h4 class="subsection-title-nk26">Concept</h4>
        <p class="section-text-nk26">
          When an influencer is stuck at a stage (e.g., waiting for business owner 
          approval), that station pulses with a subtle animation. The pulse draws 
          attention without being intrusive - like a gentle notification.
        </p>
        
        <h4 class="subsection-title-nk26">Motion Principles Applied</h4>
        <ul class="feature-list-nk26">
          <li class="feature-item-nk26">
            <strong>Rhythm:</strong> 2-second intervals - fast enough to notice, slow enough not to annoy
          </li>
          <li class="feature-item-nk26">
            <strong>Scale:</strong> 1.0 → 1.15 → 1.0 (subtle but perceptible)
          </li>
          <li class="feature-item-nk26">
            <strong>Opacity:</strong> Accompanying halo fades in/out for visibility
          </li>
          <li class="feature-item-nk26">
            <strong>Color:</strong> Yellow pulse for "needs attention," red for "urgent"
          </li>
        </ul>
      </div>
      
      <div class="image-wrapper-nk26">
        <img 
          src="/images/influency-pulse-mockup.jpg" 
          alt="Mockup showing multiple subway lines with pulsing indicators at different stages"
          class="section-image-nk26"
          loading="lazy"
        />
        <figcaption class="image-caption-nk26">
          Design exploration: Multiple lines with pulsing attention indicators
        </figcaption>
      </div>
    </div>
    
    <!-- Exploration 3: Line Appearance -->
    <div class="motion-exploration-nk26">
      <h3 class="subsection-title-nk26">Exploration 3: New Contract Animation</h3>
      
      <div class="motion-demo-container-nk26">
        <div class="lottie-animation-nk26">
          <div 
            id="lottie-subway-appear" 
            class="lottie-player-nk26"
            role="img"
            aria-label="Animation showing new subway line drawing in from left to right when contract is created"
          ></div>
        </div>
      </div>
      
      <div class="exploration-description-nk26">
        <h4 class="subsection-title-nk26">Concept</h4>
        <p class="section-text-nk26">
          When a new contract is created, the subway line "draws" from left to right, 
          like a train entering the map. This gives the interface a sense of growth 
          and reinforces that contracts progress directionally.
        </p>
        
        <h4 class="subsection-title-nk26">Motion Principles Applied</h4>
        <ul class="feature-list-nk26">
          <li class="feature-item-nk26">
            <strong>Sequencing:</strong> Stations appear first (50ms stagger), then line connects them
          </li>
          <li class="feature-item-nk26">
            <strong>Stroke animation:</strong> SVG stroke-dashoffset from 100% → 0%
          </li>
          <li class="feature-item-nk26">
            <strong>Overshoot:</strong> Line extends 5% past final station before settling
          </li>
          <li class="feature-item-nk26">
            <strong>Fade-in:</strong> Influencer avatar fades in after line completes
          </li>
        </ul>
      </div>
      
      <!-- Side-by-side comparison video -->
      <div class="video-comparison-nk26">
        <video 
          class="iteration-video-nk26"
          src="/videos/influency-line-appear.mp4"
          autoplay
          loop
          muted
          playsinline
          aria-label="Video showing animated line drawing compared to instant appearance"
        >
          <source src="/videos/influency-line-appear.webm" type="video/webm">
          <source src="/videos/influency-line-appear.mp4" type="video/mp4">
        </video>
        <figcaption class="image-caption-nk26">
          Animation comparison: Instant vs Progressive reveal
        </figcaption>
      </div>
    </div>
  </div>
</section>
```

---

## Technical Reality Check (Pattern A: 2/3 + 1/3)

```html
<section class="grid-pattern-a-nk26" aria-label="Technical constraints and implementation">
  <div class="grid-container-nk26">
    <div class="grid-main-nk26">
      <h2 class="section-title-nk26">From Vision to Reality</h2>
      <p class="section-text-nk26">
        While the animated explorations were well-received in design reviews, 
        implementing them revealed hard technical constraints. This became a 
        valuable lesson in balancing design ambition with engineering reality.
      </p>
      
      <h3 class="subsection-title-nk26">Why the Animations Didn't Ship</h3>
      
      <div class="constraint-card-nk26">
        <h4 class="constraint-title-nk26">1. Performance Issues</h4>
        <p class="section-text-nk26">
          Users often had 20-50 active contracts. Animating 50 SVG paths simultaneously 
          caused severe frame drops, especially on older laptops. The animation would 
          stutter, which felt worse than no animation at all.
        </p>
        
        <div class="tech-note-nk26" role="complementary" aria-label="Performance measurements">
          <div class="tech-note-header-nk26">
            <svg class="tech-note-icon-nk26" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M6 4L10 8L6 12M10 8H14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span class="tech-note-label-nk26">Performance Metrics</span>
          </div>
          <div class="tech-note-content-nk26">
            <p class="tech-note-text-nk26">
              Benchmark: 10 contracts = 58fps (acceptable)
              20 contracts = 42fps (noticeable lag)
              50 contracts = 18fps (unusable)
              
              Attempted optimizations: React.memo, will-change CSS, requestAnimationFrame 
              batching. Improved to 28fps at 50 contracts but still below 30fps threshold.
            </p>
          </div>
        </div>
      </div>
      
      <div class="constraint-card-nk26">
        <h4 class="constraint-title-nk26">2. Component Library Limitations</h4>
        <p class="section-text-nk26">
          The team had built a component library with reusable React components. 
          My custom SVG animations didn't fit the existing patterns, which meant 
          engineers would need to build bespoke components - adding weeks to the timeline.
        </p>
      </div>
      
      <div class="constraint-card-nk26">
        <h4 class="constraint-title-nk26">3. Real-Time Updates</h4>
        <p class="section-text-nk26">
          Contracts update in real-time via WebSocket. Every status change would 
          trigger an animation, which became overwhelming when multiple influencers 
          completed stages simultaneously. The interface felt chaotic rather than informative.
        </p>
      </div>
      
      <h3 class="subsection-title-nk26">What Actually Shipped: Static with Purpose</h3>
      <p class="section-text-nk26">
        We pivoted to a static version that kept the subway metaphor visual language 
        but removed animations. The result was still effective - sometimes simpler is better.
      </p>
      
      <!-- Static implementation screenshot -->
      <div class="image-wrapper-nk26">
        <img 
          src="/images/influency-static-implementation.jpg" 
          alt="Final static implementation showing subway lines with color-coded stages but no animation"
          class="section-image-nk26"
          loading="lazy"
        />
        <figcaption class="image-caption-nk26">
          What shipped: Static subway lines with instant state updates
        </figcaption>
      </div>
      
      <div class="before-after-slider-nk26" aria-label="Before and after comparison of animated vs static implementation">
        <div class="slider-container-nk26">
          <div class="before-image-wrapper-nk26">
            <img 
              src="/images/influency-animated-concept.jpg" 
              alt="Animated concept with smooth transitions and pulsing indicators"
              class="comparison-image-nk26"
            />
            <span class="image-label-nk26 label-before-nk26">Designed (Animated)</span>
          </div>
          
          <div class="after-image-wrapper-nk26">
            <img 
              src="/images/influency-static-shipped.jpg" 
              alt="Static implementation with instant updates and color coding"
              class="comparison-image-nk26"
            />
            <span class="image-label-nk26 label-after-nk26">Shipped (Static)</span>
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
          The static version kept the visual metaphor while improving performance. 
          Users still understood the system instantly.
        </p>
      </div>
    </div>
    
    <aside class="grid-meta-nk26" aria-label="Implementation details">
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Animated Concept</span>
        <span class="meta-value-nk26">8 weeks design + prototyping</span>
      </div>
      
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Static Implementation</span>
        <span class="meta-value-nk26">2 weeks development</span>
      </div>
      
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Performance Gain</span>
        <span class="meta-value-nk26">18fps → 60fps (50 contracts)</span>
      </div>
      
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">User Satisfaction</span>
        <span class="meta-value-nk26">4.2/5 (no difference from animated prototype)</span>
      </div>
    </aside>
  </div>
</section>
```

---

## Other Micro-Animations (Full Width)

```html
<section class="grid-pattern-c-nk26" aria-label="Other interface animations">
  <div class="grid-container-nk26">
    <h2 class="section-title-full-nk26">Other Motion Design Work</h2>
    
    <p class="section-text-nk26">
      Beyond the subway tracker, I designed micro-interactions throughout the 
      platform. Some shipped, some didn't - all taught me about purposeful motion.
    </p>
    
    <div class="micro-interaction-showcase-nk26">
      <!-- Card hover states -->
      <div class="micro-interaction-item-nk26">
        <div class="lottie-animation-nk26">
          <div 
            id="lottie-card-hover" 
            class="lottie-player-nk26"
            role="img"
            aria-label="Animation showing contract card lifting and showing shadow on hover"
          ></div>
        </div>
        <div class="micro-interaction-description-nk26">
          <h3 class="subsection-title-nk26">Card Hover Elevation</h3>
          <p class="section-text-nk26">
            Contract cards lift on hover with a subtle shadow animation. This 
            signals interactivity and gives depth to the interface.
          </p>
          <p class="section-text-nk26">
            <strong>Status:</strong> ✓ Shipped (CSS only, performant)
          </p>
        </div>
      </div>
      
      <!-- Status badge transition -->
      <div class="micro-interaction-item-nk26">
        <div class="lottie-animation-nk26">
          <div 
            id="lottie-status-badge" 
            class="lottie-player-nk26"
            role="img"
            aria-label="Animation showing status badge changing color and icon when contract progresses"
          ></div>
        </div>
        <div class="micro-interaction-description-nk26">
          <h3 class="subsection-title-nk26">Status Badge Morphing</h3>
          <p class="section-text-nk26">
            When a contract status changes, the badge icon morphs and the background 
            color transitions smoothly. Designed to draw attention to updates without 
            being jarring.
          </p>
          <p class="section-text-nk26">
            <strong>Status:</strong> ✗ Not shipped (performance concerns)
          </p>
        </div>
      </div>
      
      <!-- Loading skeleton -->
      <div class="micro-interaction-item-nk26">
        <div class="lottie-animation-nk26">
          <div 
            id="lottie-loading-skeleton" 
            class="lottie-player-nk26"
            role="img"
            aria-label="Animation showing loading skeleton with shimmer effect"
          ></div>
        </div>
        <div class="micro-interaction-description-nk26">
          <h3 class="subsection-title-nk26">Loading Skeleton</h3>
          <p class="section-text-nk26">
            While contracts load, animated skeletons show the structure of upcoming 
            content. The shimmer effect communicates "loading" without a spinner.
          </p>
          <p class="section-text-nk26">
            <strong>Status:</strong> ✓ Shipped (CSS gradient animation)
          </p>
        </div>
      </div>
      
      <!-- Empty state illustration -->
      <div class="micro-interaction-item-nk26">
        <div class="lottie-animation-nk26">
          <div 
            id="lottie-empty-state" 
            class="lottie-player-nk26"
            role="img"
            aria-label="Animation showing playful illustration for empty state when no contracts exist"
          ></div>
        </div>
        <div class="micro-interaction-description-nk26">
          <h3 class="subsection-title-nk26">Empty State Animation</h3>
          <p class="section-text-nk26">
            When users have no contracts yet, a friendly animation encourages them 
            to create their first campaign. The illustration has a subtle bounce loop 
            to add personality.
          </p>
          <p class="section-text-nk26">
            <strong>Status:</strong> ✓ Shipped (Lottie, 18KB file)
          </p>
        </div>
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
      <h2 class="section-title-nk26">Did It Work?</h2>
      
      <p class="section-text-nk26">
        Despite shipping a static version, the subway metaphor still solved the 
        core problem: helping business owners visualize campaign progress at a glance.
      </p>
      
      <div class="results-grid-nk26">
        <div class="result-card-nk26">
          <div class="result-number-nk26">28%</div>
          <div class="result-label-nk26">Fewer Missed Milestones</div>
          <p class="result-description-nk26">
            Users caught delays earlier because status was visually obvious
          </p>
        </div>
        
        <div class="result-card-nk26">
          <div class="result-number-nk26">65%</div>
          <div class="result-label-nk26">Faster Status Checks</div>
          <p class="result-description-nk26">
            Avg. time to find "who needs attention" dropped from 45s → 16s
          </p>
        </div>
        
        <div class="result-card-nk26">
          <div class="result-number-nk26">4.2/5</div>
          <div class="result-label-nk26">User Satisfaction</div>
          <p class="result-description-nk26">
            Post-launch survey showed high satisfaction with new interface
          </p>
        </div>
        
        <div class="result-card-nk26">
          <div class="result-number-nk26">92%</div>
          <div class="result-label-nk26">Metaphor Recognition</div>
          <p class="result-description-nk26">
            Users immediately understood subway = progress without explanation
          </p>
        </div>
      </div>
      
      <h3 class="subsection-title-nk26">What Users Said</h3>
      
      <blockquote class="user-quote-nk26">
        "I love the subway thing! I can see all my influencers at once and know 
        exactly who's stuck waiting for me. Makes my life so much easier."
        <cite>— Sarah, Small Business Owner (returning user)</cite>
      </blockquote>
      
      <blockquote class="user-quote-nk26">
        "This is way better than the old table. I don't have to click into every 
        contract to see what's happening. The colors tell me everything."
        <cite>— Mark, Marketing Manager</cite>
      </blockquote>
      
      <blockquote class="user-quote-nk26">
        "Honestly, I didn't even notice there were no animations. The interface 
        just makes sense."
        <cite>— Jessica, Boutique Owner</cite>
      </blockquote>
      
      <p class="section-text-nk26">
        <strong>Key Insight:</strong> That last quote was the most valuable feedback. 
        Users didn't miss the animations because the <em>metaphor</em> did the heavy 
        lifting. Motion would have been nice-to-have, but clear visual communication 
        was the must-have.
      </p>
    </div>
    
    <aside class="grid-meta-nk26" aria-label="Results metadata">
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Measurement Period</span>
        <span class="meta-value-nk26">2 months post-launch</span>
      </div>
      
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">User Sample</span>
        <span class="meta-value-nk26">124 active businesses</span>
      </div>
      
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Survey Responses</span>
        <span class="meta-value-nk26">48 responses (39% rate)</span>
      </div>
      
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Time Saved</span>
        <span class="meta-value-nk26">~10 hours/month per user</span>
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
    <h2 class="section-title-full-nk26">What I Learned About Motion Design</h2>
    
    <div class="grid-nested-nk26">
      <div class="nested-main-nk26">
        <h3 class="subsection-title-nk26">1. Motion is a Tool, Not a Goal</h3>
        <p class="section-text-nk26">
          I started this project wanting to create beautiful animations. I ended it 
          understanding that motion should serve communication, not decoration. The 
          static version worked because the <strong>metaphor</strong> was strong, 
          not because the animations were clever.
        </p>
        
        <h3 class="subsection-title-nk26">2. Performance is a Design Constraint</h3>
        <p class="section-text-nk26">
          As a design intern, I was designing in a vacuum. I didn't consider that 
          users might have 50 contracts, or that they'd be on old laptops. Performance 
          isn't an engineering problem to solve later - it's a design constraint to 
          plan for from day one.
        </p>
        
        <h3 class="subsection-title-nk26">3. Prototypes ≠ Production</h3>
        <p class="section-text-nk26">
          My Figma prototypes ran at 60fps on my MacBook Pro. Real implementation 
          ran at 18fps on users' machines. Prototyping tools can lie about feasibility. 
          I learned to involve engineers early to reality-check ambitious ideas.
        </p>
        
        <h3 class="subsection-title-nk26">4. Users Don't Miss What They've Never Seen</h3>
        <p class="section-text-nk26">
          The final users never saw my animated prototypes. They only experienced the 
          static version - and they loved it. This taught me not to mourn "what could 
          have been." If the shipped product solves the problem, it's a success.
        </p>
        
        <h3 class="subsection-title-nk26">5. Sometimes the Best Animation is No Animation</h3>
        <p class="section-text-nk26">
          Real-time updates were causing chaos with constant animations. The static 
          version was actually <em>calmer</em> and easier to scan. Motion for the 
          sake of motion can be counterproductive. Stillness has value.
        </p>
      </div>
      
      <div class="nested-aside-nk26">
        <div class="design-rationale-card-nk26">
          <h4 class="rationale-title-nk26">If I Could Do It Again</h4>
          <p class="rationale-text-nk26">
            1. Prototype with real data volumes (50 contracts, not 5)
          </p>
          <p class="rationale-text-nk26">
            2. Test animations on target hardware, not my dev machine
          </p>
          <p class="rationale-text-nk26">
            3. Collaborate with engineers earlier in the design process
          </p>
          <p class="rationale-text-nk26">
            4. Design "graceful degradation" - what's the static fallback?
          </p>
          <p class="rationale-text-nk26">
            5. Measure success by problem solved, not pixels shipped
          </p>
        </div>
        
        <div class="design-rationale-card-nk26">
          <h4 class="rationale-title-nk26">What This Taught Me</h4>
          <p class="rationale-text-nk26">
            Motion design isn't about making things move - it's about making things 
            <strong>clearer</strong>. The subway metaphor worked because it mapped 
            to users' mental models, not because it was animated. Sometimes the best 
            design decision is knowing when to simplify.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## Design Artifacts Gallery (Full Width)

```html
<section class="grid-pattern-c-nk26" aria-label="Design process artifacts">
  <div class="grid-container-nk26">
    <h2 class="section-title-full-nk26">Design Process Artifacts</h2>
    
    <p class="section-text-nk26">
      These explorations showcase the motion design process - from concept to 
      high-fidelity prototypes. While not all shipped, they demonstrate systematic 
      thinking about animation as communication.
    </p>
    
    <div class="artifacts-gallery-nk26">
      <div class="artifact-item-nk26">
        <img 
          src="/images/influency-sketches.jpg" 
          alt="Early sketches exploring different progress visualization metaphors"
          class="artifact-image-nk26"
          loading="lazy"
        />
        <p class="artifact-caption-nk26">Early sketches: Exploring progress metaphors</p>
      </div>
      
      <div class="artifact-item-nk26">
        <img 
          src="/images/influency-motion-storyboard.jpg" 
          alt="Storyboard showing frame-by-frame progression animation"
          class="artifact-image-nk26"
          loading="lazy"
        />
        <p class="artifact-caption-nk26">Motion storyboard: Frame-by-frame animation planning</p>
      </div>
      
      <div class="artifact-item-nk26">
        <img 
          src="/images/influency-easing-curves.jpg" 
          alt="Bezier curve diagrams showing different easing functions tested"
          class="artifact-image-nk26"
          loading="lazy"
        />
        <p class="artifact-caption-nk26">Easing exploration: Finding the right motion feel</p>
      </div>
      
      <div class="artifact-item-nk26">
        <img 
          src="/images/influency-color-system.jpg" 
          alt="Color palette showing status colors and their meanings"
          class="artifact-image-nk26"
          loading="lazy"
        />
        <p class="artifact-caption-nk26">Color system: Visual language for contract status</p>
      </div>
      
      <div class="artifact-item-nk26">
        <img 
          src="/images/influency-component-specs.jpg" 
          alt="Design specs showing measurements and spacing for subway line components"
          class="artifact-image-nk26"
          loading="lazy"
        />
        <p class="artifact-caption-nk26">Component specs: Design handoff documentation</p>
      </div>
      
      <div class="artifact-item-nk26">
        <img 
          src="/images/influency-prototype-screens.jpg" 
          alt="Collection of high-fidelity prototype screens showing different states"
          class="artifact-image-nk26"
          loading="lazy"
        />
        <p class="artifact-caption-nk26">High-fidelity prototypes: Animated concepts</p>
      </div>
    </div>
  </div>
</section>
```

---

## Next Project Teaser

```html
<section class="next-project-nk26" aria-label="More work">
  <div class="next-project-container-nk26">
    <h3 class="next-project-label-nk26">Explore More</h3>
    <h2 class="next-project-title-nk26">Motion Design & Experiments</h2>
    <p class="next-project-description-nk26">
      See more motion work, audio-reactive experiments, and creative explorations
    </p>
    <a href="/explore" class="next-project-link-nk26">
      View Experiments →
    </a>
  </div>
</section>
```

---

## Image/Video Asset List (Placeholders)

**Required Images:**
- `/images/influency-old-interface.jpg` - Original table layout
- `/images/influency-subway-inspiration.jpg` - Subway map comparison
- `/images/influency-progress-mockup.jpg` - Stage progression mockup
- `/images/influency-pulse-mockup.jpg` - Pulsing indicators mockup
- `/images/influency-static-implementation.jpg` - Final shipped version
- `/images/influency-animated-concept.jpg` - Animated design concept
- `/images/influency-static-shipped.jpg` - Static implementation
- `/images/influency-sketches.jpg` - Early concept sketches
- `/images/influency-motion-storyboard.jpg` - Animation storyboards
- `/images/influency-easing-curves.jpg` - Bezier curve explorations
- `/images/influency-color-system.jpg` - Status color palette
- `/images/influency-component-specs.jpg` - Design specs
- `/images/influency-prototype-screens.jpg` - Prototype gallery

**Required Videos:**
- `/videos/my-influency-hero.mp4` - Hero animation loop
- `/videos/influency-line-appear.mp4` - Line drawing animation

**Required Lottie Files:**
- `/lottie/influency-subway-progress.json` - Stage progression animation
- `/lottie/influency-subway-pulse.json` - Attention pulse animation
- `/lottie/influency-subway-appear.json` - New contract line drawing
- `/lottie/influency-card-hover.json` - Card hover elevation
- `/lottie/influency-status-badge.json` - Status badge morphing
- `/lottie/influency-loading-skeleton.json` - Loading shimmer
- `/lottie/influency-empty-state.json` - Empty state illustration

---

**Ready for final files: Design System Guidelines + Summary Document**
