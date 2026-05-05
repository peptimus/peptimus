# Contributing to Peptimus

Thank you for your interest in contributing to the Peptimus frontend. This document outlines the process for submitting changes to this repository.

## Getting Started

1. Fork the repository and clone your fork locally.
2. Install dependencies with `pnpm install` from the repo root.
3. Start the development server with `pnpm dev`.
4. Create a new branch from `main` for your change.

## Branch Naming

| Type | Pattern | Example |
|---|---|---|
| Feature | `feat/<short-description>` | `feat/peptide-comparison-view` |
| Bug fix | `fix/<short-description>` | `fix/wallet-connect-crash` |
| Docs | `docs/<short-description>` | `docs/update-readme` |
| Chore | `chore/<short-description>` | `chore/upgrade-vite` |

## Development Guidelines

- All components are written in **TypeScript** — avoid `any` types.
- UI components live in `src/components/`, pages in `src/pages/`.
- Use **Tailwind CSS** utility classes for styling — no inline styles.
- State management uses **Zustand** — keep stores small and focused.
- Data fetching uses **TanStack Query** — always handle loading and error states.
- Animation uses **Framer Motion** — prefer `layout` transitions over manual keyframes.
- 3D scenes use **React Three Fiber** — keep geometry counts low for mobile perf.

## Pull Request Process

1. Ensure CI passes — the workflow runs `tsc --noEmit`, ESLint, and a clean-ref scan.
2. Keep pull requests focused — one logical change per PR.
3. Fill out the pull request template completely.
4. Link any related issues in the PR description using `Closes #<issue>`.
5. Request a review from `@peptimusdev`.

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org):

```
feat: add peptide comparison modal
fix: resolve wallet disconnect race condition
docs: update component API docs
chore: bump framer-motion to 12.x
```

## Reporting Issues

Use the issue templates available in the repository:
- **Bug Report** — for reproducible defects
- **Feature Request** — for new functionality proposals

## Code of Conduct

Be respectful and constructive. Contributions that are disrespectful toward maintainers or other contributors will not be accepted.

---

**Maintainer:** [peptimusdev](https://github.com/peptimusdev)
