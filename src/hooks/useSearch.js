/**
 * useSearch - 검색 관련 커스텀 훅
 *
 * 이 파일은 SearchContext를 사용하기 위한 커스텀 훅입니다.
 * 컴포넌트에서 검색 관련 상태와 함수를 쉽게 사용할 수 있게 해줍니다.
 *
 * 제공하는 데이터:
 * - searchTerm: 현재 검색어
 * - isSearching: 검색 중인지 여부
 *
 * 제공하는 함수:
 * - setSearchTerm: 검색어 설정
 * - filterPokemon: 포켓몬 필터링
 * - clearSearch: 검색 초기화
 *
 * 사용 예시:
 * const { searchTerm, setSearchTerm } = useSearch();
 */
import { useSearch as useSearchContext } from "../contexts/SearchContext";

/**
 * 검색 관련 데이터와 함수를 제공하는 커스텀 훅
 * @returns {Object} 검색 상태와 함수들
 */
export const useSearch = () => {
  const context = useSearchContext();

  return {
    // 상태
    searchTerm: context.searchTerm, // 현재 검색어
    isSearching: context.isSearching, // 검색 중인지 여부

    // 함수
    setSearchTerm: context.setSearchTerm, // 검색어 설정
    filterPokemon: context.filterPokemon, // 포켓몬 필터링
    clearSearch: context.clearSearch, // 검색 초기화
  };
};
