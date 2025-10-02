/**
 * pokestore.js - 포켓몬 API 데이터 관리
 *
 * 이 파일은 PokeAPI를 통해 포켓몬 관련 데이터를 가져오는 함수들을 제공합니다.
 * 포켓몬 목록, 한국어 이름, 타입 정보 등을 API에서 가져와서 처리합니다.
 *
 * 주요 기능:
 * 1. 포켓몬 기본 정보 로드 (1세대 151마리)
 * 2. 포켓몬 한국어 이름 로드
 * 3. 포켓몬 타입 정보 로드
 * 4. 병렬 API 호출로 성능 최적화
 * 5. 에러 처리 및 폴백
 *
 * API 엔드포인트:
 * - /pokemon: 포켓몬 목록
 * - /pokemon/{id}: 포켓몬 상세 정보
 * - /pokemon-species: 포켓몬 종류 정보 (한국어 이름 포함)
 * - /type: 포켓몬 타입 정보
 */
import pokeApiInstance from "./axiosInstance";
import { cachedFetch, invalidateCache, apiCache } from "../utils/cache";

/**
 * 포켓몬 데이터를 저장하는 전역 배열
 * 이 배열에는 모든 포켓몬의 정보가 저장됩니다
 */
export let arrPokemon = [];

/**
 * 가져올 포켓몬의 개수를 설정하는 상수 (axios 사용)
 */
const fetchNum = 500;

/**
 * 포켓몬의 기본 정보를 가져오는 함수
 * PokeAPI에서 포켓몬 목록을 가져와서 기본 정보를 구성합니다
 *
 * @returns {Array} 포켓몬 기본 정보 배열
 */
