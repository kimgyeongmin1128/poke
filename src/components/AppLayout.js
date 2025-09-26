/**
 * AppLayout - 메인 레이아웃 컴포넌트
 *
 * 이 파일은 애플리케이션의 전체 레이아웃을 구성하는 메인 컴포넌트입니다.
 * 모든 주요 섹션들을 조합하여 완전한 포켓몬 위키 페이지를 만듭니다.
 *
 * 주요 구성 요소:
 * 1. Header: 상단 헤더 (로고, 제목 등)
 * 2. SearchSection: 검색 입력 필드
 * 3. PokemonGrid: 포켓몬 목록 그리드
 * 4. PokemonModal: 포켓몬 상세 정보 모달
 *
 * Context API 사용:
 * - 각 컴포넌트는 Context를 통해 상태를 관리
 * - Props drilling 없이 깔끔한 컴포넌트 구조
 * - 번역 맵을 Props로 전달하여 한국어 지원
 */
import React from "react";
import Header from "./Header";
import SearchSection from "./SearchSection";
import PokemonGrid from "./PokemonGrid";
import PokemonModal from "./PokemonModal";
import { STAT_KOREAN_MAP, ABILITY_KOREAN_MAP } from "../constants/translations";

const AppLayout = () => {
  return (
    <div className="app-container">
      {/* 상단 헤더 - 로고와 제목 */}
      <Header />

      {/* 검색 섹션 - 포켓몬 검색 입력 필드 */}
      <SearchSection />

      {/* 포켓몬 그리드 - 포켓몬 목록 표시 */}
      <PokemonGrid />

      {/* 포켓몬 상세 정보 모달 - 조건부로 표시 */}
      <PokemonModal
        statKoreanMap={STAT_KOREAN_MAP} // 능력치 한국어 번역 맵
        abilityKoreanMap={ABILITY_KOREAN_MAP} // 특성 한국어 번역 맵
      />
    </div>
  );
};

export default AppLayout;
