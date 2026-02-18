# Project Research Summary: WNRS Companion

**Project:** WNRS Companion — Real-time conversation/reflection mobile app with journaling
**Domain:** Social journaling with real-time collaboration
**Researched:** 2026-02-18
**Confidence:** HIGH

---

## Executive Summary

WNRS Companion is a mobile app designed to facilitate guided, intimate conversations between users through structured prompt decks with real-time shared sessions. The research recommends a React Native + Firebase architecture prioritizing shipped speed and offline reliability over premature native optimization. The stack is production-ready (React Native 0.84+ New Architecture, Firebase Realtime DB/Firestore, Zustand + TanStack Query for state, Tamagui for UI). The core value prop depends critically on real-time presence and emotional resonance—this means research flags data loss and prompt desync as unacceptable pitfalls requiring server-side enforcement from Day 1.

The MVP path prioritizes solo mode + 1-on-1 shared sessions as the critical path to proving real-time sync works and validating core value ("feeling seen" after a guided conversation). Group sessions (3+), LLM-powered summaries, and freemium paywall are deferred to Phase 2+. The recommended approach assumes a 12-16 week MVP timeline with a small team leveraging existing JavaScript/TypeScript expertise and Firebase's free tier for launch.

**Key risks to mitigate early:** Real-time data loss in shared sessions (requires version tracking from Day 1), prompt ordering divergence between participants (demands server-side epoch versioning), emotion tag misclassification (needs manual override UX), and LLM cost explosion if summaries aren't gated/async (Phase 2+ concern). All are solvable with architectural discipline; ignored, they destroy user trust in an inherently intimate product.

---

## Key Findings

### Recommended Stack

The stack prioritizes **developer productivity, real-time reliability, and shipping speed** over premature optimization. React Native 0.84+ with New Architecture as default is production-ready (Fabric Renderer, Hermes engine), eliminating the "React Native is slow" concern that plagued earlier versions. TypeScript is non-negotiable for a multi-user, real-time application—static types prevent concurrency bugs.

**Core technology rationale:**

- **React Native 0.84+** — Default New Architecture, ~35% mobile market share, leverages existing team JS/TS expertise. Faster than native iOS+Android parallel development (12-16 weeks vs 6-12 months per platform).
- **Firebase (Firestore + Realtime DB)** — Handles real-time sync, offline persistence, and authentication out-of-the-box. Free tier (50K MAU) covers freemium launch. No backend to build—critical for fast MVP.
- **Zustand 5.x** — Lightweight state management for UI. Pairs perfectly with TanStack Query for server state. Eliminates Redux boilerplate that would slow iteration.
- **Tamagui 1.50+ + NativeWind 5.x** — Performance-focused styling. Tamagui's build-time compiler extracts styles at compile time (near-zero runtime overhead). NativeWind brings Tailwind consistency to mobile. Potential future code-sharing with Next.js web app.
- **TanStack Query 5.x** — Server state management with offline queueing, automatic deduplication, and cache invalidation. Essential for real-time sync reliability.

**What NOT to use:** NativeBase (deprecated 2023), Redux without Toolkit (overkill), raw WebSockets (unreliable on mobile networks), and AsyncStorage for complex state (too simple for multi-user sessions). See STACK.md for full alternatives matrix.

### Expected Features

**Must have (Table Stakes):**
- Solo conversation mode — Single user flows through 3-level prompt hierarchy (Perception → Connection → Reflection), records reflections.
- 1-on-1 shared session — Two users join same session, see same prompts in real-time, submit answers together. **Core validation** of real-time sync.
- Prompt flow (3 levels) — Sequentially surface prompts with skip/restart logic. Prompt versioning for future A/B testing.
- Journal/reflection capture — Store responses + metadata (timestamp, emotions, participants). Simple Firestore documents.
- Session history — Users view past conversations by date. Engagement driver.
- Emotion tagging — 5-8 predefined emoji tags (happy, sad, thoughtful, connected, etc.). Sentiment library suggests tags; users manually override.
- User authentication — Firebase Auth (email/password + Google/Apple sign-in). Session persistence.
- Offline support — Firebase offline persistence queues writes, syncs on reconnect. **Critical for mobile reliability.**

