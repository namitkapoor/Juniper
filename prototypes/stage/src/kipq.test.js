import { describe, it, expect } from "vitest";
import { isAboutQuestion, isKipQuestion } from "./answer.js";

describe("Kip vs Namit", () => {
  it("routes questions aimed at Kip and at Namit to the About page", () => {
    for (const q of ["who are you", "who is namit", "who is he", "introduce yourself", "tell me about namit", "his background", "what's your background"])
      expect(isAboutQuestion(q), q).toBe(true);
  });
  it("tells Kip-addressed questions apart", () => {
    for (const q of ["who are you", "introduce yourself", "what are you", "what's your background"]) expect(isKipQuestion(q), q).toBe(true);
    for (const q of ["who is namit", "who is he", "tell me about namit", "his background"]) expect(isKipQuestion(q), q).toBe(false);
  });
});
