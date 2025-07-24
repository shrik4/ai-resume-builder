import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { prompt, context } = await request.json();
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("API key not set in environment variables.");
    }
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "http://localhost:3000/", // Change to your domain in production
        "X-Title": "ai-resume-builder"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: context ? `Context: ${context}` : "" },
          { role: "user", content: prompt }
        ].filter(m => m.content),
        stream: false
      })
    });
    const result = await response.json();
    if (result.choices && result.choices[0] && result.choices[0].message && result.choices[0].message.content) {
      return NextResponse.json({ text: result.choices[0].message.content });
    } else {
      throw new Error(result.error?.message || "Failed to generate text");
    }
  } catch (error) {
    console.error("Error generating text:", error);
    return NextResponse.json({ error: "Failed to generate text" }, { status: 500 });
  }
}
