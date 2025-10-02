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
import React, { useState, useEffect, useCallback, useRef } from "react";
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
  const [displayedPokemon, setDisplayedPokemon] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  const total = filteredPokemon.length;
  const hasMore = displayedPokemon.length < total;

  // 무한 스크롤을 위한 Intersection Observer 설정
  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);

    // 다음 페이지 데이터 로드
    setTimeout(() => {
      const nextPage = currentPage + 1;
      const start = (nextPage - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE;
      const newPokemon = filteredPokemon.slice(start, end);

      setDisplayedPokemon((prev) => [...prev, ...newPokemon]);
      setCurrentPage(nextPage);
      setIsLoadingMore(false);
    }, 500); // 로딩 효과를 위한 지연
  }, [currentPage, filteredPokemon, isLoadingMore, hasMore]);

  // Intersection Observer 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMore, hasMore, isLoadingMore]);

  // 검색 결과가 바뀌면 초기화
  useEffect(() => {
    setDisplayedPokemon(filteredPokemon.slice(0, PAGE_SIZE));
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
        // 정상 상태일 때 포켓몬 카드 그리드 표시 (무한 스크롤)
        <>
          {displayedPokemon.map((pokemon) => (
            <PokemonCard
              key={pokemon.id} // React key - 고유한 포켓몬 ID
              pokemon={pokemon} // 포켓몬 데이터
              onPokemonClick={openModal} // 클릭 시 모달 열기 함수
              typeKoreanMap={TYPE_KOREAN_MAP} // 타입 한국어 번역 맵
            />
          ))}

          {/* 무한 스크롤 로딩 영역 */}
          {hasMore && (
            <div ref={loadMoreRef} className="load-more-trigger">
              {isLoadingMore ? (
                <div className="loading-more">
                  <div className="loading-spinner"></div>
                  <span>더 많은 포켓몬을 불러오는 중...</span>
                </div>
              ) : (
                <div className="scroll-hint">
                  <span>스크롤하여 더 많은 포켓몬 보기</span>
                </div>
              )}
            </div>
          )}

          {/* 모든 포켓몬을 로드했을 때 */}
          {!hasMore && displayedPokemon.length > 0 && (
            <div className="end-of-list">
              <span>
                모든 포켓몬을 불러왔습니다! ({displayedPokemon.length}마리)
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PokemonGrid;
