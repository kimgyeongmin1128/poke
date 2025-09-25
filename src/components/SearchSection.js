import React from "react";

const SearchSection = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="search-container">
      <div className="search-container-title">포켓몬 도감</div>
      <input
        type="text"
        placeholder="포켓몬 이름을 입력해주세요"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default SearchSection;
