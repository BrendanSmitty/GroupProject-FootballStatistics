const axios = require('axios');

const API_KEY = 'ab6ffd931a262177e9e0e63b93f45f22';

const apiFootball = axios.create({
  baseURL: 'https://v3.football.api-sports.io',
  headers: {
    'x-apisports-key': API_KEY,
  }
});

// Fetch EPL standings
const getStandings = async () => {
    try {
      const response = await apiFootball.get('/standings', {
        params: {
          league: 39, // Premier League ID
          season: 2024
        }
      });
      console.log('API response:', response.data);
      return response.data.response;
    } catch (error) {
      console.error('Error fetching standings:', error);
      throw error;
    }
  };

const getTeams = async () => {
  try {
    const response = await apiFootball.get('/teams', {
      params: {
        league: 39,
        season: 2024
      }
    });
    return response.data.response;
  } catch (error) {
    console.error('Error fetching teams:', error)
    throw error;
  }
};

const getFixtures = async () => {
  try {
    const response = await apiFootball.get('/fixtures', {
      params: {
        league: 39,
        season: 2024
      }
    });
    return response.data.response;
  } catch (error) {
    console.error('Error fetching fixtures:', error)
    throw error;
  }
}

const getPlayers = async () => {
  try {
    const response = await apiFootball.get('/players', {
      params: {
        league: 39,
        season: 2024
      }
    });
    return response.data.response;
  } catch (error) {
    console.error('Error fetching players:', error)
    throw error;
  }
}

const getTeamStatistics = async (id) => {
  try {
    const response = await apiFootball.get('/teams/statistics', {
      params: {
        league: 39,
        season: 2024,
        team: id
      }
    });
    return response.data.response;
  } catch (error) {
    console.error('Error fetching team statistics:', error);
    throw error;
  }
};

const getFixtureStatistics = async (id) => {
  try {
    const response = await apiFootball.get('/fixtures/statistics', {
      params: {
        fixture: id
      }
    });
    console.log('Fixture statistics response:', response.data);
    return response.data.response;
  } catch (error) {
    console.error('Error fetching fixture statistics:', error);
    throw error;
  }
};

const getPlayerSquads = async (id) => {
  try {
    const response = await apiFootball.get('/players/squads', {
      params: {
        team: id
      }
    });
    console.log('Team squads response:', response.data);
    return response.data.response;
  } catch (error) {
    console.error('Error fetching fixture statistics:', error);
    throw error;
  }
};

const getplayerDetails = async (id) => {
  try {
    const response = await apiFootball.get('/players/', {
      params: {
        id: id,
        season: 2024,
        league: 39
      }
    });
    console.log('Player statistics response:', response.data);
    return response.data.response;
  } catch (error) {
    console.error('Error fetching players statistics:', error);
    throw error;
  }
};

const getTopScorers = async (id) => {
  try {
    const response = await apiFootball.get('/players/topscorers/', {
      params: {
        id: id,
        league: 39,
        season: 2024
      }
    });
    return response.data.response;
  } catch (error) {
    console.error('Error fetching players:', error)
    throw error;
  }
}

const getTopAssists = async (id) => {
  try {
    const response = await apiFootball.get('/players/topassists/', {
      params: {
        id: id,
        league: 39,
        season: 2024
      }
    });
    return response.data.response;
  } catch (error) {
    console.error('Error fetching players:', error)
    throw error;
  }
}

module.exports = {
  getStandings,
  getTeams, 
  getFixtures, 
  getPlayers,
  getTeamStatistics,
  getFixtureStatistics,
  getPlayerSquads,
  getplayerDetails,
  getTopScorers,
  getTopAssists
};