/**
 * Christine Valmy Case Study Data
 * AI enrollment assistant for beauty trade school
 */

export const christineValmyData = {
  projectId: 'christineValmy',

  // Hero Section
  hero: {
    videoSrc: '/videos/Case Studies/CV/christine-valmy-laptop.mp4',
    posterSrc: '/images/Case Studies/CV/cv-hero-poster.jpg',
    subtitle: 'How listening to users altered design decisions and led to 143% increase in enrollments'
  },

  // Project Metadata
  meta: {
    role: 'Product Designer + WordPress Developer',
    timeline: '3 months (August- October 2024)',
    team: '1 PM, 3 Developers',
    platform: 'WordPress Plugin',
    impact: '143% increase in submissions',
    techStack: 'React, PHP, Gemini, Claude, N8N '
  },

  // Overview / Challenge Section
  overview: {
    title: 'The Challenge',
    paragraphs: [
      'Christine Valmy, a beauty trade school with multiple locations, was struggling to convert prospective students. Their traditional inquiry form created a communication bottleneck: students had to wait days for responses, and enrollment officers were overwhelmed answering the same questions repeatedly without knowing if students were even qualified.',
      'International students would inquire about visa sponsorship (not offered). Others wanted course dates across different branches. Enrollment officers lacked context, leading to inefficient conversations and lost leads.'
    ],
    image: {
      src: '/images/Case Studies/CV/cv-original-form.jpg',
      alt: 'Screenshot of traditional static inquiry form with multiple text fields',
      caption: 'The original inquiry form: functional, but created communication delays'
    }
  },

  // Pain Points
  painPoints: [
    {
      title: 'Prospective Students',
      icon: '/images/Case Studies/CV/logo/stressed-student.svg',
      items: [
        'Waited 2-5 days for basic questions',
        'Couldn\'t browse courses without contacting staff',
        'No information about visa sponsorship upfront',
        'Lost interest during wait times'
      ]
    },
    {
      title: 'Enrollment Officers',
      icon: '/images/Case Studies/CV/logo/enrollment-officer.svg',
      items: [
        'Answered same questions repeatedly',
        'No context on student qualifications',
        'Couldn\'t prioritize high-quality leads',
        'Manual back-and-forth across 5 locations'
      ]
    }
  ],

  // Initial Concept
  initialConcept: {
    title: 'My Initial Vision: Make Everything Interactive',
    intro: 'I had what I thought was a brilliant solution: turn enrollment into an interactive experience. Instead of a boring chat widget, I designed two interconnected systems:',
    concepts: [
      {
        title: 'Concept 1: Interactive Student ID Card',
        description: 'Students would "fill out" a digital ID card as they progressed through the conversation. This would elegantly collect PII while making the process feel gamified and progressive.',
        lottie: {
          path: '/lottie/id-card.json',
          caption: 'The Student ID concept: Progressive information collection disguised as a credential'
        }
      },
      {
        title: 'Concept 2: Bento Grid Knowledge Base',
        description: 'Instead of forcing students to ask questions, I\'d provide a bento grid of topic tiles they could explore:',
        lottie: {
          path: '/lottie/Bento Grid Lottie.json',
          caption: 'The bento grid concept: My favorite design that never shipped'
        }
      }
    ],
    bentoFeatures: [
      { title: 'Alumni Stats', description: 'Success stories and graduation rates', icon: '/images/Case Studies/CV/logo/alumni-stats.svg' },
      { title: 'Location Information', description: 'Details on all 5 branches', icon: '/images/Case Studies/CV/logo/location.svg' },
      { title: 'Finances & Tuition', description: 'Cost breakdown and payment plans', icon: '/images/Case Studies/CV/logo/tuition.svg' },
      { title: 'Eligibility Requirements', description: 'Who qualifies for enrollment', icon: '/images/Case Studies/CV/logo/enrollment-officer.svg' },
      { title: 'Course Scheduling', description: 'Upcoming class dates per location', icon: '/images/Case Studies/CV/logo/schedule.svg' },
      { title: 'Chat Assistant', description: 'For questions outside the tiles', icon: '/images/Case Studies/CV/logo/chat.svg' }
    ],
    rationale: [
      '1. Reduces cognitive load (no need to think of questions)',
      '2. Provides structured data for analytics',
      '3. Makes the interface feel more "app-like" than a basic chatbot',
      '4. Gamifies the enrollment journey'
    ],
    bentoImage: {
      src: '/images/Case Studies/CV/cv-bento-grid-mockup.png',
      alt: 'Full interface mockup showing bento grid with six topic tiles arranged in a modular layout',
      caption: 'The bento grid concept: My favorite design that never shipped'
    }
  },

  // User Research / Pivot
  userResearch: {
    visualCards: [
      {
        step: 1,
        src: '/images/Case Studies/CV/cv-bento-grid-concept.png',
        alt: 'Initial bento grid design with six topic tiles'
      },
      {
        step: 2,
        src: '/images/Case Studies/CV/cv-bento-grid-concept-2.png',
        alt: 'Photo of user testing session with student and enrollment officer'
      },
      {
        step: 3,
        src: '/images/Case Studies/CV/cv-final-design.svg',
        alt: 'Final simplified design with inquiry form, social media panel, and chat'
      }
    ],
    contentBlocks: [
      {
        trigger: 1,
        title: 'Testing the Bento Grid',
        paragraphs: [
          'I was excited to validate my interactive concept. We recruited 8 prospective students (mix of current applicants and walk-ins) and 3 enrollment officers for testing sessions.',
          'My hypothesis: Students would love exploring topics at their own pace, and officers would appreciate the behavioral data.'
        ],
        highlight: 'What I expected: Students clicking through multiple tiles, spending time on Finances and Course Scheduling.'
      },
      {
        trigger: 2,
        title: 'What Actually Happened',
        paragraphs: [
          'Students barely touched the tiles. Instead, they kept asking: "Do you have Instagram?"',
          'Through interviews, we uncovered a critical insight: prospective students don\'t trust marketing materials. They want social proof from real students, which they find on social media.',
          'Enrollment officers confirmed this: "Students who\'ve already looked at our Instagram are much more serious. They\'ve done their homework."'
        ],
        quote: {
          image: {
            src: '/images/Case Studies/CV/logo/maria.svg',
            alt: 'Photo of Maria, Prospective Student',
            caption: 'Maria, Prospective Student'
          },
          text: 'The first thing I do after talking to someone about a school is check out their Instagram. That tells me more than any brochure.',
          cite: '— Maria, 19, Prospective Student'
        },
        findings: [
          { stat: '83% of students', description: 'check social media before any other research' },
          { stat: 'Instagram was the #1 trust signal', description: 'more than official website content' },
          { stat: 'Spanish translation was critical', description: '60% of applicants spoke Spanish first' },
          { stat: 'Chat was preferred over forms', description: 'felt more personal' },
          { stat: 'The bento grid was ignored', description: 'students didn\'t know what the tiles did' }
        ]
      },
      {
        trigger: 3,
        title: 'Killing My Darlings',
        paragraphs: [
          'This was humbling. I\'d spent weeks on a clever interface that users didn\'t want. The data was clear: simplify everything and prioritize social media.'
        ],
        kept: [
          { title: 'Inquiry Form', description: 'Quick questions before chat starts' },
          { title: 'Social Media Panel', description: 'Instagram, Facebook, TikTok front-and-center' },
          { title: 'Chat Assistant', description: 'For personalized questions' }
        ],
        cut: [
          'Student ID card concept',
          'Bento grid concept',
          'Clickable tiles concept'
        ],
        lesson: 'Sometimes the best design decision is admitting your clever solution wasn\'t what users needed.'
      }
    ]
  },

  // Design Iterations
  iterations: [
    {
      title: 'Iteration 1: The Location Dropdown Mistake',
      beforeImage: {
        src: '/images/Case Studies/CV/cv-dropdown-after.png',
        alt: 'Interface with dropdown menu for selecting location and course next to chat input'
      },
      afterImage: {
        src: '/images/Case Studies/CV/cv-dropdown-before.png',
        alt: 'Interface with location and course selection moved to chat conversation'
      },
      caption: 'The Problem: I added location and course dropdowns next to the chat input for technical reasons (easier parsing). Users thought these were "suggested topics" not actual selections. Nobody used them correctly.',
      technicalNote: 'Originally designed dropdowns to pass structured data (locationId, courseId) to the backend, avoiding NLP parsing errors. User feedback forced a redesign: now the agent parses freeform text and uses entity recognition to extract location/course intent. Added bold formatting to course names in responses to indicate importance.',
      fix: 'Removed the dropdowns entirely. Students now mention their interests in natural conversation, and the agent highlights course names with bold formatting to show they\'ve been recognized.'
    },
    {
      title: 'Iteration 2: Social Media Placement',
      image: {
        src: '/images/Case Studies/CV/social-media-bar.svg',
        alt: 'Social media icons moved directly below the chat widget for easier access',
        caption: 'Iterating on placement: Moving social proof to the center of the experience'
      },
      insight: 'Current students told us: "After chatting with the bot, I immediately want to check Instagram to see if the vibe matches."',
      change: 'Moved social media icons from a collapsible sidebar to directly below the chat widget. Made them larger, more prominent, and always visible. Added hover animations to make them feel interactive.',
      result: 'Social media click-through rate increased by 340%. Students who clicked on Instagram were 2x more likely to complete enrollment.'
    },
    {
      title: 'Iteration 3: Spanish Translation',
      videoSrc: '/videos/Case Studies/CV/spanish language.mp4',
      discovery: '60% of prospective students spoke Spanish as their first language. Many were intimidated by English-only interfaces.',
      implementation: 'Added language toggle at the top of the widget. The agent responds in the detected language automatically. All UI elements (buttons, labels, error messages) were professionally translated.',
      technicalNote: 'Used Gemini\'s multilingual capabilities with system prompts in Spanish. Rather than translate responses post-generation, the agent thinks in Spanish from the start, resulting in more natural phrasing. Language detection is automatic based on first user message.'
    }
  ],

  // Iteration Stats
  iterationStats: {
    totalIterations: '12 design versions',
    userTests: '3 rounds, 8 students, 3 officers',
    featuresCut: '5 (including bento grid)',
    featuresAdded: '2 (social media, translation)'
  },

  // Final Design
  finalDesign: {
    title: 'The Final Design',
    intro: 'What shipped was radically simpler than my initial concept - and far more effective.',
    components: [
      { number: 1, title: 'Quick Inquiry Form', description: 'Name, email, phone (optional)' },
      { number: 2, title: 'Social Media Panel', description: 'Instagram, Facebook, TikTok, YouTube' },
      { number: 3, title: 'AI Chat Assistant', description: 'Answers questions, screens leads' }
    ],
    desktopImage: {
      src: '/images/Case Studies/CV/cv-final-design.svg',
      alt: 'Final Christine Valmy enrollment assistant showing inquiry form, social media icons, and chat interface on desktop',
      caption: 'Desktop view: Clean, focused, user-driven'
    },
    mobileImage: {
      src: '/images/Case Studies/CV/cv-final-mobile.svg',
      alt: 'Mobile responsive view of enrollment assistant with stacked layout',
      caption: 'Mobile view: Touch-optimized, same functionality'
    }
  },

  // Micro-interactions
  microInteractions: [
    {
      animationPath: '/lottie/input-box-highlight.json',
      title: 'Input Focus State',
      description: 'Subtle scale and shadow animation draws attention to active input. Purple accent color (brand) reinforces focus.',
      ariaLabel: 'Animation showing input field expanding and highlighting on focus',
      loop: false
    },
    {
      animationPath: '/lottie/social-media.json',
      title: 'Social Media Hover',
      description: 'Playful bounce animation on hover makes icons feel clickable and reinforces the "go check us out" call-to-action.',
      ariaLabel: 'Animation showing social media icons bouncing on hover',
      loop: true
    },
    {
      videoSrc: '/videos/Case Studies/CV/message-feedback.mp4',
      title: 'Message Send Feedback',
      description: 'Paper airplane flies from input to chat thread, confirming the message was sent. Adds personality to an otherwise dry interaction.',
      ariaLabel: 'Animation showing message being sent with flying paper airplane',
      loop: false
    }
  ],

  // Results
  results: [
    {
      number: '143%',
      label: 'Increase in Submissions',
      description: 'From avg. 28 inquiries/month to 68 inquiries/month',
      icon: '/images/Case Studies/CV/logo/submission-increase.svg'
    },
    {
      number: '62%',
      label: 'Qualified Lead Rate',
      description: 'Agent successfully screened ineligible students (e.g., visa seekers)',
      icon: '/images/Case Studies/CV/logo/qualified-student.svg'
    },
    {
      number: '18 min',
      label: 'Avg. Time Saved per Officer',
      description: 'Officers had context before first contact, reducing repetitive Q&A',
      icon: '/images/Case Studies/CV/logo/time-saved.svg'
    },
    {
      number: '340%',
      label: 'Social Media Click-Through',
      description: 'Students who clicked Instagram were 2x more likely to enroll',
      icon: '/images/Case Studies/CV/logo/social-media.svg'
    }
  ],

  // Results Metadata
  resultsMeta: {
    measurementPeriod: '3 months (October - January 2025)',
    baseline: 'Static form (May - July 2024)',
    totalInteractions: '204 chat sessions',
    avgSessionLength: '4.5 minutes',
    conversionRate: '23% (up from 10%)'
  },

  // User Quotes
  userQuotes: [
    {
      image: {
        src: '/images/Case Studies/CV/jennifer.svg',
        alt: 'Photo of Jennifer, Enrolled Student',
        caption: 'Jennifer, Enrolled Student'
      },
      text: 'I loved that I could get answers immediately instead of waiting for someone to email me back. And having the Instagram right there meant I could see if the school actually looked like what they were saying.',
      cite: '— Jennifer, Enrolled Student'
    },
    {
      image: {
        src: '/images/Case Studies/CV/rosa.svg',
        alt: 'Photo of Rosa, Enrollment Officer',
        caption: 'Rosa, Enrollment Officer'
      },
      text: 'The Spanish option was huge for us. We\'re getting way more inquiries from our target demographic now. And the quality of leads is better - people come in already knowing what we offer.',
      cite: '— Rosa, Enrollment Officer'
    }
  ],

  // Technical Implementation
  techStack: [
    {
      title: 'Frontend',
      items: ['React 18 (for chat UI)', 'Framer Motion (micro-interactions)', 'Lottie (animations)', 'CSS Modules (scoped styles)']
    },
    {
      title: 'Backend',
      items: ['PHP 8.0+ (WordPress plugin architecture)', 'OpenAI GPT-4 API', 'Google Cloud Functions', 'N8N', 'BigQuery']
    },
    {
      title: 'DevOps',
      items: ['Webpack (bundling React for WP)', 'GitHub Actions (CI/CD)', 'WP-CLI (automated testing)']
    }
  ],

  // Technical Challenges
  technicalChallenges: [
    {
      title: 'WordPress + React Integration',
      description: 'WordPress plugins typically use jQuery. I built a custom enqueue system to load React without conflicting with existing WP scripts. Used ReactDOM.render() in isolated containers.'
    },
    {
      title: 'Mobile Responsive Positioning',
      description: 'Chat widgets are tricky on mobile - they can\'t obscure content but need to be accessible. Used position: fixed with viewport units and safe-area-inset for iOS notches.'
    },
    {
      title: 'GPT-4 Response Streaming',
      description: 'To avoid long waits, implemented Server-Sent Events (SSE) to stream responses token-by-token. Users see the agent "typing" in real-time.'
    },
    {
      title: 'Conversation Context Management',
      description: 'WordPress is stateless. Stored conversation history in browser localStorage with 7-day expiry, synced to MySQL on completion for analytics.'
    }
  ],

  // Learnings
  learnings: [
    {
      title: 'Your Favorite Design Might Be Wrong',
      description: 'I was emotionally attached to the bento grid. It was clever, it looked good in mockups, and I\'d invested time building it. But users didn\'t care. This taught me to test early and be willing to kill features I love.'
    },
    {
      title: 'Social Proof > Marketing Copy',
      description: 'Students don\'t trust what schools say about themselves. They trust what they see on Instagram from real students. Design for authentic discovery, not polished messaging.'
    },
    {
      title: 'Technical Preferences ≠ User Needs',
      description: 'I added dropdowns because they were easier to parse programmatically. Users found them confusing. The right solution was harder to build but better for users. Build for humans, not for your tech stack.'
    },
    {
      title: 'Simplicity Wins (Eventually)',
      description: 'After 12 iterations, we shipped with 3 components instead of 7. The final design felt "too simple" to me at first, but it performed 143% better. Sometimes the best design feels like you haven\'t done enough.'
    }
  ],

  // If I Could Do It Again
  retrospective: [
    '1. Test with users BEFORE building complex features',
    '2. Prototype in Figma with real user flows, not just pretty screens',
    '3. Talk to enrollment officers sooner - they knew what students wanted',
    '4. Launch with MVP, iterate based on real usage data'
  ],

  // Next Project
  nextProject: {
    title: 'Manage Small Farms',
    description: 'Designing a mobile app for low-literacy farmers with accessibility constraints',
    href: '/case-study/manage-farms'
  }
};

export default christineValmyData;
