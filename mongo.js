const mongoose = require("mongoose");
require("dotenv").config();
const url = process.env.DB_URL.replace("<password>", process.env.DB_PASSWORD);
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const userSchema = new mongoose.Schema(
  {
    username: { type: String, minlength: 3, required: true },
    description: String,
    duration: Number,
    date: {
      type: String,
      required: false,
    },
    log: {
      type: [object],
      required: false,
    },
  },
  { versionKey: false }
);

const User = mongoose.model("User", userSchema);
module.exports = { User };
