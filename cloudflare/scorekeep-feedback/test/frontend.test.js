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
    assert.equal(typeInputs.filter((input) => /\bclass="feedback-type-input"/u.test(input)).length, 3);
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

test("segmented control is a cache-safe, horizontal, equal-width 44px control", async () => {
    const [html, css] = await Promise.all([readFile(formPath, "utf8"), readFile(stylePath, "utf8")]);
    const controlRule = css.match(/\.feedback-type-control \{([^}]*)\}/u)?.[1] || "";
    const labelRule = css.match(/\.feedback-type-control label \{([^}]*)\}/u)?.[1] || "";
    const inputRule = css.match(/\.feedback-type-control \.feedback-type-input \{([^}]*)\}/u)?.[1] || "";
    const columnDeclarations = [...css.matchAll(/\.feedback-type-control \{[^}]*grid-template-columns:\s*([^;]+);/gu)];

    assert.match(css, /\.feedback-type-control input:focus-visible \+ label/u);
    assert.match(html, /\/assets\/css\/site\.css\?v=[^"]+/u);
    assert.match(controlRule, /grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/u);
    assert.match(controlRule, /width:\s*100%/u);
    assert.match(controlRule, /height:\s*44px/u);
    assert.match(controlRule, /border-radius:\s*6px/u);
    assert.match(labelRule, /height:\s*44px/u);
    assert.match(labelRule, /place-items:\s*center/u);
    assert.match(labelRule, /font-size:\s*16px/u);
    assert.match(inputRule, /position:\s*absolute\s*!important/u);
    assert.match(inputRule, /clip:\s*rect\(0 0 0 0\)\s*!important/u);
    assert.match(inputRule, /clip-path:\s*inset\(50%\)\s*!important/u);
    assert.equal(columnDeclarations.length, 1);
});
