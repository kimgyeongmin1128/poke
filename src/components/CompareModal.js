/**
 * CompareModal - 포켓몬 비교 모달 컴포넌트
 *
 * 이 파일은 선택된 포켓몬들을 비교하여 표시하는 모달 컴포넌트입니다.
 * 두 포켓몬의 능력치, 타입, 스탯 등을 나란히 비교할 수 있습니다.
 *
 * 주요 기능:
 * 1. 두 포켓몬의 기본 정보 비교
 * 2. 능력치 비교 (HP, 공격, 방어, 특수공격, 특수방어, 스피드)
 * 3. 타입 비교
 * 4. 기술 비교
 * 5. 모달 닫기 및 비교 목록 초기화
 *
 * 사용되는 곳:
 * - CompareContext에서 모달 상태 관리
 */
import React, { useState, useEffect } from "react";
import { useCompare } from "../hooks/useCompare";
import { loadPokemonDetails } from "../api/pokestore";
import { TYPE_KOREAN_MAP } from "../constants/translations";

const CompareModal = () => {
  const {
    compareList,
    isCompareModalOpen,
    closeCompareModal,
    clearCompareList,
  } = useCompare();

  const [pokemonDetails, setPokemonDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  // 포켓몬 상세 정보 로드
  useEffect(() => {
    if (isCompareModalOpen && compareList.length > 0) {
      setLoading(true);

      const loadDetails = async () => {
        try {
          const details = await Promise.all(
            compareList.map((pokemon) => loadPokemonDetails(pokemon.id))
          );
          setPokemonDetails(details);
        } catch (error) {
          console.error("포켓몬 상세 정보 로드 실패:", error);
        } finally {
          setLoading(false);
        }
      };

      loadDetails();
    }
  }, [isCompareModalOpen, compareList]);

  // 모달이 닫힐 때 상태 초기화
  const handleClose = () => {
    closeCompareModal();
    setPokemonDetails([]);
  };

  // 모달이 열려있지 않으면 렌더링하지 않음
  if (!isCompareModalOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-content compare-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>포켓몬 비교</h2>
          <button className="modal-close" onClick={handleClose}>
            ×
          </button>
        </div>

        {loading ? (
          <div className="compare-loading">
            <div className="loading-spinner"></div>
            <span>포켓몬 정보를 불러오는 중...</span>
          </div>
        ) : (
          <div className="compare-content">
            {pokemonDetails.map((pokemon, index) => (
              <div key={pokemon.id} className="compare-pokemon">
                <div className="compare-pokemon-header">
                  <img
                    src={pokemon.image}
                    alt={pokemon.name}
                    className="compare-pokemon-image"
                  />
                  <div className="compare-pokemon-info">
                    <h3 className="compare-pokemon-name">
                      {pokemon.koreanName || pokemon.name}
                    </h3>
                    <p className="compare-pokemon-id">#{pokemon.id}</p>
                    <div className="compare-pokemon-types">
                      {pokemon.types.map((type) => (
                        <span
                          key={type}
                          className={`pokemon-type pokemon-type-${type}`}
                        >
                          {TYPE_KOREAN_MAP[type] || type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="compare-stats">
                  <h4>능력치</h4>
                  <div className="stats-grid">
                    {pokemon.stats.map((stat) => (
                      <div key={stat.stat.name} className="stat-item">
                        <span className="stat-name">
                          {getStatKoreanName(stat.stat.name)}
                        </span>
                        <div className="stat-bar">
                          <div
                            className="stat-fill"
                            style={{
                              width: `${(stat.base_stat / 255) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="stat-value">{stat.base_stat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="compare-abilities">
                  <h4>특성</h4>
                  <div className="abilities-list">
                    {pokemon.abilities.map((ability) => (
                      <span key={ability.ability.name} className="ability-item">
                        {ability.ability.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="compare-actions">
          <button className="clear-compare-btn" onClick={clearCompareList}>
            비교 목록 초기화
          </button>
          <button className="close-compare-btn" onClick={handleClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

// 스탯 한국어 이름 변환 함수
const getStatKoreanName = (statName) => {
  const statMap = {
    hp: "HP",
    attack: "공격",
    defense: "방어",
    "special-attack": "특수공격",
    "special-defense": "특수방어",
    speed: "스피드",
  };
  return statMap[statName] || statName;
};

export default CompareModal;
