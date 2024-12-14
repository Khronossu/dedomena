import OpenAI from "openai";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testOpenAI() {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "user", content: "write a haiku about ai" },
      ],
    });

    console.log(completion.choices[0].message.content);
  } catch (error) {
    console.error("Error creating completion:", error);
  }
}

testOpenAI();