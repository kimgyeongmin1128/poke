import React from "react";
import { API_CONFIG } from "../constants/config";

const PokemonStats = ({ pokemonDetails, statKoreanMap }) => {
  return (
    <div className="pokemon-stats">
      {pokemonDetails.stats.map((stat, index) => (
        <div key={index} className="stat-item">
          <span className="stat-name">
            {statKoreanMap[stat.name] || stat.name}
          </span>
          <div className="stat-bar">
            <div
              className="stat-fill"
              style={{
                width: `${(stat.value / API_CONFIG.MAX_STAT_VALUE) * 100}%`,
              }}
            ></div>
          </div>
          <span className="stat-value">{stat.value}</span>
        </div>
      ))}
    </div>
  );
};

export default PokemonStats;
