import { describe, it, expect } from "vitest";
import { analyze } from "@/lib/assistant/research";
import { validateEmailInput } from "@/lib/assistant/email";

describe("assistant rules", () => {
  it("flags URLs as inaccessible", async () => {
    const r = await analyze("https://example.com/article");
    expect(r.kind).toBe("url");
    expect(r.notice).toMatch(/could not be accessed/);
  });
  it("requires an email purpose of 10+ chars", () => {
    expect(validateEmailInput({ recipient: "", purpose: "short", details: "", sender: "", tone: "formal" })).not.toBeNull();
  });
});
