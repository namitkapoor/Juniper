import React, { useEffect, useState, useRef, memo, useCallback } from 'react'; // useState used in StableLottie
import { motion } from 'framer-motion';
import Navbar from '../../components/layout/Navbar';
import Lottie from 'lottie-react';

// Fetches its own JSON lazily when ~200px from viewport, plays once, shows replay button
const StableLottie = memo(({ src }) => {
  const lottieRef = useRef(null);
  const containerRef = useRef(null);
  const [animationData, setAnimationData] = useState(null);
  const [done, setDone] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const hasFetched = useRef(false);
  const hasPlayed = useRef(false);

  // Fetch JSON when near viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const fetchObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasFetched.current) {
          hasFetched.current = true;
          fetch(src).then(r => r.json()).then(setAnimationData).catch(() => {});
          fetchObserver.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    fetchObserver.observe(el);
    return () => fetchObserver.disconnect();
  }, [src]);

  // Play when data loaded + in view
  useEffect(() => {
    if (!animationData) return;
    const el = containerRef.current;
    if (!el) return;
    const playObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasPlayed.current) {
          hasPlayed.current = true;
          lottieRef.current?.play();
          playObserver.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    playObserver.observe(el);
    return () => playObserver.disconnect();
  }, [animationData, replayKey]);

  const handleReplay = useCallback(() => {
    hasPlayed.current = false;
    setDone(false);
    setReplayKey(k => k + 1);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      {animationData && (
        <Lottie
          key={replayKey}
          lottieRef={lottieRef}
          animationData={animationData}
          loop={false}
          autoplay={false}
          onComplete={() => setDone(true)}
          style={{ height: 500, width: 'auto' }}
        />
      )}
      {done && (
        <button className="cl-lottie-replay-nk26" onClick={handleReplay} aria-label="Replay animation">
          ↺ Replay
        </button>
      )}
    </div>
  );
});

import {
  GridPatternA,
  GridPatternB,
  GridPatternC,
  GridMain,
  GridMeta,
  GridText,
  GridVisual,
  GridNested,
  NestedMain,
  NestedAside,
  SectionTitle,
  SubsectionTitle,
  SectionText,
  ImageWrapper,
  MetaItem,
  BeforeAfterSlider,
  FeatureList,
  NextProjectTeaser,
  DesignRationaleCard,
  SideNav
} from '../../components/case-study-nk26';

import { clutchData as data } from '../../data/clutchData';
import '../../style/case-study-nk26.css';

