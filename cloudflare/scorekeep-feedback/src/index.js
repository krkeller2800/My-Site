const endpointPath = "/api/scorekeep/feedback";
const expectedHostname = "komakode.com";
const expectedAction = "scorekeep_feedback";
const fixedDestination = "karlkomakode@gmail.com";
const fixedFrom = "comment@komakode.com";
const maximumBodyBytes = 16 * 1024;
const maximumMessageCharacters = 5000;
const maximumEmailCharacters = 254;
const maximumTokenCharacters = 2048;

const subjectByType = Object.freeze({
    support: "[ScoreKeep Support] New support request",
    comment: "[ScoreKeep Comment] New comment",
    suggestion: "[ScoreKeep Suggestion] New suggestion"
});
const labelByType = Object.freeze({ support: "Support Request", comment: "Comment", suggestion: "Suggestion" });

function jsonResponse(body, status = 200) {
    return Response.json(body, { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
}

function characterCount(value) {
    return Array.from(value).length;
}

function isValidReplyEmail(value) {
    if (!value || characterCount(value) > maximumEmailCharacters) return false;
    if (/[\u0000-\u001f\u007f]/u.test(value) || value !== value.trim()) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(value);
}

async function parseBody(request) {
    const contentType = request.headers.get("Content-Type") || "";
    if (!contentType.toLowerCase().startsWith("application/json")) {
        return { error: jsonResponse({ success: false, message: "This request format is not supported." }, 415) };
    }
    const declaredLength = Number(request.headers.get("Content-Length"));
    if (Number.isFinite(declaredLength) && declaredLength > maximumBodyBytes) {
        return { error: jsonResponse({ success: false, message: "The feedback request is too large." }, 413) };
    }
    const bytes = await request.arrayBuffer();
    if (bytes.byteLength > maximumBodyBytes) {
        return { error: jsonResponse({ success: false, message: "The feedback request is too large." }, 413) };
    }
    try {
        const value = JSON.parse(new TextDecoder().decode(bytes));
        if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid JSON object");
        return { value };
    } catch {
        return { error: jsonResponse({ success: false, message: "The feedback request is not valid JSON." }, 400) };
    }
}

function validateSubmission(value) {
    const type = typeof value.type === "string" ? value.type : "";
    const message = typeof value.message === "string" ? value.message.trim() : "";
    const replyEmail = typeof value.replyEmail === "string" ? value.replyEmail : "";
    const website = typeof value.website === "string" ? value.website : "";
    const turnstileToken = typeof value.turnstileToken === "string" ? value.turnstileToken : "";
    if (!Object.hasOwn(subjectByType, type)) return { error: "Choose a valid feedback type." };
    if (!message || characterCount(message) > maximumMessageCharacters) return { error: "Enter a message of 5,000 characters or fewer." };
    if (replyEmail && !isValidReplyEmail(replyEmail)) return { error: "Enter a valid reply email address or leave it blank." };
    if (!turnstileToken || characterCount(turnstileToken) > maximumTokenCharacters) return { error: "Complete the security verification and try again." };
    if (website) return { bot: true };
    return { type, message, replyEmail, turnstileToken };
}

async function verifyTurnstile(token, request, secret) {
    const formData = new FormData();
    formData.set("secret", secret);
    formData.set("response", token);
    const remoteAddress = request.headers.get("CF-Connecting-IP");
    if (remoteAddress) formData.set("remoteip", remoteAddress);
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST", body: formData, signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) throw new Error("Turnstile verification service failed");
    const result = await response.json();
    return result.success === true && result.hostname === expectedHostname && result.action === expectedAction;
}

function createEmail(submission) {
    const text = [
        `ScoreKeep feedback type: ${labelByType[submission.type]}`,
        `Reply requested: ${submission.replyEmail ? "Yes" : "No"}`,
        submission.replyEmail ? `Reply email: ${submission.replyEmail}` : null,
        "", "Message:", submission.message
    ].filter((line) => line !== null).join("\n");
    return {
        to: fixedDestination,
        from: { email: fixedFrom, name: "KomaKode ScoreKeep Feedback" },
        subject: subjectByType[submission.type],
        text,
        ...(submission.replyEmail ? { replyTo: submission.replyEmail } : {})
    };
}

export async function handleRequest(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== endpointPath) return jsonResponse({ success: false, message: "Not found." }, 404);
    if (request.method !== "POST") {
        return new Response(JSON.stringify({ success: false, message: "Only POST is allowed." }), {
            status: 405,
            headers: { "Allow": "POST", "Cache-Control": "no-store", "Content-Type": "application/json; charset=UTF-8", "X-Content-Type-Options": "nosniff" }
        });
    }
    if (request.headers.get("Origin") !== "https://komakode.com") {
        return jsonResponse({ success: false, message: "This submission origin is not allowed." }, 403);
    }
    if (!env.TURNSTILE_SECRET_KEY || !env.FEEDBACK_EMAIL) {
        return jsonResponse({ success: false, message: "Feedback is temporarily unavailable." }, 503);
    }
    const parsed = await parseBody(request);
    if (parsed.error) return parsed.error;
    const submission = validateSubmission(parsed.value);
    if (submission.bot) return jsonResponse({ success: true });
    if (submission.error) return jsonResponse({ success: false, message: submission.error }, 400);

    let verified;
    try {
        verified = await verifyTurnstile(submission.turnstileToken, request, env.TURNSTILE_SECRET_KEY);
    } catch {
        return jsonResponse({ success: false, message: "Security verification is temporarily unavailable. Your message has been preserved; please try again." }, 503);
    }
    if (!verified) {
        return jsonResponse({ success: false, message: "Security verification failed or expired. Your message has been preserved; please try again." }, 403);
    }
    try {
        await env.FEEDBACK_EMAIL.send(createEmail(submission));
    } catch {
        return jsonResponse({ success: false, message: "Your feedback could not be delivered. Your message has been preserved; please try again." }, 502);
    }
    return jsonResponse({ success: true });
}

export default { fetch(request, env) { return handleRequest(request, env); } };
export const testing = Object.freeze({ createEmail, isValidReplyEmail, validateSubmission });
