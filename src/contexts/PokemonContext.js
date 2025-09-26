/**
 * PokemonContext - 포켓몬 데이터 관리 Context
 *
 * 이 파일은 포켓몬 관련 데이터와 상태를 관리하는 React Context입니다.
 * 포켓몬 목록, 필터링된 포켓몬, 로딩 상태 등을 전역적으로 관리합니다.
 *
 * 주요 기능:
 * 1. 포켓몬 데이터 로드 및 관리
 * 2. 필터링된 포켓몬 목록 관리
 * 3. 로딩 상태 및 에러 처리
 * 4. 포켓몬 데이터 업데이트 함수 제공
 *
 * 사용되는 곳:
 * - PokemonGrid: 포켓몬 목록 표시
 * - SearchContext: 검색 기능에서 포켓몬 데이터 사용
 */
import React, { createContext, useContext, useState, useEffect } from "react";
import { loadAllPokemonData } from "../api/pokestore";

// PokemonContext의 초기 상태 정의
const initialState = {
  pokemonData: [], // 전체 포켓몬 데이터 배열
  filteredPokemon: [], // 검색으로 필터링된 포켓몬 배열
  loading: true, // 데이터 로딩 상태
  error: null, // 에러 메시지
};

// React Context 생성 - 포켓몬 관련 상태를 전역적으로 공유
const PokemonContext = createContext(initialState);

// PokemonProvider 컴포넌트 - Context의 Provider 역할
export const PokemonProvider = ({ children }) => {
  // useState로 상태 관리 - 초기값은 initialState
  const [state, setState] = useState(initialState);

  // 포켓몬 데이터를 API에서 가져오는 함수
  const loadPokemonData = async () => {
    try {
      // 로딩 시작 - 에러 상태 초기화
      setState((prev) => ({ ...prev, loading: true, error: null }));

      // API에서 모든 포켓몬 데이터 가져오기
      const data = await loadAllPokemonData();

      // 성공 시 상태 업데이트
      setState((prev) => ({
        ...prev,
        pokemonData: data, // 전체 데이터 저장
        filteredPokemon: data, // 필터링된 데이터도 전체로 초기화
        loading: false, // 로딩 완료
      }));
    } catch (error) {
      // 에러 발생 시 에러 상태로 업데이트
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
    }
  };

  // 필터링된 포켓몬 데이터를 업데이트하는 함수
  // SearchContext에서 검색 결과를 업데이트할 때 사용
  const updateFilteredPokemon = (filteredData) => {
    setState((prev) => ({
      ...prev,
      filteredPokemon: filteredData,
    }));
  };

  // 컴포넌트가 마운트될 때 포켓몬 데이터 로드
  useEffect(() => {
    loadPokemonData();
  }, []); // 빈 의존성 배열 = 컴포넌트 마운트 시 한 번만 실행

  // Context에 제공할 값들
  const value = {
    ...state, // 현재 상태 (pokemonData, filteredPokemon, loading, error)
    loadPokemonData, // 데이터 다시 로드하는 함수
    updateFilteredPokemon, // 필터링된 데이터 업데이트 함수
  };

  // Context Provider로 자식 컴포넌트들에게 값 제공
  return (
    <PokemonContext.Provider value={value}>{children}</PokemonContext.Provider>
  );
};

// PokemonContext를 사용하는 커스텀 훅
// 컴포넌트에서 포켓몬 관련 상태와 함수를 쉽게 사용할 수 있게 해줌
export const usePokemon = () => {
  const context = useContext(PokemonContext);

  // Context가 Provider 밖에서 사용되면 에러 발생
  if (!context) {
    throw new Error("usePokemon must be used within a PokemonProvider");
  }

  return context;
};

export default PokemonContext;
