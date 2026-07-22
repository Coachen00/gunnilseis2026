import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CoachTacticsAnimation from "./CoachTacticsAnimation";

const coachVariants = [
  "spelide",
  "prisma",
  "femupphojt",
  "spelmodellLabb",
  "traningsplanering",
  "traningsplan",
  "motstandaranalys",
  "matchblad",
  "taktiktavla",
] as const;

describe("CoachTacticsAnimation", () => {
  it("har en tydlig 4–3–3 mot 4–4–2-animation för varje coachverktyg", () => {
    for (const variant of coachVariants) {
      const { unmount } = render(<CoachTacticsAnimation variant={variant} />);
      expect(screen.getByRole("img", { name: /vita spelare i 4–3–3 möter gula spelare i 4–4–2/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /pausa animation/i })).toBeInTheDocument();
      unmount();
    }
  });
});
