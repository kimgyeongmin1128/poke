/**
 * TypeFilter - 포켓몬 타입별 필터링 컴포넌트
 *
 * 이 파일은 포켓몬을 타입별로 필터링할 수 있는 컴포넌트입니다.
 * 모든 포켓몬 타입을 버튼으로 표시하고, 선택된 타입으로 필터링합니다.
 *
 * 주요 기능:
 * 1. 포켓몬 타입 버튼 표시
 * 2. 타입 선택/해제
 * 3. 다중 타입 선택 지원
 * 4. 선택된 타입에 따른 시각적 피드백
 *
 * 사용되는 곳:
 * - SearchSection: 검색 섹션에 포함
 */
import React, { useState, useEffect } from "react";
import { usePokemon } from "../hooks/usePokemon";
import { useSearch } from "../hooks/useSearch";

// 포켓몬 타입 정의 (한국어)
const POKEMON_TYPES = [
  { id: "normal", name: "노말", color: "#A8A878" },
  { id: "fire", name: "불꽃", color: "#F08030" },
  { id: "water", name: "물", color: "#6890F0" },
  { id: "electric", name: "전기", color: "#F8D030" },
  { id: "grass", name: "풀", color: "#78C850" },
  { id: "ice", name: "얼음", color: "#98D8D8" },
  { id: "fighting", name: "격투", color: "#C03028" },
  { id: "poison", name: "독", color: "#A040A0" },
  { id: "ground", name: "땅", color: "#E0C068" },
  { id: "flying", name: "비행", color: "#A890F0" },
  { id: "psychic", name: "에스퍼", color: "#F85888" },
  { id: "bug", name: "벌레", color: "#A8B820" },
  { id: "rock", name: "바위", color: "#B8A038" },
  { id: "ghost", name: "고스트", color: "#705898" },
  { id: "dragon", name: "드래곤", color: "#7038F8" },
  { id: "dark", name: "악", color: "#705848" },
  { id: "steel", name: "강철", color: "#B8B8D0" },
  { id: "fairy", name: "페어리", color: "#EE99AC" },
];

const TypeFilter = () => {
  const { pokemonData } = usePokemon();
  const { searchTerm } = useSearch();
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);

  // 타입 선택/해제 핸들러
  const handleTypeToggle = (typeId) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId]
    );
  };

  // 타입별 필터링 함수
  const filterByTypes = (pokemonList, types) => {
    if (types.length === 0) return pokemonList;

    return pokemonList.filter((pokemon) =>
      types.some((type) => pokemon.types.includes(type))
    );
  };

  // 검색어와 타입으로 필터링
  useEffect(() => {
    let filtered = pokemonData;

    // 검색어 필터링
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((pokemon) => {
        const koreanName = (
          pokemon.koreanName ||
          pokemon.name ||
          ""
        ).toLowerCase();
        return koreanName.includes(searchLower);
      });
    }

    // 타입 필터링
    filtered = filterByTypes(filtered, selectedTypes);

    setFilteredPokemon(filtered);
  }, [pokemonData, searchTerm, selectedTypes]);

  // PokemonContext에서 업데이트 함수 가져오기
  const { updateFilteredPokemon } = usePokemon();

  // 필터링된 결과를 PokemonContext에 전달
  useEffect(() => {
    updateFilteredPokemon(filteredPokemon);
  }, [filteredPokemon, updateFilteredPokemon]);

  return (
    <div className="type-filter">
      <div className="type-filter-title">타입별 필터</div>
      <div className="type-buttons">
        {POKEMON_TYPES.map((type) => (
          <button
            key={type.id}
            className={`type-button ${
              selectedTypes.includes(type.id) ? "active" : ""
            }`}
            onClick={() => handleTypeToggle(type.id)}
            style={{
              backgroundColor: selectedTypes.includes(type.id)
                ? type.color
                : "#f3f4f6",
              color: selectedTypes.includes(type.id) ? "#ffffff" : "#374151",
              borderColor: type.color,
            }}
          >
            {type.name}
          </button>
        ))}
      </div>
      {selectedTypes.length > 0 && (
        <div className="filter-info">
          <span>선택된 타입: {selectedTypes.length}개</span>
          <button
            className="clear-filter-btn"
            onClick={() => setSelectedTypes([])}
          >
            필터 초기화
          </button>
        </div>
      )}
    </div>
  );
};

export default TypeFilter;
