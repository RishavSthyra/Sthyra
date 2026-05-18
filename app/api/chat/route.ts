import { NextRequest, NextResponse } from "next/server";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const STHYRA_KNOWLEDGE = {
  company:
    "Sthyra is a premium architectural visualization and digital spatial storytelling studio based in Bangalore, India.",
  website: "sthyra.com",
  email: "info@sthyra.com",
  location: "Bangalore, India",
  audience:
    "Real estate developers, architects, sales teams, investors, and luxury property brands.",
  specialty:
    "Pre construction real estate visualization that helps teams explain, launch, market, and sell spaces before they physically exist.",
  services: [
    {
      name: "Cinematic Real Estate Films",
      description:
        "High emotion launch films and project stories for websites, presentations, campaigns, investor decks, and sales launches.",
    },
    {
      name: "Interactive Web Experiences",
      description:
        "Browser based experiences such as interactive masterplans, tower selectors, unit highlights, amenity stories, hotspots, and guided project journeys.",
    },
    {
      name: "Ultra Real Renders",
      description:
        "Photorealistic exterior, interior, amenity, landscape, and lifestyle visuals designed to build buyer confidence and premium perception.",
    },
    {
      name: "VR and AR Experiences",
      description:
        "Immersive tools that help buyers and stakeholders understand scale, layout, views, interiors, and lifestyle before construction.",
    },
    {
      name: "Digital Twins",
      description:
        "Interactive digital replicas of real estate projects that make complex spatial information easier to explore and present.",
    },
    {
      name: "Pixel Streaming",
      description:
        "High fidelity real time 3D experiences streamed through the browser for premium sales and stakeholder presentations.",
    },
  ],
  outcomes: [
    "clarity before construction",
    "stronger buyer trust",
    "premium project perception",
    "better sales conversations",
    "faster stakeholder alignment",
    "more memorable launches",
  ],
};

function buildKnowledgeText() {
  const serviceText = STHYRA_KNOWLEDGE.services
    .map((service) => `${service.name}: ${service.description}`)
    .join("\n");

  return [
    `Company: ${STHYRA_KNOWLEDGE.company}`,
    `Website: ${STHYRA_KNOWLEDGE.website}`,
    `Email: ${STHYRA_KNOWLEDGE.email}`,
    `Location: ${STHYRA_KNOWLEDGE.location}`,
    `Audience: ${STHYRA_KNOWLEDGE.audience}`,
    `Specialty: ${STHYRA_KNOWLEDGE.specialty}`,
    `Services:\n${serviceText}`,
    `Typical outcomes: ${STHYRA_KNOWLEDGE.outcomes.join(", ")}.`,
  ].join("\n\n");
}

function buildConversationSignals(history: ChatMessage[]) {
  const recentUserMessages = history
    .filter((item) => item.role === "user")
    .slice(-6)
    .map((item) => item.content.toLowerCase());

  const signals = new Set<string>();

  for (const content of recentUserMessages) {
    if (/(price|pricing|cost|budget|quote|package)/.test(content)) {
      signals.add("The visitor is asking about pricing or budget.");
    }

    if (/(book|call|meeting|consult|talk|schedule)/.test(content)) {
      signals.add("The visitor may be ready for a consultation.");
    }

    if (/(render|image|visual|interior|exterior)/.test(content)) {
      signals.add("The visitor is interested in visual output quality.");
    }

    if (/(website|interactive|web|masterplan|selector|hotspot)/.test(content)) {
      signals.add("The visitor is interested in interactive web experiences.");
    }

    if (/(film|video|cinematic|launch|campaign)/.test(content)) {
      signals.add("The visitor is interested in cinematic real estate films.");
    }

    if (/(vr|ar|digital twin|pixel streaming|real time|realtime)/.test(content)) {
      signals.add("The visitor is interested in immersive or real time experiences.");
    }
  }

  if (signals.size === 0) {
    return "No strong conversation pattern yet. Ask one useful clarifying question when needed.";
  }

  return Array.from(signals).join(" ");
}

