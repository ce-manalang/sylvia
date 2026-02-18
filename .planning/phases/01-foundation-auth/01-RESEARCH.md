# Phase 1: Foundation & Auth - Research

**Researched:** 2026-02-18
**Domain:** Local-first React SPA with offline support, browser data storage, PWA scaffolding
**Confidence:** HIGH

## Summary

Phase 1 establishes a local-first web application foundation using React + Vite + Tailwind CSS. The tech stack is mature, well-documented, and intentionally avoids backend authentication in favor of a simple local display name for personalization. All data persists locally via localStorage or IndexedDB, with a PWA service worker enabling offline access and install-to-home-screen capability.

The primary architecture challenge is managing client-side state hydration from persistent storage without blocking the UI. Secondary considerations include choosing an IndexedDB abstraction layer (Dexie recommended for schema management) and configuring the PWA service worker for precaching the app shell.

**Primary recommendation:** Use Dexie 4.3.0 for IndexedDB operations, vite-plugin-pwa with generateSW strategy for automatic precaching, and React hooks (custom or via dexie-react-hooks) for state synchronization with persistent storage.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Framework:** React + Vite (SPA, not Next.js or React Native)
- **Styling:** Tailwind CSS
- **TypeScript:** Yes, normal mode (not strict)
- **Storage:** Browser localStorage / IndexedDB — no backend for v1
- **Auth:** No authentication in v1 — app works without any login
- **Optional account:** App fully functional without account; local-only display name stored on device
- **PWA:** Yes — service worker for offline access, install-to-home-screen prompt
- **Data structure:** Journal entries = simple text + metadata (question, answer text, timestamp, emotion tag)
- **Deck content:** Local JSON bundled with app
- **Mobile feel:** Responsive design, works well on mobile, still feels like a web app (not trying to fake native)
- **Data loss risk:** Clearing browser data = data gone (acceptable for v1)

### Claude's Discretion
- IndexedDB library choice (Dexie, idb, or raw IndexedDB)
- Vite plugin configuration
- PWA service worker strategy (precache vs runtime cache)
- Folder structure and project organization
- Tailwind theme configuration (warm/soft palette specifics)
- TypeScript config details

### Deferred Ideas (OUT OF SCOPE)
- Firebase Auth / social auth providers — Phase 3
- Email verification, password reset — Phase 3
- Cloud data sync/backup — Phase 3+
- Data export (journal download) — future phase
- API/CMS for deck content — when premium decks ship

</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| INFRA-02 | App functions offline for solo mode with sync on reconnect | Local-first architecture with PWA service worker precaching app shell; IndexedDB for persistent journal storage |
| INFRA-03 | Journal entries stored locally with option for cloud backup | IndexedDB recommended for structured storage; localStorage sufficient for display name; backup infrastructure deferred to Phase 3 |
| UX-05 | App works cross-platform (web-first, mobile-responsive) | Tailwind CSS mobile-first breakpoint system; responsive Vite SPA serves well on mobile; PWA installability adds native-like feel |

</phase_requirements>

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.x | Component framework, state management | Industry standard for SPAs; excellent TypeScript support; minimal dependencies |
| Vite | 7.3.1 | Build tool and dev server | Fastest build tool for SPAs; instant dev server, sub-100ms HMR; standard choice for React in 2026 |
| Tailwind CSS | 4.x | Utility-first CSS framework | Standard for responsive design; mobile-first breakpoints; zero runtime overhead; integrates seamlessly with Vite |
| TypeScript | 5.x | Type safety (normal mode) | Catches errors at compile time without strict overhead; industry standard for React projects |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Dexie.js | 4.3.0 | IndexedDB wrapper for journal storage | Preferred for structured data; schema versioning; React hooks support via dexie-react-hooks |
| vite-plugin-pwa | 0.19.x | PWA scaffolding, service worker generation | Standard for Vite PWAs; automatic precache manifest; development mode for testing offline |
| react-dom | 19.x | React renderer | Always paired with React; required for DOM rendering |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Dexie | idb | Lighter (1KB vs 30KB); idb has simpler API but less schema management |
| Dexie | Raw IndexedDB | Full control; requires significantly more boilerplate; verbose event handling |
| Dexie | LocalForage | Works for simple key-value; lacks indexing and querying for complex journal data |
| vite-plugin-pwa | Manual service worker | Full control; requires maintaining SW updates; recommended only for edge cases |
| Tailwind | CSS Modules | More control; loses ecosystem tooling and prebuilt components; not standard practice |

