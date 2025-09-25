import axios from "axios";

// PokeAPI 기본 설정
const pokeApiInstance = axios.create({
  baseURL: "https://pokeapi.co/api/v2",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터
pokeApiInstance.interceptors.request.use(
  (config) => {
    console.log(`API 요청: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("요청 에러:", error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
pokeApiInstance.interceptors.response.use(
  (response) => {
    console.log(`API 응답: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("응답 에러:", error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export default pokeApiInstance;