**Should have (Differentiators):**
- Real-time presence detection — Users see each other typing/responding live. Deepens emotional connection (if latency <100ms).
- End-of-session summary — Auto-generated reflection (rule-based in MVP, LLM-powered in Phase 2). Core to "feel seen" positioning.
- Emotion progression tracking — Graph showing emotional arc across session ("We went from guarded to vulnerable").
- Conversation deck curation — Decks tagged by context (work stress, relationships, grief). Freemium: free basic + premium specialty decks.
- Replay/relive sessions — Archive past conversations, optionally share highlights with friends (with moderation).

**Defer to v2+ (Post-MVP):**
- Group sessions (3+ users) — Complexity scales with user count. Start with 1-on-1 to validate sync.
- AI-powered summaries (LLM) — Requires API integration + cost management. Template-based summaries first.
- Prompt reminders — Requires notification scheduling + Cloud Functions. MVP focuses on user-initiated sessions.
- Freemium paywall (RevenueCat) — Implement entitlements after achieving user growth milestone.
- Video/voice call integration — Out of scope. Users can Zoom/FaceTime in parallel.
- Video-first mode — Core UX is async text prompts, not synchronous video.

**Anti-features explicitly avoided:**
- Multiplayer game mode — Conversation cards ≠ games. Gamification kills emotional intimacy.
- AI chatbot mode — Talking to AI ≠ talking to humans. Dilutes human connection value prop.
- Community-generated prompt marketplace — Moderation hell at scale. Stick with expert-curated decks.
- In-app DMs — Scope creep. Sessions provide structured conversation; users have SMS/iMessage for chat.
- Social feed — Reduces privacy comfort. App is intimate, not performative social media.

### Architecture Approach

**System architecture:** React Native app talks to Zustand for UI state and TanStack Query for server state. TanStack Query wraps Firebase SDK (Firestore for persistent data, Realtime DB for live presence). Local storage (AsyncStorage + Zustand persist) handles offline scenarios. Sentiment analysis runs client-side (npm: sentiment library) for low latency and privacy. Firebase Cloud Functions (Phase 2+) handles summaries, notifications, and analytics.

**Data flow priorities:**

1. **Solo session:** User → UI → Zustand SessionStore → TanStack Query mutation → Firebase write → local journal cache. Sentiment library suggests emotion tags on-device.
2. **Shared 1-on-1 session:** Both users subscribe to Firebase Realtime listeners. When User A submits response, both receive real-time update via listener. Presence detection shows "User B is typing." Prompt advances only after both submit (server-side validation required).
3. **Offline:** TanStack Query queues mutations locally. On reconnect, automatically retries with deduplication. Zustand persist middleware restores UI state on app restart.

**Critical patterns to follow:**
- **Zustand feature-based stores** (not monolithic global state) — sessionStore, userStore, journalStore, uiStore. Each store owns its mutations.
- **Firebase listeners with cleanup** — useEffect unsubscribes on component unmount (prevents memory leaks).
- **Server-side epoch versioning** — Each prompt level has version ID. Client validates before advancing (prevents desync).
- **Optimistic UI** — Show response immediately; sync in background. If conflict detected, merge both responses with metadata.

**Major components:**
1. **UI Layer (Tamagui screens)** — Solo Mode, Shared Session, Journal/History, Settings
2. **Zustand Stores** — SessionStore (current session state), UserStore (auth + preferences), JournalStore (cached entries), UIStore (navigation + theme)
3. **TanStack Query** — Fetch/mutation layer with cache invalidation
4. **Firebase SDK** — Real-time listeners, auth, offline persistence
5. **Sentiment Analysis** — Client-side emotion tag suggestion
6. **Local Storage** — AsyncStorage + Zustand persist for offline/recovery

