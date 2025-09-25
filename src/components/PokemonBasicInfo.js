import React from "react";

const PokemonBasicInfo = ({ pokemonDetails }) => {
  return (
    <div className="pokemon-basic-info">
      <div className="info-item">
        <span className="info-label">키</span>
        <span className="info-value">{pokemonDetails.height}m</span>
      </div>
      <div className="info-item">
        <span className="info-label">몸무게</span>
        <span className="info-value">{pokemonDetails.weight}kg</span>
      </div>
    </div>
  );
};

export default PokemonBasicInfo;
