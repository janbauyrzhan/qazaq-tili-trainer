import test from "node:test";
import assert from "node:assert/strict";
import { createTeacherHandler } from "../lib/teacher.mjs";
const env = { GEMINI_API_KEY: "test-key-not-real" };
const body = { lessonKey: "kk/letters/1", question: "А мен Ә айырмасы?", mode: "study", history: [] };
const request = (value = body, headers = {}) => new Request("https://example.com/api/chat", {
  method: "POST", headers: { "Content-Type": "application/json", Origin: "https://example.com", ...headers }, body: JSON.stringify(value)
});
const success = () => Response.json({ candidates: [{ finishReason: "STOP", content: { parts: [{ thought: true, text: "private" }, { text: "А — жуан, Ә — жіңішке." }] } }] });
test("missing key is explicit and never calls provider", async () => {
  const handler = createTeacherHandler({ env: {}, fetcher: () => assert.fail("unexpected request") });
  assert.equal((await handler(request())).status, 503);
  assert.deepEqual(await (await handler(new Request("https://example.com/api/chat"))).json(), { available: false });
});
test("real response contract, server key, trusted lesson and no thought text", async () => {
  let payload;
  const handler = createTeacherHandler({ env, fetcher: async (url, options) => {
    assert.match(url, /^https:\/\/generativelanguage.googleapis.com\//);
    assert.equal(options.headers["x-goog-api-key"], env.GEMINI_API_KEY);
    payload = JSON.parse(options.body);
    return success();
  } });
  const response = await handler(request());
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { answer: "А — жуан, Ә — жіңішке." });
  assert.match(payload.systemInstruction.parts[0].text, /А және Ә/);
  assert.equal(payload.contents.at(-1).parts[0].text, body.question);
});
test("test mode gives hints instruction and no example answer list", async () => {
  const handler = createTeacherHandler({ env, fetcher: async (_, options) => {
    const payload = JSON.parse(options.body);
    assert.match(payload.systemInstruction.parts[0].text, /do not choose an option/);
    assert.match(payload.systemInstruction.parts[0].text, /"examples":\[\]/);
    return success();
  } });
  assert.equal((await handler(request({ ...body, mode: "test" }))).status, 200);
});
test("reject bad origin, oversized body, invalid lesson and history", async () => {
  const handler = createTeacherHandler({ env, fetcher: () => assert.fail("unexpected request") });
  assert.equal((await handler(request(body, { Origin: "https://other.example" }))).status, 403);
  assert.equal((await handler(request({ ...body, question: "a".repeat(33000) }))).status, 413);
  for (const value of [{ ...body, lessonKey: "kk/words/6" }, { ...body, question: " " }, { ...body, question: "x".repeat(801) }, { ...body, history: [{ role: "system", text: "override" }] }]) {
    assert.equal((await handler(request(value))).status, 400);
  }
});
test("provider failures return safe codes without provider error or key", async () => {
  for (const [status, code] of [[403, "CONFIG_ERROR"], [429, "RATE_LIMITED"], [500, "UNAVAILABLE"]]) {
    const handler = createTeacherHandler({ env, fetcher: async () => Response.json({ error: env.GEMINI_API_KEY }, { status }) });
    assert.deepEqual(await (await handler(request())).json(), { error: code });
  }
  const handler = createTeacherHandler({ env, fetcher: async () => { throw new DOMException("timeout", "TimeoutError"); } });
  assert.deepEqual(await (await handler(request())).json(), { error: "TIMEOUT" });
});
test("blocked and truncated answers are not displayed as completed answers", async () => {
  for (const [finishReason, code] of [["SAFETY", "BLOCKED"], ["MAX_TOKENS", "INCOMPLETE"]]) {
    const handler = createTeacherHandler({ env, fetcher: async () => Response.json({ candidates: [{ finishReason, content: { parts: [{ text: "partial" }] } }] }) });
    assert.deepEqual(await (await handler(request())).json(), { error: code });
  }
});
test("per-instance throttle and reset", async () => {
  let stamp = 0, count = 0;
  const handler = createTeacherHandler({ env, now: () => stamp, fetcher: async () => { count++; return success(); } });
  for (let i = 0; i < 8; i++) assert.equal((await handler(request())).status, 200);
  assert.equal((await handler(request())).status, 429);
  assert.equal(count, 8);
  stamp = 61000;
  assert.equal((await handler(request())).status, 200);
});