### Critical Pitfalls

1. **Real-time sync data loss** — Users submit responses, network drops, Last-Write-Wins overwrites other user's answer. **Prevention:** Version tracking + custom conflict resolution + optimistic UI + server-side ACKs.

2. **Prompt ordering divergence in 1-on-1 sessions** — User A advances to Prompt 2, User B still on Prompt 1, UI breaks. **Prevention:** Server-side prompt advancement via Cloud Functions + Firestore Transactions + epoch versioning.

3. **Emotion tag misclassification ruins UX** — Sentiment library suggests "happy" for "my dog died," user loses trust. **Prevention:** Manual override option + confidence thresholding (>80%) + multi-model validation.

4. **Freemium paywall breaks emotional flow** — User mid-conversation, subscription expires, session paused. **Prevention:** Entitlement check at session start + grace period + offline-first paywall + visible labels.

5. **LLM cost explosion (Phase 2+)** — $0.01-0.05 per summary, 1000 users = $30-150/day, margins evaporate. **Prevention:** Rule-based summaries MVP + async/batch Phase 2 + cost monitoring + premium gating.

---

## Implications for Roadmap

Based on research, the recommended phase structure addresses dependencies and validates core assumptions early.

### Phase 1: MVP Foundation (Weeks 1-12)
**Rationale:** Establish real-time sync reliability and prove core value prop before adding complexity. Solo + 1-on-1 sessions are the clearest path to "feeling seen." Validates Firebase Realtime can handle latency requirements.

**Delivers:**
- Solo conversation mode (user flows through 3-level prompts, records reflections)
- 1-on-1 shared session with real-time sync (both users see same prompt, submit together)
- Journal view (past sessions by date)
- Emotion tagging with sentiment library suggestions + manual override
- Firebase Auth (email/password + Google sign-in)
- Offline support (Firebase offline persistence)
- End-of-session summary (rule-based, not LLM)

**Features from FEATURES.md:** Solo mode, 1-on-1 mode, prompt flow (3 levels), journal capture, session history, emotion tagging, authentication, offline support

**Addresses pitfalls from PITFALLS.md:**
- Real-time sync data loss → Implement optimistic UI + version tracking + server-side validation from Day 1
- Prompt ordering divergence → Server-side epoch versioning prevents UI desync
- Emotion tag misclassification → Manual override UX + confidence thresholding (only suggest if >80% confident)
- Offline queue accumulation → TanStack Query deduplication + rate limiting
- Security rules too permissive → Firebase rules: `allow read/write if request.auth.uid == resource.data.userId`

**Stack elements:** React Native 0.84+, Firebase (Auth + Firestore + Realtime DB), Zustand, TanStack Query, Tamagui, NativeWind, TypeScript, Axios, React Navigation, Sentiment library

**Critical success metric:** Shared session sync latency <500ms between users. If >500ms, real-time presence is broken.

**Research flags:** Load test Firebase with 100+ concurrent connections in Week 4. Validate sentiment library accuracy with user feedback. Pre-validate 1-on-1 UX with 2-3 person testing team.

---

### Phase 2: Scale Real-Time + Paywall (Weeks 13-20)
**Rationale:** Once 1-on-1 is stable, expand to group sessions (3+ users) and introduce revenue model. LLM summaries at scale require cost management, so defer until profitability validated.

**Delivers:**
- Group conversation sessions (3-8 users, concurrent presence)
- Server-side endpoint-to-endpoint consistency (Cloud Functions enforce prompt advancement)
- Conversation deck curation by context (work stress, relationships, grief)
- Emotion progression tracking (graph showing emotional arc)
- RevenueCat paywall integration (free basic + premium specialty decks)
- LLM-powered summaries (async, rate-limited, template fallback)

**Features from FEATURES.md:** Group mode, AI-assisted summaries, emotion progression, conversation deck curation, freemium paywall

