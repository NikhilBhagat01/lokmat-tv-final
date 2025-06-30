'use client';
import React from 'react';
import { deslugify } from '../lib/utility';

const BackButton = ({ slug }) => {
  return (
    <div className="expand-header">
      <div className="player-header">
        <span onClick={() => window.history.back()} className="player-back"></span>
        <div className="expand-title">{deslugify(slug)}</div> 
      </div>
    </div>
  );
};

export default BackButton;
