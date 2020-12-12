const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios').default;
const mongoose = require('mongoose');

const Favorite = require('./models/favorite');

const moviesUri = 'https://swapi.dev/api/films';
const peopleUri = 'https://swapi.dev/api/people';
const mongoDbUrl = 'mongodb://localhost:27017/swfavorites';

const app = express();

app.use(bodyParser.json());

app.get('/favorites', async (req, res) => {
  const favorites = await Favorite.find();
  res.status(200).json({
    favorites: favorites,
  });
});

/**
 * Add a new Favorite
 */
app.post('/favorites', async (req, res) => {
  const favName = req.body.name;
  const favType = req.body.type;
  const favUrl = req.body.url;

  try {
    await findFavoriteByName(favType, favName);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  const favorite = new Favorite({
    name: favName,
    type: favType,
    url: favUrl,
  });

  try {
    await favorite.save();
    res
      .status(201)
      .json({ message: 'Favorite saved!', favorite: favorite.toObject() });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

async function findFavoriteByName(favType, favName) {
  if (favType !== 'movie' && favType !== 'character') {
    throw new Error('"type" should be "movie" or "character"!');
  }
  const existingFav = await Favorite.findOne({ name: favName });
  if (existingFav) {
    throw new Error('Favorite exists already!');
  }
}

app.get('/movies', async (req, res) => {
  try {
    const response = await axios.get(moviesUri);
    res.status(200).json({ movies: response.data });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

app.get('/people', async (req, res) => {
  try {
    const response = await axios.get(peopleUri);
    res.status(200).json({ people: response.data });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

mongoose.connect(
  mongoDbUrl,
  { useNewUrlParser: true },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      app.listen(3000);
    }
  }
);
