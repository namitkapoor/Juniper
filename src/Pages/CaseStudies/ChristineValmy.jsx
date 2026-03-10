import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
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
  BentoGrid,
  FeatureList,
  LottieAnimation,
  ResultsGrid,
  NextProjectTeaser,
  PainPointsGrid,
  DesignRationaleCard,
  TechStackGrid,
  MicroInteractionShowcase,
  SideNav
} from '../../components/case-study-nk26';

// Import data
import { christineValmyData as data } from '../../data/christineValmyData';

// Import styles
import '../../style/case-study-nk26.css';

const ChristineValmy = () => {
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
            <SubsectionTitle as="h4">What We Kept:</SubsectionTitle>
            <FeatureList
              items={block.kept.map(k => (
                <><strong>{k.title}</strong> - {k.description}</>
              ))}
            />
          </>
        )}
        {block.cut && (
          <>
            <SubsectionTitle as="h4">What We Cut:</SubsectionTitle>
            <ul className="feature-list-nk26">
              {block.cut.map((item, i) => (
                <li key={i} className="feature-item-nk26" style={{ textDecoration: 'line-through', opacity: 0.5 }}>
                  {item}
                </li>
              ))}
            </ul>
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
    { id: 'cv-overview', label: 'Overview' },
    { id: 'cv-initial-vision', label: 'Initial Vision' },
    { id: 'cv-research', label: 'Research & Pivot' },
    { id: 'cv-iterations', label: 'Iterations' },
    { id: 'cv-solution', label: 'Solution' }
  ];

  return (
    <div className="case-study-page-nk26" data-case-study="christine-valmy">
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
      <GridPatternA id="cv-overview" sectionLabel="Project overview">
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
            imageClassName="cv-overview-image-nk26"
          />
        </GridMain>

        <GridMeta>
          <MetaItem label="Role" value={data.meta.role} />
          <MetaItem label="Timeline" value={data.meta.timeline} />
          <MetaItem label="Team" value={data.meta.team} />
          <MetaItem label="Platform" value={data.meta.platform} />
          <MetaItem label="Impact" value={data.meta.impact} />
          <MetaItem label="Tech Stack" value={data.meta.techStack} />
        </GridMeta>
      </GridPatternA>

      {/* Pain Points Section - Pattern B */}
      <GridPatternB sectionLabel="User pain points">
        <GridText>
          <SectionTitle>Who Was Hurting?</SectionTitle>
          <SectionText>
            Two distinct user groups suffered from the broken enrollment flow.
          </SectionText>
        </GridText>

        <GridVisual>
          <PainPointsGrid painPoints={data.painPoints} />
        </GridVisual>
      </GridPatternB>

      {/* Results - Pattern A - Moved here after Pain Points */}
      <GridPatternA sectionLabel="Project impact and results">
        <GridMain>
          <SectionTitle>Measuring Success</SectionTitle>
          <SectionText>
            We tracked metrics for 3 months post-launch, comparing to the previous
            3 months with the static form.
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
          <MetaItem label="Total Interactions" value={data.resultsMeta.totalInteractions} />
          <MetaItem label="Avg. Session Length" value={data.resultsMeta.avgSessionLength} />
          <MetaItem label="Conversion to Enrollment" value={data.resultsMeta.conversionRate} />
        </GridMeta>
      </GridPatternA>

      {/* Initial Concept Section - Pattern C */}
      <GridPatternC id="cv-initial-vision" sectionLabel="Initial design concepts">
        <SectionTitle full>{data.initialConcept.title}</SectionTitle>

        <GridNested>
          <NestedMain>
            <SectionText>{data.initialConcept.intro}</SectionText>

            {data.initialConcept.concepts.map((concept, i) => (
              <React.Fragment key={i}>
                <SubsectionTitle>{concept.title}</SubsectionTitle>
                <SectionText>{concept.description}</SectionText>
                {concept.lottie ? (
                  <LottieAnimation
                    animationPath={concept.lottie.path}
                    caption={concept.lottie.caption}
                    loop={true}
                  />
                ) : concept.image && (
                  <ImageWrapper
                    src={concept.image.src}
                    alt={concept.image.alt}
                    caption={concept.image.caption}
                    className="img-wrapper-flush-nk26"
                    imageClassName={`cv-concept-${i}-image-nk26`}
                  />
                )}
              </React.Fragment>
            ))}

            <BentoGrid items={data.initialConcept.bentoFeatures} />

            <SectionText>
              Each tile would open a detailed panel AND feed analytics back to
              enrollment officers. They'd know exactly what each student cared about
              before first contact.
            </SectionText>
          </NestedMain>

          <NestedAside>
            <DesignRationaleCard
              title="Why I Thought This Would Work"
              items={data.initialConcept.rationale}
            />
          </NestedAside>
        </GridNested>
      </GridPatternC>

      {/* User Research / Pivot - Sticky Scroll */}
      <StickyScrollSection
        id="cv-research"
        sectionLabel="User research findings and design pivot"
        visualCards={data.userResearch.visualCards}
        contentBlocks={stickyContentBlocks}
      />

      {/* Design Iterations - Pattern A */}
      <GridPatternA id="cv-iterations" sectionLabel="Design iterations and changes">
        <GridMain>
          <SectionTitle>Design Iterations</SectionTitle>
          <SectionText>
            After user research, we went through three major iterations before
            launching. Each change was driven by feedback from students or
            enrollment officers.
          </SectionText>

          {/* Iteration 1 */}
          <div className="iteration-container-nk26">
            <SubsectionTitle>{data.iterations[0].title}</SubsectionTitle>

            <BeforeAfterSlider
              beforeSrc={data.iterations[0].beforeImage.src}
              afterSrc={data.iterations[0].afterImage.src}
              beforeAlt={data.iterations[0].beforeImage.alt}
              afterAlt={data.iterations[0].afterImage.alt}
              caption={data.iterations[0].caption}
            />

            <TechnicalNote>
              <TechNoteText>{data.iterations[0].technicalNote}</TechNoteText>
            </TechnicalNote>

            <SectionText>
              <strong>The Fix:</strong> {data.iterations[0].fix}
            </SectionText>
          </div>

          {/* Iteration 2 */}
          <div className="iteration-container-nk26">
            <SubsectionTitle>{data.iterations[1].title}</SubsectionTitle>

            {data.iterations[1].image ? (
              <ImageWrapper
                src={data.iterations[1].image.src}
                alt={data.iterations[1].image.alt}
                caption={data.iterations[1].image.caption}
                className="cv-iteration-1-wrapper-nk26"
                imageClassName="cv-iteration-1-image-nk26"
              />
            ) : data.iterations[1].videoSrc && (
              <div className="video-comparison-nk26">
                <video
                  className="iteration-video-nk26"
                  src={data.iterations[1].videoSrc}
                  controls
                  playsInline
                  aria-label="Video showing social media icons being moved from sidebar to below chat widget"
                />
              </div>
            )}

            <SectionText>
              <strong>The Insight:</strong> {data.iterations[1].insight}
            </SectionText>
            <SectionText>
              <strong>The Change:</strong> {data.iterations[1].change}
            </SectionText>
            <SectionText>
              <strong>The Result:</strong> {data.iterations[1].result}
            </SectionText>
          </div>

          {/* Iteration 3 */}
          <div className="iteration-container-nk26">
            <SubsectionTitle>{data.iterations[2].title}</SubsectionTitle>

            {data.iterations[2].image ? (
              <ImageWrapper
                src={data.iterations[2].image.src}
                alt={data.iterations[2].image.alt}
                caption={data.iterations[2].image.caption}
                className="img-wrapper-flush-nk26"
                imageClassName="cv-iteration-2-image-nk26"
              />
            ) : data.iterations[2].videoSrc && (
              <div className="video-comparison-nk26">
                <video
                  className="iteration-video-nk26"
                  src={data.iterations[2].videoSrc}
                  controls
                  playsInline
                  aria-label="Video showing Spanish translation interface"
                />
              </div>
            )}

            <SectionText>
              <strong>The Discovery:</strong> {data.iterations[2].discovery}
            </SectionText>
            <SectionText>
              <strong>The Implementation:</strong> {data.iterations[2].implementation}
            </SectionText>

            <TechnicalNote>
              <TechNoteText>{data.iterations[2].technicalNote}</TechNoteText>
            </TechnicalNote>
          </div>
        </GridMain>

        <GridMeta sectionLabel="Iteration statistics">
          <MetaItem label="Total Iterations" value={data.iterationStats.totalIterations} />
          <MetaItem label="User Tests" value={data.iterationStats.userTests} />
          <MetaItem label="Features Cut" value={data.iterationStats.featuresCut} />
          <MetaItem label="Features Added" value={data.iterationStats.featuresAdded} />
        </GridMeta>
      </GridPatternA>

      {/* Final Design - Pattern C (Full Width) */}
      <GridPatternC id="cv-solution" sectionLabel="Final design solution">
        <SectionTitle full>{data.finalDesign.title}</SectionTitle>
        <SectionText>{data.finalDesign.intro}</SectionText>

        <GridNested>
          <NestedMain>
            <SubsectionTitle>Three Core Components</SubsectionTitle>
            <ol className="numbered-list-nk26 cv-final-components-nk26">
              {data.finalDesign.components.map((comp, i) => (
                <li key={i}>
                  <strong>{comp.title}</strong> - {comp.description}
                </li>
              ))}
            </ol>
          </NestedMain>
          <NestedAside>
            <TechnicalNote>
              <TechNoteText>
                Final build uses standard CSS Flexbox for responsiveness, ensuring the
                chat widget and social panel adapt to all screen sizes.
              </TechNoteText>
            </TechnicalNote>
          </NestedAside>
        </GridNested>

        <div className="cv-final-showcase-nk26">
          <ImageWrapper
            src={data.finalDesign.desktopImage.src}
            alt={data.finalDesign.desktopImage.alt}
            caption={data.finalDesign.desktopImage.caption}
            className="cv-final-desktop-wrapper-nk26"
            imageClassName="cv-final-desktop-image-nk26"
          />
          <ImageWrapper
            src={data.finalDesign.mobileImage.src}
            alt={data.finalDesign.mobileImage.alt}
            caption={data.finalDesign.mobileImage.caption}
            className="cv-final-mobile-wrapper-nk26"
            imageClassName="cv-final-mobile-image-nk26"
          />
        </div>
      </GridPatternC>

      {/* Micro-interactions - Pattern C */}
      <GridPatternC sectionLabel="Micro-interactions and animations">
        <SectionTitle full>Micro-Interactions That Matter</SectionTitle>
        <SectionText>
          Even in a simplified design, small details create polish and guide users
          through the flow.
        </SectionText>

        <MicroInteractionShowcase interactions={data.microInteractions} />
      </GridPatternC>

      {/* Technical Implementation - Pattern C */}
      <GridPatternC sectionLabel="Technical implementation details">
        <SectionTitle full>Building for WordPress</SectionTitle>
        <SectionText>
          The final product is a WordPress plugin that non-technical staff can install
          and configure through the admin dashboard.
        </SectionText>

        <TechStackGrid categories={data.techStack} />

        <TechnicalNote label="Key Technical Challenges">
          {data.technicalChallenges.map((challenge, i) => (
            <TechNoteText key={i}>
              <strong>{challenge.title}:</strong> {challenge.description}
            </TechNoteText>
          ))}
        </TechnicalNote>
      </GridPatternC>

      {/* Learnings - Pattern C */}
      <GridPatternC sectionLabel="Project learnings and reflections">
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
        videoSrc={data.nextProject.videoSrc}
        coverImage={data.nextProject.coverImage}
      />
    </div>
  );
};

export default ChristineValmy;
