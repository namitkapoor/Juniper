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
  StickyScrollSection,
  ContentText,
  UserQuote,
  FeatureList,
  LottieAnimation,
  ResultsGrid,
  NextProjectTeaser,
  PainPointsGrid,
  DesignRationaleCard,
  MicroInteractionShowcase,
  SideNav
} from '../../components/case-study-nk26';

// Import data
import { manageFarmsData as data } from '../../data/manageFarmsData';

// Import styles
import '../../style/case-study-nk26.css';

const ManageFarms = () => {
  // Scroll to top when case study loads
  useEffect(() => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  // Build content blocks for sticky scroll section
  const stickyContentBlocks = data.userResearch.contentBlocks.map((block) => ({
    trigger: block.trigger,
    title: block.title,
    content: (
      <>
        {block.paragraphs?.map((p, i) => (
          <ContentText key={i}>{p}</ContentText>
        ))}
        {block.highlight && (
          <SectionText><strong>{block.highlight}</strong></SectionText>
        )}
        {block.quote && (
          <UserQuote cite={block.quote.cite} image={block.quote.image}>{block.quote.text}</UserQuote>
        )}
        {block.findings && (
          <FeatureList
            items={block.findings.map(f => (
              <><strong>{f.stat}</strong> - {f.description}</>
            ))}
          />
        )}
        {block.kept && (
          <>
            <FeatureList
              items={block.kept.map(k => (
                <><strong>{k.title}</strong> - {k.description}</>
              ))}
            />
          </>
        )}
        {block.lesson && (
          <ContentText><em>{block.lesson}</em></ContentText>
        )}
      </>
    )
  }));

  // Define nav sections (max 5)
  const navSections = [
    { id: 'mf-overview', label: 'Overview' },
    { id: 'mf-research', label: 'Research' },
    { id: 'mf-principles', label: 'Principles' },
    { id: 'mf-iterations', label: 'Iterations' },
    { id: 'mf-solution', label: 'Solution' }
  ];

  return (
    <div className="case-study-page-nk26" data-case-study="manage-farms">
      <Navbar />

      {/* Hero Section */}
      <HeroVideo
        videoSrc={data.hero.videoSrc}
        webmSrc={data.hero.webmSrc}
        posterSrc={data.hero.posterSrc}
        title={data.hero.title}
        subtitle={data.hero.subtitle}
      />

      {/* Side Navigation */}
      <SideNav sections={navSections} />

      {/* Main Content Area */}
      <div className="case-study-content-nk26">

      {/* Overview Section - Pattern A */}
      <GridPatternA id="mf-overview" sectionLabel="Project overview">
        <GridMain>
          <SectionTitle>{data.overview.title}</SectionTitle>
          {data.overview.paragraphs.map((p, i) => (
            <SectionText key={i}>{p}</SectionText>
          ))}
          <ImageWrapper
            src={data.overview.image.src}
            alt={data.overview.image.alt}
            caption={data.overview.image.caption}
            imageClassName="mf-overview-image-nk26"
          />
        </GridMain>

        <GridMeta>
          <MetaItem label="Role" value={data.meta.role} />
          <MetaItem label="Timeline" value={data.meta.timeline} />
          <MetaItem label="Team" value={data.meta.team} />
          <MetaItem label="Platform" value={data.meta.platform} />
          <MetaItem label="Impact" value={data.meta.impact} />
          <MetaItem label="Methods" value={data.meta.methods} />
        </GridMeta>
      </GridPatternA>

      {/* Pain Points Section - Pattern B */}
      <GridPatternB sectionLabel="User pain points">
        <GridText>
          <SectionTitle>Understanding the Problem</SectionTitle>
          <SectionText>
            Two perspectives revealed why the existing app failed in the field.
          </SectionText>
        </GridText>

        <GridVisual>
          <PainPointsGrid painPoints={data.painPoints} />
        </GridVisual>
      </GridPatternB>

      {/* Results - Pattern A - Moved here after Understanding the Problem */}
      <GridPatternA sectionLabel="Results and impact">
        <GridMain>
          <SectionTitle>Measuring Success</SectionTitle>
          <SectionText>
            We measured impact through in-field usability testing and post-launch analytics.
          </SectionText>

          <ResultsGrid results={data.results} />

          <SubsectionTitle>What Farmers Said</SubsectionTitle>
          {data.userQuotes.map((quote, i) => (
            <UserQuote key={i} cite={quote.cite} image={quote.image}>
              {quote.text}
            </UserQuote>
          ))}
        </GridMain>

        <GridMeta sectionLabel="Results metadata">
          <MetaItem label="Measurement Period" value={data.resultsMeta.measurementPeriod} />
          <MetaItem label="Test Participants" value={data.resultsMeta.testParticipants} />
          <MetaItem label="Baseline" value={data.resultsMeta.baseline} />
          <MetaItem label="Methodology" value={data.resultsMeta.methodology} />
        </GridMeta>
      </GridPatternA>

      {/* User Research / Insights - Sticky Scroll */}
      <StickyScrollSection
        id="mf-research"
        sectionLabel="Field research and design principles"
        visualCards={data.userResearch.visualCards}
        contentBlocks={stickyContentBlocks}
      />

      {/* Design Principles - Pattern C */}
      <GridPatternC id="mf-principles" sectionLabel="Design principles">
        <SectionTitle full>Four Principles for the Field</SectionTitle>
        <SectionText>
          Every design decision was evaluated against these principles derived from our research.
        </SectionText>

        <div className="design-principles-grid-nk26">
          {data.designPrinciples.map((principle, i) => (
            <div key={i} className="design-principle-card-nk26">
              <div className="design-principle-header-nk26">
                {principle.icon && (
                  <div className="design-principle-icon-nk26">
                    <img src={principle.icon} alt="" aria-hidden="true" />
                  </div>
                )}
                <SubsectionTitle>{principle.title}</SubsectionTitle>
              </div>
              <SectionText>{principle.description}</SectionText>
              <TechnicalNote>
                <TechNoteText><strong>Example:</strong> {principle.example}</TechNoteText>
              </TechnicalNote>
            </div>
          ))}
        </div>
      </GridPatternC>

      {/* Map View Design - Pattern B */}
      <GridPatternB sectionLabel="Map view design">
        <GridText>
          <SectionTitle>{data.mapView.title}</SectionTitle>
          <SectionText>{data.mapView.intro}</SectionText>

          {data.mapView.features.map((feature, i) => (
            <React.Fragment key={i}>
              <SubsectionTitle>{feature.title}</SubsectionTitle>
              <SectionText>{feature.description}</SectionText>
            </React.Fragment>
          ))}
        </GridText>

        <GridVisual>
          <ImageWrapper
            src={data.mapView.image.src}
            alt={data.mapView.image.alt}
            caption={data.mapView.image.caption}
            imageClassName="mf-mapview-image-nk26"
          />
        </GridVisual>
      </GridPatternB>

      {/* Design Iterations - Pattern A */}
      <GridPatternA id="mf-iterations" sectionLabel="Design iterations">
        <GridMain>
          <SectionTitle>Design Iterations</SectionTitle>
          <SectionText>
            Each iteration was tested with real farmers in actual field conditions.
            Here are three key changes that made the biggest impact.
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

        <GridMeta sectionLabel="Iteration statistics">
          <MetaItem label="Total Iterations" value={data.iterationStats.totalIterations} />
          <MetaItem label="User Tests" value={data.iterationStats.userTests} />
          <MetaItem label="Features Cut" value={data.iterationStats.featuresCut} />
          <MetaItem label="Accessibility" value={data.iterationStats.accessibilityScore} />
        </GridMeta>
      </GridPatternA>

      {/* Micro-interactions - Pattern C */}
      <GridPatternC sectionLabel="Micro-interactions">
        <SectionTitle full>Micro-Interactions for the Field</SectionTitle>
        <SectionText>
          Every animation serves a purpose: confirming actions, providing feedback,
          and reducing uncertainty when using the app with dirty hands or in bright sunlight.
        </SectionText>

        <MicroInteractionShowcase interactions={data.microInteractions} />
      </GridPatternC>

      {/* Accessibility Features - Pattern C */}
      <GridPatternC sectionLabel="Accessibility features">
        <SectionTitle full>Built for Everyone</SectionTitle>
        <SectionText>
          Accessibility features designed for farmers with constraints became
          "everyone features" that improved the experience for all users.
        </SectionText>

        <div className="accessibility-grid-nk26">
          {data.accessibilityFeatures.map((feature, i) => (
            <div key={i} className="accessibility-card-nk26">
              <SubsectionTitle>{feature.title}</SubsectionTitle>
              <SectionText>{feature.description}</SectionText>
            </div>
          ))}
        </div>
      </GridPatternC>

      {/* Final Design - Pattern C */}
      <GridPatternC id="mf-solution" sectionLabel="Final design">
        <SectionTitle full>{data.finalDesign.title}</SectionTitle>
        <SectionText>{data.finalDesign.intro}</SectionText>

        <div className="final-screens-grid-nk26">
          {data.finalDesign.screens.map((screen, i) => (
            <ImageWrapper
              key={i}
              src={screen.src}
              alt={screen.alt}
              caption={screen.caption}
              imageClassName={`mf-final-screen-${i}-nk26`}
            />
          ))}
        </div>
      </GridPatternC>

      {/* Learnings - Pattern C */}
      <GridPatternC sectionLabel="Learnings">
        <SectionTitle full>What I Learned</SectionTitle>

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

      </div>
      {/* End case-study-content-nk26 */}

      {/* Next Project */}
      <NextProjectTeaser
        title={data.nextProject.title}
        description={data.nextProject.description}
        href={data.nextProject.href}
      />
    </div>
  );
};

export default ManageFarms;
