import React from "react";
import pokemonLogo from "../img/pokemon_logo.png";
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

const Header = () => {
  return (
    <div className="logo-container">
      <img src={pokemonLogo} alt="pokemon_logo" />
      <ul className="nav-list">
        <li>
          <a href="https://pokemonkorea.co.kr/news">
            <NotepadText className="nav-icon" />
            소식
          </a>
        </li>
        <li>
          <a href="https://pokemonkorea.co.kr/game" target="blank">
            <Gamepad2 className="nav-icon" />
            게임
          </a>
        </li>
        <li>
          <a href="https://pokemoncard.co.kr/main" target="blank">
            <CreditCard className="nav-icon" />
            카드 게임
          </a>
        </li>
        <li>
          <a href="https://pokemonkorea.co.kr/animation" target="blank">
            <TvMinimalPlay className="nav-icon" />
            애니메이션
          </a>
        </li>
        <li>
          <a href="https://pokemonkorea.co.kr/goods" target="blank">
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
  );
};

export default Header;
