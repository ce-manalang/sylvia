# Requirements: WNRS Companion

**Defined:** 2026-02-18
**Core Value:** Help users feel seen, known, and emotionally connected through meaningful guided conversations.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Authentication

- [ ] **AUTH-01**: User can create account with email and password
- [ ] **AUTH-02**: User can log in with Google or Apple social auth
- [ ] **AUTH-03**: User session persists across app restarts
- [ ] **AUTH-04**: User can log out from settings

### Conversation Mode

- [ ] **CONV-01**: User can start a solo conversation session
- [ ] **CONV-02**: User can start a 1-on-1 conversation session with another person
- [ ] **CONV-03**: User can start a group conversation session (3-8 people)
- [ ] **CONV-04**: Conversation progresses through three levels: Perception, Connection, Reflection
- [ ] **CONV-05**: User can swipe or tap to reveal the next question
- [ ] **CONV-06**: User can set an optional timer between questions
- [ ] **CONV-07**: User can opt out of sensitive prompts (skip with content warning)

### Deck System

- [ ] **DECK-01**: App includes a free starter conversation deck
- [ ] **DECK-02**: User can browse and select from available decks
- [ ] **DECK-03**: Premium decks are gated behind purchase (freemium)
- [ ] **DECK-04**: Each deck contains questions organized by the three conversation levels

### Journaling

- [ ] **JRNL-01**: User can write a private response to any question during a session
- [ ] **JRNL-02**: User's journal entries are saved and accessible later
- [ ] **JRNL-03**: User can tag journal entries with emotions or themes
- [ ] **JRNL-04**: User can view their session history (past conversations)

### Shared Sessions

- [ ] **SESS-01**: User can invite others to a session via link or invite code
- [ ] **SESS-02**: Questions are revealed synchronously for all participants
- [ ] **SESS-03**: User can optionally submit answers anonymously in shared sessions
- [ ] **SESS-04**: Shared session shows participant presence (who's in the session)

### Reflection & Summary

- [ ] **REFL-01**: End-of-session screen shows a reflection summary
- [ ] **REFL-02**: User can select their favorite answer from the session
- [ ] **REFL-03**: User can note one thing they learned
- [ ] **REFL-04**: User can do a mood check-in at end of session
- [ ] **REFL-05**: User can save or share an insight from the session

### User Experience

- [ ] **UX-01**: App has an onboarding flow for first-time users
- [ ] **UX-02**: UI is calm, minimal, and journal-like with warm/soft design tone
- [ ] **UX-03**: Pacing is intentional — no doom-scroll patterns, deliberate transitions between questions
- [ ] **UX-04**: Settings screen for account, preferences, and app configuration
- [ ] **UX-05**: App works on both iOS and Android (cross-platform)

### Infrastructure

- [ ] **INFRA-01**: Real-time data sync for shared sessions (sub-500ms latency)
- [ ] **INFRA-02**: App functions offline for solo mode with sync on reconnect
- [ ] **INFRA-03**: Journal entries stored locally with option for cloud backup

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Notifications

- **NOTF-01**: Daily question notification to encourage reflection
- **NOTF-02**: Smart scheduling — suggest conversations at optimal times

### AI Features

- **AI-01**: AI-generated personalized prompts based on user history
- **AI-02**: AI-assisted empathetic session summaries (LLM-powered)
- **AI-03**: Guided follow-up sequences based on detected themes

### Media

- **MEDIA-01**: Voice recording for answers
- **MEDIA-02**: Export session transcripts to external apps (Apple Notes, Notion)

### Analytics & Growth

- **ANLYT-01**: Emotion progression tracking (emotional arc across sessions)
- **ANLYT-02**: Personal conversation analytics dashboard
- **ANLYT-03**: Relationship progress timeline
- **ANLYT-04**: Replay/relive past sessions with full transcript

### Professional

- **PRO-01**: Therapist mode / guided professional packs
- **PRO-02**: Additional monetized premium deck content

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Video/video call integration | Out of scope — users can use FaceTime/Zoom in parallel |
| Gamification (points, leaderboards, streaks) | Kills emotional intimacy; conversation cards are not games |
| AI chatbot conversation partner | Dilutes human connection value prop; LLM use is summaries only |
| User-created prompt marketplace | Moderation burden; curation quality > quantity |
| In-app direct messaging | Structured sessions are the product; users have SMS/iMessage |
| Social feed / activity stream | Privacy-first app; no performative social features |
| AR/VR modes | Gimmicky; adds no value to reflective conversations |
| End-to-end encryption | Deferred complexity; local-only journal + standard Firebase security for v1 |
| User-editable prompts | Open question deferred; curated prompts maintain quality |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | — | Pending |
| AUTH-02 | — | Pending |
| AUTH-03 | — | Pending |
| AUTH-04 | — | Pending |
| CONV-01 | — | Pending |
| CONV-02 | — | Pending |
| CONV-03 | — | Pending |
| CONV-04 | — | Pending |
| CONV-05 | — | Pending |
| CONV-06 | — | Pending |
| CONV-07 | — | Pending |
| DECK-01 | — | Pending |
| DECK-02 | — | Pending |
| DECK-03 | — | Pending |
| DECK-04 | — | Pending |
| JRNL-01 | — | Pending |
| JRNL-02 | — | Pending |
| JRNL-03 | — | Pending |
| JRNL-04 | — | Pending |
| SESS-01 | — | Pending |
| SESS-02 | — | Pending |
| SESS-03 | — | Pending |
| SESS-04 | — | Pending |
| REFL-01 | — | Pending |
| REFL-02 | — | Pending |
| REFL-03 | — | Pending |
| REFL-04 | — | Pending |
| REFL-05 | — | Pending |
| UX-01 | — | Pending |
| UX-02 | — | Pending |
| UX-03 | — | Pending |
| UX-04 | — | Pending |
| UX-05 | — | Pending |
| INFRA-01 | — | Pending |
| INFRA-02 | — | Pending |
| INFRA-03 | — | Pending |

**Coverage:**
- v1 requirements: 36 total
- Mapped to phases: 0
- Unmapped: 36

---
*Requirements defined: 2026-02-18*
*Last updated: 2026-02-18 after initial definition*
