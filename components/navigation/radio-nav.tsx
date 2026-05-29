'use client'

import React from 'react';
import styled from 'styled-components';

interface RadioNavProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Radio = ({ activeSection, onSectionChange }: RadioNavProps) => {
  const handleChange = (section: string) => {
    onSectionChange(section);
  };

  return (
    <StyledWrapper>
      <div>
        <div className="container">
          <div className="wrap">
            <input 
              type="radio" 
              id="rd-1" 
              name="radio" 
              className="rd-1" 
              hidden 
              checked={activeSection === 'about'}
              onChange={() => handleChange('about')}
            />
            <label htmlFor="rd-1" className="label"><span>About Me</span></label>
            
            <input 
              type="radio" 
              id="rd-2" 
              name="radio" 
              className="rd-2" 
              hidden 
              checked={activeSection === 'skills'}
              onChange={() => handleChange('skills')}
            />
            <label htmlFor="rd-2" className="label"><span>Skills & Expertise</span></label>
            
            <input 
              type="radio" 
              id="rd-3" 
              name="radio" 
              className="rd-3" 
              hidden 
              checked={activeSection === 'projects'}
              onChange={() => handleChange('projects')}
            />
            <label htmlFor="rd-3" className="label"><span>Projects</span></label>
            
            <input 
              type="radio" 
              id="rd-4" 
              name="radio" 
              className="rd-4" 
              hidden 
              checked={activeSection === 'contact'}
              onChange={() => handleChange('contact')}
            />
            <label htmlFor="rd-4" className="label"><span>Get In Touch</span></label>
            
            <div className="bar" />
            <div className="slidebar" />
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  font-family: var(--font-inter, 'Inter', system-ui, -apple-system, sans-serif);
  /* main style */
  .wrap {
    --round: 10px;
    --p-x: 8px;
    --p-y: 4px;
    --w-label: 130px;
    display: flex;
    align-items: center;
    padding: var(--p-y) var(--p-x);
    position: relative;
    background: #1a1a1a;
    border-radius: var(--round);
    max-width: 100%;
    overflow-x: auto;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
    top: 0;
    z-index: 1;
    border: 1px solid #333;
  }

  .wrap input {
    height: 0;
    width: 0;
    position: absolute;
    overflow: hidden;
    display: none;
    visibility: hidden;
  }

  .container {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px 0;
  }

  .label {
    cursor: pointer;
    outline: none;
    font-size: 0.875rem;
    letter-spacing: initial;
    font-weight: 500;
    color: #888;
    background: transparent;
    padding: 12px 16px;
    width: var(--w-label);
    min-width: var(--w-label);
    text-decoration: none;
    -webkit-user-select: none;
    user-select: none;
    transition: color 0.25s ease;
    outline-offset: -6px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 2;
    -webkit-tap-highlight-color: transparent;
  }

  .label span {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }

  .wrap input[class*="rd-"]:checked + label {
    color: #fff;
  }

  .bar {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    position: absolute;
    transform-origin: 0 0 0;
    height: 100%;
    width: var(--w-label);
    z-index: 0;
    transition: transform 0.5s cubic-bezier(0.33, 0.83, 0.99, 0.98);
  }

  .bar::before,
  .bar::after {
    content: "";
    position: absolute;
    height: 2px;
    width: 100%;
    background: #404040;
  }

  .bar::before {
    top: 0;
    border-radius: 0 0 9999px 9999px;
  }

  .bar::after {
    bottom: 0;
    border-radius: 9999px 9999px 0 0;
  }

  .slidebar {
    position: absolute;
    height: calc(100% - (var(--p-y) * 4));
    width: var(--w-label);
    border-radius: calc(var(--round) - var(--p-y));
    background: #2a2a2a;
    transform-origin: 0 0 0;
    z-index: 0;
    transition: transform 0.5s cubic-bezier(0.33, 0.83, 0.99, 0.98);
  }

  .rd-1:checked ~ .bar,
  .rd-1:checked ~ .slidebar,
  .rd-1 + label:hover ~ .slidebar {
    transform: translateX(0) scaleX(1);
  }

  .rd-2:checked ~ .bar,
  .rd-2:checked ~ .slidebar,
  .rd-2 + label:hover ~ .slidebar {
    transform: translateX(100%) scaleX(1);
  }

  .rd-3:checked ~ .bar,
  .rd-3:checked ~ .slidebar,
  .rd-3 + label:hover ~ .slidebar {
    transform: translateX(200%) scaleX(1);
  }

  .rd-4:checked ~ .bar,
  .rd-4:checked ~ .slidebar,
  .rd-4 + label:hover ~ .slidebar {
    transform: translateX(300%) scaleX(1);
  }

  @media (max-width: 768px) {
    .wrap {
      --w-label: 100px;
    }
    
    .label {
      font-size: 0.75rem;
      padding: 10px 12px;
    }
  }
`;

export default Radio;
