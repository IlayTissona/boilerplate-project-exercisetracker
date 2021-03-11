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
  userName: { type: String, minlength: 3, required: true },
});

module.exports = mongoose.model("User", userSchema);
