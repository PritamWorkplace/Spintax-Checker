const express = require("express");
const cors = require("cors");
const { parseSpintax } = require("./spintax");  
const { z } = require("zod");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const spintaxSchema = z.object({
  spintax: z.string().min(1, "Spintax cannot be empty"), 
  count: z
    .number()
    .min(1, "Count must be at least 1")
    .max(20, "Count cannot exceed 20"), 
});

app.post("/api/spintax", (req, res) => {
  const validationResult = spintaxSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({ errors: validationResult.error.errors });
  }

  const { spintax, count } = validationResult.data;

  const variations = new Set();
  const maxAttempts = 1000; 
  let attempts = 0;

  while (variations.size < count && attempts < maxAttempts) {
    variations.add(parseSpintax(spintax));
    attempts++;
  }

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
