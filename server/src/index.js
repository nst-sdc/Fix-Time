const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/auth/register", (req, res) => {
  const { email, password } = req.body;
  console.log("Received registration:", email, password);
  res.status(200).json({ message: "User registered!" });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});