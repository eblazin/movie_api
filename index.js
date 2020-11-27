//This installs express using the require() function and installing logging middleware Morgan
const express = require("express"),
  morgan = require("morgan");
const app = express();

app.use(express.static("public"));
app.use(morgan("common"));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something Broke!");
});

app.get("/", (req, res) => {
  res.send("This is a default textual response of my choosing :)");
});
//Task 2.5 express request, Returns a list of ALL movies to the user
app.get("/movies", (req, res) => {
  res.json(movies);
});

// Gets the data about a single movie by title
app.get("/movies:title", (req, res) => {
  res.json(
    movies.find((movie) => {
      return movie.title === req.params.title;
    })
  );
});

//Gets the data about a genre
app.get("/movies:genre", (req, res) => {
  res.json(
    movies.find((genre) => {
      return movie.genre === req.params.genre;
    })
  );
});

//returns data about a director by name
app.get("/movies:director_name", (req, res) => {
  res.json(
    directors.find((director) => {
      return req.params.director;
    })
  );
});

//Allows user to register
app.post("/users", (req, res) => {
  res.send("Successful POST request returning a username");
});

//Allows users to update their user info(username)
app.put("/users:username/about", (req, res) => {
  res.send("Successful PUT request returning updated username information");
});

//Allows users to add a movie to their favorites
app.put("/users:username/profile", (req, res) => {
  res.send(
    "Successful PUT request returning information about the favorite movie"
  );
});

//Allow users to remove a movie from their favorites
app.delete("/users:username/profile", (req, res) => {
  res.send("Successful DELETE request returning a message ");
});

//Allows users to deregister
app.delete("/users:username/profile", (req, res) => {
  res.send("Successful DELETE request returning a confirmation text message");
});

//listen for requests
app.listen(8080, () => console.log("your app is listening on port 8080."));
