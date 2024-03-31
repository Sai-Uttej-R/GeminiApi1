const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const dotenv = require('dotenv').config()
const express = require('express');
const app = express();
const port = 3000;

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Converts local file information to a GoogleGenerativeAI.Part object.
function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType
    },
  };
}

async function run() {
  // For text-and-image input (multimodal), use the gemini-pro-vision model
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

  const prompt = "Could you determine if there are any food items present in these images? If so, please provide the recipe in the following format: heading with the food name, followed by ingredients, steps, serving size, and additional details. If no food is detected in the image, indicate that no food has been found";

  const imageParts = [
    fileToGenerativePart("cb1.jpg", "image/jpg"),
    fileToGenerativePart("white.jpg", "image/jpg"),
  ];

  const result = await model.generateContent([prompt, ...imageParts]);
  const response = await result.response;
  const text = response.text();
  return text;
}

app.get('/runScript', async (req, res) => {
    const text = await run(); // assuming your run function returns the text
    res.send(text);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
