import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import axios from 'axios';

const FixtureDetails = () => {
  const { id } = useParams();
  const [fixtureDetails, setFixtureDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFixtureDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/fixtures/statistics/${id}`);

        console.log('Fetched fixture details:', response.data);
        if (response.data.length > 0) {
          setFixtureDetails(response.data);
        } else {
          setError('No fixture details found.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFixtureDetails();
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
  if (fixtureDetails.length === 0) return <p>No data available</p>;

  return (
    <div className="fixture-details-container">
      <h1>Fixture Details</h1>
      {fixtureDetails.map((fixtureDetail, index) => {
        const { team, statistics } = fixtureDetail;
        return (
          <div key={index} className="team-statistics">
            <h2>{team.name}</h2>
            <img src={team.logo} alt={`${team.name} logo`} className="team-logo" />
            <div className="statistics">
              {statistics.map((stat, idx) => (
                <p key={idx}>
                  {stat.type}: {stat.value}
                </p>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FixtureDetails;
