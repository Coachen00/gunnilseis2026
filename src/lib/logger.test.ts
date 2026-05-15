import { describe, expect, it, vi, beforeEach } from "vitest";
import { logger, _internals } from "./logger";

describe("logger", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("error() loggar till console.error med rätt nivå", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    logger.error(new Error("boom"), { scope: "test" });
    expect(spy).toHaveBeenCalled();
    const [tag, payload] = spy.mock.calls[0] as [string, { level: string; message: { message: string } }];
    expect(tag).toBe("[error]");
    expect(payload.level).toBe("error");
    expect(payload.message.message).toBe("boom");
  });

  it("info() loggar till console.log", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => undefined);
    logger.info("hej", { scope: "test" });
    expect(spy).toHaveBeenCalled();
  });

  it("har inte aktiv DSN i testmiljö", () => {
    expect(_internals.hasDsn()).toBe(false);
  });
});
