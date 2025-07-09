import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import "./Fixtures.css";

const Fixtures = () => {
  const [fixtures, setFixtures] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const getCurrentWeekRange = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();

    const offsetToWednesday = dayOfWeek >= 3 ? dayOfWeek - 3 : dayOfWeek + 4; 
    // This line figures out how many days to get to a Wednesday, based off the current day. Then makes it easier to filter fixtures from wednesday to tuesday

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - offsetToWednesday);
    startDate.setHours(0, 0, 0, 0); // This is setting the time to midnight

    // End of the premier league week (set to Tuesday night)
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);

    return { startDate, endDate };
  };

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/fixtures');
        if (!response.ok) {
          throw new Error('Failed to fetch fixtures');
        }
        const data = await response.json();
        const sortedFixtures = data.sort(
          (a, b) => new Date(a.fixture.date) - new Date(b.fixture.date)
        );

        const { startDate, endDate } = getCurrentWeekRange();

        const weeklyFixtures = sortedFixtures.filter((fixture) => {
          const fixtureDate = new Date(fixture.fixture.date);
          return fixtureDate >= startDate && fixtureDate <= endDate;
        });

        setFixtures(weeklyFixtures.slice(0, 10));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFixtures();
  }, []);

  const groupFixturesByDate = (fixtures) => {
    return fixtures.reduce((grouped, fixture) => {
      const date = new Date(fixture.fixture.date).toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(fixture);
      return grouped;
    }, {});
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

  if (error) {
    return <p>Error: {error}</p>;
  }
  const groupedFixtures = groupFixturesByDate(fixtures);

  return (
    <div className="fixtures-container">
      <h1>Premier League Fixtures</h1>
      {Object.entries(groupedFixtures).map(([date, fixturesForDate]) => (
        <div key={date} className="fixtures-day">
          <h2>{date}</h2>
          <table>
            <thead>
              <tr>
                <th>Home Team</th>
                <th>Kickoff Time</th>
                <th>Away Team</th>
                <th>Venue</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {fixturesForDate.map((fixture) => (
                <tr key={fixture.fixture.id}>
                  <td>
                    <Link to={`/fixtures/${fixture.fixture.id}`}>
                      {fixture.teams.home.name}                    
                      <img src={fixture.teams.home.logo} alt={fixture.teams.home.name} style={{ width: '30px', marginRight: '10px' }} />
                    </Link>
                  </td>
                  <td>
                    {new Date(fixture.fixture.date).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit',})}
                  </td>
                  <td>
                    <Link to={`/fixtures/${fixture.fixture.id}`}>
                      <img src={fixture.teams.away.logo} alt={fixture.teams.away.name} style={{ width: '30px', marginRight: '10px' }} />
                      {fixture.teams.away.name}
                    </Link>
                  </td>
                  <td>
                    {fixture.fixture.venue.name}, {fixture.fixture.venue.city}
                  </td>
                  <td>{fixture.goals.home} - {fixture.goals.away}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default Fixtures;
