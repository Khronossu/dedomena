import openai from "./chatgpt";

const query = async (prompt: string, id: string, model: string) => {
  try {
    const res = await openai.chat.completions.create({
      model, // Use the specified chat model, e.g., "gpt-3.5-turbo"
      messages: [
        { role: "system", content: "You are ChatGPT, a helpful assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.9,
      top_p: 1,
      max_tokens: 1000,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    return res.choices[0].message.content;
  } catch (err) {
    console.error("Error querying OpenAI API:", err);
    throw new Error(err?.message || "Failed to query OpenAI API.");
  }
};

export default query;