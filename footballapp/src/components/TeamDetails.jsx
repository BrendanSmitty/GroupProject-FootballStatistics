import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import axios from 'axios';
import './TeamDetails.css';

const TeamDetails = () => {
  const { id } = useParams();
  const [teamStats, setTeamStats] = useState(null);
  const [playerSquad, setPlayerSquad] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeamStats = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/teams/statistics/${id}`);        
        console.log('Fetched team statistics:', response.data);
        setTeamStats(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchPlayerSquad = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/players/squads/${id}`);
        if (Array.isArray(response.data) && response.data.length > 0 && response.data[0].players) {
          setPlayerSquad(response.data[0].players);
        } else {
          setError('No player squad data available');
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTeamStats();
    fetchPlayerSquad();
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

  if (!teamStats) {
    return <p>No data available</p>;
  }

  const { league, team, form, fixtures } = teamStats;

  const groupByPosition = (position) => {
    return playerSquad.filter(player => player.position === position);
  };

  return (
    <div className="team-details-container">
      <div className="team-details-statistics">
        <h1 className="team-title">{team.name} - Statistics</h1>
        <img src={team.logo} alt={`${team.name} logo`} className="team-logo" />
        <h2 className="league-name">League: {league.name}</h2>
        <h3 className="team-form">Form: {form}</h3>
     
        <h4 className="fixtures-title">Fixtures Overview:</h4>
        <ul className="fixtures-list">
          <li>Total Played: {fixtures.played.total}</li>
          <li>Wins: {fixtures.wins.total}</li>
          <li>Draws: {fixtures.draws.total}</li>
          <li>Losses: {fixtures.loses.total}</li>
        </ul>
      </div>  
      <h4 className="squad-title">Player Squad:</h4>

      {['Goalkeeper', 'Defender', 'Midfielder', 'Attacker'].map((position) => {
        const players = groupByPosition(position);
        return (
          <div key={position} className="position-group">
            <h5 className="position-title">{position}s</h5>
            <div className="player-grid">
              {players.map((player) => (
                <Link to={`/players/${player.id}`} key={player.id} className="player-item">
                  <img src={player.photo} alt={player.name} className="player-photo" />
                  <div className="player-info">
                    <p className="player-name">{player.name}</p>
                    <p className="player-age">Age: {player.age}</p>
                    <p className="player-number"># {player.number}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TeamDetails;
