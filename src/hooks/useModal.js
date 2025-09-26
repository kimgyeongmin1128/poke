/**
 * useModal - 모달 관련 커스텀 훅
 *
 * 이 파일은 ModalContext를 사용하기 위한 커스텀 훅입니다.
 * 컴포넌트에서 모달 관련 상태와 함수를 쉽게 사용할 수 있게 해줍니다.
 *
 * 제공하는 데이터:
 * - showModal: 모달 표시 여부
 * - selectedPokemon: 선택된 포켓몬 정보
 * - pokemonDetails: 포켓몬 상세 정보 (능력치, 특성 등)
 * - pokemonMoves: 포켓몬 기술 목록
 * - loadingDetails: 상세 정보 로딩 상태
 * - loadingMoves: 기술 정보 로딩 상태
 * - error: 에러 메시지
 *
 * 제공하는 함수:
 * - openModal: 모달 열기
 * - closeModal: 모달 닫기
 *
 * 사용 예시:
 * const { showModal, selectedPokemon, openModal } = useModal();
 */
import { useModal as useModalContext } from "../contexts/ModalContext";

/**
 * 모달 관련 데이터와 함수를 제공하는 커스텀 훅
 * @returns {Object} 모달 상태와 함수들
 */
export const useModal = () => {
  const context = useModalContext();

  return {
    // 상태
    showModal: context.showModal, // 모달 표시 여부
    selectedPokemon: context.selectedPokemon, // 선택된 포켓몬 정보
    pokemonDetails: context.pokemonDetails, // 포켓몬 상세 정보
    pokemonMoves: context.pokemonMoves, // 포켓몬 기술 목록
    loadingDetails: context.loadingDetails, // 상세 정보 로딩 상태
    loadingMoves: context.loadingMoves, // 기술 정보 로딩 상태
    error: context.error, // 에러 메시지

    // 함수
    openModal: context.openModal, // 모달 열기
    closeModal: context.closeModal, // 모달 닫기
  };
};
