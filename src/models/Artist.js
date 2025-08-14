const mongoose = require('mongoose');

//Schema
const artistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    album: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album',
      },
    ],
    image: {
      type: String,
      default:
        'https://cdn.pixabay.com/photo/2015/04/29/09/33/drums-745077_1280.jpg',
    },
    bio: {
      type: String,
      default: true,
    },
    songs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song',
      },
    ],
    genre: [
      {
        type: String,
        trim: true,
      },
    ],
    followers: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;
