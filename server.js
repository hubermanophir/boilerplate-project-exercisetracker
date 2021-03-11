const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const User = require("./models/user");
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
  const user = await User.find({ userName: userName });
  console.log(user[0]);
  if (user[0] === undefined) {
    const newUser = new User({
      userName: userName,
    });
    await newUser.save();
    console.log(newUser._id);
    const id = newUser._id;
    const obj = {
      username: newUser.userName,
      _id: id,
    };
    res.json(obj);
  } else {
    res.status(400).send("Username already taken");
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
