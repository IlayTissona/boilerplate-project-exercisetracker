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
  console.log(req.body);
  newUser
    .save()
    .then((saved) => {
      res.json(saved);
    })
    .catch((e) => {
      // console.log(e);
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
        console.log(typeof saved._id);
        res.json({
          date: lastExercise.date,
          duration: lastExercise.duration,
          description: lastExercise.description,
          _id: saved._id,
          username: saved.username,
        });
      })
      .catch((e) => {
        res.send(e);
        console.log(e);
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
      console.log(rawArr);
      const returnArr = rawArr
        .sort((a, b) => {
          a.date > b.date;
        })
        .filter((exercise) => {
          return (exercise.date > from || !from) && (exercise.date < to || !to);
        })
        .splice(0, limit || rawArr.length);

      res.json({
        username: user.username,
        _id: user._id,
        log: returnArr,
        counter: returnArr.length,
      });
    })
    .catch((e) => {
      res.send(e);
      console.log(e);
    });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