**Addresses pitfalls from PITFALLS.md:**
- Prompt ordering divergence with 3+ users → Move prompt advancement to Cloud Functions (server-side source of truth)
- LLM cost explosion → Async summary generation + rate limiting + cost monitoring + template-based fallback for freemium
- Freemium paywall breaks emotional flow → Pre-session entitlement check + grace period for expired subscriptions
- Session expiration not implemented → Archive old sessions + TTL on Firestore documents

**Architecture evolution:** Cloud Functions for session orchestration. Session state machine (idle → active → completed). Presence detection with timeout.

**Research flags:** Group session concurrency testing. LLM cost modeling (cost per user, break-even on freemium conversion rate). Entitlement logic design (which features unlock at which tiers).

---

### Phase 3: Analytics + Integrations (Weeks 21-28)
**Rationale:** After proving product-market fit with paying users, build analytics, retention, and third-party integrations.

**Delivers:**
- Conversation analytics dashboard (personal: "12 conversations," "Most discussed topic: relationships")
- Prompt reminders (smart scheduling, local notifications)
- Session replay/archive (transcripts, moderation)
- Integrations with calendar/journaling apps (Apple Notes, Notion, Day One export)
- Accessibility improvements (screen reader support, large text)

**Features from FEATURES.md:** Conversation analytics, prompt reminders, replay/relive sessions, integrations, accessibility

**Addresses pitfalls from PITFALLS.md:**
- Privacy violations via emotion data → Anonymize + aggregate analytics + implement data retention policy
- Notification spam → User controls (frequency, timing) + opt-in by default + monitor opt-out rate
- Third-party API rate limits → Queue + exponential backoff + quota monitoring

**Research flags:** Privacy/GDPR compliance review. Third-party API rate limits. Accessibility testing with screen readers.

---

### Phase Ordering Rationale

1. **Phase 1 first:** Solo + 1-on-1 sessions validate real-time sync before adding group complexity. Proves core UX (user feels seen after conversation). Allows fast MVP launch to gather user feedback.
2. **Phase 2 follows:** Group sessions require server-side prompt orchestration (Cloud Functions). Freemium paywall enables revenue. LLM summaries require cost validation post-launch.
3. **Phase 3 late:** Analytics, reminders, integrations are retention + growth features. Secondary to core value prop validation.

**Dependency tree:**
- Phase 1 prerequisites: None (greenfield build)
- Phase 2 prerequisites: Phase 1 stable (sync proven reliable)
- Phase 3 prerequisites: Phase 2 monetization working (analytics makes sense with paying users)

---

### Research Flags

**Phases needing deeper research during planning:**

- **Phase 1 — Real-time sync reliability** — Load test Firebase Realtime with 100+ concurrent sessions. Research WebSocket fallback on flaky mobile networks. Validate offline queue behavior under network partition.
- **Phase 1 — Emotion tag accuracy** — Test sentiment library on 50+ real conversation responses. Validate 80%+ accuracy threshold is achievable. Design manual override UX.
- **Phase 2 — LLM cost model** — Calculate OpenAI/Anthropic cost per session. Model break-even on 5% freemium-to-premium conversion. Prototype template-based summaries as fallback.
- **Phase 2 — Group session concurrency** — Research Firebase Realtime limits for 3-8 concurrent users. Design state machine for prompt advancement atomicity.
- **Phase 3 — Privacy/GDPR compliance** — Research emotion data anonymization. Understand data retention requirements under EU law.

**Phases with standard patterns (skip deep research):**