export const fetchPokestore = async () => {
  try {
    // axios 인스턴스로 HTTP 요청을 보냅니다
    const res = await pokeApiInstance.get(`/pokemon?limit=${fetchNum}`);

    // 응답 데이터는 res.data로 접근합니다
    const data = res.data;

    // API에서 받은 포켓몬 목록을 우리가 사용하기 편한 형태로 변환합니다
    const loadedPokemon = data.results.map((pokemon, index) => {
      return {
        name: pokemon.name, // 포켓몬의 영어 이름
        id: index + 1, // 포켓몬의 번호 (1부터 시작)
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
          index + 1
        }.png`, // 포켓몬 이미지 URL
        koreanName: null, // 한국어 이름 (나중에 추가됨)
      };
    });

    // 전역 배열에 포켓몬 데이터를 저장합니다
    arrPokemon = loadedPokemon;
    return loadedPokemon;
  } catch (error) {
    // 에러가 발생하면 빈 배열을 반환합니다
    return [];
  }
};

/**
 * 포켓몬의 한국어 이름을 가져오는 함수
 * 각 포켓몬의 species 정보에서 한국어 이름을 찾아서 추가합니다
 *
 * @param {Array} pokemonList - 포켓몬 데이터 배열
 * @returns {Promise<Array>} 한국어 이름이 추가된 포켓몬 데이터 배열
 */
export const loadKoreanNames = async (pokemonList) => {
  try {
    // 포켓몬 종류 정보 가져오기 (한국어 이름 포함)
    const speciesResponse = await pokeApiInstance.get(
      `/pokemon-species?limit=${fetchNum}`
    );
    const speciesList = speciesResponse.data.results;

    // 각 포켓몬 종류의 한국어 이름을 병렬로 가져오기
    const koreanNames = await Promise.all(
      speciesList.map(async (species) => {
        try {
          const speciesDetailResponse = await pokeApiInstance.get(species.url);
          const speciesData = speciesDetailResponse.data;

          // 한국어 이름 찾기
          const koreanName = speciesData.names.find(
            (name) => name.language.name === "ko"
          )?.name;

          return {
            id: speciesData.id,
            koreanName: koreanName || null, // 한국어 이름이 없으면 null로 표시
          };
        } catch (error) {
          console.error(
            `포켓몬 종류 ${species.name} 정보를 가져오는데 실패:`,
            error
          );
          // 실패 시 URL에서 ID 추출하여 기본값 반환
          return {
            id: species.url.split("/").slice(-2, -1)[0],
            koreanName: species.name,
          };
        }
      })
    );

    // 포켓몬 데이터에 한국어 이름 추가
    const pokemonWithKoreanNames = pokemonList.map((pokemon) => {
      const koreanNameData = koreanNames.find(
        (nameData) => nameData.id === pokemon.id
      );
      return {
        ...pokemon,
        koreanName: koreanNameData?.koreanName || pokemon.name, // 한국어 이름이 없으면 영어 이름 사용
      };
    });

    return pokemonWithKoreanNames;
  } catch (error) {
    console.error("한국어 이름을 가져오는데 실패했습니다:", error);
    // 실패 시 원본 데이터 반환
    return pokemonList;
  }
};

/**
 * 모든 포켓몬 데이터를 가져오는 메인 함수
 * 설정된 개수만큼 포켓몬의 기본 정보와 한국어 이름을 가져옵니다.
 *
 * @returns {Promise<Array>} 포켓몬 데이터 배열
 * @throws {Error} API 호출 실패 시 에러 발생
 */
export const loadAllPokemonData = async () => {
  try {
    // 캐시 키 생성
    const cacheKey = `pokemon-list-${fetchNum}`;

    // 캐시에서 데이터 확인
    const cachedData = apiCache.get(cacheKey);
    if (cachedData) {
      console.log("포켓몬 데이터를 캐시에서 로드했습니다.");
      return cachedData;
    }

    // 설정된 개수만큼 포켓몬 가져오기
    const response = await pokeApiInstance.get(`/pokemon?limit=${fetchNum}`);
    const pokemonList = response.data.results;

    // 각 포켓몬의 상세 정보를 병렬로 가져오기 (성능 최적화)
    const pokemonDetails = await Promise.all(
      pokemonList.map(async (pokemon) => {
        try {
          const detailResponse = await pokeApiInstance.get(pokemon.url);
          const data = detailResponse.data;

          // 포켓몬 기본 정보 구성
          const pokemonData = {
            id: data.id, // 포켓몬 ID
            name: data.name, // 영어 이름
            koreanName: null, // 한국어 이름 (별도로 가져올 예정)
            image: data.sprites.other["official-artwork"].front_default, // 공식 일러스트
            types: data.types.map((type) => type.type.name), // 타입 배열
          };

          return pokemonData;
        } catch (error) {
          console.error(
            `포켓몬 ${pokemon.name} 상세 정보를 가져오는데 실패:`,
            error
          );
          return null; // 실패한 포켓몬은 null로 처리
        }
      })
    );

    // null 값 제거 (실패한 API 호출 결과)
    const validPokemon = pokemonDetails.filter((pokemon) => pokemon !== null);

    // 한국어 이름 가져오기
    const pokemonWithKoreanNames = await loadKoreanNames(validPokemon);

    // 결과를 캐시에 저장 (10분 TTL)
    apiCache.set(cacheKey, pokemonWithKoreanNames, 10 * 60 * 1000);
    console.log("포켓몬 데이터를 캐시에 저장했습니다.");

    return pokemonWithKoreanNames;
  } catch (error) {
    console.error("포켓몬 데이터를 가져오는데 실패했습니다:", error);
    throw error;
  }
};

/**
 * 특정 포켓몬의 상세 정보를 가져오는 함수
 * 포켓몬 ID를 받아서 상세 정보를 반환합니다.
 *
 * @param {number} pokemonId - 포켓몬 ID
 * @returns {Promise<Object>} 포켓몬 상세 정보
 * @throws {Error} API 호출 실패 시 에러 발생
 */
export const loadPokemonDetails = async (pokemonId) => {
  try {
    // 캐시 키 생성
    const cacheKey = `pokemon-details-${pokemonId}`;

    // 캐시에서 데이터 확인
    const cachedData = apiCache.get(cacheKey);
    if (cachedData) {
      console.log(`포켓몬 ${pokemonId} 상세 정보를 캐시에서 로드했습니다.`);
      return cachedData;
    }

    // 포켓몬 상세 정보 가져오기
    const response = await pokeApiInstance.get(`/pokemon/${pokemonId}`);
    const data = response.data;

    // 포켓몬 상세 정보 구성
    const pokemonDetails = {
      id: data.id,
      name: data.name,
      koreanName: null, // 한국어 이름은 별도로 가져올 예정
      image: data.sprites.other["official-artwork"].front_default,
      types: data.types.map((type) => type.type.name),
      stats: data.stats,
      abilities: data.abilities,
      height: data.height,
      weight: data.weight,
    };

    // 한국어 이름 가져오기
    try {
      const speciesResponse = await pokeApiInstance.get(
        `/pokemon-species/${pokemonId}`
      );
      const speciesData = speciesResponse.data;

      const koreanName = speciesData.names.find(
        (name) => name.language.name === "ko"
      )?.name;

      if (koreanName) {
        pokemonDetails.koreanName = koreanName;
      }
    } catch (error) {
      console.warn(
        `포켓몬 ${pokemonId}의 한국어 이름을 가져오는데 실패:`,
        error
      );
    }

    // 결과를 캐시에 저장 (30분 TTL)
    apiCache.set(cacheKey, pokemonDetails, 30 * 60 * 1000);
    console.log(`포켓몬 ${pokemonId} 상세 정보를 캐시에 저장했습니다.`);

    return pokemonDetails;
  } catch (error) {
    console.error(`포켓몬 ${pokemonId} 상세 정보를 가져오는데 실패:`, error);
    throw error;
  }
};

/**
 * 포켓몬 타입 정보를 가져오는 함수
 * 모든 포켓몬 타입의 정보와 한국어 이름을 가져옵니다.
 *
 * @returns {Promise<Array>} 타입 정보 배열
 * @throws {Error} API 호출 실패 시 에러 발생
 */
export const loadPokemonTypes = async () => {
  try {
    const response = await pokeApiInstance.get("/type");
    const types = response.data.results;

    // 각 타입의 상세 정보를 병렬로 가져오기
    const typeDetails = await Promise.all(
      types.map(async (type) => {
        try {
          const typeResponse = await pokeApiInstance.get(type.url);
          const typeData = typeResponse.data;

          return {
            id: typeData.id,
            name: typeData.name,
            koreanName:
              typeData.names.find((name) => name.language.name === "ko")
                ?.name || typeData.name, // 한국어 이름이 없으면 영어 이름 사용
          };
        } catch (error) {
          console.error(`타입 ${type.name} 정보를 가져오는데 실패:`, error);
          // 실패 시 URL에서 ID 추출하여 기본값 반환
          return {
            id: type.url.split("/").slice(-2, -1)[0],
            name: type.name,
            koreanName: type.name,
          };
        }
      })
    );

    return typeDetails;
  } catch (error) {
    console.error("타입 정보를 가져오는데 실패했습니다:", error);
    throw error;
  }
};
