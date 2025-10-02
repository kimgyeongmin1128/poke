/**
 * Cache - API 응답 캐싱 유틸리티
 *
 * 이 파일은 API 응답을 메모리에 캐시하여 성능을 최적화하는 유틸리티입니다.
 * 동일한 요청에 대해 캐시된 데이터를 반환하여 불필요한 API 호출을 방지합니다.
 *
 * 주요 기능:
 * 1. 메모리 기반 캐싱
 * 2. TTL (Time To Live) 지원
 * 3. 캐시 크기 제한
 * 4. 캐시 무효화
 * 5. 성능 최적화
 *
 * 사용되는 곳:
 * - API 호출 함수들
 * - 데이터 페칭 최적화
 */
class Cache {
  constructor(maxSize = 100, defaultTTL = 5 * 60 * 1000) {
    // 5분 기본 TTL
    this.cache = new Map();
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL;
  }

  // 캐시 키 생성
  generateKey(url, params = {}) {
    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join("&");

    return sortedParams ? `${url}?${sortedParams}` : url;
  }

  // 캐시에서 데이터 가져오기
  get(key) {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    // TTL 확인
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    // 접근 시간 업데이트 (LRU 정책)
    item.lastAccessed = Date.now();
    return item.data;
  }

  // 캐시에 데이터 저장
  set(key, data, ttl = this.defaultTTL) {
    // 캐시 크기 확인
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }

    const item = {
      data,
      expiresAt: Date.now() + ttl,
      lastAccessed: Date.now(),
    };

    this.cache.set(key, item);
  }

  // LRU 정책으로 오래된 항목 제거
  evictLRU() {
    let oldestKey = null;
    let oldestTime = Date.now();

    for (const [key, item] of this.cache.entries()) {
      if (item.lastAccessed < oldestTime) {
        oldestTime = item.lastAccessed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  // 특정 키 삭제
  delete(key) {
    return this.cache.delete(key);
  }

  // 특정 패턴의 키들 삭제
  deletePattern(pattern) {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  // 전체 캐시 초기화
  clear() {
    this.cache.clear();
  }

  // 캐시 통계
  getStats() {
    const now = Date.now();
    let validItems = 0;
    let expiredItems = 0;

    for (const item of this.cache.values()) {
      if (now > item.expiresAt) {
        expiredItems++;
      } else {
        validItems++;
      }
    }

    return {
      total: this.cache.size,
      valid: validItems,
      expired: expiredItems,
      maxSize: this.maxSize,
    };
  }

  // 만료된 항목들 정리
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

// 전역 캐시 인스턴스
export const apiCache = new Cache(100, 5 * 60 * 1000); // 100개 항목, 5분 TTL

// 캐시된 API 호출 함수
export const cachedFetch = async (url, options = {}, ttl) => {
  const cacheKey = apiCache.generateKey(url, options.params || {});

  // 캐시에서 데이터 확인
  const cachedData = apiCache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  // 캐시에 없으면 API 호출
  try {
    const response = await fetch(url, options);
    const data = await response.json();

    // 성공적인 응답만 캐시
    if (response.ok) {
      apiCache.set(cacheKey, data, ttl);
    }

    return data;
  } catch (error) {
    console.error("API 호출 실패:", error);
    throw error;
  }
};

// 캐시 무효화 함수
export const invalidateCache = (pattern) => {
  if (pattern) {
    apiCache.deletePattern(pattern);
  } else {
    apiCache.clear();
  }
};

// 캐시 통계 확인
export const getCacheStats = () => {
  return apiCache.getStats();
};

// 정기적인 캐시 정리 (5분마다)
setInterval(() => {
  apiCache.cleanup();
}, 5 * 60 * 1000);

export default Cache;
