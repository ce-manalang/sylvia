# Phase 1: Foundation & Auth - Context

**Gathered:** 2026-02-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Set up project infrastructure, local data storage, and app scaffolding so that users can launch the app, see an onboarding screen, and have a working local-first foundation. Auth is deferred to Phase 3 — v1 is user-less (optional account, no login required).

**Key scope change from roadmap:** AUTH-01 through AUTH-04 are moved to Phase 3 (shared sessions). Phase 1 delivers a no-auth, local-first web app.

</domain>

<decisions>
## Implementation Decisions

### Auth approach (user-less v1)
- No authentication in v1 — app works without any login
- Optional account concept: app is fully functional without an account
- Local-only display name stored on device for personalization (asked during brief welcome)
- No Firebase Auth, no social auth providers in Phase 1
- Auth infrastructure deferred entirely to Phase 3 when shared sessions need identity

### Project scaffolding
- **Framework:** React + Vite (SPA, not Next.js or React Native)
- **Styling:** Tailwind CSS
- **TypeScript:** Yes, normal mode (not strict)
- **Existing codebase:** Can be deleted/replaced — start fresh if needed
- **Target:** Web-first, mobile-responsive, PWA-installable

### Data & storage
- **Storage:** Browser localStorage / IndexedDB — no backend for v1
- **Journal entries:** Simple text + metadata (question, answer text, timestamp, emotion tag)
- **Deck content:** Local JSON bundled with app. API/CMS added later for premium decks
- **Data export:** Not in v1
- **Data loss risk:** Clearing browser data = data gone (acceptable for v1)

### Offline-first behavior
- **PWA:** Yes — service worker for offline access, install-to-home-screen prompt
- **Mobile feel:** Reasonable mobile support — responsive design, works well on mobile, still feels like a web app (not trying to fake native)
- **Offline:** Essentially free since everything is local. PWA shell ensures app loads without network

### Claude's Discretion
- IndexedDB library choice (Dexie, idb, or raw IndexedDB)
- Vite plugin configuration
- PWA service worker strategy (precache vs runtime cache)
- Folder structure and project organization
- Tailwind theme configuration (warm/soft palette specifics)
- TypeScript config details

</decisions>

<specifics>
## Specific Ideas

- User said "React + Vite" specifically — not Next.js, not React Native
- Brief welcome screen with name/avatar setup (local-only, no account)
- "Delete existing code if need be" — no obligation to preserve current Next.js codebase
- The app should feel warm, soft, reflective, journal-like (design tone from PRD)

</specifics>

<deferred>
## Deferred Ideas

- Firebase Auth / social auth (Google, Apple) — move to Phase 3 with shared sessions
- Email verification — Phase 3
- Password reset — Phase 3
- Cloud data sync/backup — Phase 3+
- Data export (journal download) — future phase
- API/CMS for deck content — when premium decks ship

</deferred>

---

*Phase: 01-foundation-auth*
*Context gathered: 2026-02-18*
