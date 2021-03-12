require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const { User } = require("./mongo");

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/exercise/new-user", (req, res) => {
  const { username } = req.body;
  let newUser = new User({ username });
  newUser
    .save()
    .then((saved) => {
      res.json(saved);
    })
    .catch((e) => {
      res.sendStatus(500);
    });
});

app.post("/api/exercise/add", (req, res) => {
  const { date, duration, description } = req.body;
  let formattedDate;
  if (date) formattedDate = new Date(date).toDateString();
  else formattedDate = new Date().toDateString();
  User.findById(req.body.userId)
    .then((userObject) => {
      if (!userObject) return res.status(404).send("Unknown userId");
      userObject.date = formattedDate;
      userObject.duration = duration;
      userObject.description = description;
      return userObject.save();
    })
    .then((saved) => {
      delete saved.__v;
      console.log("SAVED:" + saved);
      res.json(saved);
    })
    .catch((e) => {
      res.send(e);
    });
});

app.get("/api/exercise/users", (req, res) => {
  User.find({})
    .then((users) => {
      res.json(users);
    })
    .catch((e) => {
      res.send(e);
    });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
