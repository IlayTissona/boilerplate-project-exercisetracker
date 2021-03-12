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
  User.findById(req.body.userId).then((userObject) => {
    if (!userObject) return res.status(404).send("Unknown userId");
    if (!userObject.log) userObject.log = [];
    userObject.log.push({ date: formattedDate, duration, description });
    userObject
      .save()
      .then((saved) => {
        const lastExercise = saved.log[saved.log.length - 1];
        res.json({
          _id: saved._id,
          username: saved.username,
          date: lastExercise.date,
          duration: Number(lastExercise.duration),
          description: lastExercise.description,
        });
      })
      .catch((e) => {
        res.send(e);
      });
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

app.get("/api/exercise/log", (req, res) => {
  const { userId, from, to, limit } = req.query;
  if (!userId) res.send("User ID required");
  User.findById(userId)
    .then((user) => {
      const { log } = user;
      const rawArr = [];
      log.forEach((element) => {
        rawArr.push(element);
      });
      const returnArr = rawArr
        .sort((a, b) => {
          a.date > b.date;
        })
        .filter((exercise) => {
          return (
            (new Date(exercise.date) > new Date(from) || !from) &&
            (new Date(exercise.date) < new Date(to) || !to)
          );
        })
        .splice(0, limit || rawArr.length);

      res.json({
        username: user.username,
        _id: user._id,
        log: returnArr,
        count: returnArr.length,
      });
    })
    .catch((e) => {
      res.send(e);
    });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
