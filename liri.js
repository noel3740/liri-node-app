//Load the fs package to read and write
var fs = require("fs");

//Load the spotify api package
var Spotify = require('node-spotify-api');

//Read and set environment variables with dotenv package
require('dotenv').config();

//Load the keys js file
var keys = require("./keys");

//Load the moment package
var moment = require('moment');

//Load the axios package
var axios = require("axios");

//Access spotify keys from environment variables
var spotify = new Spotify(keys.spotify);

//Get the command name passed to this CLI
var commandName = process.argv[2];

//Switch statement that will redirect to a particluar function based on the command that was passed into the CLI
switch (commandName) {
    case "concert-this":
        concertThis();
        break;
    case "spotify-this-song":
        spotifyThisSong();
        break;
    case "movie-this":
        movieThis();
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
    default:
        logMessage("No valid command passed!");
        break;
}

//Function to log a message to a text file and to the console
function logMessage(message) {

    //Log message to a a log.txt file
    fs.appendFile("log.txt", `${message}\n`, function (err) {
        if (err) {
            return console.log(err);
        }
    });

    //Log the message to the console log
    console.log(message);
}

//Function to run when the "concert-this" command is used
function concertThis() {

    var artist = process.argv[3];

    //If the artist name is not entered then display an error to the user
    //Otherwise build the query url to bands in town api and send request via axios
    if (!artist) {

        logMessage("Please enter an artist name");
    } else {

        //Build the query url to bands in town api
        var queryUrl = `https://rest.bandsintown.com/artists/${encodeURI(artist)}/events?app_id=codingbootcamp`

        // Create a request with axios to the queryUrl
        axios.get(queryUrl).then(
            function (response) {

                //Build out a string for the message that we'll log to the console and in a text file
                var messageArray = [];

                messageArray.push("=====================================");
                messageArray.push(`"Concert This" results for ${artist}`);
                messageArray.push("=====================================");

                //Loop thru each event we received in the response data
                response.data.forEach(event => {
                    //Add the details of the venue to the message array
                    messageArray.push(`Date: ${moment(event.datetime).format("MM/DD/YYYY")}`);
                    messageArray.push(`\t Name of Venue: ${event.venue.name}`);
                    messageArray.push(`\t Venue Location: ${event.venue.city}, ${event.venue.region ? event.venue.region + ", " : ""}${event.venue.country}`);
                });

                messageArray.push("=====================================");

                //Log the message array (sperated by a new line for each item in the array) to the console and text file
                logMessage(messageArray.join("\n"));
            }
        );
    }
}

//Function to run when the "spotify-this-song" command is used
function spotifyThisSong() {

    //Get the song name passed in as a parameter
    //If the song name was not passed then use default
    var songName = process.argv[3] ? process.argv[3] : "The Sign";

    //Use the spotify api package to search for the song the user entered
    spotify
        .search({ type: 'track', query: songName })
        .then(function (response) {

            //Build out a string for the message that we'll log to the console and in a text file
            var messageArray = [];

            messageArray.push("=====================================");
            messageArray.push(`"Spotify This Song" results for "${songName}"`);
            messageArray.push("=====================================");

            //Sort the results by song name
            var sortedResults = response.tracks.items.sort(spotifyItemSortBySongName);

            //Loop thru all the tracks that we received and push the details of each track to the message array
            sortedResults.forEach(track => {

                //console.log(track);

                //Loop thru the artists and build out the artist string
                var artists = "";
                track.artists.forEach(artist => {
                    artists += artist.name + ",";
                });

                messageArray.push(`Song Name: ${track.name}`);
                messageArray.push(`\t Artist(s): ${artists}`);
                messageArray.push(`\t Album ${track.album.name}`);
                messageArray.push(`\t Preview Link: ${track.preview_url}`);
            });

            messageArray.push("=====================================");

            //Log the message array (sperated by a new line for each item in the array) to the console and text file
            logMessage(messageArray.join("\n"));
        })
        .catch(function (err) {
            //Log the error
            logMessage(err);
        });
}

//Function to run when the "movie-this" command is used
function movieThis() {
    //Get the movie name passed in as a parameter
    //If the moive name was not passed then use default
    var songName = process.argv[3] ? process.argv[3] : "Mr. Nobody.";

    //Build the query url to the omdb api
    var queryUrl = `http://www.omdbapi.com/?t=${encodeURI(songName)}&plot=short&apikey=trilogy`

    // Create a request with axios to the queryUrl
    axios.get(queryUrl).then(
        function (response) {

            //Build out a string for the message that we'll log to the console and in a text file
            var messageArray = [];

            messageArray.push("=====================================");
            messageArray.push(`"Movie This" results for ${songName}`);
            messageArray.push("=====================================");

            //Add the details of the movie to the message array
            messageArray.push(`Title: ${response.data.Title}`);
            messageArray.push(`\t Year: ${response.data.Year}`);
            messageArray.push(`\t IMDB Rating: ${response.data.imdbRating}`);
            messageArray.push(`\t Rotten Tomatoes Rating: ${response.data.Ratings.find(rating => rating.Source.toLowerCase() === 'rotten tomatoes').Value}`);
            messageArray.push(`\t Country: ${response.data.Country}`);
            messageArray.push(`\t Language: ${response.data.Language}`);
            messageArray.push(`\t Actors: ${response.data.Actors}`);
            messageArray.push(`\t Plot: ${response.data.Plot}`);

            messageArray.push("=====================================");

            //Log the message array (sperated by a new line for each item in the array) to the console and text file
            logMessage(messageArray.join("\n"));
        }
    );
}

//Function to run when the "do-what-it-says" command is used
function doWhatItSays() {

}

//Function to sort spotify songs by song name
function spotifyItemSortBySongName(itemA, itemB) {

    var nameA = itemA.name.toUpperCase(); // ignore upper and lowercase
    var nameB = itemB.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }

    // names must be equal
    return 0;
}