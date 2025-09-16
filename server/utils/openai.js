import "dotenv/config";

const getOpenRouterAPIResponse = async(message) => {
    const options = {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1:free", 
        messages: [{
            role: "user",
            content: message,
        }]
      }),
    };

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", options);
        const data = await response.json();
        return data.choices[0].message.content
    } catch (error) {
        console.log(error);
    }
}

export default getOpenRouterAPIResponse;