# Superleap CRM

Superleap CRM is a production-grade, single-page Lead Management application built to demonstrate advanced frontend architecture, robust state management, and highly polished UI/UX.

## Setup & Running Locally

Ensure you have Node.js 18+ installed.

```bash
# 1. Install dependencies
npm install

# 2. Start the application (runs both Next.js frontend and json-server mock API)
npm run dev:full
```
The app will be available at `http://localhost:3000`.

## Tech Stack Chosen

- **Framework**: Next.js 14 (App Router) with React 18. Next.js provides robust routing, layout organization, and powerful server/client component boundaries out of the box.
- **State Management**: React Query (TanStack Query) for async server state, and Zustand for global UI state (like sidebar toggles). React Query handles caching, optimistic updates, and loading states flawlessly, while Zustand provides a lightweight, boiler-plate-free store for client state.
- **Styling**: Tailwind CSS combined with custom CSS variables (for a dynamic dark-mode-first theme). Tailwind allows for rapid iteration and highly consistent spacing/typography without external component bloat.
- **Mock API**: `json-server` running concurrently on port 3001. It instantly provides a RESTful interface over the `seed.json` file, allowing us to interact with true HTTP requests and test optimistic updates as if a real backend existed.

## Design Decisions

### Component, State, and Async Logic Organization
I separated components into single-responsibility functional blocks (`/components/leads`, `/components/board`, `/components/layout`). Async logic is strictly encapsulated inside custom hooks (`useLeads`, `useUpdateLead`, etc.) so components never fetch data directly; they only consume data and mutation functions. URL parameters dictate filter state (via `nuqs`), keeping the UI state perfectly shareable and deeply linkable without prop-drilling.

### Enforcing Status Rules
Status transition logic is centralized in a finite state machine utility (`lib/statusMachine.ts`). The UI heavily relies on this single source of truth. For instance, the Kanban board checks `canTransitionTo()` to reject invalid drops, and the bulk action bar computes the intersection of valid next statuses across all selected leads, actively hiding invalid options.

### Handling Offline Support & Concurrent Edits
For **offline support**, I would implement a full IndexedDB caching layer via `localforage` paired with React Query's `onlineManager`. Mutations made offline would be queued and replayed upon reconnection.
For **concurrent edits**, I would implement websockets (or Server-Sent Events) to push real-time updates. If a user tries to edit a lead that another user modified, the backend should return a `409 Conflict` (via optimistic concurrency control using an `updated_at` version token), and the UI would prompt the user to refresh or merge their changes.

### What I'd Improve Given Another Week
1. **Full Authentication & RBAC**: Add NextAuth to support different roles (e.g., SDRs vs. Admins) and scope lead visibility.
2. **Activity Timelines**: Track the history of every status change and note added to provide an audit log on the lead detail page.
3. **Advanced Virtualization**: While row virtualization is implemented for 5000+ leads, a truly massive dataset would benefit from cursor-based infinite scrolling on the server side instead of fetching the entire array up front.

## AI Usage Note
I utilized Anthropic's Claude 3.5 Sonnet (via Antigravity agentic wrapper) to assist with rapid prototyping and generating boilerplate UI structures. I accepted AI suggestions for repetitive tasks like Tailwind class compositions and standard CRUD hook generation. However, I intentionally took manual control over complex state architectural decisions—such as building the status transition state machine, handling strict Next.js App Router `<Suspense>` boundaries to avoid hydration errors, and configuring `@tanstack/react-virtual` for performance—as generic AI suggestions often fail to properly account for nuanced edge cases in these areas.
