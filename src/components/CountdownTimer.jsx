import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../style/countdown.css';

const CountdownTimer = ({ targetDate }) => {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const target = new Date(targetDate);
      const current = new Date();
      
      // Calculate the time difference in milliseconds
      const timeDifference = target.getTime() - current.getTime();
      
      if (timeDifference <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      // Calculate all time units
      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
      
      setTimeRemaining({ days, hours, minutes, seconds });
    };
    
    calculateTimeRemaining();
    const timer = setInterval(calculateTimeRemaining, 1000);
    
    return () => clearInterval(timer);
  }, [targetDate]);
  
  // Format time units with leading zeros
  const formatTimeUnit = (unit) => {
    return unit < 10 ? `0${unit}` : unit;
  };
  
  // Format the target date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <motion.div 
      className="simplified-countdown-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="countdown-message">
        STEM OPT sponsorship needed before {formatDate(targetDate)}
      </div>
      
      <div className="countdown-units">
        <div className="time-unit">
          <span className="time-value">{formatTimeUnit(timeRemaining.days)}</span>
          <span className="time-label">days</span>
        </div>
        <div className="time-separator">:</div>
        <div className="time-unit">
          <span className="time-value">{formatTimeUnit(timeRemaining.hours)}</span>
          <span className="time-label">hrs</span>
        </div>
        <div className="time-separator">:</div>
        <div className="time-unit">
          <span className="time-value">{formatTimeUnit(timeRemaining.minutes)}</span>
          <span className="time-label">min</span>
        </div>
        <div className="time-separator">:</div>
        <div className="time-unit">
          <span className="time-value">
            {formatTimeUnit(timeRemaining.seconds)}
          </span>
          <span className="time-label">sec</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CountdownTimer;