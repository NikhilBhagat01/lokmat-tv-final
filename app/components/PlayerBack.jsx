'use client';

const PlayerBack = () => {
  return (
    <div className="player-header">
      onClick={() => window.history.back()}
      <span className="player-back"></span>
    </div>
  );
};

export default PlayerBack;
