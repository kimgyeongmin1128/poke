import React from "react";
import Header from "./Header";
import SearchSection from "./SearchSection";
import PokemonGrid from "./PokemonGrid";
import PokemonModal from "./PokemonModal";
import { STAT_KOREAN_MAP, ABILITY_KOREAN_MAP } from "../constants/translations";

const AppLayout = ({
  searchTerm,
  onSearchChange,
  loading,
  filteredPokemon,
  onPokemonClick,
  showModal,
  selectedPokemon,
  pokemonDetails,
  onCloseModal,
}) => {
  return (
    <div className="app-container">
      <Header />
      <SearchSection searchTerm={searchTerm} onSearchChange={onSearchChange} />
      <PokemonGrid
        loading={loading}
        filteredPokemon={filteredPokemon}
        onPokemonClick={onPokemonClick}
      />
      <PokemonModal
        showModal={showModal}
        selectedPokemon={selectedPokemon}
        pokemonDetails={pokemonDetails}
        statKoreanMap={STAT_KOREAN_MAP}
        abilityKoreanMap={ABILITY_KOREAN_MAP}
        onClose={onCloseModal}
      />
    </div>
  );
};

export default AppLayout;
