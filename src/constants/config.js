// API 관련 상수
export const API_CONFIG = {
  FETCH_NUM: 154, // 가져올 포켓몬 개수
  TIMEOUT: 10000, // API 타임아웃 (ms)
  MAX_STAT_VALUE: 255, // 최대 능력치 값
};

// 이미지 관련 상수
export const IMAGE_CONFIG = {
  POKEMON_IMAGE_SIZE: 120, // 포켓몬 카드 이미지 크기 (px)
  POKEMON_DETAIL_IMAGE_SIZE: 200, // 상세보기 이미지 크기 (px)
  LOGO_WIDTH: 150, // 로고 너비 (px)
  LOGO_HEIGHT: 50, // 로고 높이 (px)
};

// 애니메이션 관련 상수
export const ANIMATION_CONFIG = {
  CARD_HOVER_DURATION: 200, // 카드 호버 애니메이션 (ms)
  MODAL_TRANSITION_DURATION: 240, // 모달 전환 애니메이션 (ms)
  STAT_BAR_DURATION: 300, // 능력치 바 애니메이션 (ms)
};

// 레이아웃 관련 상수
export const LAYOUT_CONFIG = {
  GRID_MIN_WIDTH: 200, // 그리드 최소 너비 (px)
  GRID_GAP: 20, // 그리드 간격 (px)
  MODAL_MAX_WIDTH: 600, // 모달 최대 너비 (px)
  MODAL_MAX_HEIGHT: 80, // 모달 최대 높이 (%)
};

// 색상 관련 상수
export const COLOR_CONFIG = {
  PRIMARY_BACKGROUND: "#ffffff",
  SECONDARY_BACKGROUND: "#f5f5f5",
  MODAL_OVERLAY: "rgba(0, 0, 0, 0.8)",
  SEARCH_BACKGROUND: "#393939",
  SEARCH_INPUT_BACKGROUND: "#0e0e0e",
};

// 텍스트 관련 상수
export const TEXT_CONFIG = {
  POKEMON_NAME_SIZE: 18, // 포켓몬 이름 폰트 크기 (px)
  POKEMON_ID_SIZE: 14, // 포켓몬 번호 폰트 크기 (px)
  DETAIL_NAME_SIZE: 32, // 상세보기 이름 폰트 크기 (px)
  DETAIL_ID_SIZE: 18, // 상세보기 번호 폰트 크기 (px)
};
