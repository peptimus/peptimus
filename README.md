# Peptimus

[![CI](https://github.com/peptimus/peptimus/actions/workflows/ci.yml/badge.svg)](https://github.com/peptimus/peptimus/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-MIT-00f5ff?style=flat-square&labelColor=0a0f1c)](LICENSE)
[![Author](https://img.shields.io/badge/author-peptimusdev-8b5cf6?style=flat-square&labelColor=0a0f1c)](https://github.com/peptimusdev)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black&labelColor=0a0f1c)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white&labelColor=0a0f1c)](https://vite.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white&labelColor=0a0f1c)](https://tailwindcss.com)
[![Solana](https://img.shields.io/badge/Solana-Mainnet-9945FF?style=flat-square&logo=solana&logoColor=white&labelColor=0a0f1c)](https://solana.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white&labelColor=0a0f1c)](https://www.typescriptlang.org)

Decentralized AI peptide design platform on Solana. Design, evolve, and mint peptide sequences as IP-NFTs.

**Author:** [peptimusdev](https://github.com/peptimusdev)

---

## Overview

Peptimus is the web frontend for the Peptimus platform. Researchers use natural language to generate novel peptide sequences via AI, evolve them through iterative refinement, and mint them as on-chain IP-NFTs using the Molecule Protocol standard on Solana Mainnet.

---

## Pages

| Route | Description |
|---|---|
| `/` | Landing page with live platform stats |
| `/app/home` | Dashboard with aggregate metrics |
| `/app/studio` | AI Design Studio for peptide generation |
| `/app/library` | Personal peptide library (wallet-filtered) |
| `/app/discover` | Community discovery and top peptides |
| `/app/community` | Live activity feed |
| `/app/research` | Research events feed |
| `/app/bounty` | Bounty program and PTMS tokenomics |
| `/app/peptide/:id` | Peptide detail, metrics, and IP-NFT data |
| `/app/profile/:wallet` | Researcher profile |
| `/app/compare` | Side-by-side peptide comparison |

---

## Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build | Vite |
| Styling | Tailwind CSS + shadcn/ui |
| Animation | Framer Motion |
| 3D / WebGL | React Three Fiber + Drei |
| State | Zustand |
| Routing | Wouter |
| Data fetching | React Query |
| Wallet | Jupiter Unified Wallet Adapter |
| Language | TypeScript 5.9 |

---

## Development

```bash
pnpm install
pnpm --filter @workspace/peptimus run dev
```

```bash
pnpm --filter @workspace/peptimus run typecheck
pnpm --filter @workspace/peptimus run build
```

---

## Design Tokens

| Token | Value |
|---|---|
| Background | `#0a0f1c` |
| Cyan (primary) | `#00f5ff` |
| Emerald (secondary) | `#00ff9f` |
| Purple (accent) | `#8b5cf6` |
| Font | Space Grotesk, DM Sans |
| Mono | DM Mono |

---

**Built by [peptimusdev](https://github.com/peptimusdev)**
