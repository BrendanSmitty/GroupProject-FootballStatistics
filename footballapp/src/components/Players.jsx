import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const playersPerPage = 20;

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/players', {
          params: {
            league: 39,
            season: 2024,
            page: currentPage,
          },
        });
        
        console.log('API Response:', response.data);
        
        const playersData = response.data.response;
        
        const sortedPlayers = playersData.sort((a, b) => {
          const lastNameA = a.player.lastname.toLowerCase();
          const lastNameB = b.player.lastname.toLowerCase();
          return lastNameA.localeCompare(lastNameB);
        });
        setPlayers(sortedPlayers);
      } catch (error) {
        console.log('Error fetching players:', error);
      }
    };
    fetchPlayers();
  }, [currentPage]);
  const nextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const previousPage = () => {
    setCurrentPage(prevPage => prevPage - 1);
  };

  return (
    <div className="players-container">
      <h1>Premier League Players</h1>
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Position</th>
            <th>Nationality</th>
          </tr>
        </thead>
        <tbody>
          {players.map((playerData) => (
            <tr key={playerData.player.id}>
              <td>
                <img src={playerData.player.photo} alt={playerData.player.name} width="50" />
                {playerData.player.lastname}
              </td>
              <td>{playerData.statistics[0]?.games.position || 'N/A'}</td>
              <td>{playerData.player.nationality}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination-buttons">
        <button onClick={previousPage} disabled={currentPage === 1}>
          Previous Page
        </button>
        <button onClick={nextPage} disabled={players.length < playersPerPage}>
          Next Page
        </button>
      </div>
    </div>
  );
};

export default Players;