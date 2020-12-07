//This installs express using the require() function and installing logging middleware Morgan
const express = require("express");
const morgan = require("morgan");
const app = express();

//installing models.js using the require() function and installing the mongoose package
const mongoose = require("mongoose");
const Models = require("./models.js");
//creating variables for the models names defined in models.js
const Movies = Models.Movie;
const Users = Models.User;

//Connecting mongoose to the [myFlixDB]
mongoose.connect("mongodb://localhost:27017/[myFlixDB]", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.static("public"));
app.use(morgan("common"));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something Broke!");
});

app.get("/", (req, res) => {
  res.send("Welcome to myFlix!");
});

//Task 2.5 express request, Returns a list of ALL movies to the user
app.get("/movies", (req, res) => {
  res.send("Successful GET request returning data on all movies");
});

// Gets the data about a single movie by title
app.get("/movies/:title", (req, res) => {
  res.send("Successful GET request returning data on a single movie by title");
});

//Gets the data about a genre
app.get("/movies/genre/:name", (req, res) => {
  res.send("Successful GET request returning data on a genre by genre name");
});

//returns data about a director by name
app.get("/movies/directors/:name", (req, res) => {
  res.send(
    "Successful GET request returning data on a director by name to include bio, birth year, and death year"
  );
});

//Add a user
/* We'll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthdate: Date
}*/

app.post("/users", (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + "already exists");
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        })
          .then((user) => {
            res.status(201).json(user);
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// Get all users
app.get("/users", (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//Get a user by username
app.get("/users/:Username", (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Update a user's info, by username
/* We’ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
app.put("/users/:Username", (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      },
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

// Add a movie to a user's list of favorites
app.post("/users/:Username/Movies/:MovieID", (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $push: { FavoriteMovies: req.params.MovieID },
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

//Allow users to remove a movie from their favorites
app.delete("/users/:username/favorites", (req, res) => {
  res.send(
    "Successful DELETE request returning a message indicating the movie was removed "
  );
});

// Delete a user by username
app.delete("/users/:Username", (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + " was not found");
      } else {
        res.status(200).send(req.params.Username + " was deleted.");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//listen for requests
app.listen(8080, () => console.log("your app is listening on port 8080."));
