import React from "react";
import PokemonDetailHeader from "./PokemonDetailHeader";
import PokemonBasicInfo from "./PokemonBasicInfo";
import PokemonStats from "./PokemonStats";
import PokemonAbilities from "./PokemonAbilities";

const PokemonDetail = ({
  selectedPokemon,
  pokemonDetails,
  statKoreanMap,
  abilityKoreanMap,
}) => {
  return (
    <div className="pokemon-detail">
      <PokemonDetailHeader selectedPokemon={selectedPokemon} />

      {pokemonDetails && (
        <div className="pokemon-detail-stats">
          <h3>기본 정보</h3>
          <PokemonBasicInfo pokemonDetails={pokemonDetails} />

          <h3>능력치</h3>
          <PokemonStats
            pokemonDetails={pokemonDetails}
            statKoreanMap={statKoreanMap}
          />

          <h3>특성</h3>
          <PokemonAbilities
            pokemonDetails={pokemonDetails}
            abilityKoreanMap={abilityKoreanMap}
          />
        </div>
      )}
    </div>
  );
};

export default PokemonDetail;
