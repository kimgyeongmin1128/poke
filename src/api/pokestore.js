/**
 * 포켓몬 API 데이터 관리 파일
 *
 * 이 파일은 PokeAPI를 사용해서 포켓몬 데이터를 가져오고 관리하는 기능을 제공합니다.
 *
 * 주요 기능:
 * 1. fetchPokestore() - 포켓몬 기본 정보 가져오기 (이름, ID, 이미지)
 * 2. fetchKoreanNames() - 포켓몬 한국어 이름 가져오기
 * 3. fetchPokemonTypes() - 포켓몬 타입 정보 가져오기 (불꽃, 물, 풀 등)
 * 4. loadAllPokemonData() - 위의 모든 데이터를 순차적으로 로딩하는 통합 함수
 *
 * API 호출 과정:
 * - PokeAPI는 무료 포켓몬 데이터 API입니다
 * - 여러 API 엔드포인트를 조합해서 완전한 포켓몬 정보를 구성합니다
 * - Promise.all을 사용해서 여러 API를 동시에 호출하여 성능을 최적화합니다
 */

import axios from "axios";

/**
 * 포켓몬 데이터를 저장하는 전역 배열
 * 이 배열에는 모든 포켓몬의 정보가 저장됩니다
 */
export let arrPokemon = [];

/**
 * 가져올 포켓몬의 개수를 설정하는 상수 (axios 사용)
 */
const fetchNum = 154;

/**
 * 포켓몬의 기본 정보를 가져오는 함수
 * PokeAPI에서 포켓몬 목록을 가져와서 기본 정보를 구성합니다
 * @returns {Array} 포켓몬 기본 정보 배열
 */
export const fetchPokestore = async () => {
  try {
    // PokeAPI에서 포켓몬 목록을 가져오는 URL 생성
    // limit 파라미터로 가져올 포켓몬 개수를 지정합니다
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${fetchNum}`;

    // axios.get으로 HTTP 요청을 보냅니다
    const res = await axios.get(url);

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
 * @returns {Object} 포켓몬 ID를 키로 하는 한국어 이름 객체
 */
export const fetchKoreanNames = async () => {
  try {
    // 각 포켓몬의 species 정보를 가져오기 위한 URL 배열을 생성합니다
    const urls = [];

    // 1번부터 fetchNum까지의 포켓몬 species API URL을 생성합니다
    for (let i = 1; i <= fetchNum; i++) {
      urls.push(`https://pokeapi.co/api/v2/pokemon-species/${i}`);
    }

    // 모든 URL에 동시에 요청을 보내기 위해 axios.get 요청 배열로 만듭니다
    const requests = urls.map((url) => axios.get(url));

    // Promise.all을 사용해서 모든 요청이 완료될 때까지 기다립니다
    const responses = await Promise.all(requests);

    // 각 응답의 data를 추출합니다
    const results = responses.map((res) => res.data);

    // 한국어 이름을 저장할 객체를 생성합니다
    const koreanNames = {};

    // 각 포켓몬의 결과에서 한국어 이름을 찾습니다
    results.forEach((result, index) => {
      // names 배열에서 언어가 "ko"인 이름을 찾습니다
      const koreanName = result.names.find(
        (name) => name.language.name === "ko"
      );

      // 한국어 이름이 있으면 저장합니다
      if (koreanName) {
        koreanNames[index + 1] = koreanName.name;
      }
    });

    // 기존 포켓몬 배열에 한국어 이름을 추가합니다
    arrPokemon = arrPokemon.map((pokemon) => ({
      ...pokemon, // 기존 정보는 그대로 유지
      koreanName: koreanNames[pokemon.id] || pokemon.name, // 한국어 이름이 없으면 영어 이름 사용
    }));

    return koreanNames;
  } catch (error) {
    // 에러가 발생하면 빈 객체를 반환합니다
    return {};
  }
};

/**
 * 포켓몬의 타입 정보를 가져오는 함수
 * 각 포켓몬의 상세 정보에서 타입(불꽃, 물, 풀 등)을 가져와서 추가합니다
 * @returns {Object} 포켓몬 ID를 키로 하는 타입 배열 객체
 */
export const fetchPokemonTypes = async () => {
  try {
    // 각 포켓몬의 상세 정보를 가져오기 위한 URL 배열을 생성합니다
    const urls = [];

    // 1번부터 fetchNum까지의 포켓몬 상세 API URL을 생성합니다
    for (let i = 1; i <= fetchNum; i++) {
      urls.push(`https://pokeapi.co/api/v2/pokemon/${i}`);
    }

    // 모든 URL에 동시에 요청을 보내기 위해 axios.get 요청 배열로 만듭니다
    const requests = urls.map((url) => axios.get(url));

    // Promise.all을 사용해서 모든 요청이 완료될 때까지 기다립니다
    const responses = await Promise.all(requests);

    // 각 응답의 data를 추출합니다
    const results = responses.map((res) => res.data);

    // 포켓몬 타입을 저장할 객체를 생성합니다
    const pokemonTypes = {};

    // 각 포켓몬의 결과에서 타입 정보를 추출합니다
    results.forEach((result, index) => {
      // types 배열에서 각 타입의 이름을 추출합니다
      const types = result.types.map((type) => type.type.name);
      pokemonTypes[index + 1] = types;
    });

    // 기존 포켓몬 배열에 타입 정보를 추가합니다
    arrPokemon = arrPokemon.map((pokemon) => ({
      ...pokemon, // 기존 정보는 그대로 유지
      types: pokemonTypes[pokemon.id] || [], // 타입 정보가 없으면 빈 배열 사용
    }));

    return pokemonTypes;
  } catch (error) {
    // 에러가 발생하면 빈 객체를 반환합니다
    return {};
  }
};

/**
 * 모든 포켓몬 데이터를 순차적으로 로딩하는 통합 함수
 * 기본 정보 → 한국어 이름 → 타입 정보 순서로 데이터를 가져와서 완성합니다
 * @returns {Array} 완성된 포켓몬 데이터 배열
 */
export const loadAllPokemonData = async () => {
  try {
    // 1단계: 포켓몬의 기본 정보를 먼저 가져옵니다 (이름, ID, 이미지)
    await fetchPokestore();

    // 2단계: 포켓몬의 한국어 이름을 가져와서 추가합니다
    await fetchKoreanNames();

    // 3단계: 포켓몬의 타입 정보를 가져와서 추가합니다
    await fetchPokemonTypes();

    // 모든 데이터가 완성된 포켓몬 배열을 반환합니다
    return arrPokemon;
  } catch (error) {
    // 에러가 발생하면 빈 배열을 반환합니다
    return [];
  }
};

// 페이지가 로드될 때 자동으로 모든 포켓몬 데이터를 가져옵니다
loadAllPokemonData();
