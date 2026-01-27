# Christine Valmy Case Study - When Users Reject Your Best Idea

## Project Overview
**Client:** Christine Valmy International School of Esthetics  
**Role:** Product Designer + Engineer  
**Timeline:** 4 months  
**Platform:** WordPress Plugin  
**Impact:** 143% increase in enrollment submissions  

---

## Hero Section

```html
<section class="hero-video-nk26" aria-label="Christine Valmy project introduction">
  <div class="video-container-nk26">
    <!-- B-roll video: Prospective students interacting with the agent -->
    <video 
      class="hero-video-element-nk26"
      src="/videos/christine-valmy-hero.mp4"
      autoplay
      muted
      playsinline
      aria-label="Students using the Christine Valmy enrollment assistant"
    >
      <source src="/videos/christine-valmy-hero.webm" type="video/webm">
      <source src="/videos/christine-valmy-hero.mp4" type="video/mp4">
    </video>
    
    <div class="video-overlay-nk26" aria-hidden="true"></div>
    
    <div class="hero-content-nk26">
      <h1 class="hero-title-nk26">When Users Reject Your Best Idea</h1>
      <p class="hero-subtitle-nk26">
        How user research killed my clever bento grid and led to a 143% increase in enrollments
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
        Christine Valmy, a beauty trade school with multiple locations, was 
        struggling to convert prospective students. Their traditional inquiry 
        form created a communication bottleneck: students had to wait days for 
        responses, and enrollment officers were overwhelmed answering the same 
        questions repeatedly without knowing if students were even qualified.
      </p>
      
      <p class="section-text-nk26">
        International students would inquire about visa sponsorship (not offered). 
        Others wanted course dates across different branches. Enrollment officers 
        lacked context, leading to inefficient conversations and lost leads.
      </p>
      
      <!-- Problem visualization image -->
      <div class="image-wrapper-nk26">
        <img 
          src="/images/cv-old-form.jpg" 
          alt="Screenshot of traditional static inquiry form with multiple text fields"
          class="section-image-nk26"
          loading="lazy"
        />
        <figcaption class="image-caption-nk26">
          The original inquiry form: functional, but created communication delays
        </figcaption>
      </div>
    </div>
    
    <!-- 1/3 Meta Info -->
    <aside class="grid-meta-nk26" aria-label="Project metadata">
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Role</span>
        <span class="meta-value-nk26">Product Designer + WordPress Developer</span>
      </div>
      
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Timeline</span>
        <span class="meta-value-nk26">4 months (Feb - May 2024)</span>
      </div>
      
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Team</span>
        <span class="meta-value-nk26">Solo (Design + Development)</span>
      </div>
      
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Platform</span>
        <span class="meta-value-nk26">WordPress Plugin</span>
      </div>
      
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Impact</span>
        <span class="meta-value-nk26">143% increase in submissions</span>
      </div>
      
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Tech Stack</span>
        <span class="meta-value-nk26">React, WordPress API, OpenAI GPT-4, PHP</span>
      </div>
    </aside>
  </div>
</section>
```

---

## Key Pain Points (Pattern B: 1/3 + 2/3)

```html
<section class="grid-pattern-b-nk26" aria-label="User pain points">
  <div class="grid-container-nk26">
    <!-- 1/3 Text -->
    <div class="grid-text-nk26">
      <h2 class="section-title-nk26">Who Was Hurting?</h2>
      <p class="section-text-nk26">
        Two distinct user groups suffered from the broken enrollment flow.
      </p>
    </div>
    
    <!-- 2/3 Visual -->
    <div class="grid-visual-nk26">
      <!-- Pain points diagram/illustration -->
      <div class="pain-points-grid-nk26">
        <div class="pain-point-card-nk26">
          <h3 class="pain-point-title-nk26">Prospective Students</h3>
          <ul class="pain-point-list-nk26">
            <li>Waited 2-5 days for basic questions</li>
            <li>Couldn't browse courses without contacting staff</li>
            <li>No information about visa sponsorship upfront</li>
            <li>Lost interest during wait times</li>
          </ul>
        </div>
        
        <div class="pain-point-card-nk26">
          <h3 class="pain-point-title-nk26">Enrollment Officers</h3>
          <ul class="pain-point-list-nk26">
            <li>Answered same questions repeatedly</li>
            <li>No context on student qualifications</li>
            <li>Couldn't prioritize high-quality leads</li>
            <li>Manual back-and-forth across 5 locations</li>
          </ul>
        </div>
      </div>
      
      <div class="image-wrapper-nk26">
        <img 
          src="/images/cv-pain-points-diagram.jpg" 
          alt="Diagram showing broken communication flow between students and enrollment officers"
          class="section-image-nk26"
          loading="lazy"
        />
        <figcaption class="image-caption-nk26">
          The enrollment process before intervention
        </figcaption>
      </div>
    </div>
  </div>
</section>
```

