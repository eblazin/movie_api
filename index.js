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

let top10Movies = [
  { title: "Die Hard" },
  { title: "Bad Boys" },
  { title: "Titanic" },
  { title: "Scream" },
  { title: "Shrek" },
  { title: "Scream 2" },
  { title: "The Adam's Family" },
  { title: "Homeward Bound" },
  { title: "The Jungle Book" },
  { title: "Sharknado" },
];

app.get("/movies", (req, res) => {
  res.json(top10Movies);
});

app.get("/", (req, res) => {
  res.send("This is a default textual response of my choosing :)");
});

//listen for requests
app.listen(8080, () => console.log("your app is listening on port 8080."));
