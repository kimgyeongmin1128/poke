/**
 * useCompare - 포켓몬 비교 관련 상태와 함수를 사용하는 커스텀 훅
 *
 * 이 파일은 CompareContext를 사용하여 포켓몬 비교 관련 상태와 함수를 쉽게 접근할 수 있게 해주는 커스텀 훅입니다.
 * 컴포넌트에서 포켓몬 비교 기능을 사용할 때 사용합니다.
 *
 * 주요 기능:
 * 1. 비교 목록 상태 접근
 * 2. 비교 모달 상태 접근
 * 3. 포켓몬 추가/제거 함수 접근
 * 4. 모달 열기/닫기 함수 접근
 * 5. Context Provider 체크
 *
 * 사용되는 곳:
 * - PokemonCard: 비교 버튼
 * - CompareModal: 비교 모달
 * - 기타 비교 기능이 필요한 컴포넌트들
 */
import { useCompare as useCompareContext } from "../contexts/CompareContext";

// CompareContext의 useCompare을 재export하여 일관성 유지
export const useCompare = useCompareContext;