---

## Initial Concept (Pattern C: Full Width with Nested Split)

```html
<section class="grid-pattern-c-nk26" aria-label="Initial design concepts">
  <div class="grid-container-nk26">
    <h2 class="section-title-full-nk26">My Initial Vision: Make Everything Interactive</h2>
    
    <div class="grid-nested-nk26">
      <div class="nested-main-nk26">
        <p class="section-text-nk26">
          I had what I thought was a brilliant solution: turn enrollment into 
          an interactive experience. Instead of a boring chat widget, I designed 
          two interconnected systems:
        </p>
        
        <h3 class="subsection-title-nk26">Concept 1: Interactive Student ID Card</h3>
        <p class="section-text-nk26">
          Students would "fill out" a digital ID card as they progressed through 
          the conversation. This would elegantly collect PII while making the 
          process feel gamified and progressive.
        </p>
        
        <!-- Student ID mockup -->
        <div class="image-wrapper-nk26">
          <img 
            src="/images/cv-student-id-concept.jpg" 
            alt="Mockup of interactive student ID card with fields filling in progressively"
            class="section-image-nk26"
            loading="lazy"
          />
          <figcaption class="image-caption-nk26">
            The Student ID concept: Progressive information collection disguised as a credential
          </figcaption>
        </div>
        
        <h3 class="subsection-title-nk26">Concept 2: Bento Grid Knowledge Base</h3>
        <p class="section-text-nk26">
          Instead of forcing students to ask questions, I'd provide a bento grid 
          of topic tiles they could explore:
        </p>
        
        <ul class="feature-list-nk26">
          <li class="feature-item-nk26"><strong>Alumni Stats</strong> - Success stories and graduation rates</li>
          <li class="feature-item-nk26"><strong>Location Information</strong> - Details on all 5 branches</li>
          <li class="feature-item-nk26"><strong>Finances & Tuition</strong> - Cost breakdown and payment plans</li>
          <li class="feature-item-nk26"><strong>Eligibility Requirements</strong> - Who qualifies for enrollment</li>
          <li class="feature-item-nk26"><strong>Course Scheduling</strong> - Upcoming class dates per location</li>
          <li class="feature-item-nk26"><strong>Chat Assistant</strong> - For questions outside the tiles</li>
        </ul>
        
        <p class="section-text-nk26">
          Each tile would open a detailed panel AND feed analytics back to 
          enrollment officers. They'd know exactly what each student cared about 
          before first contact.
        </p>
      </div>
      
      <div class="nested-aside-nk26">
        <div class="design-rationale-card-nk26">
          <h4 class="rationale-title-nk26">Why I Thought This Would Work</h4>
          <p class="rationale-text-nk26">
            1. Reduces cognitive load (no need to think of questions)
          </p>
          <p class="rationale-text-nk26">
            2. Provides structured data for analytics
          </p>
          <p class="rationale-text-nk26">
            3. Makes the interface feel more "app-like" than a basic chatbot
          </p>
          <p class="rationale-text-nk26">
            4. Gamifies the enrollment journey
          </p>
        </div>
      </div>
    </div>
    
    <!-- Bento grid mockup (full width) -->
    <div class="image-wrapper-nk26">
      <img 
        src="/images/cv-bento-grid-mockup.jpg" 
        alt="Full interface mockup showing bento grid with six topic tiles arranged in a modular layout"
        class="section-image-nk26"
        loading="lazy"
      />
      <figcaption class="image-caption-nk26">
        The bento grid concept: My favorite design that never shipped
      </figcaption>
    </div>
    
    <!-- Lottie animation showing grid interaction -->
    <div class="lottie-animation-nk26" aria-label="Animation showing how users would interact with topic tiles">
      <div 
        id="lottie-bento-interaction" 
        class="lottie-player-nk26"
        role="img"
        aria-label="Animated demonstration of clicking topic tiles and viewing detailed information panels"
      ></div>
      <figcaption class="lottie-caption-nk26">
        Interaction pattern: Click tile → View details → Return to grid
      </figcaption>
    </div>
  </div>
</section>
```

