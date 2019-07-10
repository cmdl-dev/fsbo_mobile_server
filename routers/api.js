const express = require("express");
const router = new express.Router();

const { User } = require("../models");

router.get("/test", (req, res) => {
  res.status(200).json({
    userName: "Cesar",
    type: "bearer",
    token: "81324817234813123dh98x1d234d14791"
  });
});

router.get("/login/:email", (req, res) => {
  User.findOne({
    where: { email: req.params.email }
  }).then(user => {
    res.status(200).json(user);
  });
});
router.get("/create", (req, res) => {
  User.create({
    firstName: "cesar",
    lastName: "Hernandez",
    email: "tinh57122@gmail.com"
  })
    .then(_ => {
      console.log("added successfully");
      res.status(201).json({ message: "user created" });
    })
    .catch(e => {
      console.log(e.message);
      res.status(400).json({ message: "that user already exists" });
    });
});
router.post("/secret", (req, res) => {
  if (
    req.body.token === "81324817234813123dh98x1d234d14791" &&
    req.body.type === "bearer"
  ) {
    console.log("you pass");
    res.status(200).json({
      message: "You have the secret"
    });
  } else {
    console.log("you fail");
    res.status(400).json({
      message: "invalid token"
    });
  }
});
module.exports = router;
