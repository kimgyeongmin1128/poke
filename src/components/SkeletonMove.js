import React from "react";

const SkeletonMove = () => {
  return (
    <div className="skeleton-move-card">
      <div className="skeleton-move-header">
        <div className="skeleton-move-name"></div>
        <div className="skeleton-move-type"></div>
      </div>
      <div className="skeleton-move-stats">
        <div className="skeleton-move-stat">
          <div className="skeleton-stat-label"></div>
          <div className="skeleton-stat-value"></div>
        </div>
        <div className="skeleton-move-stat">
          <div className="skeleton-stat-label"></div>
          <div className="skeleton-stat-value"></div>
        </div>
        <div className="skeleton-move-stat">
          <div className="skeleton-stat-label"></div>
          <div className="skeleton-stat-value"></div>
        </div>
        <div className="skeleton-move-stat">
          <div className="skeleton-stat-label"></div>
          <div className="skeleton-stat-value"></div>
        </div>
      </div>
      <div className="skeleton-move-description"></div>
    </div>
  );
};

export default SkeletonMove;
