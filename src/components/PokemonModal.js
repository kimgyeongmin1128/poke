import React from "react";
import PokemonDetail from "./PokemonDetail";
import { useModal } from "../hooks/useModal";

const PokemonModal = ({ statKoreanMap, abilityKoreanMap }) => {
  const { showModal, selectedPokemon, pokemonDetails, closeModal } = useModal();

  if (!showModal || !selectedPokemon) return null;

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={closeModal}>
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
