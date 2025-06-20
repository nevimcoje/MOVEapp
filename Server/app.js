const express = require('express');
const app = express();
const port = 3001;

const activityController = require("./controller/activity");
const categoryController = require("./controller/category");

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.get("/", (req, res) => {
  res.send("MOVE APP DASHBOARD!");
});

app.use("/activity", activityController);
app.use("/category", categoryController);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
