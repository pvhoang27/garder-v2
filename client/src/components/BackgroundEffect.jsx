import React from 'react';
import { Fireworks } from "@fireworks-js/react";
import Snowfall from "react-snowfall";
import Confetti from "react-confetti";

const BackgroundEffect = ({ effectType }) => {
  const style = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 50
  };

  if (effectType === 'snow') {
    return <Snowfall style={style} snowflakeCount={200} />;
  }
  
  if (effectType === 'confetti') {
    return <Confetti width={window.innerWidth} height={window.innerHeight} style={style} />;
  }

  if (effectType === 'fireworks') {
    return (
      <Fireworks
        options={{
          opacity: 0.5,
          particles: 50,
          explosion: 5,
          intensity: 10,
          traceLength: 2,
        }}
        style={style}
      />
    );
  }

  return null;
};

export default BackgroundEffect;