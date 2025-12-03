I will update the environment configuration to allow cross-origin requests from your local subdomains.

### Fix CORS Policy for Local Subdomains
1.  **Update `apps/feed/.env`**:
    *   Uncomment and update `AUTH_TRUSTED_ORIGINS`.
    *   Change the protocol from `https` to `http` for the wildcard entry to match your local environment (`http://databuddy.localhost:3000`).
    *   **Change**:
        ```env
        # AUTH_TRUSTED_ORIGINS=http://localhost:3000,https://*.localhost:3000
        ```
        **To**:
        ```env
        AUTH_TRUSTED_ORIGINS=http://localhost:3000,http://*.localhost:3000
        ```

### Verification
*   After the update, you will need to restart your development server for the `.env` changes to take effect.
*   Then, try accessing `http://databuddy.localhost:3000` again. The CORS error should be resolved.
