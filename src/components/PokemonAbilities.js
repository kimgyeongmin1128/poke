import React from "react";

const PokemonAbilities = ({ pokemonDetails, abilityKoreanMap }) => {
  return (
    <div className="pokemon-abilities">
      {pokemonDetails.abilities.map((ability, index) => (
        <span key={index} className="ability-tag">
          {abilityKoreanMap[ability] || ability}
        </span>
      ))}
    </div>
  );
};

export default PokemonAbilities;
