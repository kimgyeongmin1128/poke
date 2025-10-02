/**
 * CompareContext - 포켓몬 비교 기능 관리 Context
 *
 * 이 파일은 포켓몬 비교 기능을 관리하는 React Context입니다.
 * 비교할 포켓몬들을 선택하고 관리하는 기능을 제공합니다.
 *
 * 주요 기능:
 * 1. 비교할 포켓몬 선택/해제
 * 2. 비교 모달 표시/숨김
 * 3. 최대 2마리까지 비교 가능
 * 4. 비교 상태 관리
 *
 * 사용되는 곳:
 * - PokemonCard: 비교 버튼
 * - CompareModal: 비교 결과 표시
 */
import React, { createContext, useContext, useState } from "react";

// CompareContext의 초기 상태 정의
const initialState = {
  compareList: [], // 비교할 포켓몬 목록 (최대 2마리)
  isCompareModalOpen: false, // 비교 모달 표시 여부
  maxCompare: 2, // 최대 비교 가능한 포켓몬 수
};

// React Context 생성 - 비교 관련 상태를 전역적으로 공유
const CompareContext = createContext(initialState);

// CompareProvider 컴포넌트 - Context의 Provider 역할
export const CompareProvider = ({ children }) => {
  // useState로 비교 상태 관리
  const [state, setState] = useState(initialState);

  // 포켓몬을 비교 목록에 추가하는 함수
  const addToCompare = (pokemon) => {
    setState((prev) => {
      // 이미 비교 목록에 있는 포켓몬인지 확인
      const isAlreadyAdded = prev.compareList.some((p) => p.id === pokemon.id);

      if (isAlreadyAdded) {
        return prev; // 이미 추가된 포켓몬이면 변경하지 않음
      }

      // 최대 비교 수를 초과하지 않는지 확인
      if (prev.compareList.length >= prev.maxCompare) {
        return prev; // 최대 비교 수를 초과하면 추가하지 않음
      }

      return {
        ...prev,
        compareList: [...prev.compareList, pokemon],
      };
    });
  };

  // 포켓몬을 비교 목록에서 제거하는 함수
  const removeFromCompare = (pokemonId) => {
    setState((prev) => ({
      ...prev,
      compareList: prev.compareList.filter((p) => p.id !== pokemonId),
    }));
  };

  // 비교 모달을 여는 함수
  const openCompareModal = () => {
    setState((prev) => ({
      ...prev,
      isCompareModalOpen: true,
    }));
  };

  // 비교 모달을 닫는 함수
  const closeCompareModal = () => {
    setState((prev) => ({
      ...prev,
      isCompareModalOpen: false,
    }));
  };

  // 비교 목록을 초기화하는 함수
  const clearCompareList = () => {
    setState((prev) => ({
      ...prev,
      compareList: [],
      isCompareModalOpen: false,
    }));
  };

  // 포켓몬이 비교 목록에 있는지 확인하는 함수
  const isInCompareList = (pokemonId) => {
    return state.compareList.some((p) => p.id === pokemonId);
  };

  // 비교 가능한 상태인지 확인하는 함수
  const canAddToCompare = () => {
    return state.compareList.length < state.maxCompare;
  };

  // Context에 제공할 값들
  const value = {
    ...state, // 현재 상태 (compareList, isCompareModalOpen, maxCompare)
    addToCompare, // 포켓몬 추가 함수
    removeFromCompare, // 포켓몬 제거 함수
    openCompareModal, // 비교 모달 열기 함수
    closeCompareModal, // 비교 모달 닫기 함수
    clearCompareList, // 비교 목록 초기화 함수
    isInCompareList, // 비교 목록에 있는지 확인 함수
    canAddToCompare, // 비교 가능한 상태인지 확인 함수
  };

  // Context Provider로 자식 컴포넌트들에게 값 제공
  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  );
};

// CompareContext를 사용하는 커스텀 훅
// 컴포넌트에서 비교 관련 상태와 함수를 쉽게 사용할 수 있게 해줌
export const useCompare = () => {
  const context = useContext(CompareContext);

  // Context가 Provider 밖에서 사용되면 에러 발생
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }

  return context;
};

export default CompareContext;
