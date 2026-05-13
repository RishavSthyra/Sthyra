import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are Sthyra's AI assistant. Sthyra is a premium architectural visualization and digital spatial storytelling company based in Bangalore, India.

Key Information:
- Website: sthyra.com
- Email: info@sthyra.com
- Services: Cinematic Real Estate Films, Interactive Web Experiences, Ultra-Real Renders, VR/AR Experiences, Digital Twins, Pixel Streaming
- Specialty: Pre-construction real estate visualization for developers, architects, and luxury property brands
- Based in: Bangalore, India
- Target clients: Real estate developers, architects, sales teams, investors, luxury property brands

Tone: Professional, premium, confident, helpful. Keep responses concise (2-4 sentences). Guide users toward understanding services or booking a consultation.

If asked about pricing, mention it varies by project scope and suggest booking a consultation.
If asked to book a call, redirect to booking form or email info@sthyra.com

`;

function getAnthropicBaseUrl(apiKey: string) {
  if (process.env.ANTHROPIC_BASE_URL) {
    return process.env.ANTHROPIC_BASE_URL.replace(/\/$/, "");
  }

  return apiKey.startsWith("sk-ant-co-")
    ? "https://api.claudeopus.pro"
    : "https://api.anthropic.com";
}

function parseClaudeResponse(rawResponse: string) {
  try {
    return JSON.parse(rawResponse);
  } catch {
    return null;
  }
}

function extractAIMessage(data: unknown, rawResponse: string) {
  if (!data || typeof data !== "object") {
    return rawResponse.trim();
  }

  const responseData = data as {
    content?: Array<{ type?: string; text?: string }>;
    message?: string;
    choices?: Array<{ message?: { content?: string } }>;
  };

  const textBlock = responseData.content?.find((block) => block.type === "text" || block.text);
  if (textBlock?.text) {
    return textBlock.text;
  }

  if (responseData.message) {
    return responseData.message;
  }

  const openAIMessage = responseData.choices?.[0]?.message?.content;
  if (openAIMessage) {
    return openAIMessage;
  }

  return rawResponse.trim();
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      // Fallback responses when no API key is configured
      const lowerMessage = message.toLowerCase();

      if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("pricing")) {
        return NextResponse.json({
          message: "Our pricing varies based on project scope and deliverables. The best way to get accurate pricing is a quick call. Want me to help you book one?",
        });
      }

      if (lowerMessage.includes("service") || lowerMessage.includes("what do you do")) {
        return NextResponse.json({
          message: "Sthyra specializes in premium architectural visualization for real estate. We offer Cinematic Films, Interactive Web Experiences, Ultra-Real Renders, VR/AR Experiences, and Digital Twins. All designed to help developers sell projects before they're built. Which service interests you?",
        });
      }

      if (lowerMessage.includes("book") || lowerMessage.includes("call") || lowerMessage.includes("consultation")) {
        return NextResponse.json({
          message: "I'd be happy to help you book a consultation! Please use the booking form in this chat or email us at info@sthyra.com. Our team will respond within 24 hours.",
        });
      }

      if (lowerMessage.includes("portfolio") || lowerMessage.includes("work") || lowerMessage.includes("example")) {
        return NextResponse.json({
          message: "You can explore our work throughout this website. We have experience with luxury apartments, villas, townships, and commercial projects across India.",
        });
      }

      return NextResponse.json({
        message: "Thanks for reaching out! For detailed project inquiries, I'd recommend using the booking form to schedule a consultation, or email us at info@sthyra.com. For general questions, I'm happy to help!",
      });
    }

    const baseUrl = getAnthropicBaseUrl(apiKey);
    const model = process.env.ANTHROPIC_MODEL || "claude-opus-4-6";

    const response = await fetch(`${baseUrl}/v1/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        messages: [
          { role: "user", content: message }
        ],
        system: SYSTEM_PROMPT,
      }),
    });

    const rawResponse = await response.text();
    const data = parseClaudeResponse(rawResponse);

    if (!response.ok) {
      const errorData = data as {
        error?: { type?: string; message?: string };
        request_id?: string;
      } | null;

      console.error("Claude API error:", {
        status: response.status,
        baseUrl,
        type: errorData?.error?.type,
        message: errorData?.error?.message,
        requestId: errorData?.request_id,
      });

      if (response.status === 401) {
        return NextResponse.json(
          { error: "AI API key was rejected. Check ANTHROPIC_API_KEY and ANTHROPIC_BASE_URL." },
          { status: 502 }
        );
      }

      return NextResponse.json(
        { error: "Failed to get response from AI" },
        { status: 500 }
      );
    }

    const aiMessage = extractAIMessage(data, rawResponse);

    if (!aiMessage) {
      console.error("Claude API returned an empty response", {
        status: response.status,
        baseUrl,
      });

      return NextResponse.json(
        { error: "Failed to get response from AI" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: aiMessage });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
