Cross-Domain Authentication Testing Checklist

1. Session Persistence Across Tabs/Windows
- Open two tabs on the same domain and subdomain.
- Sign in on one tab using the header modal; confirm the other tab shows authenticated UI without refresh.
- Sign out via the user dropdown; confirm both tabs revert to guest state.

2. Subdomain Synchronization
- Sign in on `https://app.<root-domain>`.
- Open `https://<workspace>.<root-domain>`; verify the header shows the authenticated UI immediately.
- Repeat across at least two subdomains.

3. Cookie Expiration and Renewal
- Inspect cookies and confirm `session_token` is httpOnly and Secure.
- Reduce session lifetime temporarily if possible and observe expiration behavior.
- Trigger renewal (e.g., re-sign-in) and confirm a fresh token is issued.

4. Mobile Responsiveness
- Test the header and modal on small screens.
- Verify buttons are accessible and forms are usable.

5. Trusted Origins
- Ensure requests from subdomains succeed.
- Requests from untrusted origins should be rejected.

Environment Variables
- `AUTH_COOKIE_DOMAIN` set to the root domain (e.g., `example.com`).
- `AUTH_TRUSTED_ORIGINS` comma-separated list including `https://app.example.com` and `https://*.example.com`.
- `NEXT_PUBLIC_APP_URL` pointing to the main app URL.

