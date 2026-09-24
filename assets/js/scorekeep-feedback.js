(() => {
    "use strict";

    const form = document.querySelector("[data-feedback-form]");
    if (!form) {
        return;
    }

    const storageKey = "scorekeepFeedbackDraft";
    const errorSummary = document.querySelector("[data-error-summary]");
    const successStatus = document.querySelector("[data-success-status]");
    const submitButton = document.querySelector("[data-submit-button]");
    const turnstileContainer = document.querySelector("[data-turnstile-container]");
    const turnstileHelp = document.querySelector("[data-turnstile-help]");
    const config = window.scoreKeepFeedbackConfig || {};
    let turnstileWidgetId;
    let turnstileToken = "";

    function saveDraft() {
        try {
            sessionStorage.setItem(storageKey, JSON.stringify({
                type: form.elements.type.value,
                message: form.elements.message.value,
                replyEmail: form.elements.replyEmail.value
            }));
        } catch {
            // Draft recovery is optional; form submission still works.
        }
    }

    function restoreDraft() {
        try {
            const draft = JSON.parse(sessionStorage.getItem(storageKey));
            if (!draft || typeof draft !== "object") {
                return;
            }

            if (["support", "comment", "suggestion"].includes(draft.type)) {
                form.elements.type.value = draft.type;
            }
            if (typeof draft.message === "string") {
                form.elements.message.value = draft.message.slice(0, 5000);
            }
            if (typeof draft.replyEmail === "string") {
                form.elements.replyEmail.value = draft.replyEmail.slice(0, 254);
            }
        } catch {
            // Ignore unavailable or malformed session data.
        }
    }

    function resetTurnstile() {
        turnstileToken = "";
        if (window.turnstile && turnstileWidgetId !== undefined) {
            window.turnstile.reset(turnstileWidgetId);
        }
    }

    function showError(message) {
        successStatus.hidden = true;
        errorSummary.textContent = message;
        errorSummary.hidden = false;
        errorSummary.focus();
    }

    function renderTurnstile() {
        const siteKey = config.turnstileSiteKey;
        if (!siteKey || siteKey.startsWith("REPLACE_")) {
            turnstileHelp.textContent = "The feedback form is not configured yet. Please use the email fallback below.";
            submitButton.disabled = true;
            return;
        }

        if (!window.turnstile) {
            showError("The security verification could not load. Check your connection or use the email fallback below.");
            return;
        }

        turnstileWidgetId = window.turnstile.render(turnstileContainer, {
            sitekey: siteKey,
            action: "scorekeep_feedback",
            size: "flexible",
            callback(token) {
                turnstileToken = token;
                errorSummary.hidden = true;
            },
            "expired-callback": resetTurnstile,
            "error-callback"() {
                turnstileToken = "";
                showError("The security verification could not be completed. Please try again.");
            }
        });
    }

    async function submitFeedback(event) {
        event.preventDefault();
        errorSummary.hidden = true;
        successStatus.hidden = true;

        if (!form.reportValidity()) {
            saveDraft();
            return;
        }

        if (!turnstileToken) {
            showError("Complete the security verification before sending your feedback.");
            return;
        }

        saveDraft();
        submitButton.disabled = true;
        submitButton.textContent = "Sending…";

        try {
            const response = await fetch("/api/scorekeep/feedback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    type: form.elements.type.value,
                    message: form.elements.message.value,
                    replyEmail: form.elements.replyEmail.value,
                    website: form.elements.website.value,
                    turnstileToken
                })
            });
            const result = await response.json().catch(() => ({}));

            if (!response.ok || result.success !== true) {
                throw new Error(result.message || "Your feedback could not be sent. Your message has been preserved; please try again.");
            }

            sessionStorage.removeItem(storageKey);
            form.reset();
            form.hidden = true;
            errorSummary.hidden = true;
            successStatus.textContent = "Thanks — your ScoreKeep feedback was sent.";
            successStatus.hidden = false;
            successStatus.focus();
        } catch (error) {
            showError(error instanceof Error ? error.message : "Your feedback could not be sent. Your message has been preserved; please try again.");
            resetTurnstile();
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Send feedback";
        }
    }

    restoreDraft();
    form.addEventListener("input", saveDraft);
    form.addEventListener("change", saveDraft);
    form.addEventListener("submit", submitFeedback);
    window.addEventListener("load", renderTurnstile, { once: true });
})();
