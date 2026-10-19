import { describe, expect, it, vi } from "vitest";
import { buildUsageCode, copyToClipboard, filterQuestions } from "./playground-utils.js";

const questions = [
  { question: "What is the Virtual DOM?", answer: "A lightweight representation of the interface." },
  { question: "What are React Hooks?", answer: "Hooks let function components use React features." },
  { question: "How does useEffect work?", answer: "It synchronizes a component with external systems." },
];

describe("playground helpers", () => {
  it("filters questions by question text and answer text without case sensitivity", () => {
    expect(filterQuestions(questions, "virtual")).toHaveLength(1);
    expect(filterQuestions(questions, "EXTERNAL")[0]?.question).toBe("How does useEffect work?");
  });

  it("returns the complete list when search is empty", () => {
    expect(filterQuestions(questions, "  ")).toEqual(questions);
  });

  it("generates JSX from the current configuration", () => {
    const code = buildUsageCode({
      type: "multiple",
      variant: "card",
      size: "lg",
      iconShape: "arrow",
      iconPosition: "start",
      headingLevel: "h4",
      collapsible: false,
      animated: true,
      disabled: true,
      rtl: true,
    }, 6);

    expect(code).toContain("questions.slice(0, 6)");
    expect(code).toContain('type="multiple"');
    expect(code).toContain('variant="card"');
    expect(code).toContain('icon="arrow"');
    expect(code).toContain('iconPosition="start"');
    expect(code).toContain('headingLevel="h4"');
    expect(code).toContain('dir="rtl"');
    expect(code).toContain("disabled={true}");
  });

  it("copies text through the Clipboard API", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    await expect(copyToClipboard("hello", { writeText })).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith("hello");
  });

  it("returns false when clipboard permission is unavailable", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("Permission denied"));
    await expect(copyToClipboard("hello", { writeText })).resolves.toBe(false);
  });
});
