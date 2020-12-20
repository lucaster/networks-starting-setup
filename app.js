const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios').default;
const mongoose = require('mongoose');

const Favorite = require('./models/favorite');

const port = 3000;
const moviesUri = 'https://swapi.dev/api/films';
const peopleUri = 'https://swapi.dev/api/people';
const mongoDbUrl = 'mongodb://172.17.0.2:27017/swfavorites';

const app = express();

app.use(bodyParser.json());

app.get('/favorites', async (req, res) => {
  const favorites = await Favorite.find();
  res.status(200).json({ favorites });
});

/**
 * Add a new Favorite
 */
app.post('/favorites', async (req, res) => {
  const fav = req.body;
  console.log(fav);
  const name = fav.name;
  const type = fav.type;
  const url  = fav.url;

  // Should not already exist:
  try {
    await findFavoriteByName(type, name);
  }
  catch (error) {
    return res.status(500).json({ message: error.message });
  }

  const newFav = new Favorite({ name, type, url });

  try {
    await newFav.save();
    res
      .status(201)
      .json({ message: 'Favorite saved!', favorite: fav.toObject() });
  }
  catch (error) {
    res.status(500).json({ message: 'Something went wrong.', error: error });
  }
});

async function findFavoriteByName(type, name) {
  if (type !== 'movie' && type !== 'character') {
    throw new Error('"type" should be "movie" or "character"!');
  }
  const existingFav = await Favorite.findOne({ name });
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
    } 
    else {
      app.listen(port);
    }
  }
);
