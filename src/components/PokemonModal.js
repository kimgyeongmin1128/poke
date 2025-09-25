import React from "react";
import PokemonDetail from "./PokemonDetail";

const PokemonModal = ({
  showModal,
  selectedPokemon,
  pokemonDetails,
  statKoreanMap,
  abilityKoreanMap,
  onClose,
}) => {
  if (!showModal || !selectedPokemon) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <PokemonDetail
          selectedPokemon={selectedPokemon}
          pokemonDetails={pokemonDetails}
          statKoreanMap={statKoreanMap}
          abilityKoreanMap={abilityKoreanMap}
        />
      </div>
    </div>
  );
};

export default PokemonModal;
