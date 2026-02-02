import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * SideNav - Fixed side navigation for case studies
 *
 * Props:
 * - sections: Array of { id, label } for nav items (max 5 recommended)
 * - className: Optional additional class
 * - heroHeight: Height of hero section to offset nav visibility (default 100vh)
 */
const SideNav = ({ sections = [], className = '', heroHeight = '100vh' }) => {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || '');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const isManualScrollRef = useRef(false);

  // Find which section is currently in view based on scroll position
  const findActiveSection = useCallback(() => {
    if (isManualScrollRef.current) return; // Skip during manual nav clicks

    const scrollTop = window.scrollY;
    const viewportHeight = window.innerHeight;
    const triggerPoint = scrollTop + viewportHeight * 0.3; // 30% from top

    let currentSection = sections[0]?.id || '';

    for (const { id } of sections) {
      const element = document.getElementById(id);
      if (element) {
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + scrollTop;
        const elementBottom = elementTop + rect.height;

        // Section is active if trigger point is within its bounds
        if (triggerPoint >= elementTop && triggerPoint < elementBottom) {
          currentSection = id;
          break;
        }
        // Or if we've scrolled past it (for sections at the end)
        if (elementTop < triggerPoint) {
          currentSection = id;
        }
      }
    }

    setActiveSection(currentSection);
  }, [sections]);

  // Track scroll progress, visibility, and active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(Math.min(progress, 100));

      // Show nav after scrolling past 80% of viewport height (hero)
      const heroThreshold = window.innerHeight * 0.8;
      setIsVisible(scrollTop > heroThreshold);

      // Update active section based on scroll position
      findActiveSection();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [findActiveSection]);

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();

    // Immediately set active state for responsive feedback
    setActiveSection(sectionId);

    // Prevent scroll-based detection from overriding during animated scroll
    isManualScrollRef.current = true;

    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // Account for any fixed headers
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      // Use Lenis if available, otherwise fallback to native scroll
      if (window.lenis) {
        window.lenis.scrollTo(offsetPosition, {
          duration: 1,
          onComplete: () => {
            isManualScrollRef.current = false;
          }
        });
      } else {
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        // Reset flag after animation (approximate)
        setTimeout(() => {
          isManualScrollRef.current = false;
        }, 1000);
      }
    }
  };

  if (sections.length === 0) return null;

  return (
    <nav
      className={`case-study-sidenav-nk26 ${isVisible ? 'is-visible' : ''} ${className}`}
      aria-label="Case study sections"
      aria-hidden={!isVisible}
    >
      <div className="sidenav-header-nk26">Sections</div>

      <ul className="sidenav-list-nk26">
        {sections.map(({ id, label }) => (
          <li key={id} className="sidenav-item-nk26">
            <a
              href={`#${id}`}
              className={`sidenav-link-nk26 ${activeSection === id ? 'active' : ''}`}
              onClick={(e) => handleNavClick(e, id)}
              aria-current={activeSection === id ? 'true' : undefined}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>

      <div className="sidenav-progress-nk26">
        <div
          className="sidenav-progress-bar-nk26"
          style={{ width: `${scrollProgress}%` }}
          role="progressbar"
          aria-valuenow={Math.round(scrollProgress)}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>
    </nav>
  );
};

export default SideNav;