---

## User Research - The Pivot Moment (Sticky Scroll)

```html
<section class="sticky-scroll-section-nk26" aria-label="User research findings and design pivot">
  <div class="sticky-container-nk26">
    <!-- Sticky Visual (Left) -->
    <div class="sticky-visual-nk26" aria-live="polite">
      <div class="visual-card-nk26 active" data-step="1">
        <img 
          src="/images/cv-bento-grid-concept.jpg" 
          alt="Initial bento grid design with six topic tiles"
          loading="lazy"
        />
      </div>
      <div class="visual-card-nk26" data-step="2">
        <img 
          src="/images/cv-user-testing-photo.jpg" 
          alt="Photo of user testing session with student and enrollment officer"
          loading="lazy"
        />
      </div>
      <div class="visual-card-nk26" data-step="3">
        <img 
          src="/images/cv-final-design.jpg" 
          alt="Final simplified design with inquiry form, social media panel, and chat"
          loading="lazy"
        />
      </div>
    </div>
    
    <!-- Scrollable Content (Right) -->
    <div class="sticky-content-nk26">
      <div class="content-block-nk26" data-trigger="1">
        <h3 class="content-title-nk26">Testing the Bento Grid</h3>
        <p class="content-text-nk26">
          I was excited to validate my interactive concept. We recruited 8 
          prospective students (mix of current applicants and walk-ins) and 
          3 enrollment officers for testing sessions.
        </p>
        <p class="content-text-nk26">
          My hypothesis: Students would love exploring topics at their own pace, 
          and officers would appreciate the behavioral data.
        </p>
        <p class="section-text-nk26">
          <strong>What I expected:</strong> Students clicking through multiple 
          tiles, spending time on Finances and Course Scheduling.
        </p>
      </div>
      
      <div class="content-block-nk26" data-trigger="2">
        <h3 class="content-title-nk26">What Actually Happened</h3>
        <p class="content-text-nk26">
          Students barely touched the tiles. Instead, they kept asking: 
          <em>"Do you have Instagram?"</em>
        </p>
        
        <blockquote class="user-quote-nk26">
          "The first thing I do after talking to someone about a school is check 
          out their Instagram. That tells me more than any brochure."
          <cite>— Maria, 19, Prospective Student</cite>
        </blockquote>
        
        <p class="content-text-nk26">
          Through interviews, we uncovered a critical insight: <strong>prospective 
          students don't trust marketing materials.</strong> They want social proof 
          from real students, which they find on social media.
        </p>
        
        <p class="content-text-nk26">
          Enrollment officers confirmed this: "Students who've already looked at our 
          Instagram are much more serious. They've done their homework."
        </p>
        
        <h4 class="subsection-title-nk26">Key Findings from Research</h4>
        <ul class="feature-list-nk26">
          <li class="feature-item-nk26">
            <strong>83% of students</strong> check social media before any other research
          </li>
          <li class="feature-item-nk26">
            <strong>Instagram was the #1 trust signal</strong> - more than official website content
          </li>
          <li class="feature-item-nk26">
            <strong>Spanish translation was critical</strong> - 60% of applicants spoke Spanish first
          </li>
          <li class="feature-item-nk26">
            <strong>Chat was preferred over forms</strong> - felt more personal
          </li>
          <li class="feature-item-nk26">
            <strong>The bento grid was ignored</strong> - students didn't know what the tiles did
          </li>
        </ul>
      </div>
      
      <div class="content-block-nk26" data-trigger="3">
        <h3 class="content-title-nk26">Killing My Darlings</h3>
        <p class="content-text-nk26">
          This was humbling. I'd spent weeks on a clever interface that users 
          didn't want. The data was clear: simplify everything and prioritize 
          social media.
        </p>
        
        <h4 class="subsection-title-nk26">What We Kept:</h4>
        <ul class="feature-list-nk26 feature-list-final-nk26">
          <li class="feature-item-nk26">
            <strong>Inquiry Form</strong> - Quick questions before chat starts
          </li>
          <li class="feature-item-nk26">
            <strong>Social Media Panel</strong> - Instagram, Facebook, TikTok front-and-center
          </li>
          <li class="feature-item-nk26">
            <strong>Chat Assistant</strong> - For personalized questions
          </li>
        </ul>
        
        <h4 class="subsection-title-nk26">What We Cut:</h4>
        <ul class="feature-list-nk26">
          <li class="feature-item-nk26" style="text-decoration: line-through; opacity: 0.5;">
            Student ID card concept
          </li>
          <li class="feature-item-nk26" style="text-decoration: line-through; opacity: 0.5;">
            Bento grid of topic tiles
          </li>
          <li class="feature-item-nk26" style="text-decoration: line-through; opacity: 0.5;">
            Complex analytics dashboard
          </li>
        </ul>
        
        <p class="content-text-nk26">
          Sometimes the best design decision is admitting your clever solution 
          wasn't what users needed.
        </p>
      </div>
    </div>
  </div>
</section>
```

