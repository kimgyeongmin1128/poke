import React from "react";

const PokemonCard = ({ pokemon, onPokemonClick, typeKoreanMap }) => {
  return (
    <div
      key={pokemon.id}
      className="pokemon-card"
      onClick={() => onPokemonClick(pokemon)}
      style={{ cursor: "pointer" }}
    >
      <img
        src={pokemon.image}
        alt={pokemon.koreanName || pokemon.name}
        className="pokemon-image"
      />
      <div className="pokemon-info">
        <h3 className="pokemon-name">{pokemon.koreanName || pokemon.name}</h3>
        <p className="pokemon-id">#{pokemon.id}</p>
        <div className="pokemon-types">
          {pokemon.types &&
            pokemon.types.map((type, index) => (
              <span key={index} className={`pokemon-type pokemon-type-${type}`}>
                {typeKoreanMap[type] || type}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
