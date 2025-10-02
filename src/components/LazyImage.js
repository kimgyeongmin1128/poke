/**
 * LazyImage - 지연 로딩 이미지 컴포넌트
 *
 * 이 파일은 이미지 지연 로딩을 구현하는 컴포넌트입니다.
 * Intersection Observer API를 사용하여 이미지가 뷰포트에 들어올 때만 로드합니다.
 *
 * 주요 기능:
 * 1. 이미지 지연 로딩
 * 2. 로딩 상태 표시
 * 3. 에러 처리
 * 4. 플레이스홀더 이미지
 * 5. 성능 최적화
 *
 * 사용되는 곳:
 * - PokemonCard: 포켓몬 이미지
 * - PokemonDetail: 포켓몬 상세 이미지
 */
import React, { useState, useRef, useEffect } from "react";

const LazyImage = ({
  src,
  alt,
  className = "",
  placeholder = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00NSA0NUg3NVY3NUg0NVY0NVoiIGZpbGw9IiNEMUQ1REIiLz4KPC9zdmc+",
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  // Intersection Observer 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  // 이미지 로드 핸들러
  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  // 이미지 에러 핸들러
  const handleError = () => {
    setHasError(true);
    setIsLoaded(false);
  };

  return (
    <div
      ref={imgRef}
      className={`lazy-image-container ${className}`}
      {...props}
    >
      {isInView && (
        <img
          src={hasError ? placeholder : src}
          alt={alt}
          className={`lazy-image ${isLoaded ? "loaded" : "loading"}`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
        />
      )}
      {!isInView && (
        <div className="lazy-image-placeholder">
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  );
};

export default LazyImage;
