# Security Policy

## Supported versions

| Version | Supported |
| --- | --- |
| 1.1.x (latest) | Yes |

## Reporting a vulnerability

Email **fnpaladini@gmail.com** with:

- Description of the issue
- Steps to reproduce
- Affected version
- Impact assessment (if known)

Please do **not** open public issues for undisclosed security vulnerabilities.

## Scope

DevUtils MCP Server runs **locally** via stdio. It does not expose HTTP endpoints or send user data to external services.

Areas of interest:

- Input validation in tool handlers (Zod schemas)
- Cryptographic operations (bcrypt, hashing)
- Docker image (non-root user, minimal base image)
- npm dependency supply chain

## Response

Expect an initial reply within 7 days. Patches are released on npm and tagged on GitHub.