---

## Design Iterations (Vertical Stack with Before/After)

```html
<section class="grid-pattern-a-nk26" aria-label="Design iterations and changes">
  <div class="grid-container-nk26">
    <div class="grid-main-nk26">
      <h2 class="section-title-nk26">Design Iterations</h2>
      <p class="section-text-nk26">
        After user research, we went through three major iterations before 
        launching. Each change was driven by feedback from students or 
        enrollment officers.
      </p>
      
      <!-- Iteration 1: Location/Course Dropdown -->
      <div class="iteration-container-nk26">
        <h3 class="subsection-title-nk26">Iteration 1: The Location Dropdown Mistake</h3>
        
        <div class="before-after-slider-nk26" aria-label="Before and after comparison of location selection interface">
          <div class="slider-container-nk26">
            <div class="before-image-wrapper-nk26">
              <img 
                src="/images/cv-dropdown-before.jpg" 
                alt="Interface with dropdown menu for selecting location and course next to chat input"
                class="comparison-image-nk26"
              />
              <span class="image-label-nk26 label-before-nk26">Before</span>
            </div>
            
            <div class="after-image-wrapper-nk26">
              <img 
                src="/images/cv-dropdown-after.jpg" 
                alt="Interface with location and course selection moved to chat conversation"
                class="comparison-image-nk26"
              />
              <span class="image-label-nk26 label-after-nk26">After</span>
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
            <strong>The Problem:</strong> I added location and course dropdowns next to 
            the chat input for technical reasons (easier parsing). Users thought these 
            were "suggested topics" not actual selections. Nobody used them correctly.
          </p>
        </div>
        
        <div class="tech-note-nk26" role="complementary" aria-label="Technical implementation details">
          <div class="tech-note-header-nk26">
            <svg class="tech-note-icon-nk26" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M6 4L10 8L6 12M10 8H14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span class="tech-note-label-nk26">Technical Note</span>
          </div>
          <div class="tech-note-content-nk26">
            <p class="tech-note-text-nk26">
              Originally designed dropdowns to pass structured data (locationId, courseId) 
              to the backend, avoiding NLP parsing errors. User feedback forced a redesign: 
              now the agent parses freeform text and uses entity recognition to extract 
              location/course intent. Added bold formatting to course names in responses 
              to indicate importance: "Our <strong>Medical Esthetics</strong> program..."
            </p>
          </div>
        </div>
        
        <p class="section-text-nk26">
          <strong>The Fix:</strong> Removed the dropdowns entirely. Students now mention 
          their interests in natural conversation, and the agent highlights course names 
          with bold formatting to show they've been recognized.
        </p>
      </div>
      
      <!-- Iteration 2: Social Media Placement -->
      <div class="iteration-container-nk26">
        <h3 class="subsection-title-nk26">Iteration 2: Social Media Placement</h3>
        
        <!-- Video showing the change -->
        <div class="video-comparison-nk26">
          <video 
            class="iteration-video-nk26"
            src="/videos/cv-social-media-iteration.mp4"
            controls
            playsinline
            aria-label="Video showing social media icons being moved from sidebar to below chat widget"
          >
            <source src="/videos/cv-social-media-iteration.webm" type="video/webm">
            <source src="/videos/cv-social-media-iteration.mp4" type="video/mp4">
          </video>
          <figcaption class="image-caption-nk26">
            Watch how social media icons moved from hidden to prominent
          </figcaption>
        </div>
        
        <p class="section-text-nk26">
          <strong>The Insight:</strong> Current students told us: "After chatting with 
          the bot, I immediately want to check Instagram to see if the vibe matches."
        </p>
        
        <p class="section-text-nk26">
          <strong>The Change:</strong> Moved social media icons from a collapsible sidebar 
          to directly below the chat widget. Made them larger, more prominent, and always 
          visible. Added hover animations to make them feel interactive.
        </p>
        
        <p class="section-text-nk26">
          <strong>The Result:</strong> Social media click-through rate increased by 340%. 
          Students who clicked on Instagram were 2x more likely to complete enrollment.
        </p>
      </div>
      
      <!-- Iteration 3: Spanish Translation -->
      <div class="iteration-container-nk26">
        <h3 class="subsection-title-nk26">Iteration 3: Spanish Translation</h3>
        
        <div class="image-wrapper-nk26">
          <img 
            src="/images/cv-spanish-translation.jpg" 
            alt="Side-by-side comparison of English and Spanish chat interfaces"
            class="section-image-nk26"
            loading="lazy"
          />
          <figcaption class="image-caption-nk26">
            Spanish translation wasn't an afterthought - it was a requirement
          </figcaption>
        </div>
        
        <p class="section-text-nk26">
          <strong>The Discovery:</strong> 60% of prospective students spoke Spanish as 
          their first language. Many were intimidated by English-only interfaces.
        </p>
        
        <p class="section-text-nk26">
          <strong>The Implementation:</strong> Added language toggle at the top of the 
          widget. The agent responds in the detected language automatically. All UI 
          elements (buttons, labels, error messages) were professionally translated.
        </p>
        
        <div class="tech-note-nk26" role="complementary" aria-label="Technical implementation details">
          <div class="tech-note-header-nk26">
            <svg class="tech-note-icon-nk26" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M6 4L10 8L6 12M10 8H14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span class="tech-note-label-nk26">Technical Note</span>
          </div>
          <div class="tech-note-content-nk26">
            <p class="tech-note-text-nk26">
              Used GPT-4's multilingual capabilities with system prompts in Spanish. 
              Rather than translate responses post-generation, the agent thinks in Spanish 
              from the start, resulting in more natural phrasing. Language detection is 
              automatic based on first user message. Added i18n for all UI strings using 
              WordPress's translation system.
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <aside class="grid-meta-nk26" aria-label="Iteration statistics">
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Total Iterations</span>
        <span class="meta-value-nk26">12 design versions</span>
      </div>
      
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">User Tests</span>
        <span class="meta-value-nk26">3 rounds, 8 students, 3 officers</span>
      </div>
      
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Features Cut</span>
        <span class="meta-value-nk26">5 (including bento grid)</span>
      </div>
      
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Features Added</span>
        <span class="meta-value-nk26">2 (social media, translation)</span>
      </div>
    </aside>
  </div>
</section>
```

