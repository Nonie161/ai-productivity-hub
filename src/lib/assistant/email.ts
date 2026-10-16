// Client-side demo engine. Swap `generateEmail` for a real AI call later; keep the same signature.
export type Tone = "formal" | "friendly" | "persuasive";
export type EmailInput = { recipient: string; purpose: string; details: string; sender: string; tone: Tone };
export type EmailOutput = { subject: string; body: string };

export function validateEmailInput(i: EmailInput): string | null {
  if (i.purpose.trim().length < 10) return "Describe the purpose in at least 10 characters.";
  if (i.recipient.trim().length > 80) return "Recipient name is too long.";
  return null;
}

const pick = <T,>(arr: T[], seed: number) => arr[seed % arr.length];

function subjectFrom(purpose: string) {
  const s = purpose.trim().replace(/^(i want to|i need to|please|write an email to|ask|tell)\s+/i, "");
  const words = s.split(/\s+/).slice(0, 8).join(" ").replace(/[.,;:!?]+$/, "");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export async function generateEmail(i: EmailInput, variant = 0): Promise<EmailOutput> {
  const name = i.recipient.trim() || "there";
  const sender = i.sender.trim() || "[Your name]";
  const purpose = i.purpose.trim().replace(/[.]+$/, "");
  const details = i.details.trim().split(/\n|;/).map((d) => d.trim()).filter(Boolean);

  const t = {
    formal: {
      greet: [`Dear ${name},`, `Good day ${name},`],
      open: [`I am writing regarding the following: ${purpose.toLowerCase()}.`, `I would like to formally address a matter concerning ${purpose.toLowerCase()}.`],
      bridge: ["Please find the relevant points below:", "For your reference, the key details are as follows:"],
      close: ["I would appreciate your response at your earliest convenience.", "Thank you for your time and consideration."],
      sign: ["Kind regards,", "Yours sincerely,"],
      prefix: ["", "Regarding: "],
    },
    friendly: {
      greet: [`Hi ${name},`, `Hey ${name},`],
      open: [`Hope you're having a good week! I wanted to reach out about ${purpose.toLowerCase()}.`, `Quick note from me about ${purpose.toLowerCase()}.`],
      bridge: ["Here's what I had in mind:", "A few quick things:"],
      close: ["Let me know what you think — happy to chat anytime.", "Thanks so much, talk soon!"],
      sign: ["Cheers,", "Best,"],
      prefix: ["", "Quick one: "],
    },
    persuasive: {
      greet: [`Hi ${name},`, `Dear ${name},`],
      open: [`I'd like to propose something that I believe will make a real difference: ${purpose.toLowerCase()}.`, `There's a clear opportunity here, and I'd value your support on ${purpose.toLowerCase()}.`],
      bridge: ["Here's why this is worth acting on:", "The case is straightforward:"],
      close: ["Could we lock in 15 minutes this week to move this forward?", "If you agree, I can start on next steps right away — would Thursday work to confirm?"],
      sign: ["Best regards,", "Thank you,"],
      prefix: ["Proposal: ", "Opportunity: "],
    },
  }[i.tone];

  const v = variant;
  const bullets = details.length ? `\n\n${pick(t.bridge, v)}\n${details.map((d) => `• ${d}`).join("\n")}` : "";
  const body = `${pick(t.greet, v)}\n\n${pick(t.open, v)}${bullets}\n\n${pick(t.close, v)}\n\n${pick(t.sign, v)}\n${sender}`;
  return { subject: pick(t.prefix, v) + subjectFrom(purpose), body };
}
