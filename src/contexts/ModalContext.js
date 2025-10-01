/**
 * ModalContext - 모달 및 포켓몬 상세 정보 관리 Context
 *
 * 이 파일은 포켓몬 상세 정보 모달과 관련된 상태를 관리하는 React Context입니다.
 * 모달 표시, 선택된 포켓몬, 상세 정보, 기술 정보 등을 전역적으로 관리합니다.
 *
 * 주요 기능:
 * 1. 모달 표시/숨김 상태 관리
 * 2. 선택된 포켓몬 정보 관리
 * 3. 포켓몬 상세 정보 (능력치, 특성 등) 로드
 * 4. 포켓몬 기술 정보 로드 및 관리
 * 5. 로딩 상태 및 에러 처리
 *
 * API 호출:
 * - 포켓몬 기본 정보: /pokemon/{id}
 * - 기술 상세 정보: /move/{move_name}
 *
 * 사용되는 곳:
 * - PokemonGrid: 포켓몬 클릭 시 모달 열기
 * - PokemonModal: 모달 표시
 * - PokemonDetail: 포켓몬 상세 정보 표시
 * - PokemonMoves: 포켓몬 기술 목록 표시
 */
import React, { createContext, useContext, useState, useRef } from "react";
import pokeApiInstance from "../api/axiosInstance";

// ModalContext의 초기 상태 정의
const initialState = {
  showModal: false, // 모달 표시 여부
  selectedPokemon: null, // 선택된 포켓몬 정보
  pokemonDetails: null, // 포켓몬 상세 정보 (능력치, 특성 등)
  pokemonMoves: null, // 포켓몬 기술 목록
  loadingDetails: false, // 상세 정보 로딩 상태
  loadingMoves: false, // 기술 정보 로딩 상태
  error: null, // 에러 메시지
};

// React Context 생성 - 모달 관련 상태를 전역적으로 공유
const ModalContext = createContext(initialState);

