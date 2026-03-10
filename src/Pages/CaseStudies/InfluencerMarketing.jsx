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
  ContentText,
  UserQuote,
  FeatureList,
  ResultsGrid,
  NextProjectTeaser,
  PainPointsGrid,
  DesignRationaleCard,
  SideNav
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

  // Define nav sections (max 5)
  const navSections = [
    { id: 'im-overview', label: 'Overview' },
    { id: 'im-results', label: 'Results' },
    { id: 'im-discovery', label: 'Discovery' },
    { id: 'im-design', label: 'Design' },
    { id: 'im-prototypes', label: 'Prototypes' }
  ];

  return (
    <div className="case-study-page-nk26" data-case-study="influencer-marketing">
      <Navbar />

      {/* Hero Section */}
      <HeroVideo
        videoSrc={data.hero.videoSrc}
        posterSrc={data.hero.posterSrc}
        title={data.hero.title}
        subtitle={data.hero.subtitle}
      />

      {/* Side Navigation */}
      <SideNav sections={navSections} />

      {/* Main Content Area */}
      <div className="case-study-content-nk26">

        {/* Overview Section - Pattern A */}
        <GridPatternA id="im-overview" sectionLabel="Project overview">
          <GridMain>
            <SectionTitle>{data.overview.title}</SectionTitle>
            {data.overview.paragraphs.map((p, i) => (
              <SectionText key={i}>{p}</SectionText>
            ))}
            <ImageWrapper
              src={data.overview.image.src}
              alt={data.overview.image.alt}
              caption={data.overview.image.caption}
              className="img-wrapper-flush-nk26"
              imageClassName="im-overview-image-nk26"
            />
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

        {/* Pain Points Section - Pattern B */}
        <GridPatternB sectionLabel="User pain points">
          <GridText>
            <SectionTitle>The Status Visibility Problem</SectionTitle>
            <SectionText>
              Small business owners needed to track influencers across different campaign stages.
              The original 5-tab interface made it impossible to see progress at a glance.
            </SectionText>
          </GridText>

          <GridVisual>
            <PainPointsGrid painPoints={data.painPoints} />
          </GridVisual>
        </GridPatternB>

        {/* Results - Pattern A - Moved after pain points */}
        <GridPatternA id="im-results" sectionLabel="Results and impact">
          <GridMain>
            <SectionTitle>Results</SectionTitle>
            <ResultsGrid results={data.results} />

            <SubsectionTitle>What Users Said</SubsectionTitle>
            {data.userQuotes.map((quote, i) => (
              <UserQuote key={i} cite={quote.cite}>
                {quote.text}
              </UserQuote>
            ))}
          </GridMain>

          <GridMeta>
            <DesignRationaleCard
              title="Key Findings"
              items={data.usabilityTesting.keyFindings}
            />
          </GridMeta>
        </GridPatternA>

        {/* Problem Discovery - Pattern B (consolidated) */}
        <GridPatternB id="im-discovery" sectionLabel="Problem discovery">
          <GridText>
            <SectionTitle>{data.problemDiscovery.title}</SectionTitle>
            <SectionText>{data.problemDiscovery.intro}</SectionText>

            <div className="problem-cards-nk26">
              {data.problemDiscovery.keyProblems.map((problem, i) => (
                <div key={i} className="problem-card-nk26">
                  {problem.icon && (
                    <div className="problem-icon-nk26">
                      <img src={problem.icon} alt="" />
                    </div>
                  )}
                  <strong>{problem.title}</strong>
                  <p>{problem.problem}</p>
                  <p className="evidence-nk26"><em>{problem.evidence}</em></p>
                </div>
              ))}
            </div>

            <TechnicalNote>
              <TechNoteText>{data.problemDiscovery.insight}</TechNoteText>
            </TechnicalNote>
          </GridText>

          <GridVisual>
            {data.problemDiscovery.video && (
              <ImageWrapper
                src={data.problemDiscovery.video.src}
                alt="Original interface task flow"
                caption={data.problemDiscovery.video.caption}
                type="video"
                autoPlay
                loop
                muted
                className="img-wrapper-flush-nk26"
              />
            )}
            <div className="metrics-card-nk26" style={{ marginTop: 'var(--space-xl-nk26)' }}>
              <MetaItem label="Participants" value={data.problemDiscovery.metrics.participants} />
              <MetaItem label="User Type" value={data.problemDiscovery.metrics.userType} />
              <MetaItem label="Avg Tab Switches" value={data.problemDiscovery.metrics.avgTabSwitches} />
            </div>
          </GridVisual>
        </GridPatternB>

        {/* Design Decisions - Pattern A */}
        <GridPatternA id="im-design" sectionLabel="Design decisions">
          <GridMain>
            <SectionTitle>{data.designDecisions.title}</SectionTitle>
            <SectionText>{data.designDecisions.subtitle}</SectionText>

            {/* Summary Video */}
            {data.designDecisions.summaryVideo && (
              <ImageWrapper
                src={data.designDecisions.summaryVideo.src}
                alt="Redesign walkthrough"
                caption={data.designDecisions.summaryVideo.caption}
                type="video"
                autoPlay
                loop
                muted
                className="img-wrapper-flush-nk26 redesign-video-nk26"
              />
            )}

            {/* Iteration 1 */}
            <SubsectionTitle>{data.designDecisions.iteration1.title}</SubsectionTitle>
            <SectionText><strong>Problem:</strong> {data.designDecisions.iteration1.problem}</SectionText>
            <SectionText><strong>Decision:</strong> {data.designDecisions.iteration1.decision}</SectionText>

            <ImageWrapper
              src={data.designDecisions.iteration1.beforeImage}
              alt="Tab consolidation comparison"
              caption={data.designDecisions.iteration1.result}
              className="img-wrapper-flush-nk26"
            />

            <TechnicalNote>
              <TechNoteText>{data.designDecisions.iteration1.metric}</TechNoteText>
            </TechnicalNote>

            {/* Iteration 2 */}
            <SubsectionTitle>{data.designDecisions.iteration2.title}</SubsectionTitle>
            <SectionText><strong>Problem:</strong> {data.designDecisions.iteration2.problem}</SectionText>
            <SectionText><strong>Decision:</strong> {data.designDecisions.iteration2.decision}</SectionText>

            {data.designDecisions.iteration2.changes.map((change, i) => (
              <div key={i} className="change-block-nk26">
                <strong>{change.title}</strong>
                {change.tabs && (
                  <FeatureList items={change.tabs} />
                )}
                {change.description && <SectionText>{change.description}</SectionText>}
                {change.milestones && (
                  <div className="milestones-nk26">
                    {change.milestones.map((m, j) => (
                      <span key={j} className="milestone-pill-nk26">{m}</span>
                    ))}
                  </div>
                )}
                <ImageWrapper
                  src={change.image}
                  alt={change.title}
                  caption={change.reasoning}
                  className="img-wrapper-flush-nk26"
                />
              </div>
            ))}

            <TechnicalNote>
              <TechNoteText>{data.designDecisions.iteration2.keyInsight}</TechNoteText>
            </TechnicalNote>

            <UserQuote cite={data.designDecisions.iteration2.quote.cite}>
              {data.designDecisions.iteration2.quote.text}
            </UserQuote>
          </GridMain>

          <GridMeta>
            <DesignRationaleCard
              title="Design Principles"
              items={data.designDecisions.designPrinciples.map(p =>
                `${p.title}: ${p.description}`
              )}
            />
          </GridMeta>
        </GridPatternA>

        {/* Prototypes Section - Pattern C */}
        <GridPatternC id="im-prototypes" sectionLabel="Shipped prototypes">
          <SectionTitle full>{data.prototypes.title}</SectionTitle>
          <SectionText>{data.prototypes.subtitle}</SectionText>

          <div className="prototypes-grid-nk26">
            {data.prototypes.items.map((prototype, i) => (
              <div key={i} className="prototype-card-nk26">
                <ImageWrapper
                  src={prototype.video}
                  alt={prototype.title}
                  type="video"
                  autoPlay
                  loop
                  muted
                  className={prototype.isLaptop ? 'laptop-video-nk26' : ''}
                />
                <div className="prototype-info-nk26">
                  <strong>{prototype.title}</strong>
                  <p>{prototype.description}</p>
                  <span className="key-feature-nk26">{prototype.keyFeature}</span>
                </div>
              </div>
            ))}
          </div>
        </GridPatternC>

        {/* Micro-interactions - Pattern B */}
        <GridPatternB sectionLabel="Micro-interactions">
          <GridText>
            <SectionTitle>{data.microInteractions.title}</SectionTitle>
            <SectionText>{data.microInteractions.intro}</SectionText>

            {data.microInteractions.items.map((item, i) => (
              <div key={i} className="micro-item-nk26">
                <strong>{item.name}</strong>
                <p>{item.description}</p>
                <span className="micro-type-nk26">{item.type}</span>
                <p className="micro-purpose-nk26">{item.purpose}</p>
              </div>
            ))}

            <TechnicalNote>
              <TechNoteText>{data.microInteractions.note}</TechNoteText>
            </TechnicalNote>
          </GridText>

          <GridVisual>
            {data.microInteractions.video && (
              <ImageWrapper
                src={data.microInteractions.video.src}
                alt="Micro-interactions demo"
                caption={data.microInteractions.video.caption}
                type="video"
                autoPlay
                loop
                muted
                className="img-wrapper-flush-nk26"
              />
            )}
            <div className="usability-stats-nk26" style={{ marginTop: 'var(--space-xl-nk26)' }}>
              <SubsectionTitle>Validation</SubsectionTitle>
              <MetaItem label="Participants" value={data.usabilityTesting.participants} />
              <MetaItem label="Tasks Tested" value={data.usabilityTesting.tasksTested} />
              <MetaItem label="Success Rate" value={data.usabilityTesting.metrics.successRate} />
              <MetaItem label="Click Reduction" value={data.usabilityTesting.metrics.clickReduction} />
              <MetaItem label="Time Saved" value={data.usabilityTesting.metrics.timeSaved} />
            </div>
          </GridVisual>
        </GridPatternB>

        {/* Learnings - Pattern C */}
        <GridPatternC sectionLabel="Learnings">
          <SectionTitle full>Learnings</SectionTitle>

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
        videoSrc={data.nextProject.videoSrc}
        coverImage={data.nextProject.coverImage}
      />
    </div>
  );
};

export default InfluencerMarketing;
