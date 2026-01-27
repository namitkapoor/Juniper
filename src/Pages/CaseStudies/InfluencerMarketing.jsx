import React, { useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';

// Import NK26 components
import {
  HeroVideo,
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
  TechnicalNote,
  TechNoteText,
  BeforeAfterSlider,
  ContentText,
  UserQuote,
  FeatureList,
  LottieAnimation,
  ResultsGrid,
  NextProjectTeaser,
  PainPointsGrid,
  DesignRationaleCard,
  MicroInteractionShowcase
} from '../../components/case-study-nk26';

// Import data
import { influencerMarketingData as data } from '../../data/influencerMarketingData';

// Import styles
import '../../style/case-study-nk26.css';

const InfluencerMarketing = () => {
  // Scroll to top when case study loads
  useEffect(() => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className="case-study-page-nk26">
      <Navbar />

      {/* Hero Section */}
      <HeroVideo
        videoSrc={data.hero.videoSrc}
        webmSrc={data.hero.webmSrc}
        posterSrc={data.hero.posterSrc}
        title={data.hero.title}
        subtitle={data.hero.subtitle}
      />

      {/* Overview Section - Pattern A */}
      <GridPatternA sectionLabel="Project overview">
        <GridMain>
          <SectionTitle>{data.overview.title}</SectionTitle>
          {data.overview.paragraphs.map((p, i) => (
            <SectionText key={i}>{p}</SectionText>
          ))}
          <ImageWrapper
            src={data.overview.image.src}
            alt={data.overview.image.alt}
            caption={data.overview.image.caption}
            imageClassName="im-overview-image-nk26"
          />
        </GridMain>

        <GridMeta>
          <MetaItem label="Role" value={data.meta.role} />
          <MetaItem label="Timeline" value={data.meta.timeline} />
          <MetaItem label="Team" value={data.meta.team} />
          <MetaItem label="Platform" value={data.meta.platform} />
          <MetaItem label="Impact" value={data.meta.impact} />
          <MetaItem label="Honest Take" value={data.meta.challenge} />
        </GridMeta>
      </GridPatternA>

      {/* Pain Points Section - Pattern B */}
      <GridPatternB sectionLabel="User pain points">
        <GridText>
          <SectionTitle>The Status Visibility Problem</SectionTitle>
          <SectionText>
            Campaign managers needed to track dozens of influencers across different stages.
            The text-heavy interface made it impossible to scan quickly.
          </SectionText>
        </GridText>

        <GridVisual>
          <PainPointsGrid painPoints={data.painPoints} />
        </GridVisual>
      </GridPatternB>

      {/* Results - Pattern A - Moved here after Pain Points */}
      <GridPatternA sectionLabel="Results and impact">
        <GridMain>
          <SectionTitle>The Results (With Honesty)</SectionTitle>
          <SectionText>
            The static version—without elaborate animations—delivered strong results.
            This reinforced that spatial layout and color, not motion, drove the improvements.
          </SectionText>

          <ResultsGrid results={data.results} />

          <SubsectionTitle>What Users Said</SubsectionTitle>
          {data.userQuotes.map((quote, i) => (
            <UserQuote key={i} cite={quote.cite} image={quote.image}>
              {quote.text}
            </UserQuote>
          ))}
        </GridMain>

        <GridMeta sectionLabel="Results metadata">
          <MetaItem label="Measurement Period" value={data.resultsMeta.measurementPeriod} />
          <MetaItem label="Baseline" value={data.resultsMeta.baseline} />
          <MetaItem label="Test Participants" value={data.resultsMeta.testParticipants} />
          <MetaItem label="Methodology" value={data.resultsMeta.methodology} />
        </GridMeta>
      </GridPatternA>

      {/* Subway Metaphor - Pattern B */}
      <GridPatternB sectionLabel="Design concept">
        <GridText>
          <SectionTitle>{data.subwayMetaphor.title}</SectionTitle>
          <SectionText>{data.subwayMetaphor.intro}</SectionText>

          <FeatureList
            items={data.subwayMetaphor.explanation.map(item => item)}
          />
        </GridText>

        <GridVisual>
          <ImageWrapper
            src={data.subwayMetaphor.video.src}
            alt={data.subwayMetaphor.video.alt}
            caption={data.subwayMetaphor.video.caption}
            imageClassName="im-subway-image-nk26"
            type="video"
            autoPlay
          />
        </GridVisual>
      </GridPatternB>

      {/* Motion Design Explorations - Pattern C */}
      <GridPatternC sectionLabel="Motion design explorations">
        <SectionTitle full>{data.motionExplorations.title}</SectionTitle>
        <SectionText>{data.motionExplorations.intro}</SectionText>

        {data.motionExplorations.explorations.map((exploration, i) => (
          <div key={i} className="motion-exploration-nk26">
            <GridNested>
              <NestedMain>
                <SubsectionTitle>{exploration.title}</SubsectionTitle>
                <SectionText>{exploration.description}</SectionText>

                <TechnicalNote>
                  <TechNoteText>{exploration.technicalNote}</TechNoteText>
                </TechnicalNote>

                <div className="verdict-badge-nk26" data-verdict={exploration.verdict === 'Didn\'t ship' ? 'cut' : 'shipped'}>
                  <strong>{exploration.verdict}</strong>
                </div>
                <SectionText><em>Why: {exploration.reason}</em></SectionText>
              </NestedMain>

              <NestedAside>
                <LottieAnimation
                  animationPath={exploration.animationPath}
                  loop={true}
                  ariaLabel={`Animation demonstration of ${exploration.title}`}
                />
              </NestedAside>
            </GridNested>
          </div>
        ))}
      </GridPatternC>

      {/* Technical Reality Check - Pattern C */}
      <GridPatternC sectionLabel="Technical constraints">
        <SectionTitle full>{data.technicalReality.title}</SectionTitle>
        <SectionText>{data.technicalReality.intro}</SectionText>

        <div className="reality-check-grid-nk26">
          {data.technicalReality.reasons.map((reason, i) => (
            <div key={i} className="reality-check-card-nk26">
              <SubsectionTitle>{reason.title}</SubsectionTitle>
              <SectionText>{reason.description}</SectionText>
            </div>
          ))}
        </div>
      </GridPatternC>

      {/* What Actually Shipped - Before/After */}
      <GridPatternA sectionLabel="Final design comparison">
        <GridMain>
          <SectionTitle>{data.whatShipped.title}</SectionTitle>
          <SectionText>{data.whatShipped.intro}</SectionText>

          <BeforeAfterSlider
            beforeSrc={data.whatShipped.beforeImage.src}
            afterSrc={data.whatShipped.afterImage.src}
            beforeAlt={data.whatShipped.beforeImage.alt}
            afterAlt={data.whatShipped.afterImage.alt}
            caption={data.whatShipped.caption}
          />
        </GridMain>

        <GridMeta sectionLabel="Iteration statistics">
          <MetaItem label="Design Versions" value={data.iterationStats.totalIterations} />
          <MetaItem label="Motion Concepts" value={data.iterationStats.motionConcepts} />
          <MetaItem label="Animations Shipped" value={data.iterationStats.motionShipped} />
          <MetaItem label="Time on Motion" value={data.iterationStats.designTime} />
        </GridMeta>
      </GridPatternA>

      {/* Micro-interactions That Shipped - Pattern C */}
      <GridPatternC sectionLabel="Micro-interactions that shipped">
        <SectionTitle full>What Actually Shipped: Micro-Interactions</SectionTitle>
        <SectionText>
          Instead of elaborate animations, we shipped subtle CSS-based micro-interactions.
          Each one serves a specific purpose without overwhelming the interface.
        </SectionText>

        <MicroInteractionShowcase interactions={data.microInteractions} />
      </GridPatternC>

      {/* Design Iterations - Pattern A */}
      <GridPatternA sectionLabel="Design iterations">
        <GridMain>
          <SectionTitle>Key Design Iterations</SectionTitle>
          <SectionText>
            Beyond motion explorations, the core visualization went through significant changes.
          </SectionText>

          {data.iterations.map((iteration, i) => (
            <div key={i} className="iteration-container-nk26">
              <SubsectionTitle>{iteration.title}</SubsectionTitle>

              <BeforeAfterSlider
                beforeSrc={iteration.beforeImage.src}
                afterSrc={iteration.afterImage.src}
                beforeAlt={iteration.beforeImage.alt}
                afterAlt={iteration.afterImage.alt}
                caption={iteration.caption}
              />

              <TechnicalNote>
                <TechNoteText>{iteration.technicalNote}</TechNoteText>
              </TechnicalNote>

              <SectionText>
                <strong>The Fix:</strong> {iteration.fix}
              </SectionText>
            </div>
          ))}
        </GridMain>

        <GridMeta>
          <DesignRationaleCard
            title="Motion Graveyard"
            items={data.motionGraveyard.items.map(item =>
              `${item.name}: ${item.whyCut}`
            )}
          />
        </GridMeta>
      </GridPatternA>

      {/* Learnings - Pattern C */}
      <GridPatternC sectionLabel="Learnings">
        <SectionTitle full>Honest Learnings About Motion Design</SectionTitle>

        <GridNested>
          <NestedMain>
            {data.learnings.map((learning, i) => (
              <React.Fragment key={i}>
                <SubsectionTitle>{`${i + 1}. ${learning.title}`}</SubsectionTitle>
                <SectionText>{learning.description}</SectionText>
              </React.Fragment>
            ))}
          </NestedMain>

          <NestedAside>
            <DesignRationaleCard
              title="If I Could Do It Again"
              items={data.retrospective}
            />
          </NestedAside>
        </GridNested>
      </GridPatternC>

      {/* Next Project */}
      <NextProjectTeaser
        title={data.nextProject.title}
        description={data.nextProject.description}
        href={data.nextProject.href}
      />
    </div>
  );
};

export default InfluencerMarketing;
