import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import './Teams.css';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [favouriteTeam, setFavouriteTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/teams');
        if (!response.ok) {
          throw new Error('Failed to fetch teams');
        }
        const data = await response.json();
        const sortedTeams = data.sort((a, b) => a.team.name.localeCompare(b.team.name));
        setTeams(sortedTeams);
  
        // Fetch the user's favourite team if logged in
        try {
          const favResponse = await axios.get('http://localhost:5000/api/users/favourite-team');
          setFavouriteTeam(favResponse.data.teamId); // Set the favourite team in state
        } catch (err) {
          console.log('User not logged in or no favourite team set.');
        }
  
      } catch (err) {
        if (err.response?.status === 401) {
          console.log('User is not logged in, skipping favourite team fetch');
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);
  
  const handleFavouriteToggle = async (teamId) => {
    try {
      // Send POST request to update the user's favourite team
      const response = await axios.post(
        'http://localhost:5000/api/users/favourite-team', 
        { teamId },
        { withCredentials: true }
      );
  
      // Update the state with the new favourite team ID
      setFavouriteTeam(response.data.teamId);
    } catch (err) {
      console.error('Failed to update favourite team:', err);
      setError('Failed to update favourite team');
    }
  };
  

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

  return (
  <div className="teams-page">
    <h1 className="teams-title">Teams</h1>
    <div className="teams-list">
      {teams.map(({ team, venue }) => (
        <div key={team.id} className="team-card">
          <Link to={`/teams/${team.id}`} className="team-link">
            <img src={team.logo} alt={team.name} className="team-logo" />
            <div className="team-info">
              <h3 className="team-name">{team.name}</h3>
              <p className="team-city">City: {venue.city}</p>
            </div>
          </Link>
          {/* Favourite Star Button */}
          <button
            onClick={() => handleFavouriteToggle(team.id)}
            className={`favourite-button ${favouriteTeam === team.id ? 'favourited' : ''}`}
          >
            {/* Conditionally render empty or filled star */}
            {favouriteTeam === team.id ? '★' : '☆'}
          </button>
        </div>
      ))}
    </div>
  </div>
  );
};

export default Teams;