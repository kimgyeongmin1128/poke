import React from "react";
import pokeApiInstance from "./api/axiosInstance";
import "./App.css";
import { loadAllPokemonData } from "./api/pokestore";
import AppLayout from "./components/AppLayout";

function App() {
  const [pokemonData, setPokemonData] = React.useState([]);
  const [filteredPokemon, setFilteredPokemon] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedPokemon, setSelectedPokemon] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);
  const [pokemonDetails, setPokemonDetails] = React.useState(null);

  // 컴포넌트가 처음 렌더링될 때 포켓몬 데이터를 가져오는 useEffect
  React.useEffect(() => {
    loadAllPokemonData().then((data) => {
      setPokemonData(data);
      setFilteredPokemon(data);
      setLoading(false);
    });
  }, []);

  // 검색어가 변경될 때마다 포켓몬 목록을 필터링하는 useEffect
  React.useEffect(() => {
    if (!searchTerm) {
      setFilteredPokemon(pokemonData);
    } else {
      const searchLower = searchTerm.toLowerCase();
      const filtered = pokemonData.filter((pokemon) => {
        const koreanName = (
          pokemon.koreanName ||
          pokemon.name ||
          ""
        ).toLowerCase();
        return koreanName.includes(searchLower);
      });
      setFilteredPokemon(filtered);
    }
  }, [searchTerm, pokemonData]);

  // 포켓몬 카드 클릭 핸들러
  const handlePokemonClick = async (pokemon) => {
    setSelectedPokemon(pokemon);
    setShowModal(true);

    try {
      const response = await pokeApiInstance.get(`/pokemon/${pokemon.id}`);
      const data = response.data;
      const stats = data.stats.map((stat) => ({
        name: stat.stat.name,
        value: stat.base_stat,
      }));
      const height = data.height / 10;
      const weight = data.weight / 10;
      setPokemonDetails({
        stats,
        height,
        weight,
        abilities: data.abilities.map((ability) => ability.ability.name),
      });
    } catch (error) {
      console.error("포켓몬 상세 정보를 가져오는데 실패했습니다:", error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPokemon(null);
    setPokemonDetails(null);
  };

  return (
    <AppLayout
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      loading={loading}
      filteredPokemon={filteredPokemon}
      onPokemonClick={handlePokemonClick}
      showModal={showModal}
      selectedPokemon={selectedPokemon}
      pokemonDetails={pokemonDetails}
      onCloseModal={closeModal}
    />
  );
}

export default App;
