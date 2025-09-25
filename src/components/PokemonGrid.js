import React from "react";
import PokemonCard from "./PokemonCard";
import LoadingSpinner from "./LoadingSpinner";
import NoResults from "./NoResults";
import { TYPE_KOREAN_MAP } from "../constants/translations";

const PokemonGrid = ({ loading, filteredPokemon, onPokemonClick }) => {
  return (
    <div className="pokemon-grid">
      {loading ? (
        <LoadingSpinner />
      ) : filteredPokemon.length === 0 ? (
        <NoResults />
      ) : (
        filteredPokemon.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            onPokemonClick={onPokemonClick}
            typeKoreanMap={TYPE_KOREAN_MAP}
          />
        ))
      )}
    </div>
  );
};

export default PokemonGrid;
