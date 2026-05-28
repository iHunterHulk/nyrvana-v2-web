# Contributing to Nyrvana V2 Web

This document explains the workflow for making changes to the Nyrvana V2 Web repository, particularly when changes are made autonomously by Hermes.

## Branch Naming

All changes should be made in feature branches with the following naming convention:
`hermes/YYYY-MM-DD-short-description`

For example: `hermes/2026-05-26-ui-skeleton`

## Workflow Principles

1. **Never push to main directly** - All changes must go through a pull request.
2. **One logical change per PR** - Keep pull requests focused on a single, coherent change.
3. **Never commit secrets** - Files containing secrets (`.env`, `*.key`, `*.pem`) are gitignored and should never be committed.
4. **Autonomous workflow** - Hermes opens PR, Claude reviews, user has final say
5. **Squash-only merge policy** - All pull requests are merged using squash merge
6. **No em dashes rule** - Never use em dashes (—) anywhere in code, documentation, commit messages, or PR descriptions

## Pull Request Process

1. Create a feature branch following the naming convention above.
2. Make your changes in the branch.
3. Commit your changes with a clear, descriptive message.
4. Push the branch to the repository.
5. Open a pull request from your branch to the `main` branch.
6. Wait for review and merge approval.

## Secret Management

All secret files are gitignored and will not be included in the repository:
- `.env` files
- `*.key` files
- `*.pem` files
- Any file containing passwords or API keys

If you need to reference configuration values that would normally be in a secret file, use environment variable placeholders or documentation files that describe the required variables without including actual values.

## Merge Policy

All changes to the repository must be made through pull requests. Direct pushes to the main branch are strictly prohibited. All pull requests must be merged using squash merge to maintain a clean, linear history.

## Code Quality Standards

- TypeScript strict mode is enabled
- All components should be functional components with TypeScript interfaces
- Use Tailwind CSS for styling with the provided design tokens
- Follow the accessibility guidelines in the design documentation
- Write tests for new functionality when applicable