# ROADMAP: WNRS Companion

**Created:** 2026-02-18
**Depth:** Quick (4 phases, 1-3 plans per phase)
**Coverage:** 36/36 v1 requirements mapped

---

## Phases

- [ ] **Phase 1: Foundation & Auth** - Set up project infrastructure, authentication, and single-user session scaffolding
- [ ] **Phase 2: Core Solo Experience** - Solo conversation mode, journaling, emotion tagging, and rule-based reflection summaries
- [ ] **Phase 3: Real-Time Shared Sessions** - 1-on-1 and group shared sessions with real-time sync and presence detection
- [ ] **Phase 4: Decks, Monetization & Polish** - Deck selection UI, freemium paywall, and end-to-end UX refinement

---

## Phase Details

### Phase 1: Foundation & Auth

**Goal:** Establish development environment, user authentication, and app scaffolding so that users can create accounts and the foundation for session modes is ready.

**Depends on:** Nothing (greenfield start)

**Requirements:**
- AUTH-01: User can create account with email and password
- AUTH-02: User can log in with Google or Apple social auth
- AUTH-03: User session persists across app restarts
- AUTH-04: User can log out from settings
- INFRA-01: Real-time data sync for shared sessions (sub-500ms latency)
- INFRA-02: App functions offline for solo mode with sync on reconnect
- INFRA-03: Journal entries stored locally with option for cloud backup
- UX-05: App works on both iOS and Android (cross-platform)

**Success Criteria** (what must be TRUE when complete):
1. User can sign up with email/password and receive account confirmation
2. User can log in with Google or Apple without friction; session persists across app restarts and manual logout
3. App is deployable on iOS and Android simulators/devices with no platform-specific crashes
4. Offline-first architecture is in place: app queues writes when offline and syncs on reconnect (validated with network toggle test)
5. Firebase Auth + Firestore rules are configured with proper security constraints (user-owned data only)

**Plans:** TBD

---

### Phase 2: Core Solo Experience

**Goal:** Deliver the foundational user experience where solo users can start a conversation, progress through 3-level prompt hierarchy, write reflections, tag emotions, and see meaningful summaries—proving core emotional value before multiplayer complexity.

**Depends on:** Phase 1 (auth + infrastructure in place)

**Requirements:**
- CONV-01: User can start a solo conversation session
- CONV-04: Conversation progresses through three levels: Perception, Connection, Reflection
- CONV-05: User can swipe or tap to reveal the next question
- CONV-06: User can set an optional timer between questions
- CONV-07: User can opt out of sensitive prompts (skip with content warning)
- DECK-01: App includes a free starter conversation deck
- DECK-04: Each deck contains questions organized by the three conversation levels
- JRNL-01: User can write a private response to any question during a session
- JRNL-02: User's journal entries are saved and accessible later
- JRNL-03: User can tag journal entries with emotions or themes
- JRNL-04: User can view their session history (past conversations)
- REFL-01: End-of-session screen shows a reflection summary
- REFL-02: User can select their favorite answer from the session
- REFL-03: User can note one thing they learned
- REFL-04: User can do a mood check-in at end of session
- REFL-05: User can save or share an insight from the session
- UX-01: App has an onboarding flow for first-time users
- UX-02: UI is calm, minimal, and journal-like with warm/soft design tone
- UX-03: Pacing is intentional — no doom-scroll patterns, deliberate transitions between questions
- UX-04: Settings screen for account, preferences, and app configuration

**Success Criteria** (what must be TRUE when complete):
1. User can start solo session, see 3-level prompt structure, and progress via swipe/tap without breaking
2. User can write reflections to any question and see them saved in history after session ends
3. Sentiment library suggests emotion tags (happy, sad, thoughtful, connected) with >80% accuracy; user can manually override any tag
4. End-of-session summary displays: user's favorite answer, one learned insight, mood check-in, and is not overwhelming (max 3-4 elements shown)
5. UI feels calm and minimal (no aggressive CTAs, intentional spacing, warm color palette); timer is optional and never feels pushy
6. User can opt out of sensitive prompts and see them skipped naturally (no jarring error states)
7. Session history persists across app restarts and shows past conversations by date

