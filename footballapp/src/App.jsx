import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Teams from './components/Teams';
import Fixtures from './components/Fixtures';
import Players from './components/Players';
import TeamDetails from './components/TeamDetails';
import PlayerDetails from './components/PlayerDetails';
import FixturesDetails from './components/FixturesDetails';
import Profile from './components/Profile';
import NavBar from './components/NavBar';
import Logout from './components/Logout';

import './App.css';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleLogin = (username) => {
    setUser(username);
    localStorage.setItem('username', username);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('username');
  };

  return (
    <Router>
      <div className='container'>
        <NavBar user={user} onLogout={handleLogout} />
        <div className='content'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login onLogin={handleLogin} />} />
            <Route path="/logout" element={<Logout />} />
            <Route path='/register' element={<Register />} />
            <Route path='/teams' element={<Teams />} />
            <Route path='/fixtures' element={<Fixtures />} />
            <Route path='/players' element={<Players />} />
            <Route path='/teams/:id' element={<TeamDetails />} />
            <Route path='/fixtures/:id' element={<FixturesDetails />} />
            <Route path='/players/:id' element={<PlayerDetails />} />
            <Route path='/profile' element={<Profile />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
