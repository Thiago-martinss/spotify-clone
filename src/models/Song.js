const mongoose = require('mongoose');

//Schema
const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist',
      required: true,
    },
    album: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album',
      },
    ],
    duration: {
      type: Number,
      required: true,
    },
    audioUrl: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      default:
        'https://cdn.pixabay.com/photo/2015/04/29/09/33/drums-745077_1280.jpg',
    },
    releaseDate: [
      {
        type: Date,
        default: Date.now,
      },
    ],
    genre: {
      type: String,
      trim: true,
    },
    followers: {
      type: Number,
      default: 0,
    },
    plays: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },

    isExplicit: {
      type: Boolean,
      default: false,
    },
    featuredArtists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Song = mongoose.model('Song', songSchema);

module.exports = Song;
