import React from "react";

const SkeletonDetail = () => {
  return (
    <div className="skeleton-detail">
      <div className="skeleton-detail-header">
        <div className="skeleton-detail-image" />
        <div className="skeleton-detail-titles">
          <div className="skeleton-detail-name" />
          <div className="skeleton-detail-id" />
        </div>
      </div>

      <div className="skeleton-section">
        <div className="skeleton-section-title" />
        <div className="skeleton-rows">
          <div className="skeleton-row" />
          <div className="skeleton-row" />
          <div className="skeleton-row" />
        </div>
      </div>

      <div className="skeleton-section">
        <div className="skeleton-section-title" />
        <div className="skeleton-stats-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton-stat" />
          ))}
        </div>
      </div>

      <div className="skeleton-section">
        <div className="skeleton-section-title" />
        <div className="skeleton-abilities">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton-chip" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonDetail;
