import React from "react";
import { TYPE_KOREAN_MAP } from "../constants/translations";

const PokemonDetailHeader = ({ selectedPokemon }) => {
  return (
    <div className="pokemon-detail-header">
      <img
        src={selectedPokemon.image}
        alt={selectedPokemon.koreanName || selectedPokemon.name}
        className="pokemon-detail-image"
      />
      <div className="pokemon-detail-info">
        <h2 className="pokemon-detail-name">
          {selectedPokemon.koreanName || selectedPokemon.name}
        </h2>
        <p className="pokemon-detail-id">#{selectedPokemon.id}</p>
        <div className="pokemon-detail-types">
          {selectedPokemon.types &&
            selectedPokemon.types.map((type, index) => (
              <span key={index} className={`pokemon-type pokemon-type-${type}`}>
                {TYPE_KOREAN_MAP[type] || type}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PokemonDetailHeader;
