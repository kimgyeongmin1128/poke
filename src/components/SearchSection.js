import React from "react";
import { useSearch } from "../hooks/useSearch";
import TypeFilter from "./TypeFilter";

const SearchSection = () => {
  const { searchTerm, setSearchTerm } = useSearch();

  return (
    <div className="search-section">
      <div className="search-container">
        <div className="search-container-title">포켓몬 도감</div>
        <input
          type="text"
          placeholder="포켓몬 이름을 입력해주세요"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <TypeFilter />
    </div>
  );
};

export default SearchSection;
