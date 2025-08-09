const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("OKGSLMS2 Backend is running ✅");
});

app.listen(3000, () => {
  console.log("Server listening on port 3000 🚀");
});
