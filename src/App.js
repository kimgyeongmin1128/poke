import React from "react";
import axios from "axios";
import pokemonLogo from "./img/pokemon_logo.png";
import {
  NotepadText,
  Gamepad2,
  CreditCard,
  TvMinimalPlay,
  Store,
  Book,
  Search,
  User,
} from "lucide-react";
import "./App.css";
import { loadAllPokemonData } from "./api/pokestore";

function App() {
  const [pokemonData, setPokemonData] = React.useState([]);
  const [filteredPokemon, setFilteredPokemon] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedPokemon, setSelectedPokemon] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);
  const [pokemonDetails, setPokemonDetails] = React.useState(null);

  const typeKoreanMap = {
    normal: "노말",
    fire: "불꽃",
    water: "물",
    electric: "전기",
    grass: "풀",
    ice: "얼음",
    fighting: "격투",
    poison: "독",
    ground: "땅",
    flying: "비행",
    psychic: "에스퍼",
    bug: "벌레",
    rock: "바위",
    ghost: "고스트",
    dragon: "드래곤",
    dark: "악",
    steel: "강철",
    fairy: "페어리",
  };

  const statKoreanMap = {
    hp: "HP",
    attack: "공격",
    defense: "방어",
    "special-attack": "특수공격",
    "special-defense": "특수방어",
    speed: "속도",
  };

  const abilityKoreanMap = {
    overgrow: "심록",
    blaze: "맹화",
    torrent: "급류",
    static: "정전기",
    "lightning-rod": "피뢰침",
    "sand-veil": "모래숨기",
    "swift-swim": "쓸쓸한",
    chlorophyll: "엽록소",
    "run-away": "도주",
    "keen-eye": "날카로운눈",
    "tangled-feet": "갈지자걸음",
    "big-pecks": "부풀린가슴",
    hustle: "의욕",
    "inner-focus": "정신력",
    "magic-guard": "마법방어",
    regenerator: "재생력",
    "mold-breaker": "틀깨기",
    "super-luck": "대운",
    infiltrator: "틈새포착",
    moxie: "자기과신",
    intimidate: "위협",
    adaptability: "적응력",
    anticipation: "예지",
    aftermath: "폭탄",
    "anger-point": "분노의경혈",
    "arena-trap": "개미지옥",
    "battle-armor": "갑옷",
    "clear-body": "투명",
    "cloud-nine": "날씨부정",
    "color-change": "변색",
    "compound-eyes": "복안",
    "cute-charm": "헤롱헤롱",
    damp: "습기",
    drizzle: "잔비",
    drought: "가뭄",
    "dry-skin": "건조피부",
    "early-bird": "일찍일어나기",
    "effect-spore": "포자",
    "flame-body": "불꽃몸",
    "flash-fire": "타오르는불꽃",
    forecast: "날씨변화",
    guts: "근성",
    heatproof: "내열",
    hydration: "촉촉한몸",
    "ice-body": "아이스바디",
    immunity: "면역",
    insomnia: "불면",
    "iron-fist": "철주먹",
    "leaf-guard": "리프가드",
    levitate: "부유",
    limber: "유연",
    "liquid-ooze": "점성",
    "magma-armor": "마그마의무장",
    "magnet-pull": "자력",
    "marvel-scale": "이상한비늘",
    minimize: "작아지기",
    "natural-cure": "자연회복",
    "no-guard": "노가드",
    oblivious: "둔감",
    overcoat: "방진",
    "own-tempo": "마이페이스",
    pickup: "픽업",
    plus: "플러스",
    "poison-point": "독가시",
    "poison-touch": "독수",
    pressure: "압박",
    "pure-power": "순수한힘",
    "quick-feet": "속보",
    "rain-dish": "촉촉한몸",
    reckless: "무모",
    "rock-head": "돌머리",
    "rough-skin": "까칠까칠",
    "sand-rush": "모래헤치기",
    "sand-stream": "모래날림",
    scrappy: "배짱",
    "serene-grace": "하늘의은총",
    "shadow-tag": "그림자밟기",
    "shed-skin": "탈피",
    "shell-armor": "조가비갑옷",
    "shield-dust": "방진",
    simple: "단순",
    "skill-link": "스킬링크",
    "slow-start": "슬로스타트",
    sniper: "스나이퍼",
    "snow-cloak": "눈숨기",
    "snow-warning": "눈퍼뜨리기",
    "solar-power": "솔라파워",
    "solid-rock": "하드록",
    soundproof: "방음",
    "speed-boost": "가속",
    stench: "악취",
    "sticky-hold": "끈적끈적",
    "storm-drain": "급류",
    "strong-jaw": "강한턱",
    sturdy: "옹골참",
    "suction-cups": "흡반",
    swarm: "벌레의알림",
    "sweet-veil": "스위트베일",
    synchronize: "싱크로",
    technician: "테크니션",
    "thick-fat": "두꺼운지방",
    "tinted-lens": "색안경",
    trace: "트레이스",
    truant: "게으름",
    unaware: "천진",
    unburden: "무게감소",
    unnerve: "긴장감",
    "vital-spirit": "의기양양",
    "volt-absorb": "전기흡수",
    "water-absorb": "저수",
    "water-veil": "수면",
    "white-smoke": "하얀연기",
    "wonder-guard": "특수",
    "wonder-skin": "신기한피부",
    "zen-mode": "달마모드",
  };

  // 컴포넌트가 처음 렌더링될 때 포켓몬 데이터를 가져오는 useEffect
  React.useEffect(() => {
    loadAllPokemonData().then((data) => {
      setPokemonData(data);
      setFilteredPokemon(data);
      setLoading(false);
    });
  }, []);

  // 검색어가 변경될 때마다 포켓몬 목록을 필터링하는 useEffect
  React.useEffect(() => {
    if (!searchTerm) {
      setFilteredPokemon(pokemonData);
    } else {
      const searchLower = searchTerm.toLowerCase();
      const filtered = pokemonData.filter((pokemon) => {
        const koreanName = (
          pokemon.koreanName ||
          pokemon.name ||
          ""
        ).toLowerCase();
        return koreanName.includes(searchLower);
      });
      setFilteredPokemon(filtered);
    }
  }, [searchTerm, pokemonData]);

  // 포켓몬 카드 클릭 핸들러
  const handlePokemonClick = async (pokemon) => {
    setSelectedPokemon(pokemon);
    setShowModal(true);

    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${pokemon.id}`
      );
      const data = response.data;
      const stats = data.stats.map((stat) => ({
        name: stat.stat.name,
        value: stat.base_stat,
      }));
      const height = data.height / 10;
      const weight = data.weight / 10;
      setPokemonDetails({
        stats,
        height,
        weight,
        abilities: data.abilities.map((ability) => ability.ability.name),
      });
    } catch (error) {
      console.error("포켓몬 상세 정보를 가져오는데 실패했습니다:", error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPokemon(null);
    setPokemonDetails(null);
  };

  return (
    <div className="app-container">
      <div className="logo-container">
        <img src={pokemonLogo} alt="pokemon_logo" />
        <ul className="nav-list">
          <li>
            <a href="#">
              <NotepadText className="nav-icon" />
              소식
            </a>
          </li>
          <li>
            <a href="#">
              <Gamepad2 className="nav-icon" />
              게임
            </a>
          </li>
          <li>
            <a href="#">
              <CreditCard className="nav-icon" />
              카드 게임
            </a>
          </li>
          <li>
            <a href="#">
              <TvMinimalPlay className="nav-icon" />
              애니메이션
            </a>
          </li>
          <li>
            <a href="#">
              <Store className="nav-icon" />
              상품
            </a>
          </li>
        </ul>
        <div className="nav-search-container">
          <ul className="nav-search-list">
            <li>
              <a href="pokebooks.tsx">
                <Book className="nav-search-icon" />
                포켓몬 도감
              </a>
            </li>
            <li>
              <a href="pokebooks.tsx">
                <User className="nav-search-icon" />
                로그인
              </a>
            </li>
            <li>
              <a href="pokebooks.tsx">
                <Search className="nav-search-icon" />
                통합검색
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="search-container">
        <div className="search-container-title">포켓몬 도감</div>
        <input
          type="text"
          placeholder="포켓몬 이름을 입력해주세요"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="pokemon-grid">
        {loading ? (
          <div className="loading">포켓몬 데이터를 불러오는 중...</div>
        ) : filteredPokemon.length === 0 ? (
          <div className="no-results">
            <p>검색 결과가 없습니다.</p>
            <p>다른 검색어를 시도해보세요.</p>
          </div>
        ) : (
          filteredPokemon.map((pokemon) => (
            <div
              key={pokemon.id}
              className="pokemon-card"
              onClick={() => handlePokemonClick(pokemon)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={pokemon.image}
                alt={pokemon.koreanName || pokemon.name}
                className="pokemon-image"
              />
              <div className="pokemon-info">
                <h3 className="pokemon-name">
                  {pokemon.koreanName || pokemon.name}
                </h3>
                <p className="pokemon-id">#{pokemon.id}</p>
                <div className="pokemon-types">
                  {pokemon.types &&
                    pokemon.types.map((type, index) => (
                      <span
                        key={index}
                        className={`pokemon-type pokemon-type-${type}`}
                      >
                        {typeKoreanMap[type] || type}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && selectedPokemon && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              ×
            </button>

            <div className="pokemon-detail">
              <div className="pokemon-detail-header">
                <img
                  src={selectedPokemon.image}
                  alt={selectedPokemon.koreanName || selectedPokemon.name}
                  className="pokemon-detail-image"
                />
                <div className="pokemon-detail-info">
                  <h2 className="pokemon-detail-name">
                    {selectedPokemon.koreanName || selectedPokemon.name}
                  </h2>
                  <p className="pokemon-detail-id">#{selectedPokemon.id}</p>
                  <div className="pokemon-detail-types">
                    {selectedPokemon.types &&
                      selectedPokemon.types.map((type, index) => (
                        <span
                          key={index}
                          className={`pokemon-type pokemon-type-${type}`}
                        >
                          {typeKoreanMap[type] || type}
                        </span>
                      ))}
                  </div>
                </div>
              </div>

              {pokemonDetails && (
                <div className="pokemon-detail-stats">
                  <h3>기본 정보</h3>
                  <div className="pokemon-basic-info">
                    <div className="info-item">
                      <span className="info-label">키</span>
                      <span className="info-value">
                        {pokemonDetails.height}m
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">몸무게</span>
                      <span className="info-value">
                        {pokemonDetails.weight}kg
                      </span>
                    </div>
                  </div>

                  <h3>능력치</h3>
                  <div className="pokemon-stats">
                    {pokemonDetails.stats.map((stat, index) => (
                      <div key={index} className="stat-item">
                        <span className="stat-name">
                          {statKoreanMap[stat.name] || stat.name}
                        </span>
                        <div className="stat-bar">
                          <div
                            className="stat-fill"
                            style={{ width: `${(stat.value / 255) * 100}%` }}
                          ></div>
                        </div>
                        <span className="stat-value">{stat.value}</span>
                      </div>
                    ))}
                  </div>

                  <h3>특성</h3>
                  <div className="pokemon-abilities">
                    {pokemonDetails.abilities.map((ability, index) => (
                      <span key={index} className="ability-tag">
                        {abilityKoreanMap[ability] || ability}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