**Plans:** TBD

---

### Phase 3: Real-Time Shared Sessions

**Goal:** Extend core solo experience to multiplayer: users can invite others to 1-on-1 or group sessions, both see the same prompts in real-time, and answers sync without data loss—proving the "feeling seen together" value prop.

**Depends on:** Phase 2 (solo session flow and journaling work reliably)

**Requirements:**
- CONV-02: User can start a 1-on-1 conversation session with another person
- CONV-03: User can start a group conversation session (3-8 people)
- SESS-01: User can invite others to a session via link or invite code
- SESS-02: Questions are revealed synchronously for all participants
- SESS-03: User can optionally submit answers anonymously in shared sessions
- SESS-04: Shared session shows participant presence (who's in the session)
- REFL-02: User can select their favorite answer from the session (shared context)
- REFL-05: User can save or share an insight from the session (shared context)

**Success Criteria** (what must be TRUE when complete):
1. User can generate invite link or code and share it; other users join via link/code and both see the same prompt within <500ms of each other
2. When User A submits answer, User B sees it appear in real-time; both users stay in sync across all 3 levels (no prompt divergence)
3. Participant presence is visible (e.g., "Sarah is here" / "Jake is typing"); users feel connected in real-time
4. Server-side validation ensures prompt advancement only happens when required participants have submitted (no skipping ahead)
5. Anonymous submission works: User can toggle anonymity before answering; their answer appears without their name to other participants
6. Session maintains data integrity: if network drops mid-submission, answer is queued and retried on reconnect; no answers are lost
7. Shared session summary shows all participants' answers (with names or "Anonymous") and lets users see perspectives together

**Plans:** TBD

---

### Phase 4: Decks, Monetization & Polish

**Goal:** Complete the MVP with deck selection UI, freemium paywall for premium decks, and refined end-to-end UX so the app feels intentional and revenue-ready.

**Depends on:** Phase 3 (core features complete and syncing reliably)

**Requirements:**
- DECK-02: User can browse and select from available decks
- DECK-03: Premium decks are gated behind purchase (freemium)
- CONV-06: Optional timer configuration (already in Phase 2, refined here for Settings)
- UX-04: Settings screen for account, preferences, and app configuration (paywall integration)

**Success Criteria** (what must be TRUE when complete):
1. Deck selection UI shows free starter deck + 2-3 premium decks with clear pricing and "try free" CTAs
2. Free deck is always available; premium decks show paywall interstitial with Apple/Google in-app purchase flow
3. User can see entitlements clearly (e.g., "You have access to Basic + Relationships decks")
4. Settings screen consolidates: logout, notification preferences, content warning toggles, paid subscription status
5. App feels intentionally paced: no aggressive notifications, deliberate spacing, no dark patterns pushing premium features
6. Cross-platform consistency: iOS and Android user flows for purchases, account settings, and content are identical (modulo OS affordances)

**Plans:** TBD

---

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Auth | 0/3 | Not started | — |
| 2. Core Solo Experience | 0/3 | Not started | — |
| 3. Real-Time Shared Sessions | 0/2 | Not started | — |
| 4. Decks, Monetization & Polish | 0/2 | Not started | — |

---

## Notes

- **Compression applied:** Quick depth combined 4 natural requirement clusters into 4 phases. Phase 1 (Foundation) and Phase 4 (Monetization) are thin but critical milestones.
- **Research alignment:** Phase structure matches research recommendation (Phase 1 MVP Foundation → Phase 2 Core Solo → Phase 3 Scale to Shared → Phase 4 Monetization).
- **Real-time priority:** Phase 3 is critical validation point for Firebase sync latency and data integrity (research flags this as highest risk).
- **Offline-first:** Phase 1 establishes offline queuing; Phases 2-3 inherit and extend it.
- **UX philosophy:** Warm, calm, intentional pacing is woven into every phase (not deferred to Polish).

---

*Roadmap created: 2026-02-18*
*Awaiting planning*