**Installation:**
```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install react@19 react-dom@19
npm install -D tailwindcss @tailwindcss/vite
npm install -D vite-plugin-pwa
npm install dexie
npm install dexie-react-hooks
```

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── components/
│   ├── common/              # Reusable UI components (Button, Modal, Card, etc.)
│   │   └── [...].tsx
│   ├── layout/              # App shell components (Header, Sidebar, Footer)
│   │   └── [...].tsx
│   ├── features/            # Feature-specific components grouped by domain
│   │   ├── journal/         # Journal entry creation/display
│   │   ├── deck/            # Deck browsing/selection
│   │   └── welcome/         # Onboarding flow
│   └── [...].tsx
├── hooks/
│   ├── useJournalStorage.ts # Custom hook for journal IndexedDB operations
│   ├── useDisplayName.ts    # Custom hook for localStorage display name
│   └── [...].ts
├── db/
│   ├── schema.ts            # Dexie schema definition
│   ├── init.ts              # Database initialization and migration
│   └── [...].ts
├── services/                # Non-React business logic
│   ├── journal.ts           # Journal CRUD operations
│   ├── deck.ts              # Deck loading and filtering
│   └── [...].ts
├── types/
│   ├── journal.ts           # Journal entry types
│   ├── deck.ts              # Deck and card types
│   └── [...].ts
├── utils/
│   ├── storage.ts           # localStorage helpers
│   ├── formatting.ts        # Date/text formatting
│   └── [...].ts
├── data/
│   └── decks.json           # Bundled deck content
├── styles/
│   └── globals.css          # Tailwind imports
├── App.tsx                  # Root component
└── main.tsx                 # Vite entry point
```

**Rationale:** Feature-based organization scales as the app grows; separates UI from business logic; IndexedDB schema lives in `db/` for centralized persistence management.

### Pattern 1: Local-First Data Hydration with IndexedDB

**What:** Load persistent data from IndexedDB into React state during app initialization, ensuring UI renders with hydrated state without blocking layout.

**When to use:** On app startup and after any data modifications in offline mode.

**Example:**
```typescript
// src/hooks/useJournalStorage.ts
import { useLiveQuery } from 'dexie-react-hooks';
import { journalDb } from '../db/schema';

export function useJournalEntries() {
  const entries = useLiveQuery(() => journalDb.entries.toArray(), []);

  // useLiveQuery returns undefined during initial load, [] when empty
  return entries ?? [];
}

// src/components/JournalList.tsx
import { useJournalEntries } from '../hooks/useJournalStorage';

