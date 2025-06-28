'use client';
import React from 'react';

const BackButton = ({ slug }) => {
  const deslugify = (slug) => {
    return slug
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase())
      .replace(/(\d+)/g, ' $1')
      .trim();
  };

  slug = deslugify(slug);
  return (
    <div className="expand-header">
      <div className="player-header">
        <span onClick={() => window.history.back()} className="player-back"></span>
        <div className="expand-title">{slug}</div> 
      </div>
    </div>
  );
};

export default BackButton;
