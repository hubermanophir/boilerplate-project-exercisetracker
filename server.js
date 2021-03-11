const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const User = require("./models/user");
const Exercise = require("./models/exercise");
const { json } = require("body-parser");
const { find } = require("./models/user");

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(json());

mongoose
  .connect(
    "mongodb+srv://hubermanophir:Password123@testcluster.oqqu5.mongodb.net/ExerciseTracker?retryWrites=true&w=majority",
    {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log("Connected Successfully to Mongoose atlas"));

const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/exercise/new-user", async (req, res) => {
  const body = req.body;
  const userName = body.username;
  const user = await User.find({ username: userName });
  if (user[0] === undefined) {
    const newUser = new User({
      username: userName,
    });
    await newUser.save();
    const id = newUser._id;
    const username = newUser.username;
    const obj = {
      username: username,
      _id: id,
    };
    console.log(obj.username);
    res.json(obj);
  } else {
    res.status(400).send("Username already taken");
  }
});

app.get("/api/exercise/users", async (req, res) => {
  const userArray = await User.find({});
  res.json(userArray);
});

app.post("/api/exercise/add", async (req, res) => {
  const body = req.body;
  const id = body.userId;
  const user = await User.findById(id);
  console.log(user);
  const exercise = {
    _id: user._id,
    username: user.username,
  };
  if (body.date === "") {
    exercise.date = new Date().toLocaleDateString("en-US", options);
  } else {
    exercise.date = body.date;
  }
  exercise.duration = Number(body.duration);
  exercise.description = body.description;
  res.json(exercise);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
