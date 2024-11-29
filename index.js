const express = require("express");
const { parseSpintax } = require("./spintax");

const app = express();
const port = 3000;
const cors = require("cors");
app.use(cors());
app.use(express.json());

app.post("/api/spintax", (req, res) => {
  const { spintax, count } = req.body;

  // validation
  if (!spintax || typeof spintax !== "string") {
    return res.status(400).json({ message: "Invalid spintax format." });
  }
  if (!count || typeof count !== "number" || count < 1 || count > 20) {
    return res
      .status(400)
      .json({ message: "Count must be a number between 1 and 20." });
  }

  // Generate variations
  const variations = new Set();
  const maxAttempts = 1000; 
  let attempts = 0;

  console.time("Spintax Generation"); 
  while (variations.size < count && attempts < maxAttempts) {
    const variation = parseSpintax(spintax);
    variations.add(variation);
    attempts++;
  }
  console.timeEnd("Spintax Generation");

  if (variations.size < count) {
    return res
      .status(500)
      .json({ message: "Unable to generate sufficient unique variations." });
  }

  return res.json({ variations: Array.from(variations) });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