---

## Final Design (Pattern B: 1/3 + 2/3)

```html
<section class="grid-pattern-b-nk26" aria-label="Final design solution">
  <div class="grid-container-nk26">
    <div class="grid-text-nk26">
      <h2 class="section-title-nk26">The Final Design</h2>
      <p class="section-text-nk26">
        What shipped was radically simpler than my initial concept - and 
        far more effective.
      </p>
      
      <h3 class="subsection-title-nk26">Three Core Components</h3>
      <ol class="numbered-list-nk26">
        <li><strong>Quick Inquiry Form</strong> - Name, email, phone (optional)</li>
        <li><strong>Social Media Panel</strong> - Instagram, Facebook, TikTok, YouTube</li>
        <li><strong>AI Chat Assistant</strong> - Answers questions, screens leads</li>
      </ol>
    </div>
    
    <div class="grid-visual-nk26">
      <div class="image-wrapper-nk26">
        <img 
          src="/images/cv-final-desktop.jpg" 
          alt="Final Christine Valmy enrollment assistant showing inquiry form, social media icons, and chat interface on desktop"
          class="section-image-nk26"
          loading="lazy"
        />
        <figcaption class="image-caption-nk26">
          Desktop view: Clean, focused, user-driven
        </figcaption>
      </div>
      
      <div class="image-wrapper-nk26">
        <img 
          src="/images/cv-final-mobile.jpg" 
          alt="Mobile responsive view of enrollment assistant with stacked layout"
          class="section-image-nk26"
          loading="lazy"
        />
        <figcaption class="image-caption-nk26">
          Mobile view: Touch-optimized, same functionality
        </figcaption>
      </div>
    </div>
  </div>
</section>
```

---

## Micro-Interactions (Full Width)

