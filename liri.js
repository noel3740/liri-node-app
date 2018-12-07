//Reawd and set environment variables with dotenv package
require('dotenv').config();

//Access spotify keys from environment variables
var spotify = new Spotify(keys.spotify);