//Load the fs package to read and write
const fs = require("fs");

//Load the spotify api package
const Spotify = require('node-spotify-api');

//Read and set environment variables with dotenv package
require('dotenv').config();

//Load the keys js file
const keys = require("./keys");

//Load the moment package
const moment = require('moment');

//Load the axios package
const axios = require("axios");

//Load the inquirer package
var inquirer = require("inquirer");

//Access spotify keys from environment variables
const spotify = new Spotify(keys.spotify);

//Get the second argument passed to the CLI
let arg2 = process.argv[3];

//Function will run the function associated with the command passed to it. 
function runCommand(commandName) {

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
}

//Function to log a message to a text file and to the console
function logMessage(message) {

    //Log message to a a log.txt file
    fs.appendFile("log.txt", `${message}\n`, err => {
        if (err) {
            return console.log("Error logging message", err);
        }
    });

    //Log the message to the console log
    console.log(message);
}

function logCommandResults(messageDetailsArray, commandDetailName, resultsFor) {

    //Build out a string for the message that we'll log to the console and in a text file
    let messageArray = [];

    messageArray.push("=========================================================");
    messageArray.push(`"${commandDetailName}" results for "${resultsFor}"`);
    messageArray.push("=========================================================");

    //Add the message details array
    messageArray = messageArray.concat(messageDetailsArray);

    messageArray.push("=========================================================");

    //Log the message array (sperated by a new line for each item in the array) to the console and text file
    logMessage(messageArray.join("\n"));
}

//Function to run when the "concert-this" command is used
function concertThis() {

    const artist = arg2;

    //If the artist name is not entered then display an error to the user
    //Otherwise build the query url to bands in town api and send request via axios
    if (!artist) {

        logMessage("Please enter an artist name");
    } else {

        //Build the query url to bands in town api
        const queryUrl = `https://rest.bandsintown.com/artists/${encodeURI(artist)}/events?app_id=codingbootcamp`

        // Create a request with axios to the queryUrl
        axios.get(queryUrl).then(
            response => {

                //Build out a string for the message that we'll log to the console and in a text file
                const messageArray = [];

                //Loop thru each event we received in the response data
                response.data.forEach(event => {
                    //Add the details of the venue to the message array
                    messageArray.push(`Date: ${moment(event.datetime).format("MM/DD/YYYY")}`);
                    messageArray.push(`\t Name of Venue: ${event.venue.name}`);
                    messageArray.push(`\t Venue Location: ${event.venue.city}, ${event.venue.region ? event.venue.region + ", " : ""}${event.venue.country}`);
                    messageArray.push('');
                });

                //Log the command results
                logCommandResults(messageArray, "Concert This", artist);
            }
        );
    }
}

//Function to run when the "spotify-this-song" command is used
function spotifyThisSong() {

    //Get the song name passed in as a parameter
    //If the song name was not passed then use default
    const songName = arg2 ? arg2 : "The Sign";

    //Use the spotify api package to search for the song the user entered
    spotify
        .search({ type: 'track', query: songName })
        .then(
            response => {

                //Build out a string for the message that we'll log to the console and in a text file
                const messageArray = [];

                //Sort the results by song name
                const sortedResults = response.tracks.items.sort(spotifyItemSortBySongName);

                //Loop thru all the tracks that we received and push the details of each track to the message array
                sortedResults.forEach(track => {

                    //console.log(track);

                    //Loop thru the artists and build out the artist string
                    let artists = "";
                    track.artists.forEach(artist => {
                        artists += artist.name + ",";
                    });

                    messageArray.push(`Song Name: ${track.name}`);
                    messageArray.push(`\t Artist(s): ${artists}`);
                    messageArray.push(`\t Album ${track.album.name}`);
                    messageArray.push(`\t Preview Link: ${track.preview_url}`);
                    messageArray.push('');
                });

                //Log the command results
                logCommandResults(messageArray, "Spotify This Song", songName);
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
    const songName = arg2 ? arg2 : "Mr. Nobody.";

    //Build the query url to the omdb api
    const queryUrl = `http://www.omdbapi.com/?t=${encodeURI(songName)}&plot=short&apikey=trilogy`

    // Create a request with axios to the queryUrl
    axios.get(queryUrl).then(
        response => {

            //Build out a string for the message that we'll log to the console and in a text file
            const messageArray = [];

            //Add the details of the movie to the message array
            messageArray.push(`Title: ${response.data.Title}`);
            messageArray.push(`\t Year: ${response.data.Year}`);
            messageArray.push(`\t IMDB Rating: ${response.data.imdbRating}`);
            messageArray.push(`\t Rotten Tomatoes Rating: ${response.data.Ratings.find(rating => rating.Source.toLowerCase() === 'rotten tomatoes').Value}`);
            messageArray.push(`\t Country: ${response.data.Country}`);
            messageArray.push(`\t Language: ${response.data.Language}`);
            messageArray.push(`\t Actors: ${response.data.Actors}`);
            messageArray.push(`\t Plot: ${response.data.Plot}`);

            //Log the command results
            logCommandResults(messageArray, "Movie This", songName);
        }
    );
}

//Function to run when the "do-what-it-says" command is used
function doWhatItSays() {

    //Read the random.txt file and run the command that is in the file
    fs.readFile("random.txt", "utf8", (err, data) => {
        if (err) {
            return console.log(err);
        }

        //Allow multiple commands seperated by new lines in the text file
        const lines = data.split("\n");

        //Loop thru each line and run the command on that line
        lines.forEach((line, index) => {

            //Only run if the line is not blank
            if (line.trim().length > 0) {
                //Split the string in the file by comma
                const params = line.split(",");

                //If no parameters are found in the file then log a message
                //Else process the command in the file
                if (!params || params.length === 0) {
                    logMessage(`No parameters found in file line ${index + 1}!`);
                } else {

                    //Set the second argument
                    //If there is none in the file then just set the argument to blank
                    arg2 = params.length >= 2 ? params[1].trim() : "";

                    //Remove any leading or trailing double or singe quotes
                    arg2 = arg2.replace(/(^")|("$)/g, "").replace(/(^')|('$)/g, "");

                    //Run the command associated with the command name passed in the file
                    runCommand(params[0].trim());
                }
            }
        });

    });
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

//Function to prompt user for which command they want to run
function promptForCommand() {
    inquirer
        .prompt([
            {
                type: "list",
                name: "commandToRun",
                message: "Select a command to run",
                choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"]
            }
        ])
        .then(commandPrompt => {
            switch (commandPrompt.commandToRun) {
                case "concert-this":
                    promptForArg2("Enter an artist/band name to search", "Foo Fighters", commandPrompt.commandToRun);
                    break;
                case "spotify-this-song":
                    promptForArg2("Enter a song name to search", "The Sign", commandPrompt.commandToRun);
                    break;
                case "movie-this":
                    promptForArg2("Enter a movie to search", "Mr. Nobody.", commandPrompt.commandToRun);
                    break;
                default:
                    runCommand(commandPrompt.commandToRun);
                    break;
            }
        });
}

//Prompt the user for the second argument
function promptForArg2(arg2PromptMessage, defaultArg2Value, commandName) {
    if (arg2PromptMessage && arg2PromptMessage.length > 0) {
        inquirer
            .prompt([
                {
                    type: "input",
                    name: "ar2",
                    default: defaultArg2Value,
                    message: arg2PromptMessage
                }
            ])
            .then(arg2Prompt => {
                arg2 = arg2Prompt.ar2;
                runCommand(commandName);
            });
    }
}

//Start the prompt for the user to select a command
promptForCommand();