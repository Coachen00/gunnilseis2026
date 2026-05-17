import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import SkipToContent from "./SkipToContent";

describe("SkipToContent", () => {
  afterEach(cleanup);

  it("renderar en länk till #main", () => {
    render(<SkipToContent />);
    const link = screen.getByRole("link", { name: /hoppa till innehåll/i });
    expect(link).toHaveAttribute("href", "#main");
  });
});
