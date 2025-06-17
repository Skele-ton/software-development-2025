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
  const [avgBest, setAvgBest] = useState(null);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/api/score/average')
      .then(res => res.json())
      .then(data => {
        setAvg(data.averageScore);
        setAvgBest(data.highScoreAvg);
      });
  }, [score]);

  const startTest = () => {
    setMessage('Wait...');
    setShowStats(false);
    const delay = Math.floor(Math.random() * 5000) + 2000;

    setTimeout(() => {
      setMessage('Click Now!');
      setStartTime(Date.now());
    }, delay);
  };

  const handleClick = () => {
    if (message === 'Click to Start') {
      startTest();
    } else if (message === 'Wait...') {
      setMessage('Too soon! Click to try again.');
      setStartTime(null);
    } else if (message === 'Click Now!') {
      const reaction = Date.now() - startTime;
      setScore(reaction);
      setMessage('Click to Start');
      setShowStats(true);

      fetch('http://localhost:3001/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: reaction }),
      });

      if (!highScore || reaction < highScore) {
        setHighScore(reaction);
        document.cookie = `highScore=${reaction}; path=/; max-age=31536000`;
      }
    } else {
      setMessage('Click to Start');
    }
  };

  const getStats = () => {
    if (!avg || !score || !avgBest || !highScore) return null;
    const faster = ((avg - score) / avg) * 100;
    const bestFaster = ((avgBest - highScore) / avgBest) * 100;
    
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
          <span className={`stat-value ${faster > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {faster > 0 ? '↑' : '↓'} {Math.abs(faster).toFixed(2)}%
          </span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Best vs Avg Best</span>
          <span className={`stat-value ${bestFaster > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {bestFaster > 0 ? '↑' : '↓'} {Math.abs(bestFaster).toFixed(2)}%
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 ${
      message === 'Click Now!' ? 'bg-green-300' : 
      message === 'Wait...' ? 'bg-red-300' : 'bg-gray-100'
    }`}>
      <div className="text-center px-4 w-full max-w-md">
        <h1 className="text-4xl font-bold mb-8 text-black font-mono tracking-tight">
          REACTION TIME TEST
        </h1>
        
        <div 
          className={`click-box ${message === 'Click Now!' ? 'bg-green-400 ring-4 ring-green-200 animate-pulse' : 
            message === 'Wait...' ? 'bg-red-400 cursor-wait' : 
            'bg-gray-200 hover:bg-gray-300 cursor-pointer'}`}
          onClick={handleClick}
        >
          <div className="box-content">
            <p className="text-2xl font-semibold mb-2 text-black">{message}</p>
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
              <p>Keep practicing to improve your reaction time!</p>
              <p className="mt-1">Average human reaction: 200-300ms</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReactionTimeTest;