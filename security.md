## 9. Security Improvements — Implementation Tasks

Implement the following improvements based on established security best practices. First inspect the existing architecture and configuration, then implement the changes without breaking current functionality.

### 9.1. Rate Limiting and Brute Force Protection

- [ ] Implement global API rate limiting using the official NestJS-compatible `@nestjs/throttler` package, or an equivalent solution if the existing architecture requires it.
- [ ] Apply stricter, endpoint-specific limits to authentication routes, especially login, registration and password recovery.
- [ ] Apply appropriate limits to public search and other resource-intensive endpoints.
- [ ] Use HTTP `429 Too Many Requests` when a client exceeds the configured limit.
- [ ] Return appropriate rate-limit headers, including `Retry-After` when applicable.
- [ ] Avoid relying exclusively on IP-based limits for authentication. Consider combining IP-based and account-based protections without introducing account-lockout denial-of-service vulnerabilities.
- [ ] Make limits configurable through environment variables where appropriate.
- [ ] If the application runs across multiple instances or replicas, use shared rate-limit storage such as Redis instead of relying on in-memory storage.
- [ ] Configure proxy trust only for known and trusted reverse proxies. Do not blindly trust client-provided `X-Forwarded-For` headers.
- [ ] Ensure legitimate application functionality is not unnecessarily restricted.

### 9.2. Content Security Policy (CSP) and HTTP Security Headers

- [ ] Implement a restrictive Content Security Policy for the frontend.
- [ ] Configure CSP at the appropriate layer for the Next.js application, ensuring that browser-rendered pages receive the policy.
- [ ] Prefer nonce-based or hash-based policies for inline scripts instead of allowing unrestricted inline script execution.
- [ ] Inspect existing inline styles and scripts before defining CSP directives.
- [ ] Avoid using `'unsafe-inline'` in `script-src` in production.
- [ ] If temporary exceptions are necessary for compatibility, document them and restrict their scope.
- [ ] Start with `Content-Security-Policy-Report-Only` when necessary to identify compatibility problems before enforcing the policy.
- [ ] Configure `frame-ancestors` to prevent unauthorized embedding and clickjacking. Use `'none'` unless legitimate framing is required.
- [ ] Configure appropriate HTTP security headers, including:
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy`
  - `Strict-Transport-Security` in HTTPS production environments
  - `X-Frame-Options` as a legacy compatibility fallback where appropriate
  - `Content-Security-Policy`
- [ ] Avoid conflicting or duplicated security headers between Next.js, NestJS and the reverse proxy.
- [ ] Verify that CSP does not break authentication, API requests, images, fonts, styles or other existing frontend functionality.

### 9.3. PostgreSQL Network Exposure and Docker Compose

- [ ] Separate development and production Docker Compose configurations.
- [ ] Preserve local PostgreSQL access during development, including compatibility with DBeaver.
- [ ] Ensure the production configuration does not publish PostgreSQL's port to the public host interface.
- [ ] Keep PostgreSQL accessible only to authorized application services through an internal Docker network.
- [ ] Use Docker service-to-service communication instead of exposing the database unnecessarily.
- [ ] Apply the principle of least privilege to database users and permissions.
- [ ] Ensure production credentials are supplied through secure environment configuration and are not committed to Git.
- [ ] Verify that production containers do not run with unnecessary privileges.
- [ ] Keep development convenience features separate from production security requirements.

### 9.4. Environment-Based CORS Configuration

- [ ] Replace hardcoded CORS origins with environment-based configuration.
- [ ] Introduce an environment variable such as `CORS_ORIGINS` containing an explicit allowlist of trusted frontend origins.
- [ ] Support multiple origins when necessary, parsing and validating the configured values.
- [ ] Keep the existing development origin available through the development environment configuration.
- [ ] Configure the actual production frontend origin separately.
- [ ] Never use `origin: '*'` when credentials are enabled.
- [ ] Preserve the existing required HTTP methods and headers while avoiding unnecessarily permissive permissions.
- [ ] Keep `credentials: true` only where the authentication mechanism requires it.
- [ ] Reject origins that are not explicitly allowed.
- [ ] Fail safely or report a clear configuration error when production CORS configuration is missing or invalid.

---

## Implementation and Verification Requirements

For every task:

1. Inspect the existing implementation before modifying files.
2. Prefer established framework features and maintained packages over custom security implementations.
3. Follow the official documentation and practices compatible with the installed versions of Next.js, NestJS and Docker Compose.
4. Avoid unnecessary dependencies and architectural changes.
5. Preserve existing authentication, authorization, cookies, refresh-token rotation, uploads and API functionality.
6. Update `.env.example` files with new configuration variables, using placeholders only. Never expose real credentials.
7. Add or update tests to verify the security behavior.
8. Test both development and production configurations separately.
9. Verify that security headers are actually present in HTTP responses.
10. Verify that rate limits are enforced and legitimate requests continue to work.
11. Document any limitations or security decisions that require future attention.

## Acceptance Criteria

The implementation is considered complete only when:

- Rate limiting is active on relevant API endpoints, with stricter protection for authentication.
- CSP and clickjacking protections are configured and verified without breaking the frontend.
- PostgreSQL remains accessible for local development but is not publicly