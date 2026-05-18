"use client";

import { useState, type FormEvent } from "react";

type ContactFormState = "idle" | "sending" | "success" | "error";

const PROJECT_TYPES = [
  "Luxury apartment",
  "Villa",
  "Township",
  "Commercial",
  "Hospitality",
  "Interior",
  "Other",
];

const SERVICES = [
  "Ultra Real Renders",
  "Cinematic Real Estate Film",
  "Interactive Web Experience",
  "Digital Twin",
  "VR or AR Experience",
  "Pixel Streaming",
  "Not sure yet",
];

const BUDGET_RANGES = [
  "Under $5,000",
  "$5,000 to $15,000",
  "$15,000 to $35,000",
  "$35,000 plus",
  "Need guidance",
];

const TIMELINES = [
  "Urgent",
  "2 to 4 weeks",
  "1 to 2 months",
  "3 months plus",
  "Planning stage",
];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[0.58rem] font-semibold uppercase tracking-[0.24em] text-white/44">
      {children}
    </label>
  );
}

const inputClassName =
  "mt-2 w-full border border-white/[0.1] bg-white/[0.035] px-3.5 py-2.5 text-[0.84rem] tracking-[-0.012em] text-[#f7f1e7] outline-none transition-[border-color,background-color,transform] duration-300 placeholder:text-white/24 focus:-translate-y-px focus:border-white/28 focus:bg-white/[0.06] md:py-3";

export default function ContactForm() {
  const [state, setState] = useState<ContactFormState>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState("sending");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Unable to send message");
      }

      setState("success");
      setMessage(data.message || "Your brief reached Sthyra. We will respond soon.");
      form.reset();
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please email info@sthyra.com directly.",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4" noValidate={false}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="contact-field">
          <FieldLabel>Name *</FieldLabel>
          <input name="name" required minLength={2} autoComplete="name" className={inputClassName} />
        </div>
        <div className="contact-field">
          <FieldLabel>Email *</FieldLabel>
          <input name="email" required type="email" autoComplete="email" className={inputClassName} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="contact-field">
          <FieldLabel>Phone *</FieldLabel>
          <input name="phone" required type="tel" autoComplete="tel" className={inputClassName} />
        </div>
        <div className="contact-field">
          <FieldLabel>Company *</FieldLabel>
          <input name="company" required autoComplete="organization" className={inputClassName} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="contact-field">
          <FieldLabel>Project Type *</FieldLabel>
          <select name="projectType" required defaultValue="" className={inputClassName}>
            <option value="" disabled className="bg-black">
              Select project type
            </option>
            {PROJECT_TYPES.map((item) => (
              <option key={item} value={item} className="bg-black">
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="contact-field">
          <FieldLabel>Service Needed *</FieldLabel>
          <select name="service" required defaultValue="" className={inputClassName}>
            <option value="" disabled className="bg-black">
              Select service
            </option>
            {SERVICES.map((item) => (
              <option key={item} value={item} className="bg-black">
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="contact-field">
          <FieldLabel>Budget Range *</FieldLabel>
          <select name="budget" required defaultValue="" className={inputClassName}>
            <option value="" disabled className="bg-black">
              Select budget
            </option>
            {BUDGET_RANGES.map((item) => (
              <option key={item} value={item} className="bg-black">
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="contact-field">
          <FieldLabel>Timeline *</FieldLabel>
          <select name="timeline" required defaultValue="" className={inputClassName}>
            <option value="" disabled className="bg-black">
              Select timeline
            </option>
            {TIMELINES.map((item) => (
              <option key={item} value={item} className="bg-black">
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="contact-field">
        <FieldLabel>Project Brief *</FieldLabel>
        <textarea
          name="message"
          required
          minLength={20}
          rows={4}
          className={`${inputClassName} resize-none leading-[1.55]`}
        />
      </div>

      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />

      <div className="contact-field grid gap-4 border-t border-white/[0.1] pt-4 md:grid-cols-[1fr_auto] md:items-center">
        <p
          className={[
            "m-0 min-h-5 text-[0.82rem] leading-[1.45] tracking-[-0.01em]",
            state === "success" ? "text-[#f7f1e7]" : state === "error" ? "text-red-200" : "text-white/48",
          ].join(" ")}
          aria-live="polite"
        >
          {message || "Required fields help us respond with a sharper next step."}
        </p>
        <button
          type="submit"
          disabled={state === "sending"}
          className="min-h-12 border border-white/18 bg-[#f7f1e7] px-6 text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-black transition-colors duration-300 hover:bg-white disabled:cursor-wait disabled:bg-white/58"
        >
          {state === "sending" ? "Sending" : "Send Brief"}
        </button>
      </div>
    </form>
  );
}
