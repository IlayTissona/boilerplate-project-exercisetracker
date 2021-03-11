const mongoose = require("mongoose");
require("dotenv").config();
const url = process.env.DB_URL.replace("<password>", process.env.DB_PASSWORD);
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const userSchema = new mongoose.Schema({
  username: { type: String, minlength: 3, required: true },
  exercises: { type: [Exercise], required: false, default: [] },
});

const exerciseSchema = new mongoose.Schema({
  userId: { type: String, minlength: 3, required: true },
  description: String,
  duration: Number,
  date: {
    type: Date,
    required: false,
    default: new Date(),
  },
});

const User = mongoose.model("User", userSchema);
const Exercise = mongoose.model("exercise", exerciseSchema);
module.exports = { User, Exercise };
