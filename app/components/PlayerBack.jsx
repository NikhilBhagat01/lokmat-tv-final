'use client';

const PlayerBack = () => {
  return (
    <div className="player-header">
      <span onClick={() => window.history.back()} className="player-back"></span>
    </div>
  );
};

export default PlayerBack;
