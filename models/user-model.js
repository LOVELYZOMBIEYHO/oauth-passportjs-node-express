const mongoose = require("mongoose");

//  Google AC required information/data for login
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minlength: 6,
    maxlength: 255,
  },
  googleID: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  thumbnail: {
    type: String,
  },
  //   Local Login
  email: {
    type: String,
  },
  password: {
    type: String,
    minlength: 8,
    maxlength: 1024,
  },
});

module.exports = mongoose.model("User", userSchema);
