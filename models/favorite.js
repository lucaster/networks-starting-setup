const { Schema, model } = require('mongoose');

const favoriteSchema = new Schema({
  type: 'movie' | 'character',
  /**
   * Key
   */
  name: String,
  url: String
}); 

const Favorite = model('Favorite', favoriteSchema);

module.exports = Favorite;