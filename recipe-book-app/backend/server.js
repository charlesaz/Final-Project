const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const axios = require('axios');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 60 * 60 * 24,
    }),
  })
);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = mongoose.model('User', {
  username: String,
  email: String,
  password: String,
  favorites: [{ recipeId: String, recipeTitle: String, preparation: String }],
});


app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    req.session.user = {
      userId: user._id,
      username: user.username,
      email: user.email,
    };

    res.json({ userId: user._id, message: 'Login successful' });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logout successful' });
});

app.get('/api/user/profile', (req, res) => {
    const user = req.session.user;
  
    if (!user) {
      return res.status(401).json({ message: 'User not logged in' });
    }
  
  
    const token = req.headers.authorization;
  
  
  
    console.log('User Token:', token);
  
    res.json(user);
  });

app.get('/api/recipes/search', async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=da0bbd3f8e7b462f94df9ec2cc14020e`
    );

    res.json(response.data.results);
  } catch (error) {
    console.error('Error searching for recipes:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/favorites/:userId', async (req, res) => {
  const { userId } = req.params;
  const { recipeId, recipeTitle, preparation } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingFavorite = user.favorites.find(fav => fav.recipeId === recipeId);
    if (existingFavorite) {
      return res.status(400).json({ message: 'Recipe is already in favorites' });
    }

    user.favorites.push({ recipeId, recipeTitle, preparation });
    await user.save();

    res.json({ message: 'Favorite added successfully' });
  } catch (error) {
    console.error('Error adding user favorite:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/favorites/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ favorites: user.favorites });
  } catch (error) {
    console.error('Error fetching user favorites:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/favorites/:userId/:recipeId', async (req, res) => {
  const { userId, recipeId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.favorites = user.favorites.filter(fav => fav.recipeId !== recipeId);
    await user.save();

    res.json({ message: 'Favorite removed successfully' });
  } catch (error) {
    console.error('Error removing user favorite:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/user/change-password', async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = req.session.user;

  if (!user) {
    return res.status(401).json({ message: 'User not logged in' });
  }

  try {
    const dbUser = await User.findById(user.userId);

    if (!dbUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      dbUser.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Current password is incorrect',
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    dbUser.password = hashedNewPassword;

    await dbUser.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