- **Phase 1 — Authentication** — Firebase Auth email/password + social is standard, well-documented pattern. No research needed.
- **Phase 1 — State management** — Zustand + TanStack Query is established pattern for React Native. No research needed.
- **Phase 1 — UI components** — Tamagui is production-ready. No research needed.
- **Phase 1 — Navigation** — React Navigation 7.1+ is de facto standard. No research needed.
- **Phase 3 — Analytics** — Firebase Analytics is standard event tracking. No research needed.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| **Stack** | HIGH | React Native 0.84+ New Architecture is production-ready (verified via official RN docs, Feb 2026). Firebase pricing + offline persistence confirmed via official Firebase docs. Zustand + TanStack Query are established patterns with extensive community validation. |
| **Features** | HIGH | Table stakes (solo, 1-on-1, journal, auth) are standard for conversation apps. MVP recommendations align with standard mobile product sequencing (validate core before expanding). Freemium model matches industry standard (free tier = 2 decks, premium = 10+). |
| **Architecture** | MEDIUM-HIGH | System overview (Zustand + TanStack Query + Firebase) is standard pattern. Data flows for solo/shared/offline are well-documented. **Gap:** Group session concurrency (3+ users) is less documented in Firebase best practices—needs validation during Phase 2 planning. |
| **Pitfalls** | HIGH | Critical pitfalls (data loss, prompt desync, emotion misclassification) are real risks in real-time collaborative apps. Prevention strategies (version tracking, server-side validation, manual override) are established patterns. LLM cost explosion is known pitfall in AI products—Phase 2 research needed. |

**Overall confidence:** HIGH

The stack is production-ready, the feature sequencing is validated by similar products (Headspace, Couples+, Reflectly), and the architecture patterns are established. The main gaps are Phase 2-specific (group session scaling, LLM cost model, paywall UX) and Phase 3-specific (privacy/GDPR), which are appropriate to research deeper during respective phase planning.

### Gaps to Address

- **Firebase Realtime latency on mobile networks:** Needs validation during Week 4 Phase 1 planning. What's acceptable latency threshold? (<100ms ideal, <500ms acceptable?)
- **Emotion sentiment library on domain-specific language:** Phase 1 research needed. Real conversation responses may use context-dependent emotion language. Need to validate 80%+ accuracy or adjust strategy.
- **Group session prompt advancement atomicity:** Not addressed in Phase 1 research. Defer to Phase 2 planning—research how Cloud Functions coordinate 3+ concurrent users.
- **LLM cost model for freemium:** Phase 2 research. Need to model cost per user tier and break-even scenarios before committing to LLM summaries.
- **Privacy/GDPR compliance for emotion data:** Phase 3 research. Emotion tagging creates sensitive behavioral data. Need legal/compliance review before scaling beyond MVP.

---

## Sources

### Primary (HIGH confidence)
- React Native 0.76+ Release (official docs, Feb 2026) — New Architecture default, Fabric Renderer performance, Hermes engine
- Firebase Documentation (official, Jan 2026) — Real-time sync, offline persistence, security rules, pricing
- Zustand GitHub + Examples — State management patterns, TypeScript integration
- TanStack Query Documentation — Server state, cache invalidation, offline queueing
- React Navigation Docs (v7.1+) — Navigation patterns, deep linking
- Tamagui Performance Guide — Build-time compilation, React Native integration
- Freemium Mobile Paywall Best Practices (RevenueCAT guides) — Paywall timing, entitlements

### Secondary (MEDIUM confidence)
- Mobile App Real-time Collaboration Patterns (Ably, 2026) — Shared session UX, presence detection
- Offline-First Mobile Architecture (Medium, 2026) — Offline queue patterns, conflict resolution
- React Native Accessibility Guide — Screen reader, large text support
- Firebase Security Best Practices (official) — Security rules, data privacy

### Tertiary (MEDIUM-LOW, needs validation)
- Sentiment Analysis Library Performance (npm: sentiment, 2026) — AFINN-based accuracy claims (needs testing with real data)
- LLM Cost Modeling (OpenAI + Anthropic pricing, Feb 2026) — Cost per call estimates (needs Phase 2 validation)

---

*Research completed: 2026-02-18*
*Ready for roadmap creation: YES*

Summary synthesized from: STACK.md, FEATURES.md, ARCHITECTURE.md, PITFALLS.md
