import React from "react";
import PokemonDetailHeader from "./PokemonDetailHeader";
import PokemonBasicInfo from "./PokemonBasicInfo";
import PokemonStats from "./PokemonStats";
import SkeletonDetail from "./SkeletonDetail";
import PokemonAbilities from "./PokemonAbilities";
import PokemonMoves from "./PokemonMoves";
import { useModal } from "../hooks/useModal";

const PokemonDetail = ({ statKoreanMap, abilityKoreanMap }) => {
  const { selectedPokemon, pokemonDetails, pokemonMoves, loadingMoves } =
    useModal();

  return (
    <div className="pokemon-detail">
      <PokemonDetailHeader selectedPokemon={selectedPokemon} />

      {!pokemonDetails ? (
        <SkeletonDetail />
      ) : (
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

          <PokemonMoves
            pokemonMoves={pokemonMoves}
            loadingMoves={loadingMoves}
          />
        </div>
      )}
    </div>
  );
};

export default PokemonDetail;
