const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const User = require("./models/user");
const Exercise = require("./models/exercise");
const { json } = require("body-parser");

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
  let exercise;
  if (!body.date) {
    exercise = new Exercise({
      userId: body.userId,
      description: body.description,
      duration: body.duration,
      date: body.date,
    });
  } else {
    exercise = new Exercise({
      userId: body.userId,
      description: body.description,
      duration: body.duration,
    });
  }
  await exercise.save();
  const obj = {};
  const id = exercise._id;
  const { username } = await Exercise.findById(id);
  obj._id = id;
  obj.username = username;
  obj.date = exercise.date;
  obj.duration = exercise.duration;
  obj.description = exercise.description;
  res.json(obj);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