```html
<section class="grid-pattern-c-nk26" aria-label="Micro-interactions and animations">
  <div class="grid-container-nk26">
    <h2 class="section-title-full-nk26">Micro-Interactions That Matter</h2>
    
    <p class="section-text-nk26">
      Even in a simplified design, small details create polish and guide users 
      through the flow.
    </p>
    
    <!-- Lottie: Input focus animation -->
    <div class="micro-interaction-showcase-nk26">
      <div class="micro-interaction-item-nk26">
        <div class="lottie-animation-nk26">
          <div 
            id="lottie-input-focus" 
            class="lottie-player-nk26"
            role="img"
            aria-label="Animation showing input field expanding and highlighting on focus"
          ></div>
        </div>
        <div class="micro-interaction-description-nk26">
          <h3 class="subsection-title-nk26">Input Focus State</h3>
          <p class="section-text-nk26">
            Subtle scale and shadow animation draws attention to active input. 
            Purple accent color (brand) reinforces focus.
          </p>
        </div>
      </div>
      
      <!-- Lottie: Social media hover -->
      <div class="micro-interaction-item-nk26">
        <div class="lottie-animation-nk26">
          <div 
            id="lottie-social-hover" 
            class="lottie-player-nk26"
            role="img"
            aria-label="Animation showing social media icons bouncing on hover"
          ></div>
        </div>
        <div class="micro-interaction-description-nk26">
          <h3 class="subsection-title-nk26">Social Media Hover</h3>
          <p class="section-text-nk26">
            Playful bounce animation on hover makes icons feel clickable and 
            reinforces the "go check us out" call-to-action.
          </p>
        </div>
      </div>
      
      <!-- Lottie: Message send -->
      <div class="micro-interaction-item-nk26">
        <div class="lottie-animation-nk26">
          <div 
            id="lottie-message-send" 
            class="lottie-player-nk26"
            role="img"
            aria-label="Animation showing message being sent with flying paper airplane"
          ></div>
        </div>
        <div class="micro-interaction-description-nk26">
          <h3 class="subsection-title-nk26">Message Send Feedback</h3>
          <p class="section-text-nk26">
            Paper airplane flies from input to chat thread, confirming the 
            message was sent. Adds personality to an otherwise dry interaction.
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
      <h2 class="section-title-nk26">Measuring Success</h2>
      
      <p class="section-text-nk26">
        We tracked metrics for 3 months post-launch, comparing to the previous 
        3 months with the static form.
      </p>
      
      <!-- Results grid -->
      <div class="results-grid-nk26">
        <div class="result-card-nk26">
          <div class="result-number-nk26">143%</div>
          <div class="result-label-nk26">Increase in Submissions</div>
          <p class="result-description-nk26">
            From avg. 28 inquiries/month to 68 inquiries/month
          </p>
        </div>
        
        <div class="result-card-nk26">
          <div class="result-number-nk26">62%</div>
          <div class="result-label-nk26">Qualified Lead Rate</div>
          <p class="result-description-nk26">
            Agent successfully screened ineligible students (e.g., visa seekers)
          </p>
        </div>
        
        <div class="result-card-nk26">
          <div class="result-number-nk26">18 min</div>
          <div class="result-label-nk26">Avg. Time Saved per Officer</div>
          <p class="result-description-nk26">
            Officers had context before first contact, reducing repetitive Q&A
          </p>
        </div>
        
        <div class="result-card-nk26">
          <div class="result-number-nk26">340%</div>
          <div class="result-label-nk26">Social Media Click-Through</div>
          <p class="result-description-nk26">
            Students who clicked Instagram were 2x more likely to enroll
          </p>
        </div>
      </div>
      
      <!-- Qualitative feedback -->
      <h3 class="subsection-title-nk26">What Users Said</h3>
      
      <blockquote class="user-quote-nk26">
        "I loved that I could get answers immediately instead of waiting for 
        someone to email me back. And having the Instagram right there meant 
        I could see if the school actually looked like what they were saying."
        <cite>— Jennifer, Enrolled Student</cite>
      </blockquote>
      
      <blockquote class="user-quote-nk26">
        "The Spanish option was huge for us. We're getting way more inquiries 
        from our target demographic now. And the quality of leads is better - 
        people come in already knowing what we offer."
        <cite>— Rosa, Enrollment Officer</cite>
      </blockquote>
    </div>
    
    <aside class="grid-meta-nk26" aria-label="Results metadata">
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Measurement Period</span>
        <span class="meta-value-nk26">3 months (June - Aug 2024)</span>
      </div>
      
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Baseline</span>
        <span class="meta-value-nk26">Static form (Mar - May 2024)</span>
      </div>
      
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Total Interactions</span>
        <span class="meta-value-nk26">204 chat sessions</span>
      </div>
      
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Avg. Session Length</span>
        <span class="meta-value-nk26">4.5 minutes</span>
      </div>
      
      <div class="meta-item-nk26">
        <span class="meta-label-nk26">Conversion to Enrollment</span>
        <span class="meta-value-nk26">23% (up from 14%)</span>
      </div>
    </aside>
  </div>
</section>
```

