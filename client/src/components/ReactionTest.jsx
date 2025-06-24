/* eslint-disable no-unused-vars */
// ReactionTest.jsx
import React, { useState, useEffect } from 'react';
import '../index.css';

const ReactionTimeTest = () => {
  const [message, setMessage] = useState('Click to Start');
  const [startTime, setStartTime] = useState(null);
  const [score, setScore] = useState(null);
  const [highScore, setHighScore] = useState(() => {
    try {
      const saved = document.cookie.split('; ').find(row => row.startsWith('highScore='));
      return saved ? parseInt(saved.split('=')[1]) : null;
    } catch (e) {
      return null;
    }
  });
  const [avg, setAvg] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/score/average')
      .then(res => res.json())
      .then(data => {
        setAvg(data.averageScore);
      });
  }, [score]);

  const startTest = () => {
    setMessage('Wait...');
    setShowStats(false);
    const delay = Math.floor(Math.random() * 5000) + 2000;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const id = setTimeout(() => {
      setMessage('Click Now!');
      setStartTime(Date.now());
    }, delay);

    setTimeoutId(id);
  };

  const handleClick = () => {
    if (message === 'Click to Start') {
      startTest();
    } else if (message === 'Wait...') {
      if (timeoutId) {
        clearTimeout(timeoutId);
        setTimeoutId(null);
      }
      setMessage('Too soon! Click to try again.');
      setStartTime(null);
    } else if (message === 'Click Now!') {
    const reaction = Date.now() - startTime;
    setScore(reaction);
    setMessage('Click to Start');
    setShowStats(true);

    // Update this fetch call
    fetch('http://localhost:3001/api/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score: reaction }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Score saved:', data);
    })
    .catch(error => {
      console.error('Error saving score:', error);
    });

    if (!highScore || reaction < highScore) {
      setHighScore(reaction);
      document.cookie = `highScore=${reaction}; path=/; max-age=31536000`;
    }
  } else {
      setMessage('Click to Start');
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const getStats = () => {
    if (!avg || !score ||!highScore) return null;
    const faster = ((avg - score) / avg) * 100;
    const bestFaster = ((avg - highScore) / avg) * 100;
    
    return (
      <div className="stats-grid">
        <div className="stat-box">
          <span className="stat-label">Your Time</span>
          <span className="stat-value">{score} ms</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">High Score</span>
          <span className="stat-value">{highScore} ms</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Vs Average</span>
          <span className={`stat-value ${faster > 0 ? 'faster' : 'slower'}`}>
            {faster > 0 ? '↑' : '↓'} {Math.abs(faster).toFixed(2)}%
          </span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Best vs Average</span>
          <span className={`stat-value ${bestFaster > 0 ? 'faster' : 'slower'}`}>
            {bestFaster > 0 ? '↑' : '↓'} {Math.abs(bestFaster).toFixed(2)}%
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className={`reaction-container flex-center ${
      message === 'Click Now!' ? 'click-now' : 
      message === 'Wait...' ? 'waiting' : 'ready'
    }`}>
      <div className="text-center px-4 w-full max-w-md">
        <h1 className="reaction-header">
          REACTION TIME TEST
        </h1>
        
        <div 
          className={`click-box ${
            message === 'Click Now!' ? 'click-now' : 
            message === 'Wait...' ? 'waiting' : 'ready'
          }`}
          onClick={handleClick}
        >
          <div className="box-content">
            <p className="text-lg">{message}</p>
            {message === 'Click to Start' && (
              <p className="text-sm text-gray-700">Click the box to begin</p>
            )}
            {message === 'Too soon! Click to try again.' && (
              <p className="text-sm text-gray-800">Don't click until the box turns green</p>
            )}
          </div>
        </div>

        {showStats && (
          <div className="mt-8 animate-fade-in">
            {getStats()}
            <div className="mt-6 text-gray-800 text-sm">
              <p className="mt-1">Average human reaction: 200-300ms</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReactionTimeTest;