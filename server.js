const express = require("express");

const app = express();

const port = 3000;

app.use("/api/v1", require("./routers/api.js"));

app.listen(port, () => {
  console.log(`Express Server is listening on port ${port}`);
  return;
});
