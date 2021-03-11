const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Users", UserSchema);