// ModalProvider 컴포넌트 - Context의 Provider 역할
export const ModalProvider = ({ children }) => {
  // useState로 모달 상태 관리
  const [state, setState] = useState(initialState);
  // 배경 스크롤 잠금을 위한 스크롤 위치 저장
  const scrollYRef = useRef(0);

  // 포켓몬 기술 정보를 API에서 가져오는 함수
  const loadPokemonMoves = async (pokemon) => {
    try {
      // 기술 로딩 시작
      setState((prev) => ({ ...prev, loadingMoves: true }));

      // 포켓몬의 기술 목록 가져오기
      const response = await pokeApiInstance.get(`/pokemon/${pokemon.id}`);
      const moves = response.data.moves;

      // 각 기술의 상세 정보를 병렬로 가져오기 (10개로 제한)
      const moveDetails = await Promise.all(
        moves.slice(0, 10).map(async (move) => {
          try {
            // 개별 기술의 상세 정보 가져오기
            const moveResponse = await pokeApiInstance.get(
              `/move/${move.move.name}`
            );
            const moveData = moveResponse.data;

            // 기술 정보 정리
            return {
              name: moveData.name, // 기술 영어 이름
              koreanName:
                moveData.names?.find((name) => name.language.name === "ko")
                  ?.name || moveData.name, // 한국어 이름
              type: moveData.type.name, // 기술 타입
              power: moveData.power, // 위력
              accuracy: moveData.accuracy, // 정확도
              pp: moveData.pp, // PP
              category: moveData.damage_class.name, // 분류 (물리/특수/변화)
              description:
                moveData.flavor_text_entries?.find(
                  (entry) => entry.language.name === "ko" // 한국어 설명 우선
                )?.flavor_text ||
                moveData.flavor_text_entries?.find(
                  (entry) => entry.language.name === "en" // 없으면 영어 설명
                )?.flavor_text ||
                `${moveData.name} 기술입니다.`, // 둘 다 없으면 기본 설명
            };
          } catch (error) {
            console.error(
              `기술 ${move.move.name} 정보를 가져오는데 실패:`,
              error
            );
            // API 호출 실패 시 기본값 반환
            return {
              name: move.move.name,
              koreanName: move.move.name,
              type: "normal",
              power: 50,
              accuracy: 100,
              pp: 20,
              category: "physical",
              description: `${move.move.name} 기술입니다.`,
            };
          }
        })
      );

      // null 값 제거 (실패한 API 호출 결과)
      const validMoves = moveDetails.filter((move) => move !== null);

      // 성공 시 상태 업데이트
      setState((prev) => ({
        ...prev,
        pokemonMoves: validMoves,
        loadingMoves: false,
      }));
    } catch (error) {
      console.error("포켓몬 기술 정보를 가져오는데 실패했습니다:", error);
      setState((prev) => ({
        ...prev,
        loadingMoves: false,
        error: error.message,
      }));
    }
  };

  // 모달을 열고 포켓몬 상세 정보를 로드하는 함수
  const openModal = async (pokemon) => {
    // 배경 스크롤 잠금 (iOS 포함 대응)
    scrollYRef.current = window.scrollY || window.pageYOffset;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollYRef.current}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.overflow = "hidden";
    document.body.style.width = "100%";

    // 모달 열기 상태로 설정
    setState((prev) => ({
      ...prev,
      showModal: true,
      selectedPokemon: pokemon,
      loadingDetails: true,
      error: null,
    }));

    try {
      // 포켓몬 상세 정보 가져오기
      const [detailsResponse] = await Promise.all([
        pokeApiInstance.get(`/pokemon/${pokemon.id}`),
      ]);

      const data = detailsResponse.data;

      // 능력치 정보 정리
      const stats = data.stats.map((stat) => ({
        name: stat.stat.name, // 능력치 이름 (hp, attack 등)
        value: stat.base_stat, // 능력치 수치
      }));

      // 키와 몸무게를 미터/킬로그램으로 변환
      const height = data.height / 10; // 10으로 나누면 미터 단위
      const weight = data.weight / 10; // 10으로 나누면 킬로그램 단위

      // 포켓몬 상세 정보 객체 생성
      const pokemonDetails = {
        stats, // 능력치 배열
        height, // 키
        weight, // 몸무게
        abilities: data.abilities.map((ability) => ability.ability.name), // 특성 배열
      };

      // 상세 정보 로딩 완료
      setState((prev) => ({
        ...prev,
        pokemonDetails,
        loadingDetails: false,
      }));

      // 기술 정보도 로드
      await loadPokemonMoves(pokemon);
    } catch (error) {
      console.error("포켓몬 상세 정보를 가져오는데 실패했습니다:", error);
      setState((prev) => ({
        ...prev,
        loadingDetails: false,
        error: error.message,
      }));
    }
  };

  // 모달을 닫고 모든 상태를 초기화하는 함수
  const closeModal = () => {
    // 배경 스크롤 잠금 해제 및 위치 복원
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.overflow = "";
    document.body.style.width = "";
    window.scrollTo(0, scrollYRef.current || 0);

    setState((prev) => ({
      ...prev,
      showModal: false, // 모달 숨김
      selectedPokemon: null, // 선택된 포켓몬 초기화
      pokemonDetails: null, // 상세 정보 초기화
      pokemonMoves: null, // 기술 정보 초기화
      loadingDetails: false, // 로딩 상태 초기화
      loadingMoves: false, // 로딩 상태 초기화
      error: null, // 에러 상태 초기화
    }));
  };

  // Context에 제공할 값들
  const value = {
    ...state, // 현재 상태 (showModal, selectedPokemon 등)
    openModal, // 모달 열기 함수
    closeModal, // 모달 닫기 함수
    loadPokemonMoves, // 기술 정보 로드 함수
  };

  // Context Provider로 자식 컴포넌트들에게 값 제공
  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};

// ModalContext를 사용하는 커스텀 훅
// 컴포넌트에서 모달 관련 상태와 함수를 쉽게 사용할 수 있게 해줌
export const useModal = () => {
  const context = useContext(ModalContext);

  // Context가 Provider 밖에서 사용되면 에러 발생
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }

  return context;
};

export default ModalContext;
