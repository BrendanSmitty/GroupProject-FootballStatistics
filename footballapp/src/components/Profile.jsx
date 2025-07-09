import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import './Profile.css'; 

const Profile = () => {
  const [user, setUser] = useState(null);
  const [teams, setTeams] = useState([]);
  const [favouriteTeamId, setFavouriteTeamId] = useState(null);
  const [favouriteTeamName, setFavouriteTeamName] = useState('None');
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfileData = async () => {
    try {
      const response = await axios.get('/api/users/profile', { withCredentials: true });
      setUser(response.data.user);
      setFavouriteTeamId(response.data.user.favouriteTeam);
      console.log('Favourite Team ID:', response.data.user.favouriteTeam);

      fetchFixtures(response.data.user.favouriteTeam);
    } catch (err) {
      console.error('Error fetching profile data:', err);
      if (err.response && err.response.status === 401) {
        setError('User not logged in.');
      } else {
        setTimeout(() => setLoading(false), 1000);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    setLoadingTeams(true);
    try {
      const response = await axios.get('/api/teams');
      console.log('Teams fetched:', response.data);
      setTeams(response.data);
    } catch (err) {
      console.error('Error fetching teams data:', err);
      setError('Error fetching teams data.');
    } finally {
      setTimeout(() => setLoadingTeams(false), 1000);
    }
  };

  const fetchFixtures = async (favouriteTeamId) => {
    try {
      const response = await axios.get('/api/fixtures');
      const upcomingFixtures = response.data.filter(
        (fixture) => new Date(fixture.fixture.date) > new Date()
      ).sort((a, b) => new Date(a.fixture.date) - new Date(b.fixture.date));

      const nextFiveFixturesForFavoriteTeam = upcomingFixtures.filter(fixture => {
        const homeTeamId = fixture.teams.home.id.toString();
        const awayTeamId = fixture.teams.away.id.toString();
        return homeTeamId === favouriteTeamId || awayTeamId === favouriteTeamId;
      }).slice(0, 5);

      setFixtures(nextFiveFixturesForFavoriteTeam);
    } catch (err) {
      console.error('Error fetching fixtures:', err);
      setError('Error fetching fixtures.');
    }
  };

  useEffect(() => {
    fetchProfileData();
    fetchTeams();
  }, []);

  useEffect(() => {
    console.log('Favourite Team ID:', favouriteTeamId);
    console.log('Teams Data:', teams);

    if (favouriteTeamId && teams.length > 0) {
      const team = teams.find(team => team.team.id === Number(favouriteTeamId));
      console.log('Found Team:', team);

      setFavouriteTeamName(team ? team.team.name : 'None');
    }
  }, [favouriteTeamId, teams]);

  if (loading || loadingTeams) {
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
    <div className="profile-container">
      <div className="profile-header">
        <h1>User Profile</h1>
      </div>
      <div className="user-info">
        <p>Username: {user.username}</p>
        <p>First Name: {user.firstName}</p>
        <p>Last Name: {user.lastName}</p>
        <p>Favorite Team: {favouriteTeamName}</p>
      </div>
      <h2 className="fixtures-header">Next 5 Fixtures for {favouriteTeamName}</h2>
      <ul className="fixtures-list">
        {fixtures.map((fixture) => (
          <li key={fixture.fixture.id}>
            <span>{fixture.teams.home.name} vs {fixture.teams.away.name}</span>
            <span>{new Date(fixture.fixture.date).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Profile;
