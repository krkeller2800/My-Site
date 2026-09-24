import assert from "node:assert/strict";
import test from "node:test";
import { handleRequest, testing } from "../src/index.js";

const endpoint = "https://komakode.com/api/scorekeep/feedback";
const validPayload = Object.freeze({ type: "support", message: "ScoreKeep needs help.", replyEmail: "player@example.com", website: "", turnstileToken: "valid-token" });

function request(payload = validPayload, overrides = {}) {
    const method = overrides.method || "POST";
    return new Request(overrides.url || endpoint, {
        method,
        headers: { "Content-Type": overrides.contentType || "application/json", "Origin": overrides.origin || "https://komakode.com", ...(overrides.headers || {}) },
        body: method === "POST" ? JSON.stringify(payload) : undefined
    });
}

function environment(sent) {
    return { TURNSTILE_SECRET_KEY: "test-secret", FEEDBACK_EMAIL: { async send(message) { sent.push(message); } } };
}

async function withTurnstile(result, operation) {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => Response.json(result);
    try { return await operation(); } finally { globalThis.fetch = originalFetch; }
}

test("valid feedback sends one fixed plain-text email", async () => {
    const sent = [];
    const response = await withTurnstile({ success: true, hostname: "komakode.com", action: "scorekeep_feedback" }, () => handleRequest(request(), environment(sent)));
    assert.equal(response.status, 200);
    assert.equal(sent.length, 1);
    assert.deepEqual(sent[0], {
        to: "karlkomakode@gmail.com",
        from: { email: "comment@komakode.com", name: "KomaKode ScoreKeep Feedback" },
        subject: "[ScoreKeep Support] New support request",
        text: "ScoreKeep feedback type: Support Request\nReply requested: Yes\nReply email: player@example.com\n\nMessage:\nScoreKeep needs help.",
        replyTo: "player@example.com"
    });
    assert.equal("html" in sent[0], false);
});

test("allowed types map to fixed subjects and omitted email omits Reply-To", () => {
    assert.equal(testing.createEmail({ type: "comment", message: "Hi", replyEmail: "" }).subject, "[ScoreKeep Comment] New comment");
    assert.equal(testing.createEmail({ type: "suggestion", message: "Hi", replyEmail: "" }).subject, "[ScoreKeep Suggestion] New suggestion");
    assert.equal("replyTo" in testing.createEmail({ type: "comment", message: "Hi", replyEmail: "" }), false);
});

test("malformed submissions never invoke email sending", async (t) => {
    const cases = [
        ["unknown type", { ...validPayload, type: "other" }, {}, 400],
        ["empty message", { ...validPayload, message: "   " }, {}, 400],
        ["long message", { ...validPayload, message: "x".repeat(5001) }, {}, 400],
        ["invalid email", { ...validPayload, replyEmail: "not-an-email" }, {}, 400],
        ["CRLF email", { ...validPayload, replyEmail: "person@example.com\r\nBcc: victim@example.com" }, {}, 400],
        ["missing token", { ...validPayload, turnstileToken: "" }, {}, 400],
        ["long token", { ...validPayload, turnstileToken: "x".repeat(2049) }, {}, 400],
        ["wrong content type", validPayload, { contentType: "text/plain" }, 415],
        ["wrong origin", validPayload, { origin: "https://example.com" }, 403],
        ["wrong method", validPayload, { method: "GET" }, 405],
        ["wrong path", validPayload, { url: "https://komakode.com/api/scorekeep/feedback-extra" }, 404]
    ];
    for (const [name, payload, overrides, expectedStatus] of cases) {
        await t.test(name, async () => {
            const sent = [];
            const response = await handleRequest(request(payload, overrides), environment(sent));
            assert.equal(response.status, expectedStatus);
            assert.equal(sent.length, 0);
        });
    }
});

test("oversized body is rejected before sending", async () => {
    const sent = [];
    const response = await handleRequest(request(validPayload, { headers: { "Content-Length": "16385" } }), environment(sent));
    assert.equal(response.status, 413);
    assert.equal(sent.length, 0);
});

test("honeypot returns success without email", async () => {
    const sent = [];
    const response = await handleRequest(request({ ...validPayload, website: "spam.example" }), environment(sent));
    assert.equal(response.status, 200);
    assert.equal(sent.length, 0);
});

test("Turnstile must match success, hostname, and action", async (t) => {
    const results = [
        { success: false, hostname: "komakode.com", action: "scorekeep_feedback" },
        { success: true, hostname: "preview.pages.dev", action: "scorekeep_feedback" },
        { success: true, hostname: "komakode.com", action: "different_action" }
    ];
    for (const result of results) {
        await t.test(JSON.stringify(result), async () => {
            const sent = [];
            const response = await withTurnstile(result, () => handleRequest(request(), environment(sent)));
            assert.equal(response.status, 403);
            assert.equal(sent.length, 0);
        });
    }
});

test("email failure does not echo submitted content", async () => {
    const env = { TURNSTILE_SECRET_KEY: "test-secret", FEEDBACK_EMAIL: { async send() { throw new Error("send failed"); } } };
    const response = await withTurnstile({ success: true, hostname: "komakode.com", action: "scorekeep_feedback" }, () => handleRequest(request(), env));
    const body = await response.text();
    assert.equal(response.status, 502);
    assert.equal(body.includes(validPayload.message), false);
    assert.equal(body.includes(validPayload.replyEmail), false);
});
