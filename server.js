require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const User = require("./mongo");

app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/exercise/new-user", (req, res) => {
  const {username} = req.body;
  let newUser = new User({username})
  console.log(newUser);
  newUser.save().then((saved)=>{
    console.log(saved);
    res.json(saved);
  }).catch(e=>{res.sendStatus(500)});

});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
