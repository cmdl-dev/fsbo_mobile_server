require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");

const { graphql } = require("./middlewares/graphql");
const { authMiddleware } = require("./middlewares/auth");

const app = express();

const port = 3000;

app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
// ability to use .json for forms
app.use(bodyParser.json());
// app.use("/api/v1", require("./routers/api.js"));
require("./middlewares/auth").initBearerStrategy();
app.use(passport.initialize());
app.use(passport.session());
app.use("/graphql", graphql);

app.listen(port, () => {
  console.log(`Express Server is listening on port ${port}`);
  return;
});
