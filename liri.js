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

function concertThis() {

    var artist = process.argv[3];

    //If the artist name is not entered then display an error to the user
    //Otherwise build the query url to bands in town api and send request via axios
    if (!artist) {

        logMessage("Please enter an artist name");
    } else {

        //Build the query url to bands in town api
        var queryUrl = `https://rest.bandsintown.com/artists/${encodeURI(artist)}/events?app_id=codingbootcamp`

        console.log("queryUrl", queryUrl);
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
                    messageArray.push(`Name of venue: ${event.venue.name}, Venue location: ${event.venue.city}, ${event.venue.region}, ${event.venue.country}, Date: ${moment(event.datetime).format("MM/DD/YYYY")}`)
                }); 

                messageArray.push("=====================================");

                //Log the message array (sperated by a new line for each item in the array) to the console and text file
                logMessage(messageArray.join("\n"));
            }
        );
    }
}

function spotifyThisSong() {

}

function movieThis() {

}

function doWhatItSays() {

}