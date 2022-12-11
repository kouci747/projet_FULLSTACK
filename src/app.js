const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/userModel");
const dotenv = require("dotenv").config();
const { findById } = require("./models/userModel");

const app = express();

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("successfully connected to DA database");
  })
  .catch((err) => console.log(err));

app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.send({
    message: "Test OK",
    auth: false,
    myProducts: [{ id: 1 }, { id: 2 }],
  });
});

// const myUser = {
//     firstName:"Koceila",
//     lastName:"arhab"
// }

// app.post('/api/v1/auth/login', function(req,res){
//     //on récupère le body de la req

//     // console.log(req.body);
//     //v1 res.send({
//     //     message: req.body.firstName? 'tu as bien un prénom' : 'sans identité'
//     // })
//     //v2 ..équivalent à v1
//    if (!req.body.firstName){
//     return res.status(404).send({
//         auth: false,
//         message:"User not found"
//         //return : si ce script passe, le reste ne s'execute pas
//     })

//    }
//    res.send({
//     auth:true,
//     message:"User logged"
// })

// })

app.post("/auth/register", (req, res) => {
  console.log(req);
  //hacher le mot de passe
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);

  //créer un nouvel utilisateur
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hash,
  });
  newUser
    .save()
    .then((user) => {
      res.send(user);
      console.log("ici");
    })
    .catch((err) => {
      res.status(400).send(err);
      console.log("la");
    }); // .save :sauvegarder le nouvel user créé
});

app.get("/users/:id", (req, res) => {
  //trouver un user par son id
  User.findById(req.params.id).then((users) => {
    res.send(users);
  });
});

app.get("/users", (req, res) => {
  //récupérer tous les utilisateurs
  User.find(req.params).then((users) => {
    res.send(users);
  });
});

app.put("/users/:id", (req, res) => {
  //modifier un utilisateur
  User.findByIdAndUpdate(req.params.id, {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  }).then((users) => {
    res.send({ users, updated: true });
  });
});

app.delete("/users/:id", (req, res) => {
  User.findByIdAndRemove(req.params.id).then((users) => {
    res.status(200).json("Utilisateur supprimé");
  });
});

//console.log(JSON.stringify(myUser))
//console.log(myUser)
//console.log(myUser.lastName) //les objets sont DEJA parsés

//écouter l'appli sur un port
app.listen("4000", function () {
  console.log("server launched ");
});
