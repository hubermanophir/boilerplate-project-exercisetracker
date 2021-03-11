const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
  },
  log: [
    {
      description: String,
      duration: Number,
      date: Date,
    },
  ],
});

module.exports = mongoose.model("Users", UserSchema);