function buildSystemPrompt(history: ChatMessage[]) {
  const extraKnowledge = process.env.STHYRA_AI_KNOWLEDGE?.trim();

  return `You are Sthyra's AI assistant. Speak like a thoughtful human consultant for a premium architectural visualization studio, not like a generic chatbot.

Core business knowledge:
${buildKnowledgeText()}

Additional editable knowledge:
${extraKnowledge || "No additional knowledge has been provided."}

Conversation signals learned from this visitor:
${buildConversationSignals(history)}

How to respond:
Keep answers concise, usually 2 to 4 sentences.
Sound warm, premium, specific, and calm.
Use natural language. Avoid robotic phrases like as an AI, we understand your needs, or thank you for reaching out unless it truly fits.
Do not use markdown lists.
Do not use dash punctuation or dash based bullets.
Do not overuse exclamation marks.
When the visitor is vague, ask one focused question that helps qualify the project.
When useful, guide toward a consultation or email info@sthyra.com.

Business rules:
If asked about pricing, say pricing depends on scope, format, timeline, property type, and level of detail. Suggest a consultation for an accurate estimate.
If asked to book a call, tell them they can use the booking form in the chat or email info@sthyra.com.
If asked what Sthyra does, explain the outcome first, then name the most relevant services.
If asked for technical details, answer clearly but keep the business value visible.
If asked about something unknown, be honest and suggest sharing project details or contacting info@sthyra.com.
Never invent prices, client names, delivery timelines, guarantees, awards, or case studies unless the visitor provides them.`;
}

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

function normalizeHistory(input: unknown): ChatMessage[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .filter((item): item is ChatMessage => {
      if (!item || typeof item !== "object") {
        return false;
      }

      const value = item as { role?: unknown; content?: unknown };
      return (
        (value.role === "user" || value.role === "assistant") &&
        typeof value.content === "string" &&
        value.content.trim().length > 0
      );
    })
    .slice(-10)
    .map((item) => ({
      role: item.role,
      content: item.content.trim().slice(0, 1200),
    }));
}

function cleanAssistantMessage(message: string) {
  return message
    .replace(/[—–]/g, ", ")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function getFallbackResponse(message: string, history: ChatMessage[]) {
  const lowerMessage = message.toLowerCase();
  const hasPricingIntent = /(price|cost|pricing|budget|quote|package)/.test(lowerMessage);
  const hasServiceIntent = /(service|what do you do|offer|help with)/.test(lowerMessage);
  const hasBookingIntent = /(book|call|consultation|meeting|schedule|talk)/.test(lowerMessage);
  const hasPortfolioIntent = /(portfolio|work|example|case study|sample)/.test(lowerMessage);
  const hasInteractiveIntent = /(interactive|website|web|masterplan|selector|hotspot)/.test(lowerMessage);
  const hasFilmIntent = /(film|video|cinematic|launch)/.test(lowerMessage);
  const hasRenderIntent = /(render|image|visual|interior|exterior)/.test(lowerMessage);

  if (hasPricingIntent) {
    return "Pricing depends on the project scope, deliverables, timeline, property type, and level of detail. The best next step is a short consultation so the team can understand what you need and share an accurate estimate.";
  }

  if (hasBookingIntent) {
    return "Absolutely. You can use the booking form in this chat, or email info@sthyra.com with your project details and preferred time. The team typically responds within 24 hours.";
  }

  if (hasInteractiveIntent) {
    return "Sthyra builds interactive web experiences for real estate projects, including masterplans, tower selectors, unit highlights, amenity stories, and guided project journeys. These are useful when buyers or stakeholders need to understand a project quickly without reading dense plans.";
  }

  if (hasFilmIntent) {
    return "Cinematic real estate films are ideal for launches, campaigns, investor presentations, and premium website moments. Sthyra shapes them to make an unbuilt project feel clear, desirable, and emotionally real.";
  }

  if (hasRenderIntent) {
    return "Sthyra creates ultra real architectural renders for interiors, exteriors, amenities, landscapes, and lifestyle scenes. The goal is to remove doubt and make the future space feel believable before it is built.";
  }

  if (hasServiceIntent) {
    return "Sthyra helps real estate teams present and sell unbuilt spaces through cinematic films, interactive web experiences, ultra real renders, VR and AR, digital twins, and pixel streaming. If you tell me your project type, I can suggest which service fits best.";
  }

  if (hasPortfolioIntent) {
    return "You can explore Sthyra's work across this website. For the most relevant examples, share whether your project is residential, commercial, interior, township, or hospitality, and the team can point you in the right direction.";
  }

  if (history.length > 2) {
    return "That makes sense. To guide you properly, could you share the project type and whether you need renders, a film, an interactive experience, or an immersive sales tool?";
  }

  return "Sthyra helps developers, architects, and luxury property brands make unbuilt spaces feel clear, premium, and ready to present. Tell me what you are planning, and I’ll help you find the right service.";
}

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();
    const chatHistory = normalizeHistory(history);

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        message: getFallbackResponse(message, chatHistory),
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
        max_tokens: 520,
        messages: [...chatHistory, { role: "user", content: message }],
        system: buildSystemPrompt(chatHistory),
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

    const aiMessage = cleanAssistantMessage(extractAIMessage(data, rawResponse));

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
