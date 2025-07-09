const express = require('express');
const { getStandings, getFixtures, getPlayers, getTeams, getTeamStatistics, getFixtureStatistics, getPlayerSquads, getplayerDetails, getTopScorers, getTopAssists } = require('../services/footballAPI');
const router = express.Router();

router.get('/profile', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'User not logged in' });
  }

  try {
    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/standings', async (req, res) => {
  try {
    const standings = await getStandings();
    res.json(standings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch standings' });
  }
});

router.get('/fixtures', async (req, res) => {
  try {
    const fixtures = await getFixtures();
    res.json(fixtures);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch fixtures' });
  }
});

router.get('/teams', async (req, res) => {
  try {
    const teams = await getTeams();
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

router.get('/players', async (req, res) => {
  try {
    const players = await getPlayers();
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch players' });
  }
});

router.get('/teams/statistics/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const statistics = await getTeamStatistics(id);
    res.json(statistics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team statistics' });
  }
});

router.get('/fixtures/statistics/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const fixtureStatistics = await getFixtureStatistics(id);
    res.json(fixtureStatistics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch fixture statistics' });
  }
});

router.get('/players/squads/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const playerSquads = await getPlayerSquads(id);
    res.json(playerSquads);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch squad' });
  }
});

router.get('/players/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const playerDetails = await getplayerDetails(id);
    res.json(playerDetails);
  } catch (error) {
    res.status(500).json({ error: 'Failed to player details' });
  }
});

router.get('/players/topscorers/:id', async (req, res) => {
  try {
    const topscorers = await getTopScorers();
    res.json(topscorers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch the top scorers' });
  }
});

router.get('/players/topassists/:id', async (req, res) => {
  try {
    const topassists = await getTopAssists();
    res.json(topassists);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch the top assists' });
  }
});

module.exports = router;