const ClutchContent = () => {
  useEffect(() => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  const navSections = [
    { id: 'clutch-overview', label: 'Overview' },
    { id: 'clutch-pivot', label: 'The Pivot' },
    { id: 'clutch-ia', label: 'Architecture' },
    { id: 'clutch-interactions', label: 'Interactions' },
    { id: 'clutch-reflection', label: 'Reflection' }
  ];

  return (
    <div className="case-study-page-nk26" data-case-study="clutch">
      <Navbar />

      {/* Hero — video */}
      <section className="hero-video-nk26" aria-label="Project hero">
        <div className="video-container-nk26">
          <video
            src="/videos/Case Studies/CLUTCH/cover video.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="hero-video-element-nk26"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div className="video-overlay-nk26" aria-hidden="true" />
          <motion.div
            className="hero-content-nk26"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <p className="hero-subtitle-nk26">{data.hero.subtitle}</p>
          </motion.div>
        </div>
      </section>

      <SideNav sections={navSections} />

      <div className="case-study-content-nk26">

        {/* Overview */}
        <GridPatternA id="clutch-overview" sectionLabel="Project overview">
          <GridMain>
            <SectionTitle>{data.overview.title}</SectionTitle>
            {data.overview.paragraphs.map((p, i) => (
              <SectionText key={i}>{p}</SectionText>
            ))}
            <div className="cl-screen-wrapper-nk26" style={{ display: 'flex', justifyContent: 'center' }}>
              <StableLottie src="/lottie/clutch-anim-S2-transition.json" />
            </div>
          </GridMain>

          <GridMeta>
            <MetaItem label="Role" value={data.meta.role} />
            <MetaItem label="Timeline" value={data.meta.timeline} />
            <MetaItem label="Team" value={data.meta.team} />
            <MetaItem label="Platform" value={data.meta.platform} />
            <MetaItem label="Impact" value={data.meta.impact} />
            <MetaItem label="Context" value={data.meta.context} />
          </GridMeta>
        </GridPatternA>

        {/* The Pivot: V1 to V2 */}
        <GridPatternC id="clutch-pivot" sectionLabel="Design pivot from V1 to V2">
          <SectionTitle full>{data.pivot.title}</SectionTitle>
          {data.pivot.paragraphs.map((p, i) => (
            <SectionText key={i}>{p}</SectionText>
          ))}

          <BeforeAfterSlider
            beforeSrc={data.pivot.before.src}
            afterSrc={data.pivot.after.src}
            beforeAlt={data.pivot.before.alt}
            afterAlt={data.pivot.after.alt}
            caption="V1 (gamified) → V2 (data-first): same brief, completely different philosophy"
          />
        </GridPatternC>

        {/* Information Architecture */}
        <GridPatternB id="clutch-ia" sectionLabel="Information architecture">
          <GridText>
            <SectionTitle>{data.ia.title}</SectionTitle>
            {data.ia.paragraphs.map((p, i) => (
              <SectionText key={i}>{p}</SectionText>
            ))}
          </GridText>

          <GridVisual>
            <ImageWrapper
              src={data.ia.image.src}
              alt={data.ia.image.alt}
              caption={data.ia.image.caption}
              className="img-wrapper-flush-nk26"
              imageClassName="cl-ia-image-nk26"
            />
          </GridVisual>
        </GridPatternB>

        {/* Key Interaction: Expandable Stat Cards */}
        <GridPatternC id="clutch-interactions" sectionLabel="Key interaction patterns">
          <SectionTitle full>{data.expandableCards.title}</SectionTitle>
          {data.expandableCards.paragraphs.map((p, i) => (
            <SectionText key={i}>{p}</SectionText>
          ))}

          <div className="cl-screen-wrapper-nk26" style={{ display: 'flex', justifyContent: 'center' }}>
            <StableLottie src="/lottie/clutch-anim-stat-cards.json" />
          </div>

          <div className="cl-stat-icons-grid-nk26">
            {[
              { icon: '/images/Case Studies/CLUTCH/icons/winners.svg',   stat: 'Winners',    insight: 'Shot-type breakdown — "7 of 11 from net play"' },
              { icon: '/images/Case Studies/CLUTCH/icons/errors.svg',    stat: 'Errors',     insight: 'By shot type — "Backhand drives = 48% of errors"' },
              { icon: '/images/Case Studies/CLUTCH/icons/w-e-ratio.svg', stat: 'W/E Ratio',  insight: 'Semicircle gauge with your avg + tier reference' },
              { icon: '/images/Case Studies/CLUTCH/icons/run.svg',       stat: 'Distance',   insight: '4-player comparison + "62% lateral movement"' },
              { icon: '/images/Case Studies/CLUTCH/icons/calories.svg',  stat: 'Calories',   insight: 'Equivalence — "≈30 min running" + per-set split' },
              { icon: '/images/Case Studies/CLUTCH/icons/avg_rally.svg', stat: 'Avg Rally',  insight: 'Distribution histogram + longest rally with video link' },
            ].map(({ icon, stat, insight }) => (
              <div key={stat} className="cl-stat-icon-item-nk26">
                <img src={icon} alt={stat} className="cl-stat-icon-nk26" />
                <div>
                  <strong className="cl-stat-icon-label-nk26">{stat}</strong>
                  <p className="cl-stat-icon-insight-nk26">{insight}</p>
                </div>
              </div>
            ))}
          </div>
        </GridPatternC>

        {/* Key Interaction: Multi-Select Player Comparison */}
        <GridPatternC sectionLabel="Multi-select player comparison">
          <SectionTitle full>{data.multiSelect.title}</SectionTitle>
          {data.multiSelect.paragraphs.map((p, i) => (
            <SectionText key={i}>{p}</SectionText>
          ))}

          <ImageWrapper
            src={data.multiSelect.image.src}
            alt={data.multiSelect.image.alt}
            caption={data.multiSelect.image.caption}
            className="cl-screen-wrapper-nk26"
            imageClassName="cl-wide-image-nk26"
          />

          <FeatureList items={data.multiSelect.comparisonDetails} />
        </GridPatternC>

        {/* S2: Match Card */}
        <GridPatternA sectionLabel="Match card screen">
          <GridMain>
            <SectionTitle>{data.screens.s2.title}</SectionTitle>
            {data.screens.s2.paragraphs.map((p, i) => (
              <SectionText key={i}>{p}</SectionText>
            ))}
            <div className="cl-screen-wrapper-nk26" style={{ display: 'flex', justifyContent: 'center' }}>
              <StableLottie src="/lottie/clutch-anim-player-comparison.json" />
            </div>
          </GridMain>

          <GridMeta sectionLabel="Match card details">
            <MetaItem label="Players" value="4 per match (2v2)" />
            <MetaItem label="Pairings" value="C(4,2) = 6 combinations" />
            <MetaItem label="Selection States" value="None → 1 → 2 compared" />
            <MetaItem label="Share" value="Static image for WhatsApp/iMessage" />
          </GridMeta>
        </GridPatternA>

        {/* S3: Video Browser */}
        <GridPatternB sectionLabel="Video browser screen">
          <GridText>
            <SectionTitle>{data.screens.s3.title}</SectionTitle>
            {data.screens.s3.paragraphs.map((p, i) => (
              <SectionText key={i}>{p}</SectionText>
            ))}
          </GridText>

          <GridVisual>
            <ImageWrapper
              src={data.screens.s3.shareImage.src}
              alt={data.screens.s3.shareImage.alt}
              caption={data.screens.s3.shareImage.caption}
              className="cl-screen-wrapper-nk26"
              imageClassName="cl-screen-image-nk26"
            />
          </GridVisual>
        </GridPatternB>

        {/* S4: Progress */}
        <GridPatternA sectionLabel="Progress screen">
          <GridMain>
            <SectionTitle>{data.screens.s4.title}</SectionTitle>
            {data.screens.s4.paragraphs.map((p, i) => (
              <SectionText key={i}>{p}</SectionText>
            ))}
            <ImageWrapper
              src={data.screens.s4.image.src}
              alt={data.screens.s4.image.alt}
              caption={data.screens.s4.image.caption}
              className="cl-screen-wrapper-nk26"
              imageClassName="cl-screen-image-nk26"
            />

            <SubsectionTitle>Smart Match: The Retention Loop</SubsectionTitle>
            <SectionText>
              The smart match suggestion recommends an opponent based on complementary weaknesses —
              a backhand specialist paired against someone working on their backhand defense.
              It closes the loop from reviewing your game to booking the next one, keeping players coming back.
            </SectionText>
            <ImageWrapper
              src={data.screens.s4.smartMatchImage.src}
              alt={data.screens.s4.smartMatchImage.alt}
              caption={data.screens.s4.smartMatchImage.caption}
              className="cl-screen-wrapper-nk26"
              imageClassName="cl-screen-image-nk26"
            />
          </GridMain>

          <GridMeta sectionLabel="Progress details">
            <MetaItem label="Clutch Score" value="Composite performance metric" />
            <MetaItem label="Trend" value="Last 10 matches with tier boundaries" />
            <MetaItem label="Smart Match" value="Opponent suggestion based on weaknesses" />
            <MetaItem label="Retention" value="Review → Improve → Book → Play loop" />
          </GridMeta>
        </GridPatternA>

        {/* Court Data */}
        <GridPatternB sectionLabel="Court data visualizations">
          <GridText>
            <SectionTitle>{data.courtData.title}</SectionTitle>
            {data.courtData.paragraphs.map((p, i) => (
              <SectionText key={i}>{p}</SectionText>
            ))}
          </GridText>

          <GridVisual>
            <ImageWrapper
              src={data.courtData.image.src}
              alt={data.courtData.image.alt}
              caption={data.courtData.image.caption}
              className="cl-court-wrapper-nk26"
              imageClassName="cl-court-image-nk26"
            />
          </GridVisual>
        </GridPatternB>

        {/* Reflection */}
        <GridPatternC id="clutch-reflection" sectionLabel="Reflection and learnings">
          <SectionTitle full>{data.reflection.title}</SectionTitle>
          {data.reflection.paragraphs.map((p, i) => (
            <SectionText key={i}>{p}</SectionText>
          ))}

          <GridNested>
            <NestedMain>
              {data.reflection.learnings.map((learning, i) => (
                <React.Fragment key={i}>
                  <SubsectionTitle>{`${i + 1}. ${learning.title}`}</SubsectionTitle>
                  <SectionText>{learning.description}</SectionText>
                </React.Fragment>
              ))}
            </NestedMain>

            <NestedAside>
              <DesignRationaleCard
                title="The Core Tension"
                items={[
                  <><strong>Data density:</strong> Players want every number — progressive disclosure solves this</>,
                  <><strong>Social sharing:</strong> Every screen had to be screenshot-worthy for the group chat</>,
                  <><strong>Competitive edge:</strong> Not encouragement — ammunition for banter and self-improvement</>
                ]}
              />
            </NestedAside>
          </GridNested>
        </GridPatternC>

      </div>

      {/* Next Project */}
      <NextProjectTeaser
        title={data.nextProject.title}
        description={data.nextProject.description}
        href={data.nextProject.href}
        videoSrc={data.nextProject.videoSrc}
        coverImage={data.nextProject.coverImage}
      />
    </div>
  );
};

const Clutch = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <ClutchContent />
  </motion.div>
);

export default Clutch;
