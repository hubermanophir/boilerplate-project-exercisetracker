const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  log: [
    {
      date: Date,
      duration: Number,
      description: String,
    },
  ],
});

// const exercisesSchema = new mongoose.Schema({
//   date: {
//     type: Date,
//     default: new Date(),
//   },
//   duration: {
//     type: Number,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
// });

module.exports = mongoose.model("Users", UserSchema);
