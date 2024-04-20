// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const fs = require("fs");
// const dotenv = require("dotenv").config();

// Access your API key as an environment variable (see "Set up your API key" above)
// const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Converts local file information to a GoogleGenerativeAI.Part object.
function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
}

async function run() {
  // For text-and-image input (multimodal), use the gemini-pro-vision model
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

  const prompt =
    "Could you determine if there are any food items present in these images? If so, please provide the recipe in the following format: heading with the food name, followed by ingredients, steps, serving size, and additional details. If no food is detected in the image, indicate that no food has been found";

  const imageParts = [
    fileToGenerativePart("images/cb1.jpg", "image/png"),
    fileToGenerativePart("images/white.jpg", "image/jpg"),
  ];

  const result = await model.generateContent([prompt, ...imageParts]);
  const response = await result.response;
  const text = response.text();
  console.log(text);
  const btn = document.getElementById("btn");
  const res = document.getElementById("result");
  res.innerHTML = text;
}

document.getElementById("runButton").addEventListener("click", function () {
  const fileInput = document.getElementById("image");
  const file = fileInput.files[0];
  if (!file) {
    alert("Please upload a file before submitting!");
    return;
  }
  postDetails(file);

  // run();
});

// Functions
const postDetails = (photo) => {
  if (photo.type === "image/jpeg" || photo.type === "image/png") {
    const data = new FormData();
    data.append("file", photo);
    data.append("upload_preset", "gemini-api");
    data.append("cloud_name", "supradeep");
    fetch("https://api.cloudinary.com/v1_1/supradeep/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.url.toString());
        const link = data.url.toString();
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    console.log("please select image");
    return;
  }
};
