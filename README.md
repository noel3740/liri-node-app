# LIRI Bot

### Overview

This is LIRI. It's like iPhone's SIRI but a _Language_ Interpretation and Recognition Interface instead of a Speech Interpretation and Recognition Interface. LIRI will be a command line node app that takes in parameters and gives you back data.

### Instructions

LIRI requires Node.js to be installed to run. The command line to run LIRI is:
`node liri <command name> '<search parameter>'`

There are 4 basic commands of LIRI:

1. `concert-this`
    * To run this command you type into terminal the following: `node liri concert-this '<artist/band name here>'`
    * This will search the Bands in Town Artist Events API using the [npm axios package](https://www.npmjs.com/package/axios) for an artist and render the following information about each event to the terminal window and log.txt file:

        * Name of the venue

        * Venue location

        * Date of the Event (use moment to format this as "MM/DD/YYYY")
    * You can watch a video of this command running [here](https://drive.google.com/file/d/1vNKKUy5lfebpRyHduQo2mmGhviY5HxxP/view)

2. `spotify-this-song`
    * To run this command you type into terminal the following: `node liri spotify-this-song '<song name here>'`
        * `song name` is an optional parameter. If not entered then "The Sign" will be the song name searched. 
    * This command will utilize the [node-spotify-api package](https://www.npmjs.com/package/node-spotify-api) to search the       Spotify API and show the following information about the song in your terminal window and log.txt file:

        * Artist(s)

        * The song's name

        * A preview link of the song from Spotify

        * The album that the song is from
    * You can watch a video of this command running [here](https://drive.google.com/file/d/1x5ktsp1Kwq0uMCfe630YzFg51AxtQIGo/view)

3. `movie-this`
    * To run this command you type into terminal the following: `node liri movie-this '<movie name here>'`
        * `movie name` is an optional parameter. If not entered then "Mr. Nobody." will be the movie name searched. 
    * This command will search the OMDB API using the [npm axios package](https://www.npmjs.com/package/axios) for a movie name and render the following information about the movie to the terminal window and log.txt file:

        * Title of the movie.

        * Year the movie came out.

        * IMDB Rating of the movie.

        * Rotten Tomatoes Rating of the movie.

        * Country where the movie was produced.

        * Language of the movie.

        * Plot of the movie.
        
        * Actors in the movie. 
    * You can watch a video of this command running [here](https://drive.google.com/file/d/1ky5h-S5Bo1cFrjZiyX0q7BOKuDlHt3fu/view)

4. `do-what-it-says`
    * To run this command you type into terminal the following: `node liri do-what-it-says`

    * This command will look for a file named `random.txt` in the same location that you are running the program from and run whatever commands you have in that file. 

    * You can run multiple commands by entering them as seperate lines in the `random.txt` file. 

    * The commands you can run and the format of those commands are described in 1 thru 3 above. 

    * The output will also be in the terminal window and log.txt file. 

    * You can watch a video of this command running [here](https://drive.google.com/file/d/1e1xHLAjxqmb3DzhWGrfy-nRCwuHymZ5p/view)