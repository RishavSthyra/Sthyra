"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Open_Sans } from "next/font/google";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type BookingFormData = {
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  projectType: string;
  message: string;
};

const INITIAL_MESSAGE: Message = {
  id: "init",
  role: "assistant",
  content: "Hi, I can help you understand Sthyra's visualization services and what might fit your project. What are you planning?",
  timestamp: new Date(),
};

const QUICK_ACTIONS = [
  { label: "Services", action: "services" },
  { label: "Book Call", action: "book" },
  { label: "Pricing", action: "pricing" },
  { label: "Contact", action: "contact" },
];

const PROJECT_TYPES = [
  "Apartments",
  "Villas",
  "Township",
  "Commercial",
  "Interior",
  "VR/AR",
  "Other",
];

function CloseIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 18L18 6M6 6l12 12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2.8l1.38 5.02L18.4 9.2l-5.02 1.38L12 15.6l-1.38-5.02L5.6 9.2l5.02-1.38L12 2.8Z"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinejoin="round"
      />
      <path
        d="M18.6 14.8l.62 2.24 2.18.56-2.18.62-.62 2.18-.58-2.18-2.22-.62 2.22-.56.58-2.24ZM5.4 14.2l.46 1.68 1.74.52-1.74.48-.46 1.72-.5-1.72-1.7-.48 1.7-.52.5-1.68Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState<BookingFormData>({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    projectType: "",
    message: "",
  });
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const sendToAI = async (userMessage: string, conversation: Message[] = messages) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: conversation
            .filter((message) => message.id !== "init")
            .slice(-10)
            .map((message) => ({
              role: message.role,
              content: message.content,
            })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: "assistant",
          content: data.message,
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: "assistant",
          content: "I’m having trouble connecting right now. You can email info@sthyra.com and the team will help you directly.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInputValue("");
    await sendToAI(userMessage.content, nextMessages);
  };

  const handleQuickAction = async (action: string) => {
    const actionMessages: Record<string, string> = {
      services: "What services does Sthyra offer, and which one should I choose?",
      book: "I want to book a consultation.",
      pricing: "How does pricing work for a Sthyra project?",
      contact: "How can I contact Sthyra?",
    };

    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: action,
      timestamp: new Date(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    await sendToAI(actionMessages[action] || "How can Sthyra help my project?", nextMessages);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await fetch("/api/chat/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      setBookingSubmitted(true);
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: "assistant",
          content: `Thanks ${bookingData.name}. We’ll email ${bookingData.email} within 24 hours to confirm your consultation.`,
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: "assistant",
          content: "There was an issue with the booking form. Please email info@sthyra.com and the team will help you directly.",
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`${openSans.className} ai-chatbot fixed bottom-5 right-5 z-[100]`}>
      {/* Chat Panel */}
      <div
        className={`
          relative mb-3 flex flex-col overflow-hidden rounded-[1.75rem] border border-white/[0.14]
          bg-[linear-gradient(145deg,rgba(5,5,5,0.78)_0%,rgba(5,5,5,0.9)_45%,rgba(24,24,24,0.72)_100%)]
          shadow-[0_28px_95px_rgba(0,0,0,0.56),0_0_0_1px_rgba(255,255,255,0.04)_inset]
          backdrop-blur-[34px] before:pointer-events-none before:absolute before:inset-0
          before:bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.16),transparent_34%),linear-gradient(115deg,rgba(255,255,255,0.09)_0%,transparent_28%,transparent_70%,rgba(255,255,255,0.05)_100%)]
          transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${isOpen ? "h-[26rem] w-[19rem] opacity-100 md:h-[28rem] md:w-[21rem]" : "h-0 w-0 opacity-0"}
        `}
      >
        {/* Header */}
        <div className="relative z-[1] flex shrink-0 items-center justify-between border-b border-white/[0.08] px-4 py-3.5 backdrop-blur-[28px]">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative h-8 w-[6.6rem] overflow-hidden">
              <Image
                src="/sthyra_logo_new.png"
                alt="STHYRA"
                width={144}
                height={40}
                priority
                className="h-full w-auto object-contain brightness-[1.12]"
              />
            </div>
           
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.035] text-white/44 transition-all duration-300 hover:border-white/16 hover:bg-white/[0.07] hover:text-white/82"
            aria-label="Close chat"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="relative z-[1] flex-1 overflow-y-auto px-3.5 py-4 text-xs [scrollbar-color:rgba(255,255,255,0.24)_transparent]">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-2.5 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`
                  max-w-[88%] rounded-[1.15rem] px-3.5 py-2.5 leading-relaxed shadow-[0_16px_45px_rgba(0,0,0,0.24)]
                  ${message.role === "user"
                    ? "rounded-br-md border border-white/45 bg-[linear-gradient(145deg,rgba(255,255,255,0.94),rgba(255,255,255,0.72))] text-black shadow-[0_14px_45px_rgba(255,255,255,0.1)] backdrop-blur-2xl"
                    : "rounded-bl-md border border-white/[0.11] bg-[linear-gradient(145deg,rgba(255,255,255,0.105),rgba(255,255,255,0.035))] text-white/86 backdrop-blur-2xl"
                  }
                `}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="mb-2 flex justify-start">
              <div className="rounded-bl-md rounded-br-[1.15rem] rounded-tl-[1.15rem] rounded-tr-[1.15rem] border border-white/[0.11] bg-white/[0.06] px-3.5 py-2.5 backdrop-blur-2xl">
                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/58 [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/42 [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/28 [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          {showBookingForm && !bookingSubmitted && (
            <form onSubmit={handleBookingSubmit} className="mt-2 space-y-2 rounded-[1.15rem] border border-white/[0.11] bg-white/[0.055] p-3.5 backdrop-blur-2xl">
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.22em] text-white/66">Book Consultation</p>
              <input type="text" placeholder="Name" required value={bookingData.name} onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })} className="w-full rounded-full border border-white/[0.09] bg-black/30 px-3 py-1.5 text-xs text-white placeholder:text-white/28 focus:border-white/24 focus:outline-none" />
              <input type="email" placeholder="Email" required value={bookingData.email} onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })} className="w-full rounded-full border border-white/[0.09] bg-black/30 px-3 py-1.5 text-xs text-white placeholder:text-white/28 focus:border-white/24 focus:outline-none" />
              <input type="tel" placeholder="Phone" required value={bookingData.phone} onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })} className="w-full rounded-full border border-white/[0.09] bg-black/30 px-3 py-1.5 text-xs text-white placeholder:text-white/28 focus:border-white/24 focus:outline-none" />
              <select value={bookingData.projectType} onChange={(e) => setBookingData({ ...bookingData, projectType: e.target.value })} className="w-full rounded-full border border-white/[0.09] bg-black/30 px-3 py-1.5 text-xs text-white focus:border-white/24 focus:outline-none">
                <option value="" className="bg-black">Project Type</option>
                {PROJECT_TYPES.map((type) => (<option key={type} value={type} className="bg-black">{type}</option>))}
              </select>
              <div className="flex gap-2">
                <input type="date" required value={bookingData.preferredDate} onChange={(e) => setBookingData({ ...bookingData, preferredDate: e.target.value })} className="min-w-0 flex-1 rounded-full border border-white/[0.09] bg-black/30 px-2.5 py-1.5 text-xs text-white focus:border-white/24 focus:outline-none" />
                <select required value={bookingData.preferredTime} onChange={(e) => setBookingData({ ...bookingData, preferredTime: e.target.value })} className="min-w-0 flex-1 rounded-full border border-white/[0.09] bg-black/30 px-2.5 py-1.5 text-xs text-white focus:border-white/24 focus:outline-none">
                  <option value="" className="bg-black">Time</option>
                  <option value="09:00" className="bg-black">9 AM</option>
                  <option value="11:00" className="bg-black">11 AM</option>
                  <option value="14:00" className="bg-black">2 PM</option>
                  <option value="16:00" className="bg-black">4 PM</option>
                </select>
              </div>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setShowBookingForm(false)} className="flex-1 rounded-full border border-white/[0.09] px-3 py-1.5 text-xs text-white/52 transition-colors hover:border-white/18 hover:text-white/78">Cancel</button>
                <button type="submit" className="flex-1 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-black transition-colors hover:bg-white/88">Book</button>
              </div>
            </form>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {!showBookingForm && messages.length <= 2 && (
          <div className="relative z-[1] shrink-0 border-t border-white/[0.08] px-3.5 py-2.5 backdrop-blur-[28px]">
            <div className="flex flex-wrap gap-1.5">
              {QUICK_ACTIONS.map((item) => (
                <button
                  key={item.action}
                  type="button"
                  onClick={() => {
                    if (item.action === "book") {
                      setShowBookingForm(true);
                    } else {
                      handleQuickAction(item.action);
                    }
                  }}
                  className="rounded-full border border-white/[0.1] bg-white/[0.055] px-2.5 py-1 text-[10px] font-medium text-white/64 backdrop-blur-xl transition-colors hover:border-white/[0.2] hover:bg-white/[0.1] hover:text-white/92"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        {!showBookingForm && (
          <div className="relative z-[1] shrink-0 border-t border-white/[0.08] px-3.5 py-3 backdrop-blur-[28px]">
            <div className="flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.045] px-3 py-2 shadow-[0_0_0_1px_rgba(255,255,255,0.025)_inset] backdrop-blur-2xl transition-colors focus-within:border-white/[0.24]">
              <input
                ref={inputRef}
                type="text"
                placeholder="Message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                className="flex-1 bg-transparent text-[11px] text-white placeholder:text-white/32 focus:outline-none disabled:opacity-40"
              />
              <button
                type="button"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/88 text-black shadow-[0_8px_24px_rgba(255,255,255,0.14)] transition-all hover:bg-white disabled:opacity-30"
                aria-label="Send"
              >
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          group flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.12]
          bg-[linear-gradient(145deg,rgba(12,12,12,0.72),rgba(0,0,0,0.88))]
          shadow-[0_18px_56px_rgba(0,0,0,0.42),0_0_0_1px_rgba(255,255,255,0.035)_inset]
          backdrop-blur-[28px] transition-all duration-300 hover:border-white/22 hover:scale-[1.03]
          ${isOpen ? "bg-black/82" : ""}
        `}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
         <CloseIcon className="h-5 w-5 text-white" />
        ) : (
          <SparkIcon className="h-5 w-5 text-white" />
        )}
      </button>
    </div>
  );
}
