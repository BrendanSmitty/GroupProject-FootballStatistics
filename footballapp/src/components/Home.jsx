import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import './Home.css';

const Home = () => {
  const [standings, setStandings] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [topScorers, setTopScorers] = useState([]);
  const [topAssists, setTopAssists] = useState([]);
  const [error, setError] = useState(null);
  const [loadingFixtures, setLoadingFixtures] = useState(true);
  const [loadingStandings, setLoadingStandings] = useState(true);
  const [loadingTopScorers, setLoadingTopScorers] = useState(true);
  const [loadingTopAssists, setLoadingTopAssists] = useState(true);

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/standings');
        if (!response.ok) {
          throw new Error('Failed to fetch standings');
        }
        const data = await response.json();
        const leagueStandings = data[0]?.league.standings[0] || [];
        setStandings(leagueStandings);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingStandings(false);
      }
    };
    fetchStandings();
  }, []);

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/fixtures');
        if (!response.ok) {
          throw new Error('Failed to fetch fixtures');
        }
        const data = await response.json();
        const upcomingFixtures = data.filter(
          (fixture) => new Date(fixture.fixture.date) > new Date()
        );
        const sortedFixtures = upcomingFixtures
          .sort((a, b) => new Date(a.fixture.date) - new Date(b.fixture.date))
          .slice(0, 3);
        setFixtures(sortedFixtures);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingFixtures(false);
      }
    };

    fetchFixtures();
  }, []);

  useEffect(() => {
    const fetchTopScorers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/players/topscorers/39');
        if (!response.ok) {
          throw new Error('Failed to fetch top scorers');
        }
        const data = await response.json();
        setTopScorers(data.slice(0,10));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingTopScorers(false);
      }
    };

    fetchTopScorers();
  }, []);

  useEffect(() => {
    const fetchTopAssists = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/players/topassists/39');
        if (!response.ok) {
          throw new Error('Failed to fetch top assists');
        }
        const data = await response.json();
        setTopAssists(data.slice(0,10));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingTopAssists(false);
      }
    };

    fetchTopAssists();
  }, []);

  if (loadingFixtures || loadingStandings || loadingTopScorers || loadingTopAssists) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress 
        sx={{'& .MuiLinearProgress-bar': {background: 'linear-gradient(98.5deg, #05f0ff -46.16%, #7367ff 42.64%, #963cff 70.3%)',},}} 
        />
     </Box>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="home">
      <h1 className="home-title">Welcome to Football Central</h1>

      <section className="upcoming-fixtures">
        <h2 className="section-title">Upcoming Fixtures</h2>
        <table className="fixtures-table">
          <thead>
            <tr>
              <th>Fixture</th>
              <th>Date</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {fixtures.map((fixture) => (
              <tr key={fixture.fixture.id}>
                <td className="fixture-info">
                  <img src={fixture.teams.home.logo} alt={fixture.teams.home.name} className="team-logo" />
                  {fixture.teams.home.name} vs
                  <img src={fixture.teams.away.logo} alt={fixture.teams.away.name} className="team-logo" />
                  {fixture.teams.away.name}
                </td>
                <td>
                  {new Date(fixture.fixture.date).toLocaleString([], {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td>
                  {fixture.fixture.venue.name}, {fixture.fixture.venue.city}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Standings Section */}
      <section className="standings">
        <h2 className="section-title">Standings</h2>
        <table className="standings-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Team</th>
              <th>Points</th>
              <th>Goal Difference</th>
              <th>Form</th>
            </tr>
          </thead>
          <tbody>
            {standings.map(({ rank, team, points, goalsDiff, form }) => (
              <tr key={team.id}>
                <td>{rank}</td>
                <td className="team-info">
                  <img src={team.logo} alt={team.name} className="team-logo" />
                  {team.name}
                </td>
                <td>{points}</td>
                <td>{goalsDiff}</td>
                <td>{form}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="top-scorers">
        <h2 className="section-title">Top Scorers</h2>
        <table className="top-scorers-table">
          <thead>
            <tr>
              <th></th>
              <th>Player</th>
              <th>Team</th>
              <th>Goals</th>
            </tr>
          </thead>
          <tbody>
            {topScorers.map((scorer) => (
              <tr key={scorer.player.id}>
                <td><img src={scorer.player.photo}></img></td>
                <td>{scorer.player.name}</td>
                <td>{scorer.statistics[0].team.name}</td>
                <td>{scorer.statistics[0].goals.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="top-assists">
        <h2 className="section-title">Top Assists</h2>
        <table className="top-assists-table">
          <thead>
            <tr>
              <th></th>
              <th>Player</th>
              <th>Team</th>
              <th>Assists</th>
            </tr>
          </thead>
          <tbody>
            {topAssists.map((assist) => (
              <tr key={assist.player.id}>
                <td><img src={assist.player.photo}></img></td>
                <td>{assist.player.name}</td>
                <td>{assist.statistics[0].team.name}</td>
                <td>{assist.statistics[0].goals.assists}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

    </div>
  );
};

export default Home;
