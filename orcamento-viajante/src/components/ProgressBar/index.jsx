import React from 'react';

const containerStyle = {
  width: '100%',
  height: '25px',
  backgroundColor: '#8d8d8dff',
  borderRadius: '12px',
  overflow: 'hidden',
  marginBottom: '20px',
};

function ProgressBar({ progresso }) {
  let barColor;
  
  if (progresso <= 50) {
    barColor = '#039D15';
  } else if (progresso > 50 && progresso < 100) {
    barColor = '#A29C00';
  } else {
    barColor = '#9D2203';
  }
  
  const barWidth = Math.min(progresso, 100); 

  const fillStyle = {
    height: '100%',
    width: `${barWidth}%`,
    backgroundColor: barColor,
    transition: 'width 0.5s ease, background-color 0.5s ease',
    textAlign: 'center',
    lineHeight: '25px',
    color: 'white',
    fontWeight: 'bold',
    padding: '0 5px',
  };

  return (
    <div style={containerStyle}>
      <div style={fillStyle}>
        {progresso.toFixed(1)}%
      </div>
    </div>
  );
}

export default ProgressBar;