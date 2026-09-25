import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const formPath = new URL("../../../scorekeep/feedback/index.html", import.meta.url);
const scriptPath = new URL("../../../assets/js/scorekeep-feedback.js", import.meta.url);
const stylePath = new URL("../../../assets/css/site.css", import.meta.url);

test("feedback type uses one native radio group with the existing API values", async () => {
    const html = await readFile(formPath, "utf8");
    const typeInputs = [...html.matchAll(/<input\s+([^>]*\bname="type"[^>]*)>/gu)].map((match) => match[1]);

    assert.equal(typeInputs.length, 3);
    assert.deepEqual(typeInputs.map((input) => input.match(/\bvalue="([^"]+)"/u)?.[1]), ["support", "comment", "suggestion"]);
    assert.equal(typeInputs.filter((input) => /\bchecked\b/u.test(input)).length, 1);
    assert.match(typeInputs[0], /\bchecked\b/u);
    assert.match(typeInputs[0], /\brequired\b/u);
    assert.doesNotMatch(html, /<select[^>]*\bname="type"/u);
});

test("each feedback type radio has a visible label and the draft contract remains unchanged", async () => {
    const [html, script] = await Promise.all([readFile(formPath, "utf8"), readFile(scriptPath, "utf8")]);

    for (const [id, label] of [
        ["feedback-type-support", "Support"],
        ["feedback-type-comment", "Comment"],
        ["feedback-type-suggestion", "Suggestion"]
    ]) {
        assert.match(html, new RegExp(`<label for="${id}">${label}</label>`, "u"));
    }

    assert.match(script, /type:\s*form\.elements\.type\.value/u);
    assert.match(script, /form\.elements\.type\.value\s*=\s*draft\.type/u);
});

test("segmented control retains visible focus, touch height, and a narrow-width fallback", async () => {
    const css = await readFile(stylePath, "utf8");

    assert.match(css, /\.feedback-type-control input:focus-visible \+ label/u);
    assert.match(css, /\.feedback-type-control label \{[^}]*min-height:\s*2\.75rem;/su);
    assert.match(css, /@media \(max-width:\s*18rem\)[\s\S]*?\.feedback-type-control \{[^}]*grid-template-columns:\s*1fr;/u);
});
