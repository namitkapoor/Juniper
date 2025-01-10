import React from 'react';
import ProcessFlow from './ProcessFlow';
import DecisionCriteria from './DecisionCriteria';
import '../style/phase-content.css';
import ImplementationPlan from './ImplementationPlan';
import ResearchInsights from './ResearchInsights';
import SolutionFramework from './SolutionFramework';

const PhaseContent = ({ content, contentType, projectId }) => {
  if (!content) return null;

  // Get project-specific content if it exists
  const projectContent = content[projectId] || content;

  const renderSection = (section) => {
    switch (section.type) {
      case 'requirements':
        return (
          <div className="section requirements">
            <h5 className="requirements-title">Design Requirements</h5>
            <ResearchInsights 
              items={section.items}
              projectId={projectId}
            />
          </div>
        );

      case 'analysis':
      case 'concepts':
      case 'wireframes':
        return <SolutionFramework 
          content={section.content} 
          type={section.type}
          projectId={projectId}
        />;

      case 'process':
        return <ProcessFlow steps={section.steps} />;

      case 'decisions':
        return <DecisionCriteria 
          content={section.content} 
          projectId={projectId}
        />;

      case 'prototypes':
      case 'usabilityTesting':
      case 'presentation':
      case 'reflection':
        return <ImplementationPlan content={{ sections: [section] }} />;

      case 'implementation':
        return <ImplementationPlan content={section.content} />;

      default:
        return null;
    }
  };

  return (
    <div className={`phase-content ${contentType}`}>
      <h3>{projectContent.title}</h3>
      {projectContent.summary && <p className="summary">{projectContent.summary}</p>}
      
      <div className="sections">
        {projectContent.sections?.map((section, index) => (
          <div key={index} className={`section ${section.type}`}>
            {renderSection(section)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhaseContent; 