// Timer Component
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const Timer = ({ duration, onTimeUpdate }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [timesUp, setTimesUp] = useState(false);

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = Math.max(prevTime - 1000, 0);
        onTimeUpdate(newTime); 
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [onTimeUpdate]);

  useEffect(() => {
    if (timeLeft === 0) {
      setTimesUp(true);
    }
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 1000 / 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return (
    <div className="flex flex-col bg-black text-white p-4">
      <span className="text-gray-400">Time left to complete order &nbsp;</span>
      {timesUp ? (
        <span className="text-red-500 text-4xl">You failed to order in time</span>
      ) : (
        <span className="text-red-500 text-4xl">
          {minutes}:{seconds < 10 ? "0" + seconds : seconds}
        </span>
      )}
    </div>
  );
};

Timer.propTypes = {
  duration: PropTypes.number.isRequired,
  onTimeUpdate: PropTypes.func.isRequired,
};

export default Timer;
