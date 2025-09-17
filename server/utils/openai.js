const getOpenRouterAPIResponse = async (message) => {
  const options = {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",   // ✅ stable model
      messages: [{ role: "user", content: message }]
    }),
  };

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", options);
    const data = await response.json();

    if (!response.ok) {
      console.error("❌ OpenRouter error:", data);
      return "Error from OpenRouter: " + (data.error?.message || "Unknown error");
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error("❌ Fetch error:", error);
    return "Error calling OpenRouter API";
  }
};

export default getOpenRouterAPIResponse;
