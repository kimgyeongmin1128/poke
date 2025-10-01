import React from "react";

const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image"></div>
      <div className="skeleton-content">
        <div className="skeleton-name"></div>
        <div className="skeleton-id"></div>
        <div className="skeleton-english-name"></div>
        <div className="skeleton-types">
          <div className="skeleton-type"></div>
          <div className="skeleton-type"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
