import { describe, it, expect, beforeEach } from "vitest";
import { mergeItem, mergeGated } from "./gate.js";
import { checkPassword, setCookie, verify, configured } from "../api/_lib/gate.js";

describe("mergeItem", () => {
  it("puts gated fills back at their original indices and drops the gate", () => {
    const pub = { id: "d", thesis: "locked", fills: [{ id: "a" }, { kind: "gate", id: "d~gate" }, { id: "d2" }] };
    const entry = { thesis: "real", fills: [{ at: 1, fill: { id: "b" } }, { at: 2, fill: { id: "c" } }] };
    const m = mergeItem(pub, entry);
    expect(m.fills.map((f) => f.id)).toEqual(["a", "b", "c", "d2"]);
    expect(m.thesis).toBe("real");
  });
  it("strips the Go deeper a public host only carried for a gated fill", () => {
    const pub = { id: "d", fills: [{ id: "p", opens: "x" }, { kind: "gate", id: "g" }] };
    const m = mergeItem(pub, { movedOpens: ["p"], fills: [{ at: 1, fill: { id: "q", opens: "x" } }] });
    expect(m.fills[0].opens).toBeUndefined();
    expect(m.fills[1].opens).toBe("x");
  });
  it("leaves content untouched without a store", () => {
    const decks = [{ id: "d", fills: [{ id: "a" }] }];
    expect(mergeGated(decks, [], null).decks).toBe(decks);
  });
});

describe("server gate", () => {
  beforeEach(() => {
    process.env.GATE_PASSWORD = "correct-horse-battery";
    process.env.GATE_SECRET = "s".repeat(32);
  });
  const res = () => { const h = {}; return { h, setHeader: (k, v) => { h[k] = v; } }; };
  const reqWith = (cookie) => ({ headers: { host: "localhost:5175", cookie } });

  it("fails closed when unconfigured", () => {
    delete process.env.GATE_SECRET;
    expect(configured()).toBe(false);
    expect(checkPassword("correct-horse-battery")).toBe(false);
  });
  it("checks the password", () => {
    expect(checkPassword("correct-horse-battery")).toBe(true);
    expect(checkPassword("wrong")).toBe(false);
    expect(checkPassword(undefined)).toBe(false);
  });
  it("issues a cookie that verifies, and rejects tampering and rotation", () => {
    const r = res();
    setCookie(reqWith(""), r);
    const cookie = r.h["Set-Cookie"].split(";")[0];
    expect(r.h["Set-Cookie"]).toMatch(/HttpOnly/);
    expect(verify(reqWith(cookie))).toBe(true);
    const [name, val] = cookie.split("=");
    const [v, exp, mac] = val.split(".");
    expect(verify(reqWith(`${name}=${v}.${Number(exp) + 1000}.${mac}`))).toBe(false); // longer expiry
    expect(verify(reqWith(`${name}=${v}.${exp}.${mac.slice(0, -2)}xx`))).toBe(false); // bad mac
    process.env.GATE_PASSWORD = "a-new-password-now";
    expect(verify(reqWith(cookie))).toBe(false); // rotating the password signs everyone out
  });
});
