const mongoose = require('mongoose');

//Schema
const albumSchema = new mongoose.Schema(
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
      trim: true,
    },
    coverImage: {
      type: String,
      default:
        'https://www.istockphoto.com/photo/vinyl-record-with-blank-cover-gm469724807-32179114?utm_source=pixabay&utm_medium=affiliate&utm_campaign=sponsored_image&utm_content=srp_topbannerNone_media&utm_term=music+cover',
    },
    releaseDate: {
      type: Date,
      default: Date.now,
    },
    songs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song',
      },
    ],
    genres: [
      {
        type: String,
        trim: true,
      },
    ],
    likes: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    isExplicit: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Album = mongoose.model('Album', albumSchema);

module.exports = Album;