---

## Technical Implementation (Expandable Section)

```html
<section class="grid-pattern-c-nk26" aria-label="Technical implementation details">
  <div class="grid-container-nk26">
    <h2 class="section-title-full-nk26">Building for WordPress</h2>
    
    <p class="section-text-nk26">
      The final product is a WordPress plugin that non-technical staff can install 
      and configure through the admin dashboard.
    </p>
    
    <div class="tech-stack-grid-nk26">
      <div class="tech-stack-item-nk26">
        <h4 class="tech-stack-title-nk26">Frontend</h4>
        <ul class="tech-list-nk26">
          <li>React 18 (for chat UI)</li>
          <li>Framer Motion (micro-interactions)</li>
          <li>Lottie (animations)</li>
          <li>CSS Modules (scoped styles)</li>
        </ul>
      </div>
      
      <div class="tech-stack-item-nk26">
        <h4 class="tech-stack-title-nk26">Backend</h4>
        <ul class="tech-list-nk26">
          <li>PHP 8.0+ (WordPress plugin architecture)</li>
          <li>WordPress REST API</li>
          <li>OpenAI GPT-4 API</li>
          <li>MySQL (conversation logs)</li>
        </ul>
      </div>
      
      <div class="tech-stack-item-nk26">
        <h4 class="tech-stack-title-nk26">DevOps</h4>
        <ul class="tech-list-nk26">
          <li>Webpack (bundling React for WP)</li>
          <li>GitHub Actions (CI/CD)</li>
          <li>WP-CLI (automated testing)</li>
        </ul>
      </div>
    </div>
    
    <div class="tech-note-nk26" role="complementary" aria-label="Technical challenges and solutions">
      <div class="tech-note-header-nk26">
        <svg class="tech-note-icon-nk26" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M6 4L10 8L6 12M10 8H14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <span class="tech-note-label-nk26">Key Technical Challenges</span>
      </div>
      <div class="tech-note-content-nk26">
        <p class="tech-note-text-nk26">
          <strong>1. WordPress + React Integration:</strong> WordPress plugins typically 
          use jQuery. I built a custom enqueue system to load React without conflicting 
          with existing WP scripts. Used ReactDOM.render() in isolated containers.
        </p>
        <p class="tech-note-text-nk26">
          <strong>2. Mobile Responsive Positioning:</strong> Chat widgets are tricky on 
          mobile - they can't obscure content but need to be accessible. Used 
          position: fixed with viewport units and safe-area-inset for iOS notches.
        </p>
        <p class="tech-note-text-nk26">
          <strong>3. GPT-4 Response Streaming:</strong> To avoid long waits, implemented 
          Server-Sent Events (SSE) to stream responses token-by-token. Users see the 
          agent "typing" in real-time.
        </p>
        <p class="tech-note-text-nk26">
          <strong>4. Conversation Context Management:</strong> WordPress is stateless. 
          Stored conversation history in browser localStorage with 7-day expiry, synced 
          to MySQL on completion for analytics.
        </p>
      </div>
    </div>
    
    <!-- Code snippet example -->
    <div class="code-snippet-nk26">
      <pre><code class="language-javascript">
// Example: Streaming GPT-4 responses in WordPress plugin
async function streamChatResponse(message, conversationId) {
  const response = await fetch('/wp-json/cv-agent/v1/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-WP-Nonce': wpApiSettings.nonce
    },
    body: JSON.stringify({ 
      message, 
      conversationId,
      stream: true 
    })
  });
  
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  
  let partialResponse = '';
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value);
    partialResponse += chunk;
    
    // Update UI in real-time
    updateChatBubble(conversationId, partialResponse);
  }
  
  return partialResponse;
}
      </code></pre>
    </div>
  </div>
</section>
```

---

## Learnings (Full Width)

