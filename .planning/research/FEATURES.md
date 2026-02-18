# Feature Landscape: WNRS Companion

**Domain:** Real-time conversation/reflection mobile app with journaling
**Researched:** 2026-02-18
**Confidence:** HIGH

---

## Table Stakes

Features users expect in a conversation card game app. Missing any = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Solo conversation mode** | Card game apps exist for solo play. Users expect to use app alone. | Low | Single user flows through prompts, records reflections. Firebase auth + simple Firestore queries. |
| **1-on-1 conversation mode** | Core value prop. Two people having guided conversation through prompts together. | High | Real-time prompt synchronization, turn management, presence detection. Shared session state in Firestore. |
| **Group conversation mode (3-8 people)** | Conversation cards are social. Group hangouts = primary use case. | High | Multi-user session state, concurrent presence, conflict resolution for simultaneous answers. |
| **Prompt flow (3 levels)** | Conversation depth (Perception → Connection → Reflection). Already specified in requirements. | Medium | Each prompt surfaces sequentially. Skip/restart logic. Prompt versioning. |
| **Journal/reflection capture** | Recording answers to prompts for later review. | Low | Text input, timestamp, optional voice memo (Phase 2). Simple Firestore documents. |
| **Session history** | Users want to see past conversations they've had. Retention = engagement. | Low | Query Firestore by user + date. List view of past sessions. |
| **End-of-session summary** | Auto-generated reflection summary after conversation. | Medium | NLP to extract themes, generate prose. LLM call (or rule-based). Critical for "feel seen" positioning. |
| **Emotion tagging** | Label entries with mood (happy, sad, thoughtful, connected, etc.). | Low | 5-8 predefined emoji tags. Sentiment analysis library suggests tags. |
| **Offline support** | Mobile users lose connection—app must stay usable. | Medium | Firebase offline persistence. Queue writes, sync on reconnect. No custom backend. |
| **Cross-platform (iOS + Android)** | Standard mobile app expectation. | Low → High | React Native handles abstraction. Test on actual devices. |
| **User authentication** | Sign up, login, session persistence. | Low | Firebase Auth with email/password + social (Google, Apple). |

---

## Differentiators

Features that set WNRS Companion apart from competitors. Not expected, but highly valued if done well.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Shared live session (real-time presence)** | Users SEE each other typing/responding in real-time. Deepens emotional connection. | High | Presence detection (Firebase Realtime). Requires sub-100ms latency (not always guaranteed on mobile). |
| **Emotion progression tracking** | Graph showing emotional arc across a session. "We went from guarded to vulnerable." | Medium | Aggregate emotion tags over time. Historical emotion patterns. |
| **Prompt reminders (smart scheduling)** | Suggest conversations at optimal times (evenings, weekends, after stressful events). | Medium | Local notifications. Firebase Cloud Functions for server-side scheduling. |
| **Conversation deck curation by context** | "Decks for work stress," "Decks for relationships," "Decks for grief." Guided deck selection. | Medium | Deck taxonomy + AI recommendation. Freemium: free + premium specialty decks. |
| **AI-assisted reflection summaries** | LLM generates personalized, empathetic session summaries from user responses. | High | Integration with OpenAI / Anthropic API. Cost = bottleneck. Privacy concerns. |
| **Integrations with calendar/journaling apps** | Export session transcripts to Apple Notes, Notion, Day One journals. | Medium | Custom integrations or Zapier. User data export. |
| **Replay/relive sessions** | Users can re-read past conversations. Social: share highlights with friends. | Medium | Archive sessions with full transcript. Moderation for sensitive content. |
| **Guided follow-up sequences** | After a session, app suggests "follow-up conversation prompts" based on themes detected. | Medium | NLP topic extraction → rule-based prompt recommendation. |
| **Accessibility (screen reader, large text)** | Users with visual impairments can use app. Voice-first alternative UI. | High | React Native accessibility features. Test with TalkBack + VoiceOver. |
| **Conversation analytics (personal)** | Dashboard: "You've had 12 conversations," "Most discussed topic: relationships." | Medium | Aggregate Firestore queries. Firebase Cloud Functions compute stats. |

---

## Anti-Features

Explicitly do NOT build these. They distract from core value or create maintenance debt.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Video/video call integration** | Out of scope. Requires WebRTC. Users can voice call natively. | Focus on async text-based prompts. Users use Zoom/FaceTime in parallel. |
| **Multiplayer game mode** | Conversation cards ≠ games. Gamification kills emotional intimacy. | Keep focus on reflection, not competition. No points, leaderboards. |
| **AI chatbot mode** | Talking to AI ≠ talking to humans. Dilutes human connection value prop. | Do NOT build conversational AI partner. LLM use = summaries only. |
| **Marketplace for user-created prompts** | Community-generated content = moderation hell at scale. Dilutes curation quality. | Curated deck library only. Expert-written prompts. Community voting (Phase 3). |
| **In-app messaging (DMs)** | Conversation app already = async messaging. DM feature = scope creep. | Use in-app sessions for structured conversation. Users have SMS/iMessage. |
| **Social feed / activity stream** | Reduces privacy comfort. Users want intimate app, not performative social media. | No feeds, no public profiles. Private sessions only. |
| **AR/VR conversation mode** | Trendy but gimmicky. Mobile AR unreliable. Adds no value to prompts. | Keep UI minimal, warm, journal-like. Not flashy. |
| **Synchronous voice recording** | Voice = data storage cost, privacy concern, transcription liability. | Allow text-based + optional voice memo (Phase 2, off-device storage). |

