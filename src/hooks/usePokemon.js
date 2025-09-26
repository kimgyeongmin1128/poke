/**
 * usePokemon - 포켓몬 관련 커스텀 훅
 *
 * 이 파일은 PokemonContext를 사용하기 위한 커스텀 훅입니다.
 * 컴포넌트에서 포켓몬 관련 상태와 함수를 쉽게 사용할 수 있게 해줍니다.
 *
 * 제공하는 데이터:
 * - pokemonData: 전체 포켓몬 데이터
 * - filteredPokemon: 검색으로 필터링된 포켓몬 데이터
 * - loading: 데이터 로딩 상태
 * - error: 에러 메시지
 *
 * 제공하는 함수:
 * - loadPokemonData: 포켓몬 데이터 다시 로드
 * - updateFilteredPokemon: 필터링된 포켓몬 데이터 업데이트
 *
 * 사용 예시:
 * const { filteredPokemon, loading } = usePokemon();
 */
import { usePokemon as usePokemonContext } from "../contexts/PokemonContext";

/**
 * 포켓몬 관련 데이터와 함수를 제공하는 커스텀 훅
 * @returns {Object} 포켓몬 상태와 함수들
 */
export const usePokemon = () => {
  const context = usePokemonContext();

  return {
    // 상태
    pokemonData: context.pokemonData, // 전체 포켓몬 데이터
    filteredPokemon: context.filteredPokemon, // 필터링된 포켓몬 데이터
    loading: context.loading, // 로딩 상태
    error: context.error, // 에러 메시지

    // 함수
    loadPokemonData: context.loadPokemonData, // 데이터 다시 로드
    updateFilteredPokemon: context.updateFilteredPokemon, // 필터링된 데이터 업데이트
  };
};
