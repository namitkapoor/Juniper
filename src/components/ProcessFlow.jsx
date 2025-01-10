import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PhaseContent from './PhaseContent';
import '../style/process-flow.css';
import { 
  IoLeafOutline,
  IoFlagOutline,
  IoConstructOutline,
  IoCalendarOutline,
  IoNavigateOutline,
  IoTrashOutline
} from 'react-icons/io5';

const ProcessFlow = ({ steps, isNested = false, projectId }) => {
  const [activeStep, setActiveStep] = useState(null);
  
  console.log('ProcessFlow Props:', { steps, isNested, projectId }); // Debug log

  const handleStepClick = (stepId) => {
    setActiveStep(activeStep === stepId ? null : stepId);
  };

  // Map task titles to icons
  const getTaskIcon = (taskTitle) => {
    const iconMap = {
      'Choose a Crop to Plant': IoLeafOutline,
      'Identify and Customize Flags': IoFlagOutline,
      'Find Troubleshoot': IoConstructOutline,
      'Create Harvest Plans': IoCalendarOutline,
      'Navigation': IoNavigateOutline,
      'Unnecessary Features': IoTrashOutline
    };
    
    return iconMap[taskTitle] || null;
  };

  // Format content and inject icons
  const getStepContent = (step) => {
    if (step.content) {
      // Inject icons into findings if they exist
      const contentWithIcons = {
        ...step.content,
        findings: step.content.findings?.map(finding => ({
          ...finding,
          icon: getTaskIcon(finding.category)
        }))
      };

      return {
        title: step.title,
        summary: step.description,
        sections: [
          {
            type: step.type,
            content: contentWithIcons
          }
        ]
      };
    }
    return step.details || step.content;
  };

  return (
    <div className={`process-flow ${isNested ? 'nested' : ''}`}>
      <div className="process-steps">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <motion.div
              className={`process-step ${activeStep === step.id ? 'active' : ''}`}
              data-type={step.type}
              onClick={() => handleStepClick(step.id)}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="step-header">
                <div className="step-icon">
                  <step.icon size={24} />
                </div>
                <h4>{step.title}</h4>
              </div>
              <p>{step.description}</p>
              {step.iterationHint && (
                <div className="iteration-hint">{step.iterationHint}</div>
              )}
            </motion.div>
            {index < steps.length - 1 && <div className="step-connector" />}
          </React.Fragment>
        ))}
      </div>

      <AnimatePresence mode='wait'>
        {activeStep && (
          <motion.div
            className="step-content-wrapper"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="step-content">
              <PhaseContent 
                content={getStepContent(steps.find(step => step.id === activeStep))}
                contentType={steps.find(step => step.id === activeStep)?.type}
                projectId={projectId}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProcessFlow; 