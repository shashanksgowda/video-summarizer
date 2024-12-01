const { GoogleGenerativeAI } = require("@google/generative-ai");

const summarizeVideo = async (videoUrl) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Summarize this video in detail: ${videoUrl}`;

  const result = await model.generateContent(prompt);
  return result.response.text();
};

module.exports = { summarizeVideo };