export function JournalList() {
  const entries = useJournalEntries();

  if (entries === undefined) return <Loading />;

  return (
    <div>
      {entries.map(entry => (
        <JournalCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
```

**Source:** [Dexie React Hooks](https://dexie.org/docs/libs/dexie-react-hooks)

### Pattern 2: localStorage for Simple Key-Value (Display Name)

**What:** Store user personalization (display name) in localStorage for instant retrieval during onboarding.

**When to use:** For small, frequently-accessed user preferences that don't require querying or complex schema.

**Example:**
```typescript
// src/hooks/useDisplayName.ts
import { useState, useEffect } from 'react';

const DISPLAY_NAME_KEY = 'app:displayName';

export function useDisplayName() {
  const [displayName, setDisplayName] = useState<string>(() => {
    return localStorage.getItem(DISPLAY_NAME_KEY) || '';
  });

  const updateDisplayName = (name: string) => {
    localStorage.setItem(DISPLAY_NAME_KEY, name);
    setDisplayName(name);
  };

  return { displayName, updateDisplayName };
}

// Usage in welcome component
function WelcomeScreen() {
  const { displayName, updateDisplayName } = useDisplayName();

  if (!displayName) {
    return <OnboardingFlow onComplete={updateDisplayName} />;
  }

  return <MainApp displayName={displayName} />;
}
```

**Source:** Industry standard pattern; verified with React localStorage documentation

### Pattern 3: PWA Service Worker with App Shell Strategy

**What:** Pre-cache HTML, CSS, and JS (app shell) so app loads instantly offline; cache data separately.

**When to use:** Always for PWAs; vite-plugin-pwa generateSW strategy handles this automatically.

**Configuration:**
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'generateSW',
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.example\.com\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
            },
          },
        ],
      },
      manifest: {
        name: 'Journal App',
        short_name: 'Journal',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#f5f1e8',
        icons: [
          // Generated automatically by vite-plugin-pwa
        ],
      },
    }),
  ],
});
```

**Source:** [Vite PWA Service Worker Precache Guide](https://vite-pwa-org.netlify.app/guide/service-worker-precache)

### Pattern 4: Responsive Mobile-First Layout with Tailwind

**What:** Design for mobile first, then progressively enhance for larger screens using Tailwind breakpoint prefixes.

**When to use:** All pages and components; ensures mobile UX by default.

**Example:**
```tsx
// src/components/JournalCard.tsx
export function JournalCard({ entry }) {
  return (
    <div className="flex flex-col gap-2 p-4 sm:p-6 md:flex-row md:gap-4 lg:p-8">
      <div className="w-full md:w-2/3">
        <h3 className="text-lg md:text-xl font-semibold">{entry.question}</h3>
        <p className="text-sm md:text-base text-gray-600 mt-2">{entry.answer}</p>
      </div>
      <div className="w-full md:w-1/3 flex items-end">
        <span className="text-xs md:text-sm text-gray-400">
          {formatDate(entry.timestamp)}
        </span>
      </div>
    </div>
  );
}
```

**Tailwind Breakpoints:** sm (640px), md (768px), lg (1024px), xl (1280px)

**Source:** [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)

### Anti-Patterns to Avoid

- **Direct manipulation of IndexedDB:** Write logic through Dexie schema instead; avoids version migration bugs
- **Storing large objects in localStorage:** Will block main thread; use IndexedDB for anything >1KB
- **Synchronous state initialization:** Always use Suspense or loading states; IndexedDB is async by design
- **Hardcoding breakpoints in CSS:** Use Tailwind breakpoint system; ensures consistency and maintainability
- **Mixing data storage strategies:** Pick localStorage OR IndexedDB per entity; avoid duplicating data across both

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| IndexedDB abstraction | Custom IndexedDB wrapper | Dexie.js | Schema versioning, migrations, and query building are complex; Dexie handles edge cases (quotas, eviction, browser differences) |
| PWA service worker | Custom SW registration logic | vite-plugin-pwa | Workbox integration, cache strategies, and precache manifest are subtle; vite-plugin-pwa generates them with tested defaults |
| State persistence | Custom React context + useEffect | dexie-react-hooks | Requires handling async initialization, race conditions, and re-render optimization; libraries provide battle-tested patterns |
| Responsive breakpoints | Custom media queries | Tailwind breakpoint system | Tailwind enforces consistency and prevents cascade bugs; standardizes on mobile-first approach |
| Data migrations | Manual schema upgrades in app | Dexie versioning | IndexedDB schema changes require careful transaction handling; Dexie provides migration hooks |

**Key insight:** Local-first storage and PWA infrastructure have subtle gotchas (IndexedDB quota eviction, service worker stale cache bugs, hydration race conditions). Proven libraries handle these edge cases reliably.

---

## Common Pitfalls

### Pitfall 1: Hydration Mismatch — React Renders Before Data Loads

**What goes wrong:** Component tries to render with undefined data, then UI flickers when IndexedDB data arrives.

**Why it happens:** IndexedDB is async; React renders synchronously. Without careful coordination, component may render twice with different data.

**How to avoid:**
- Use `useLiveQuery` from dexie-react-hooks (returns undefined during load, handles re-render)
- Show Suspense or loading boundary during initial hydration
- Don't render content dependent on IndexedDB data until it's confirmed loaded

**Warning signs:** Console warnings about changing data types; UI flicker on page load; entries appear/disappear.

### Pitfall 2: localStorage Clearing on Every Page Refresh (Vite Dev Issue)

**What goes wrong:** Data stored in localStorage during development disappears after HMR or page refresh.

**Why it happens:** In some Vite setups (especially with certain HMR configurations), localStorage is cleared between reloads. This is NOT a Vite bug—usually a development server proxy issue.

**How to avoid:**
- Test with production build locally (`npm run build && npm run preview`)
- If development localStorage clearing persists, check Vite HMR config isn't resetting browser state
- Use IndexedDB for important data (it's more resilient to dev server quirks)

**Warning signs:** Data works in production build but disappears in dev; happens inconsistently across restarts.

### Pitfall 3: Exceeding IndexedDB Storage Quota

**What goes wrong:** App crashes or silently fails to save when user's total browser storage exceeds quota (typically 20% disk space).

**Why it happens:** IndexedDB has a quota; storing too many entries or large blobs fills it. No warning before quota is hit.

**How to avoid:**
- Estimate storage: each journal entry ≈ 500 bytes; 10,000 entries = 5MB. Typical quota is 100s of MB
- For Phase 1 (local-only), don't worry about quota; v1 users won't hit it with journal entries alone
- In Phase 3 (cloud sync), implement data pruning or archival

**Warning signs:** `QuotaExceededError` in console; saves silently fail; user reports data loss.

### Pitfall 4: Service Worker Stale Cache in Development

**What goes wrong:** Updates to app code don't appear; user is served old cached files.

**Why it happens:** Service worker caches the app shell; HMR doesn't clear SW cache. Production builds have versioning, dev has race conditions.

**How to avoid:**
- Use vite-plugin-pwa development mode to test SW safely: `workbox.navigateFallback` configured
- In dev, hard refresh (Cmd+Shift+R) to bust cache
- vite-plugin-pwa's `registerType: 'autoUpdate'` ensures users get updates automatically in production

**Warning signs:** Old code showing in production; user reports stale UI after deploy.

### Pitfall 5: Syncing Data Between Tabs Without Service Worker

**What goes wrong:** User opens app in two tabs; edits journal in Tab A but Tab B doesn't show the change.

**Why it happens:** IndexedDB is shared across tabs, but React state is per-tab. No built-in messaging between tabs.

**How to avoid:**
- For Phase 1 (single-user local app), this is acceptable—document that user should use one tab
- If needed, use `storage` event (fires when another tab modifies localStorage) to trigger refresh
- Phase 3 (cloud sync) will implement proper sync

**Warning signs:** User opens multiple tabs; changes in one tab don't appear in others.

### Pitfall 6: TypeScript "any" Creeping Into Normal Mode

**What goes wrong:** `normal mode` TypeScript (strict: false) allows `any` types; code evolves to become untyped.

**Why it happens:** Without `noImplicitAny`, untyped functions default to `any`. Teams gradually skip type annotations.

**How to avoid:**
- Set `noImplicitAny: true` in tsconfig.json even though strict is false
- Use TypeScript in VSCode for real-time feedback
- Code review for missing types on function parameters

**Warning signs:** Gradual loss of type safety; errors only discovered at runtime.

---

## Code Examples

Verified patterns from official sources:

### Setting Up Dexie Schema

```typescript
// src/db/schema.ts
import Dexie, { type Table } from 'dexie';

export interface JournalEntry {
  id?: number;
  questionId: string;
  answer: string;
  emotionTag: string; // 'hopeful', 'anxious', 'neutral', etc.
  timestamp: number;
  updatedAt?: number;
}

export class JournalDatabase extends Dexie {
  entries!: Table<JournalEntry>;

  constructor() {
    super('JournalDB');
    this.version(1).stores({
      entries: '++id, timestamp, questionId', // primary key, then indexes
    });
  }
}

export const journalDb = new JournalDatabase();

// src/db/init.ts
export async function initializeDatabase() {
  try {
    await journalDb.open();
    console.log('Database initialized');
  } catch (err) {
    console.error('Database init failed:', err);
  }
}
```

**Source:** [Dexie.js Documentation](https://dexie.org/docs/API-Reference/Dexie)

### PWA Registration with React Hook

```typescript
// src/hooks/usePWARegister.ts
import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export function usePWAInstallPrompt() {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  const {
    offlineReady: [offlineReady],
    needRefresh: [needRefresh],
  } = useRegisterSW({
    onRegistered() {
      console.log('Service Worker registered');
    },
    onRegisterError(error) {
      console.error('SW registration error:', error);
    },
  });

  useEffect(() => {
    if (offlineReady || needRefresh) {
      setShowInstallPrompt(true);
    }
  }, [offlineReady, needRefresh]);

  return { showInstallPrompt, offlineReady, needRefresh };
}

// Usage in App.tsx
function App() {
  const { showInstallPrompt } = usePWAInstallPrompt();

  return (
    <>
      {showInstallPrompt && <PWAInstallBanner />}
      <MainApp />
    </>
  );
}
```

**Source:** [vite-plugin-pwa React Documentation](https://vite-pwa-org.netlify.app/examples/react)

### Querying IndexedDB with Dexie

```typescript
// src/services/journal.ts
import { journalDb, type JournalEntry } from '../db/schema';

export async function addJournalEntry(entry: Omit<JournalEntry, 'id' | 'timestamp'>) {
  const id = await journalDb.entries.add({
    ...entry,
    timestamp: Date.now(),
  });
  return id;
}

export async function getEntriesByQuestion(questionId: string) {
  return journalDb.entries
    .where('questionId')
    .equals(questionId)
    .toArray();
}

export async function getRecentEntries(limit: number = 10) {
  return journalDb.entries
    .orderBy('timestamp')
    .reverse()
    .limit(limit)
    .toArray();
}

export async function deleteEntry(id: number) {
  return journalDb.entries.delete(id);
}
```

**Source:** [Dexie Query API](https://dexie.org/docs/API-Reference/Table/query)

### Tailwind Configuration for Warm/Soft Palette

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm, soft palette for reflective/journal app
        cream: '#f5f1e8',
        sand: '#e8dcc8',
        terracotta: '#d4a574',
        sage: '#a8b5a0',
        slate: '#6b7280',
        charcoal: '#2d3436',
      },
      fontFamily: {
        serif: ['Crimson Text', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        128: '32rem',
      },
    },
  },
  plugins: [],
} satisfies Config;
```

**Usage in components:**
```tsx
<div className="bg-cream text-charcoal">
  <h1 className="font-serif text-2xl text-terracotta">Your Reflection</h1>
</div>
```

**Source:** [Tailwind CSS Configuration](https://tailwindcss.com/docs/configuration)

### TypeScript Configuration (Normal Mode)

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "strict": false,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "jsx": "react-jsx",
    "isolatedModules": true,
    "noEmit": true,
    "types": ["vite/client"]
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**Key settings:**
- `strict: false` — Normal mode (no strictNullChecks, strictFunctionTypes, etc.)
- `noImplicitAny: true` — Still catch untyped functions (recommended even in normal mode)
- `jsx: "react-jsx"` — Modern React 19 JSX transform (no need for React import in files)

**Source:** [TypeScript TSConfig Reference](https://www.typescriptlang.org/tsconfig/)

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Create React App | Vite | 2024-2025 | Vite is now standard; 10-100x faster dev builds; CRA no longer recommended for new projects |
| CSS-in-JS (styled-components) | Tailwind CSS + CSS Modules | 2022-2023 | Tailwind eliminates runtime JS for styling; zero-config with Vite; standard in React ecosystem |
| Redux for client state | React Context + Hooks + IndexedDB | 2021-2023 | For local-first apps, persistent storage is simpler than Redux + persistence plugins |
| Manual service workers | vite-plugin-pwa | 2023-present | Workbox integration; automatic precache; safe development mode; industry standard for Vite PWAs |
| SQLite in browser | IndexedDB with Dexie wrapper | 2020-present | Better browser support; no additional build complexity; Dexie handles schema versioning |

**Deprecated/outdated:**
- **Firebase Realtime Database for local-first sync:** Replaced by proper CRDTs (Yjs, Automerge) and purpose-built sync. Firebase is now primarily auth + Firestore (document DB)
- **Next.js for single-page apps:** Next.js is for SSR/SSG; Vite SPA is simpler and faster for client-only apps
- **Strict TypeScript on all projects:** Best practice now is "normal mode by default, strict if needed"; reduces friction without sacrificing type safety if `noImplicitAny` is enabled

---

## Open Questions

1. **Deck content delivery in Phase 1 vs Phase 3**
   - What we know: Decks are local JSON bundled with app in Phase 1
   - What's unclear: Should decks be loaded as one large JSON file or split into separate files? Is the deck list dynamic or static?
   - Recommendation: Start with single `decks.json` file; split if it exceeds 100KB or performance issues arise. Document structure upfront to avoid migration in Phase 3.

2. **IndexedDB quota management for large journal collections**
   - What we know: IndexedDB has quota (~5-10% of disk); journal entries are ~500 bytes each
   - What's unclear: Should Phase 1 implement quota warnings? Should old entries be pruned?
   - Recommendation: Skip quota management in Phase 1 (users won't hit it with journal entries alone). Add pruning/archival in Phase 3 when cloud sync requires data management.

3. **Service worker update strategy for Phase 3**
   - What we know: vite-plugin-pwa registerType: 'autoUpdate' auto-refreshes when new version deployed
   - What's unclear: Should users be notified of updates? Should old data be migrated on SW update?
   - Recommendation: Implement basic "New version available" toast in Phase 2 or 3. For Phase 1, autoUpdate is sufficient.

4. **Offline data sync strategy (deferred to Phase 3)**
   - What we know: Phase 1 is local-only; Phase 3 adds cloud sync
   - What's unclear: Should Phase 1 schema include `syncState` flag for entries? Should we reserve space in the schema?
   - Recommendation: Add optional `cloudId` field and `syncedAt` timestamp to JournalEntry schema now (forward compatibility). Don't implement sync logic in Phase 1.

---

## Sources

### Primary (HIGH confidence)
- **Vite Official Docs** (https://vite.dev/) — Latest version 7.3.1, React integration, development features
- **React TypeScript Guide** (https://react.dev/learn/typescript) — Confirmed React 19 + TypeScript best practices
- **Tailwind CSS Official Docs** (https://tailwindcss.com/docs) — Responsive design, configuration, Vite integration
- **Dexie.js Official Docs** (https://dexie.org/) — Current version 4.3.0, schema versioning, React hooks support
- **vite-plugin-pwa Official Docs** (https://vite-pwa-org.netlify.app/) — Service worker strategies, React integration

### Secondary (MEDIUM confidence)
- [React Folder Structure Best Practices 2025](https://www.robinwieruch.de/react-folder-structure/) — Verified with multiple sources; feature-based organization consensus
- [Making Offline-First PWAs with Vite and React](https://adueck.github.io/blog/caching-everything-for-totally-offline-pwa-vite-react/) — Practical precaching patterns
- [Using localStorage with React Hooks](https://blog.logrocket.com/using-localstorage-react-hooks/) — Verified patterns for simple data persistence
- [IndexedDB Wrapper Library Comparison](https://npm-compare.com/dexie,idb) — Dexie vs idb tradeoffs with npm download statistics

### Tertiary (LOW confidence, marked for validation)
- WebSearch results on React + Vite common pitfalls (marked as LOW until validated against official docs)
- TypeScript normal mode configuration (inferred from strict mode docs; not explicitly confirmed in one place)

---

## Metadata

**Confidence breakdown:**
- **Standard stack:** HIGH — All libraries verified against official docs and current npm versions
- **Architecture patterns:** HIGH — Verified with official documentation for Vite, Dexie, and Tailwind
- **PWA & service workers:** HIGH — vite-plugin-pwa documentation is comprehensive and current
- **Pitfalls & anti-patterns:** MEDIUM-HIGH — Derived from verified sources + community reports; recommend testing edge cases
- **TypeScript normal mode:** MEDIUM — Inferred from official TypeScript configuration reference; recommend testing specific settings

**Research date:** 2026-02-18
**Valid until:** 2026-03-20 (30 days; React/Vite ecosystem is stable)
**Last verified:** 2026-02-18

