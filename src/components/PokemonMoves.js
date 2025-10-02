/**
 * PokemonMoves - 포켓몬 기술 목록 컴포넌트
 *
 * 이 파일은 포켓몬의 기술 목록을 표시하는 컴포넌트입니다.
 * 각 기술의 이름, 타입, 분류, 위력, 정확도, PP, 설명을 카드 형태로 표시합니다.
 *
 * 주요 기능:
 * 1. 기술 로딩 상태 표시
 * 2. 기술 정보 없음 표시
 * 3. 기술 목록 그리드 표시
 * 4. 한국어 번역 지원
 * 5. 기술 상세 스탯 표시
 *
 * 표시되는 정보:
 * - 기술명 (한국어 번역 + 영어 원문)
 * - 기술 타입 (색상으로 구분)
 * - 분류 (물리/특수/변화)
 * - 위력, 정확도, PP
 * - 기술 설명
 *
 * Props:
 * - pokemonMoves: 포켓몬 기술 배열
 * - loadingMoves: 기술 로딩 상태
 */
import React from "react";
import SkeletonMove from "./SkeletonMove";
import {
  TYPE_KOREAN_MAP,
  MOVE_CATEGORY_KOREAN_MAP,
  MOVE_TYPE_COLORS,
  MOVE_KOREAN_MAP,
} from "../constants/translations";

const PokemonMoves = ({ pokemonMoves, loadingMoves }) => {
  // 기술 로딩 중일 때 스켈레톤 UI 표시
  if (loadingMoves) {
    return (
      <div className="pokemon-moves">
        <h3>기술</h3>
        <div className="moves-grid">
          {Array.from({ length: 6 }, (_, index) => (
            <SkeletonMove key={index} />
          ))}
        </div>
      </div>
    );
  }

  // 기술 정보가 없을 때 표시
  if (!pokemonMoves || pokemonMoves.length === 0) {
    return (
      <div className="pokemon-moves">
        <h3>기술</h3>
        <div className="no-moves">기술 정보가 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="pokemon-moves">
      <h3>기술</h3>
      <div className="moves-grid">
        {/* 각 기술을 카드 형태로 표시 */}
        {pokemonMoves.map((move, index) => (
          <div key={index} className="move-card">
            {/* 기술 헤더 - 이름과 타입 */}
            <div className="move-header">
              <span className="move-name">
                {/* 한국어 번역 우선, 없으면 API에서 가져온 이름, 없으면 영어 이름 */}
                {MOVE_KOREAN_MAP[move.name] || move.koreanName || move.name}
                {/* 한국어 번역이 있고 영어 이름과 다를 때 영어 이름 표시 */}
                {/* {MOVE_KOREAN_MAP[move.name] &&
                  MOVE_KOREAN_MAP[move.name] !== move.name && (
                    <span className="move-english-name"> ({move.name})</span>
                  )} */}
              </span>
              {/* 기술 타입 - 색상으로 구분 */}
              <span
                className="move-type"
                style={{
                  backgroundColor: MOVE_TYPE_COLORS[move.type] || "#A8A878",
                }}
              >
                {TYPE_KOREAN_MAP[move.type] || move.type}
              </span>
            </div>

            {/* 기술 상세 스탯 */}
            <div className="move-stats">
              {/* 분류 (물리/특수/변화) */}
              <div className="move-stat">
                <span className="stat-label">분류:</span>
                <span className="stat-value">
                  {MOVE_CATEGORY_KOREAN_MAP[move.category] ||
                    move.category ||
                    "—"}
                </span>
              </div>

              {/* 위력 */}
              <div className="move-stat">
                <span className="stat-label">위력:</span>
                <span className="stat-value">
                  {move.power !== null && move.power !== undefined
                    ? move.power
                    : "—"}
                </span>
              </div>

              {/* 정확도 */}
              <div className="move-stat">
                <span className="stat-label">정확도:</span>
                <span className="stat-value">
                  {move.accuracy !== null && move.accuracy !== undefined
                    ? `${move.accuracy}%`
                    : "—"}
                </span>
              </div>

              {/* PP (Power Points) */}
              <div className="move-stat">
                <span className="stat-label">PP:</span>
                <span className="stat-value">
                  {move.pp !== null && move.pp !== undefined ? move.pp : "—"}
                </span>
              </div>
            </div>

            {/* 기술 설명 (있는 경우에만 표시) */}
            {move.description && (
              <div className="move-description">{move.description}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PokemonMoves;
