require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const expressGraphQL = require("express-graphql");
const cors = require("cors");

const { schema } = require("./graphql");

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
app.use("/api/v1", require("./routers/api.js"));

app.use(
  "/graphql",
  expressGraphQL({
    schema,
    graphiql: process.env.NODE_ENV === "development"
  })
);

app.listen(port, () => {
  console.log(`Express Server is listening on port ${port}`);
  return;
});
