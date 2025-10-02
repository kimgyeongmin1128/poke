/**
 * PokemonGrid - 포켓몬 목록 그리드 컴포넌트
 *
 * 이 파일은 포켓몬 목록을 그리드 형태로 표시하는 컴포넌트입니다.
 * 로딩 상태, 검색 결과, 포켓몬 목록을 조건부로 렌더링합니다.
 *
 * 주요 기능:
 * 1. 로딩 상태 표시 (LoadingSpinner)
 * 2. 검색 결과 없음 표시 (NoResults)
 * 3. 포켓몬 목록 그리드 표시 (PokemonCard 배열)
 * 4. 포켓몬 클릭 시 모달 열기
 *
 * Context 사용:
 * - usePokemon: 포켓몬 데이터 및 로딩 상태
 * - useModal: 모달 열기 함수
 *
 * 조건부 렌더링:
 * - 로딩 중: LoadingSpinner 표시
 * - 검색 결과 없음: NoResults 표시
 * - 정상: 포켓몬 카드 그리드 표시
 */
import React, { useState, useEffect } from "react";
import PokemonCard from "./PokemonCard";
// import LoadingSpinner from "./LoadingSpinner";
import SkeletonCard from "./SkeletonCard";
import NoResults from "./NoResults";
import { TYPE_KOREAN_MAP } from "../constants/translations";
import { usePokemon } from "../hooks/usePokemon";
import { useModal } from "../hooks/useModal";

const PokemonGrid = () => {
  // PokemonContext에서 포켓몬 데이터와 로딩 상태 가져오기
  const { loading, filteredPokemon } = usePokemon();
  const PAGE_SIZE = 100;
  const [currentPage, setCurrentPage] = useState(1);

  const total = filteredPokemon.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentPokemon = filteredPokemon.slice(startIndex, endIndex);

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 페이지 번호 렌더링
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`page-num ${i === currentPage ? "active" : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  // 필터된 포켓몬이 변경될 때 페이지 초기화
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredPokemon]);

  // ModalContext에서 모달 열기 함수 가져오기
  const { openModal } = useModal();

  return (
    <div className="pokemon-grid">
      {/* 조건부 렌더링 - 상태에 따라 다른 컴포넌트 표시 */}
      {loading ? (
        // 로딩 중일 때 스켈레톤 UI 표시
        Array.from({ length: 12 }, (_, index) => <SkeletonCard key={index} />)
      ) : filteredPokemon.length === 0 ? (
        // 검색 결과가 없을 때 NoResults 표시
        <NoResults />
      ) : (
        // 정상 상태일 때 포켓몬 카드 그리드 표시 (페이지네이션)
        <>
          {currentPokemon.map((pokemon) => (
            <PokemonCard
              key={pokemon.id} // React key - 고유한 포켓몬 ID
              pokemon={pokemon} // 포켓몬 데이터
              onPokemonClick={openModal} // 클릭 시 모달 열기 함수
              typeKoreanMap={TYPE_KOREAN_MAP} // 타입 한국어 번역 맵
            />
          ))}

          {/* 페이지네이션 컨트롤 */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                이전
              </button>

              {renderPageNumbers()}

              <button
                className="page-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                다음
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PokemonGrid;
