/**
 * SearchContext - 검색 기능 관리 Context
 *
 * 이 파일은 포켓몬 검색 기능을 관리하는 React Context입니다.
 * 검색어 입력, 필터링, 검색 상태 등을 전역적으로 관리합니다.
 *
 * 주요 기능:
 * 1. 검색어 상태 관리
 * 2. 포켓몬 데이터 필터링
 * 3. 검색 상태 추적
 * 4. 검색 초기화 기능
 *
 * PokemonContext와의 관계:
 * - PokemonContext의 pokemonData를 사용하여 필터링
 * - updateFilteredPokemon 함수를 통해 결과를 PokemonContext에 전달
 *
 * 사용되는 곳:
 * - SearchSection: 검색 입력 필드
 * - PokemonGrid: 필터링된 포켓몬 목록 표시
 */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { usePokemon } from "./PokemonContext";

// SearchContext의 초기 상태 정의
const initialState = {
  searchTerm: "", // 현재 검색어
  isSearching: false, // 검색 중인지 여부
};

// React Context 생성 - 검색 관련 상태를 전역적으로 공유
const SearchContext = createContext(initialState);

// SearchProvider 컴포넌트 - Context의 Provider 역할
export const SearchProvider = ({ children }) => {
  // useState로 검색 상태 관리
  const [state, setState] = useState(initialState);

  // PokemonContext에서 포켓몬 데이터와 업데이트 함수 가져오기
  const { pokemonData, updateFilteredPokemon } = usePokemon();

  // 검색어를 설정하는 함수
  const setSearchTerm = (term) => {
    setState((prev) => ({
      ...prev,
      searchTerm: term, // 검색어 업데이트
      isSearching: term.length > 0, // 검색어가 있으면 검색 중 상태
    }));
  };

  // 포켓몬 데이터를 검색어로 필터링하는 함수
  const filterPokemon = useCallback(
    (searchTerm) => {
      // 검색어가 없으면 전체 데이터 표시
      if (!searchTerm) {
        updateFilteredPokemon(pokemonData);
        return;
      }

      // 검색어를 소문자로 변환
      const searchLower = searchTerm.toLowerCase();

      // 포켓몬 데이터를 필터링
      const filtered = pokemonData.filter((pokemon) => {
        // 포켓몬의 한국어 이름 또는 영어 이름 가져오기
        const koreanName = (
          pokemon.koreanName || // 한국어 이름이 있으면 사용
          pokemon.name || // 없으면 영어 이름 사용
          ""
        ) // 둘 다 없으면 빈 문자열
          .toLowerCase();

        // 검색어가 포켓몬 이름에 포함되어 있는지 확인
        return koreanName.includes(searchLower);
      });

      // 필터링된 결과를 PokemonContext에 전달
      updateFilteredPokemon(filtered);
    },
    [pokemonData, updateFilteredPokemon]
  ); // pokemonData와 updateFilteredPokemon을 의존성으로 설정

  // 검색어나 포켓몬 데이터가 변경될 때마다 필터링 실행
  useEffect(() => {
    filterPokemon(state.searchTerm);
  }, [state.searchTerm, filterPokemon]); // 의존성 배열: 검색어와 필터링 함수

  // 검색을 초기화하는 함수
  const clearSearch = () => {
    setSearchTerm(""); // 검색어를 빈 문자열로 설정
  };

  // Context에 제공할 값들
  const value = {
    ...state, // 현재 상태 (searchTerm, isSearching)
    setSearchTerm, // 검색어 설정 함수
    filterPokemon, // 포켓몬 필터링 함수
    clearSearch, // 검색 초기화 함수
  };

  // Context Provider로 자식 컴포넌트들에게 값 제공
  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};

// SearchContext를 사용하는 커스텀 훅
// 컴포넌트에서 검색 관련 상태와 함수를 쉽게 사용할 수 있게 해줌
export const useSearch = () => {
  const context = useContext(SearchContext);

  // Context가 Provider 밖에서 사용되면 에러 발생
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }

  return context;
};

export default SearchContext;
