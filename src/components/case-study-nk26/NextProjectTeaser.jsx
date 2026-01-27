import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * NextProjectTeaser - CTA section linking to next case study
 */
const NextProjectTeaser = ({
  title,
  description,
  href,
  className = ''
}) => {
  return (
    <section className={`next-project-nk26 ${className}`} aria-label="Next case study">
      <motion.div
        className="next-project-container-nk26"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="next-project-label-nk26">Next Project</h3>
        <h2 className="next-project-title-nk26">{title}</h2>
        <p className="next-project-description-nk26">{description}</p>
        <Link to={href} className="next-project-link-nk26">
          View Case Study
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 10H16M16 10L10 4M16 10L10 16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </motion.div>
    </section>
  );
};

export default NextProjectTeaser;
