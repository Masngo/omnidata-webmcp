cat << 'EOF' > README.md
# OmniData WebMCP

> **Agent-Native In-Browser Analytics Workspace**  
> Built for the OpenAI WebMCP Challenge | Powered by Next.js 14, DuckDB WASM, & the WebMCP Protocol

[![Live Demo](https://img.shields.io/badge/Live_App-omnidata--webmcp.vercel.app-6366f1?style=for-the-badge)](https://omnidata-webmcp.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg?style=for-the-badge)](LICENSE)

---

## Overview

Traditional AI web agents often rely on fragile DOM scraping or require users to upload raw CSV files to third-party LLM servers. **OmniData WebMCP** solves this by establishing a standardized, client-side interaction protocol between web applications and AI agents.

Operating entirely inside the browser using **DuckDB WASM**, OmniData exposes structured, type-safe analytical tools directly to AI agents via `document.modelContext`. Agents can execute complex SQL queries, run dataset quality diagnostics, and change data contexts in real time while humans observe the results through responsive charts and an execution terminal.

---

## Core Features

* 🦆 **Client-Side DuckDB WASM Engine**: Runs full SQL analytics on memory datasets 100% inside the browser. Zero network latency, complete data privacy.
* 🤖 **Native WebMCP Integration**: Exposes structured JSON-Schema tools (`run_sql_query`, `audit_dataset`, `switch_preset`) directly to WebMCP-enabled agents.
* 📊 **Dynamic Visualization**: Responsive chart canvas powered by **Recharts** and **Tailwind CSS** that automatically updates when underlying query state changes.
* 📜 **Real-Time Execution Logs**: Transparent terminal interface displaying live WebMCP tool calls, status codes, execution timestamps, and parameters.
* ⚡ **Reactive State Synchronization**: Powered by **Zustand** to maintain instant reactivity between agent calls, DuckDB tables, and UI components.

---

## Registered WebMCP Tools

OmniData automatically registers three tools via `document.modelContext.registerTool` upon booting:

| Tool Name | Parameters | Description |
| :--- | :--- | :--- |
| `run_sql_query` | `query` (string) | Executes analytical SQL queries directly against client-side DuckDB WASM tables. |
| `audit_dataset` | `preset` (string) | Runs automated data diagnostics (row counts, null distributions, column types). |
| `switch_preset` | `preset` (string) | Changes the active dataset context across available domain presets (`ecommerce`, `saas`, `financial`). |

---

## Tech Stack

* **Framework**: Next.js 14 (App Router)
* **Languages**: TypeScript, SQL
* **Database / Engine**: DuckDB WASM
* **Styling & UI**: Tailwind CSS, Lucide React
* **State Management**: Zustand
* **Visualizations**: Recharts
* **Deployment**: Vercel

---

## Getting Started

### Prerequisites

* Node.js 18.x or higher
* npm / yarn / pnpm

### Local Installation

1. **Clone the repository**:
   ```bash
   git clone [https://github.com/Masngo/omnidata-webmcp.git](https://github.com/Masngo/omnidata-webmcp.git)
   cd omnidata-webmcp

   Install dependencies:

Bash
npm install
Run the development server:

Bash
npm run dev
Open in browser:
Navigate to http://localhost:3000 to access the application.

Testing with WebMCP Agents
To test WebMCP tool execution locally in Google Chrome:

Open Chrome and navigate to chrome://flags/#enable-webmcp-testing.

Set the WebMCP Testing flag to Enabled.

Relaunch Chrome and open https://omnidata-webmcp.vercel.app.

Inspect tool executions live in the lower-right Execution Terminal.

License
This project is licensed under the MIT License.
EOF

Commit and push to GitHub
git add README.md
git commit -m "docs: update README.md with comprehensive WebMCP documentation and badges"
git push origin main
