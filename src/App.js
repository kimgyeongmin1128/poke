/**
 * 메인 App 컴포넌트
 *
 * 이 파일은 React 애플리케이션의 진입점입니다.
 * AppProvider로 전체 앱을 감싸서 Context API를 통해 상태를 관리합니다.
 *
 * 주요 역할:
 * 1. AppProvider로 전체 앱을 감싸기
 * 2. AppLayout 컴포넌트 렌더링
 * 3. 전역 CSS 스타일 적용
 */
import React from "react";
import "./App.css";
import AppLayout from "./components/AppLayout";
import { AppProvider } from "./providers/AppProvider";

function App() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
}

export default App;
