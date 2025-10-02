/**
 * ThemeContext - 다크/라이트 모드 테마 관리 Context
 *
 * 이 파일은 애플리케이션의 테마(다크/라이트 모드)를 관리하는 React Context입니다.
 * 사용자의 테마 선호도를 저장하고 전역적으로 테마를 관리합니다.
 *
 * 주요 기능:
 * 1. 다크/라이트 모드 상태 관리
 * 2. 로컬 스토리지에 테마 선호도 저장
 * 3. 시스템 테마 감지
 * 4. 테마 전환 함수 제공
 *
 * 사용되는 곳:
 * - Header: 테마 토글 버튼
 * - 전체 애플리케이션: CSS 변수를 통한 테마 적용
 */
import React, { createContext, useContext, useState, useEffect } from "react";

// ThemeContext의 초기 상태 정의
const initialState = {
  isDarkMode: false, // 다크 모드 여부
  theme: "light", // 현재 테마 (light/dark)
};

// React Context 생성 - 테마 관련 상태를 전역적으로 공유
const ThemeContext = createContext(initialState);

// ThemeProvider 컴포넌트 - Context의 Provider 역할
export const ThemeProvider = ({ children }) => {
  // useState로 테마 상태 관리
  const [state, setState] = useState(initialState);

  // 테마 전환 함수
  const toggleTheme = () => {
    setState((prev) => {
      const newTheme = prev.isDarkMode ? "light" : "dark";
      const newIsDarkMode = !prev.isDarkMode;

      // 로컬 스토리지에 테마 선호도 저장
      localStorage.setItem("pokemon-wiki-theme", newTheme);

      // CSS 변수 업데이트
      updateCSSVariables(newIsDarkMode);

      return {
        ...prev,
        isDarkMode: newIsDarkMode,
        theme: newTheme,
      };
    });
  };

  // CSS 변수 업데이트 함수
  const updateCSSVariables = (isDark) => {
    const root = document.documentElement;
    const html = document.documentElement;

    // HTML 요소에 테마 속성 설정
    html.setAttribute("data-theme", isDark ? "dark" : "light");

    if (isDark) {
      // 다크 모드 색상
      root.style.setProperty("--bg-primary", "#1f2937");
      root.style.setProperty("--bg-secondary", "#374151");
      root.style.setProperty("--bg-tertiary", "#4b5563");
      root.style.setProperty("--text-primary", "#f9fafb");
      root.style.setProperty("--text-secondary", "#d1d5db");
      root.style.setProperty("--text-muted", "#9ca3af");
      root.style.setProperty("--border-color", "#4b5563");
      root.style.setProperty("--shadow", "0 4px 6px -1px rgba(0, 0, 0, 0.3)");
    } else {
      // 라이트 모드 색상
      root.style.setProperty("--bg-primary", "#ffffff");
      root.style.setProperty("--bg-secondary", "#f9fafb");
      root.style.setProperty("--bg-tertiary", "#f3f4f6");
      root.style.setProperty("--text-primary", "#111827");
      root.style.setProperty("--text-secondary", "#374151");
      root.style.setProperty("--text-muted", "#6b7280");
      root.style.setProperty("--border-color", "#e5e7eb");
      root.style.setProperty("--shadow", "0 4px 6px -1px rgba(0, 0, 0, 0.1)");
    }
  };

  // 컴포넌트 마운트 시 테마 초기화
  useEffect(() => {
    // 로컬 스토리지에서 저장된 테마 확인
    const savedTheme = localStorage.getItem("pokemon-wiki-theme");

    if (savedTheme) {
      // 저장된 테마가 있으면 사용
      const isDark = savedTheme === "dark";
      setState({
        isDarkMode: isDark,
        theme: savedTheme,
      });
      updateCSSVariables(isDark);
    } else {
      // 저장된 테마가 없으면 시스템 테마 감지
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const theme = prefersDark ? "dark" : "light";

      setState({
        isDarkMode: prefersDark,
        theme: theme,
      });
      updateCSSVariables(prefersDark);
    }
  }, []);

  // 시스템 테마 변경 감지
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e) => {
      // 로컬 스토리지에 저장된 테마가 없을 때만 시스템 테마 변경에 반응
      if (!localStorage.getItem("pokemon-wiki-theme")) {
        const isDark = e.matches;
        setState({
          isDarkMode: isDark,
          theme: isDark ? "dark" : "light",
        });
        updateCSSVariables(isDark);
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  // Context에 제공할 값들
  const value = {
    ...state, // 현재 상태 (isDarkMode, theme)
    toggleTheme, // 테마 전환 함수
  };

  // Context Provider로 자식 컴포넌트들에게 값 제공
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// ThemeContext를 사용하는 커스텀 훅
// 컴포넌트에서 테마 관련 상태와 함수를 쉽게 사용할 수 있게 해줌
export const useTheme = () => {
  const context = useContext(ThemeContext);

  // Context가 Provider 밖에서 사용되면 에러 발생
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};

export default ThemeContext;
