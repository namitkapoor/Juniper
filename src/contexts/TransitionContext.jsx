import { createContext, useContext, useState } from 'react';

const TransitionContext = createContext();

export function TransitionProvider({ children }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionData, setTransitionData] = useState(null);

  const startTransition = (data) => {
    setTransitionData(data);
    setIsTransitioning(true);
  };

  const endTransition = () => {
    setIsTransitioning(false);
    // Clear transition data after a delay to allow exit animation
    setTimeout(() => setTransitionData(null), 500);
  };

  return (
    <TransitionContext.Provider value={{ isTransitioning, transitionData, startTransition, endTransition }}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const context = useContext(TransitionContext);
  if (context === undefined) {
    throw new Error('useTransition must be used within a TransitionProvider');
  }
  return context;
}