---

## Feature Dependencies

```
Authentication (Firebase Auth) → All other features
├─ Solo mode
├─ Journaling
├─ Session history
├─ Emotion tagging
├─ Offline support (uses auth token)
└─ Freemium paywall

Real-time sync (Firebase Realtime) → Shared sessions
├─ 1-on-1 mode
├─ Group mode
├─ Live presence
└─ Shared cursor (stretch)

Session history → Session summary generation
├─ Emotion progression tracking
├─ Conversation analytics
└─ Replay/relive sessions

Emotion tagging → Emotion progression tracking
├─ Sentiment analysis (library)
└─ Personalized recommendations

Deck system → Prompt flow
├─ Conversation levels (Perception/Connection/Reflection)
└─ Premium deck paywall

End-of-session summary → (optional) LLM integration
```

---

## MVP Recommendation

**Phase 1 (MVP) — Weeks 1-12:**

Prioritize:
1. **Solo mode with prompt flow** — User creates a session, flows through 3 levels of prompts, captures reflections. Core feedback loop.
2. **1-on-1 shared session** — Two users join a shared session, see same prompt, submit answers, end session. Real-time sync testing.
3. **Basic journaling** — Session → responses stored in Firestore. Journal view shows past sessions.
4. **Emotion tagging** — 5-8 predefined mood tags. Sentiment library suggests tags (optional).
5. **Firebase Auth** — Simple email/password + Google sign-in. User persistence.

**Defer (Phase 2-3):**
- Group mode (3+) — Complexity scales with user count. Start with 1-on-1.
- AI-powered summaries — Requires LLM API + cost management. Basic rule-based summary first.
- Prompt reminders — Requires notification infrastructure.
- Emotion progression chart — Post-MVP nice-to-have.
- Replay/share — Moderation + privacy engineering needed.
- Freemium paywall → RevenueCat integration — After achieving user growth.

**Why this MVP:**
- Reduces complexity — Solo + 1-on-1 are clearest paths to core value.
- Validates real-time sync — 1-on-1 session proves Firebase Realtime works reliably.
- Fastest to emotional value — Users "feel seen" after first conversation + summary.
- Supports freemium launch — Free tier = solo + 1-on-1. Premium = premium decks (Phase 2).
- Testable — 2-3 person testing team can validate both flows.

---

## Assumptions & Risks

| Assumption | Risk | Mitigation |
|-----------|------|-----------|
| Users want async (text-only) not real-time video | Wrong = entire UX is video-first (Zoom-like). | User interviews (2-3 sessions) with target personas before Phase 1. |
| Firebase Realtime can handle 50+ concurrent sessions | Network latency, Firebase quotas. | Load test with 100 concurrent Firebase connections in Week 4. Have Supabase as backup plan. |
| Sentiment analysis library is accurate enough for emotion tagging | Misclassification = bad UX ("sad" marked "happy"). | Manual override for tags. Gather user feedback on accuracy post-MVP. |
| Users will share 1-on-1 sessions (not all solo) | If all solo, network effects fail. Feature becomes glorified diary. | Post-launch surveys: "Did you use 1-on-1? Why/why not?" |
| Freemium paywall works (users upgrade) | Free tier satisfies everyone. Premium decks never purchased. | Clear value differentiation in premium decks. Free tier = 2 basic decks. Premium = 10+ specialized decks. |

---

## Success Metrics

| Feature | Success Metric | Target |
|---------|---|---|
| **Authentication** | Signup completion rate | 70%+ complete signup without churn |
| **Solo mode** | Session completion rate | 80%+ users finish all 3 prompt levels |
| **1-on-1 shared session** | Sync latency | <500ms between user input & other user seeing update |
| **Emotion tagging** | Tag accuracy (user survey) | 80%+ users say tags feel accurate |
| **Session history** | Journal revisits | 40%+ users open journal in first week |
| **End-of-session summary** | User satisfaction | 7+/10 users found summary insightful |
| **Offline support** | App usability without network | Users can start sessions, capture responses without connection |
| **Freemium paywall** | Free→premium conversion | 5%+ of free users upgrade within 30 days |

---

## Sources

- [Real-time Collaboration UX Patterns](https://ably.com/topic/real-time-collaboration)
- [Mobile App Journaling Trends 2026](https://www.reflection.app/blog/best-journaling-apps)
- [Freemium Mobile Paywall Best Practices](https://www.revenuecat.com/docs/playbooks/guides/freemium)
- [Firebase Realtime Performance Limits](https://firebase.google.com/docs/database/usage/best-practices)
- [Accessibility in React Native](https://reactnative.dev/docs/accessibility)
