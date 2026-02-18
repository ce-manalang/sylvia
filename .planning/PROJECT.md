# WNRS Companion

## What This Is

A mobile-first app that recreates the emotional, reflective experience of the WNRS physical conversation card game through guided prompts, journaling, and shared sessions. Users choose Solo, 1-on-1, or Group mode, progress through three conversation levels (Perception, Connection, Reflection), and can save private journal entries or participate in synchronized real-time sessions.

## Core Value

Help users feel seen, known, and emotionally connected through meaningful guided conversations.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Guided conversation mode (Solo, 1-on-1, Group) with three levels
- [ ] Swipe/tap question reveal with optional timer
- [ ] Solo reflection and journaling with saved responses
- [ ] Emotion/theme tagging for journal entries
- [ ] Real-time shared sessions via invite link or code
- [ ] Synchronized question reveal in shared sessions
- [ ] Optional anonymous answers in shared sessions
- [ ] End-of-session reflection summary (favorite answer, lesson learned, mood check-in)
- [ ] Onboarding flow
- [ ] Deck selection (starter deck included free)
- [ ] Freemium model with premium deck purchases
- [ ] Calm, minimal, journal-like UI with slow pacing
- [ ] Opt-out for sensitive prompts
- [ ] Settings screen

### Out of Scope

- Daily question notifications — post-MVP
- AI-generated personalized prompts — post-MVP
- Voice recording answers — post-MVP
- Relationship progress timeline — post-MVP
- Therapist mode / guided packs — post-MVP
- Monetized premium deck content creation — post-MVP (deck infrastructure is in scope)
- End-to-end encryption — deferred complexity, local-only journal sufficient for v1
- User-editable prompts — open question, deferred
- Spiritual/faith-based decks — open question, deferred

## Context

- Inspired by the WNRS physical card game; all prompts must be original to avoid IP issues
- Target audience is young adults (18-35) exploring relationships, healing, or self-reflection
- Secondary audience includes therapists/coaches and regular journalers
- Design tone: warm, soft, reflective, journal-like
- Emotional safety is paramount — content review and consent flows required
- Success is measured by emotional impact (users feel moved, return for reflection, use in real relationships)
- PRD suggests React Native or Flutter for cross-platform; Firebase or Supabase for backend
- Existing codebase is a Next.js project (web-first approach possible)

## Constraints

- **Platform**: Cross-platform mobile (React Native/Flutter) or web-first (Next.js already in repo)
- **Backend**: Firebase or Supabase for auth, real-time sessions, and data storage
- **Privacy**: Journal entries must have local-only storage option
- **Content**: All conversation prompts must be original (no WNRS IP)
- **UX**: Slow pacing enforced — no doom-scroll patterns, intentional transitions

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Web-first vs React Native/Flutter | Existing Next.js codebase in repo; PRD suggests mobile-first | — Pending |
| Firebase vs Supabase for backend | Both viable; Supabase has better real-time and open-source story | — Pending |
| Local-only journal vs cloud sync | Privacy concern vs cross-device access | — Pending |

---
*Last updated: 2026-02-18 after initialization*
