import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import './PlayerDetails.css';

const PlayerDetails = () => {
  const { id } = useParams();
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlayerDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/players/${id}`);
        console.log('Fetched player details:', response.data);
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          setPlayerData(response.data[0]);
        } else {
          setError('No player data available');
        }
      } catch (err) {
        console.error('Error fetching player details:', err);
        setError('Failed to fetch player details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerDetails();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress 
        sx={{'& .MuiLinearProgress-bar': {background: 'linear-gradient(98.5deg, #05f0ff -46.16%, #7367ff 42.64%, #963cff 70.3%)',},}} 
        />
     </Box>
    );
  }
  if (error) return <p>Error: {error}</p>;

  if (!playerData) return <p>No data available</p>;

  const { player, statistics } = playerData;
  if (!player || !statistics || statistics.length === 0) return <p>No statistics available for this player.</p>;

  const [stat] = statistics;

  return (
    <div className="player-details-container">
      <h1 className="player-name">{player.name}</h1>
      <img src={player.photo} alt={player.name} className="player-photo" />
      <div className="player-info">
      <p>Full Name: {player.firstname} {player.lastname}</p>
        <p>Age: {player.age}</p>
        <p>Birthdate: {player.birth.date}</p>
        <p>Birthplace: {player.birth.place}, {player.birth.country}</p>
        <p>Nationality: {player.nationality}</p>
        <p>Height: {player.height}</p>
        <p>Position: {stat.games.position}</p>
      </div>

      <h2 className="statistics-title">Statistics</h2>
      <div className="statistics-info">
        <div className="team-info">
          <img src={stat.team.logo} alt={stat.team.name} className="team-logo" />
          <p>Team: {stat.team.name}</p>
          <p>League: {stat.league.name} ({stat.league.country})</p>
          {stat.league.flag && <img src={stat.league.flag} alt={stat.league.country} className="league-flag" />}
        </div>
      </div>
      
      <div className="stat-cards">
          <div className="stat-card">
            <h3>Games</h3>
            <p>Appearances: {stat.games.appearences}</p>
            <p>Minutes Played: {stat.games.minutes}</p>
          </div>
          <div className="stat-card">
            <p>Goals: {stat.goals.total}</p>
            <p>Assists: {stat.goals.assists}</p>
          </div>
          <div className="stat-card">
            <p>Total Passes: {stat.passes.total}</p>
            <p>Key Passes: {stat.passes.key}</p>
          </div>
          <div className="stat-card">
            <p>Yellow Cards: {stat.cards.yellow}</p>
            <p>Red Cards: {stat.cards.red}</p>
          </div>
        </div>
      </div>
  );
};

export default PlayerDetails;
