const mongoose = require('mongoose');

//Schema
const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
    default:
      'https://cdn.pixabay.com/photo/2015/04/29/09/33/drums-745077_1280.jpg',
  },
  creator: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  ],
  songs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Song',
    },
  ],
  isPublic: {
    type: Boolean,
    default: false,
  },
  followers: {
    type: Number,
    default: 0,
  },
  collaborators: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  ],
  timestamps: true,
});

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;
