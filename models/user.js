const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  exercises: [
    {
      date: Date,
      duration: Number,
      description: String,
    },
  ],
});

module.exports = mongoose.model("Users", UserSchema);
