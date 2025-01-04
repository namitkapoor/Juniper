import React, { useState } from 'react';

const TaskAnalysis = ({ taskAnalysis }) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState(0);

  return (
    <div className="task-analysis">
      <h4>{taskAnalysis.title}</h4>
      <p className="analysis-description">{taskAnalysis.description}</p>

      <div className="workflow-selector">
        {taskAnalysis.workflows.map((workflow, index) => (
          <button
            key={index}
            className={`workflow-tab ${selectedWorkflow === index ? 'active' : ''}`}
            onClick={() => setSelectedWorkflow(index)}
          >
            {workflow.name}
          </button>
        ))}
      </div>

      <div className="workflow-content">
        <div className="workflow-card">
          <h5>{taskAnalysis.workflows[selectedWorkflow].name}</h5>
          
          {taskAnalysis.workflows[selectedWorkflow].image && (
            <div className="workflow-image">
              <img 
                src={taskAnalysis.workflows[selectedWorkflow].image.url} 
                alt={taskAnalysis.workflows[selectedWorkflow].image.caption}
              />
              <p className="image-caption">
                {taskAnalysis.workflows[selectedWorkflow].image.caption}
              </p>
            </div>
          )}

          <ol className="workflow-steps">
            {taskAnalysis.workflows[selectedWorkflow].steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
          
          <div className="pain-points">
            Pain Points: {taskAnalysis.workflows[selectedWorkflow].painPoints}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskAnalysis; 