Deployed with Cloudflare Pages.

## ScoreKeep feedback

The static form lives at `scorekeep/feedback/`. Its dedicated Worker is in
`cloudflare/scorekeep-feedback/` and handles only
`POST /api/scorekeep/feedback`.

Before deployment:

1. Replace the placeholder in `assets/js/scorekeep-feedback-config.js` with the
   public site key for the existing `ScoreKeep Feedback` Turnstile widget.
2. In the Worker directory, install the locked development dependencies with
   `npm ci` and run `npm test`.
3. Set `TURNSTILE_SECRET_KEY` as an encrypted Worker secret. Never commit it.
4. Confirm the `FEEDBACK_EMAIL` binding is restricted to the verified
   `karlkomakode@gmail.com` destination and that Cloudflare accepts
   `comment@komakode.com` as the fixed sender.
5. Review existing Worker routes before deploying the narrow route declared in
   `wrangler.jsonc`.

For local development, copy `.dev.vars.example` to `.dev.vars` and use
Cloudflare's published Turnstile test secret. `.dev.vars` and `.env` variants
are ignored by Git.