```html
<section class="grid-pattern-c-nk26" aria-label="Project learnings and reflections">
  <div class="grid-container-nk26">
    <h2 class="section-title-full-nk26">What I Learned</h2>
    
    <div class="grid-nested-nk26">
      <div class="nested-main-nk26">
        <h3 class="subsection-title-nk26">1. Your Favorite Design Might Be Wrong</h3>
        <p class="section-text-nk26">
          I was emotionally attached to the bento grid. It was clever, it looked 
          good in mockups, and I'd invested time building it. But users didn't care. 
          This taught me to test early and be willing to kill features I love.
        </p>
        
        <h3 class="subsection-title-nk26">2. Social Proof > Marketing Copy</h3>
        <p class="section-text-nk26">
          Students don't trust what schools say about themselves. They trust what 
          they see on Instagram from real students. Design for authentic discovery, 
          not polished messaging.
        </p>
        
        <h3 class="subsection-title-nk26">3. Technical Preferences ≠ User Needs</h3>
        <p class="section-text-nk26">
          I added dropdowns because they were easier to parse programmatically. 
          Users found them confusing. The right solution was harder to build but 
          better for users. Build for humans, not for your tech stack.
        </p>
        
        <h3 class="subsection-title-nk26">4. Simplicity Wins (Eventually)</h3>
        <p class="section-text-nk26">
          After 12 iterations, we shipped with 3 components instead of 7. The final 
          design felt "too simple" to me at first, but it performed 143% better. 
          Sometimes the best design feels like you haven't done enough.
        </p>
      </div>
      
      <div class="nested-aside-nk26">
        <div class="design-rationale-card-nk26">
          <h4 class="rationale-title-nk26">If I Could Do It Again</h4>
          <p class="rationale-text-nk26">
            1. Test with users BEFORE building complex features
          </p>
          <p class="rationale-text-nk26">
            2. Prototype in Figma with real user flows, not just pretty screens
          </p>
          <p class="rationale-text-nk26">
            3. Talk to enrollment officers sooner - they knew what students wanted
          </p>
          <p class="rationale-text-nk26">
            4. Launch with MVP, iterate based on real usage data
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
    <h2 class="next-project-title-nk26">Manage Small Farms</h2>
    <p class="next-project-description-nk26">
      Designing a mobile app for low-literacy farmers with accessibility constraints
    </p>
    <a href="/case-study/manage-farms" class="next-project-link-nk26">
      View Case Study →
    </a>
  </div>
</section>
```

---

## JavaScript Initialization

```javascript
// Initialize all interactive elements when page loads
document.addEventListener('DOMContentLoaded', () => {
  // Load Lottie animations
  loadLottieAnimation('lottie-bento-interaction', '/lottie/cv-bento-interaction.json', false);
  loadLottieAnimation('lottie-input-focus', '/lottie/cv-input-focus.json', true);
  loadLottieAnimation('lottie-social-hover', '/lottie/cv-social-hover.json', true);
  loadLottieAnimation('lottie-message-send', '/lottie/cv-message-send.json', false);
  
  // Initialize before/after sliders (from template)
  // Initialize sticky scroll observers (from template)
  
  // Google Analytics tracking
  document.querySelectorAll('.section-image-nk26, .comparison-image-nk26').forEach(img => {
    img.addEventListener('click', () => {
      gtag('event', 'image_click', {
        'event_category': 'engagement',
        'event_label': img.alt
      });
    });
  });
});
```

---

## Image Asset List (Placeholders)

**Required Images:**
- `/images/cv-hero-video.mp4` - B-roll of students using agent
- `/images/cv-old-form.jpg` - Original static inquiry form
- `/images/cv-pain-points-diagram.jpg` - Communication flow diagram
- `/images/cv-student-id-concept.jpg` - Student ID card mockup
- `/images/cv-bento-grid-mockup.jpg` - Full bento grid interface
- `/images/cv-user-testing-photo.jpg` - Photo from testing session
- `/images/cv-final-design.jpg` - Final simplified design
- `/images/cv-dropdown-before.jpg` - Before: dropdown interface
- `/images/cv-dropdown-after.jpg` - After: conversational selection
- `/images/cv-social-media-iteration.mp4` - Video of social media placement change
- `/images/cv-spanish-translation.jpg` - English vs Spanish comparison
- `/images/cv-final-desktop.jpg` - Final design on desktop
- `/images/cv-final-mobile.jpg` - Final design on mobile

**Required Lottie Files:**
- `/lottie/cv-bento-interaction.json` - Tile click interaction
- `/lottie/cv-input-focus.json` - Input field focus animation
- `/lottie/cv-social-hover.json` - Social media hover animation
- `/lottie/cv-message-send.json` - Message send feedback

---

**Ready to create: Manage Farms Case Study next**
