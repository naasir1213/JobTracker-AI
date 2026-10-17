# Job Tracker AI

A local-first Kanban job application tracker. Everything is stored in your browser's
IndexedDB — no backend, no accounts, no network calls.

## Features

- **Kanban board** with six columns: Wishlist, Applied, Follow-up, Interview, Offer, Rejected
- **Drag-and-drop** cards between columns (`@dnd-kit/core`)
- **Add / edit / delete** jobs via a modal form (delete asks for confirmation)
- Required-field validation on company and role
- Card shows company, role, resume tag, salary, days since applied, and a clickable
  LinkedIn link
- Live **column counts** and a **search bar** (filters by company or role)
- **Sort** cards within a column by date applied (newest/oldest) or company A–Z
- **Light / dark mode** toggle (remembers your choice)
- **Export** all data as JSON and **import** it back to restore
- Responsive layout with independently scrollable columns

## Tech stack

React 18 + Vite, Tailwind CSS, `idb` for IndexedDB, `@dnd-kit/core` for drag-and-drop.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed localhost URL. Build for production with `npm run build` and preview
with `npm run preview`.

## Data

All data lives in the `jobtracker-ai` IndexedDB database in your browser. Use the export
button in the header to back it up as JSON; clearing site data will remove it.
