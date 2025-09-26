/**
 * AppProvider - Context Provider 통합 관리자
 *
 * 이 파일은 모든 Context Provider를 하나로 통합하여 관리합니다.
 * React Context API를 사용하여 전역 상태를 관리하는 핵심 컴포넌트입니다.
 *
 * 주요 기능:
 * 1. PokemonProvider: 포켓몬 데이터, 필터링, 로딩 상태 관리
 * 2. SearchProvider: 검색어, 검색 상태 관리 (PokemonProvider 의존)
 * 3. ModalProvider: 모달 표시, 선택된 포켓몬, 상세 정보 관리
 *
 * Provider 순서가 중요한 이유:
 * - SearchProvider가 PokemonProvider의 데이터를 사용하므로 안쪽에 위치
 * - ModalProvider는 독립적이므로 가장 안쪽에 위치
 * - 이렇게 하면 각 Context가 필요한 데이터에 접근할 수 있음
 */
import React from "react";
import { PokemonProvider } from "../contexts/PokemonContext";
import { SearchProvider } from "../contexts/SearchContext";
import { ModalProvider } from "../contexts/ModalContext";

export const AppProvider = ({ children }) => {
  return (
    <PokemonProvider>
      <SearchProvider>
        <ModalProvider>{children}</ModalProvider>
      </SearchProvider>
    </PokemonProvider>
  );
};

export default AppProvider;
