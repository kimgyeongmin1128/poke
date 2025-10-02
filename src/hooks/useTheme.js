/**
 * useTheme - 테마 관련 상태와 함수를 사용하는 커스텀 훅
 *
 * 이 파일은 ThemeContext를 사용하여 테마 관련 상태와 함수를 쉽게 접근할 수 있게 해주는 커스텀 훅입니다.
 * 컴포넌트에서 테마 상태와 테마 전환 함수를 사용할 때 사용합니다.
 *
 * 주요 기능:
 * 1. 현재 테마 상태 (isDarkMode, theme) 접근
 * 2. 테마 전환 함수 (toggleTheme) 접근
 * 3. Context Provider 체크
 *
 * 사용되는 곳:
 * - Header: 테마 토글 버튼
 * - 기타 테마가 필요한 컴포넌트들
 */
import { useTheme as useThemeContext } from "../contexts/ThemeContext";

// ThemeContext의 useTheme을 재export하여 일관성 유지
export const useTheme = useThemeContext;
