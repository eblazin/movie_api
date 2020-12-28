//This installs express using the require() function and installing logging middleware Morgan
const mongoose = require("mongoose");
const Models = require("./models.js");
const Movies = Models.Movie;
const Users = Models.User;
const bodyParser = require("body-parser");
const express = require("express");
const morgan = require("morgan");
const app = express();

//installing models.js using the require() function and installing the mongoose package

//creating variables for the models names defined in models.js

//Connecting mongoose to the [myFlixDB]
mongoose.connect("mongodb://localhost:27017/[myFlixDB]", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(morgan("common"));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something Broke!");
});

app.get("/", (req, res) => {
  res.send("Welcome to myFlix!");
});

//Return a list of ALL movies to the user
app.get("/movies", (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//Return data about a single movie by title to the user
app.get("/movies/:Title", (req, res) => {
  Movies.findOne({ Title: req.body.Title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//Gets the data about a genre
app.get("/movies/:genre", (req, res) => {
  Movies.find({ "Genre.Name": req.body.name })
    .then((genre) => {
      res.json(genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
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
  username: String,
  password: String,
  Email: String,
  Birthdate: Date
}*/

app.post("/users", (req, res) => {
  Users.findOne({ username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + "already exists");
      } else {
        Users.create({
          username: req.body.username,
          password: req.body.password,
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

//Get all users
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
app.get("/users/:username", (req, res) => {
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
  username: String,
  (required)
  password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
app.put("/users/:username", (req, res) => {
  Users.findOneAndUpdate(
    { username: req.params.username },
    {
      $set: {
        username: req.body.username,
        password: req.body.password,
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
app.post("/users/:username/Movies/:MovieID", (req, res) => {
  Users.findOneAndUpdate(
    { username: req.params.username },
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
app.delete("/users/:username", (req, res) => {
  Users.findOneAndRemove({ username: req.params.username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.username + " was not found");
      } else {
        res.status(200).send(req.params.username + " was deleted.");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//listen for requests
app.listen(8080, () => console.log("your app is listening on port 8080."));
