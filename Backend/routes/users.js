const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  console.log('Received login request:', { username, password });

  try {
    const user = await User.findOne({ username });
    console.log('User found:', user);

    if (user && password === user.password) {
      req.session.user = { id: user._id, username: user.username };
      console.log('Session created:', req.session);

      res.cookie('SESSION', req.sessionID, { httpOnly: true, secure: false });
      console.log('Cookie set:', req.sessionID);

      return res.redirect('/');
    }

    console.log('Invalid credentials');
    return res.render('login', { error: 'Username or password is incorrect' });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).send('Internal Server Error');
  }
});


router.post('/register', async (req, res) => {
  const { username, firstName, lastName, password } = req.body;

  if (!username || !firstName || !lastName || !password) {
    console.log('Error: Missing fields in request');
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log('Error: User already exists');
      return res.status(400).json({ error: 'User already exists' });
    }

    const newUser = new User({ username, firstName, lastName, password });
    await newUser.save();
    console.log('User registered successfully:', newUser);
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/logout', (req, res) => {
  console.log('Received logout request');

  if (!req.session.user) {
    console.log('Unauthorized logout attempt');
    return res.status(401).send('Unauthorized');
  }

  res.clearCookie('SESSION', { httpOnly: true, secure: false });
  console.log('Cookie cleared');

  req.session.destroy(err => {
    if (err) {
      console.error('Session destruction error:', err);
      return res.status(500).send('Internal Server Error');
    }

    console.log('Session destroyed');
    res.sendStatus(200);
  });
});


// Route to update the favourite team in MongoDB
router.post('/favourite-team', async (req, res) => {
  // Check if user is logged in by checking the session
  if (!req.session.user) {
    console.log('Unauthorized: User not logged in');
    return res.status(401).json({ message: 'Unauthorized, please log in.' });
  }

  const { teamId } = req.body;
  console.log('Received teamId:', teamId);
  if (!teamId) {
    return res.status(400).json({ message: 'Team ID is required' });
  }

  try {
    // Find the user by their ID from the session and update the favourite team
    const user = await User.findById(req.session.user.id);
    console.log('Fetched user:', user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.favouriteTeam = teamId;
    await user.save(); // Save the updated user data to MongoDB
    console.log('Favourite team updated successfully');

    return res.json({ message: 'Favourite team updated successfully', teamId });
  } catch (error) {
    console.error('Error updating favourite team:', error);
    return res.status(500).json({ message: 'Failed to update favourite team' });
  }
});

// Route to get user's favourite team from MongoDB
router.get('/favourite-team', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized, please log in.' });
  }

  try {
    // Find the user by their ID from the session
    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ teamId: user.favouriteTeam });
  } catch (error) {
    console.error('Error fetching favourite team:', error);
    return res.status(500).json({ message: 'Error fetching favourite team' });
  }
});

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


module.exports = router;