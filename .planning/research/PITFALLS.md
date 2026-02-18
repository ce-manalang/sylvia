# Domain Pitfalls: WNRS Companion

**Domain:** Real-time conversation/reflection mobile app with journaling
**Researched:** 2026-02-18
**Confidence:** HIGH

---

## Critical Pitfalls

Mistakes that cause rewrites or major issues. These will destroy user trust if ignored.

### Pitfall 1: Real-Time Sync Data Loss

**What goes wrong:** Users submit responses in a shared session. Network drops mid-sync. Later, Firebase receives conflicting data from both clients. Last-Write-Wins overwrites one user's answer. User loses data without realizing.

**Why it happens:**
- Firebase Realtime DB uses Last-Write-Wins by default (timestamp-based)
- No client-side verification that both users received ACK
- Offline persistence queues writes independently—no coordination between two devices
- App doesn't warn users about conflicts

**Consequences:**
- User trust destroyed ("my response disappeared!")
- Data integrity issues for analytics/summaries
- Support burden (users ask where their responses went)
- Potential breach of privacy (other user's response visible)

**Prevention:**
1. Implement optimistic UI: Show user's response immediately, sync in background
2. Add version tracking: Each response includes [userId, timestamp, version]
3. Custom conflict resolution: When conflict detected, preserve both responses with metadata (not destructive overwrite)
4. Server-side validation: Cloud Function verifies both users submitted before advancing prompt
5. Client-side ACKs: Don't show "submitted" until Firebase confirms write
6. Warn on offline: Display banner "Changes are offline—reconnect to sync"

**Detection:**
- Monitor Firebase write failures in Cloud Logging
- User feedback: "My response was missing"
- Version mismatch in Firestore documents

---

### Pitfall 2: Prompt Ordering Divergence in 1-on-1 Sessions

**What goes wrong:** User A advances to Prompt 2 (submits response to Prompt 1). Meanwhile, User B is still on Prompt 1. When User B submits, the shared session state shows conflicting prompt levels. One user sees Prompt 2, the other sees Prompt 1. UI breaks.

**Why it happens:**
- No server-side enforced turn order
- Firebase Realtime listeners fire asynchronously
- Prompt advancement logic lives on client (not authoritative)
- No optimistic locking or epoch versioning

**Consequences:**
- UI desync (users looking at different prompts)
- Frustration ("Why are we not on the same page?")
- Session becomes unusable, must restart
- Potential for data corruption (responses to wrong prompts)

**Prevention:**
1. Server-side prompt advancement: Use Cloud Function (not client) to advance prompt
2. Transaction-based model: Firebase Transactions ensure both users advance together
3. Epoch versioning: Each prompt level has epoch ID. Client can't advance without ACK
4. State validation: Before rendering prompt, verify both users are on same epoch
5. Atomic updates: Update prompt level + validate both users' responses in single Firestore transaction

**Detection:**
- Log mismatches between client & server prompt state
- Monitor Firebase transaction failures
- User reports: "We're not on the same prompt"

---

### Pitfall 3: Emotion Tag Misclassification Ruins UX

**What goes wrong:** Sentiment analysis library suggests "happy" for "I'm sad because my dog died." User gets wrong emotion tag. Looks insensitive. Ruins emotional intimacy ("This app doesn't understand me").

**Why it happens:**
- Simple AFINN-based sentiment looks at words in isolation
- Context-agnostic ("sad" + "dog" = negative, but library might flag "happy")
- Sarcasm ("That's great, just great" = sarcastic, but sentiment sees "great")
- Domain-specific language (conversation cards use emotionally complex language)

**Consequences:**
- Users distrust emotion tagging feature
- Tag-based analytics become unreliable
- Core value prop damaged ("help users feel seen" fails if tags are wrong)
- Support burden (users manually fix tags)

**Prevention:**
1. Always offer manual override: User can select emotion from picker (don't auto-apply)
2. Confidence thresholding: Only suggest tag if sentiment confidence > 80%
3. Multi-model validation: Use both AFINN + ML model for disagreement detection
4. Domain-specific training: Fine-tune sentiment on conversation card responses
5. Disable for ambiguous cases: Show picker instead of suggestion if confidence < 60%
6. Gather feedback: Post-session: "Was this emotion accurate?" (collect training data)

**Detection:**
- User clicks override >30% of time (suggests low accuracy)
- Sentiment analysis service logs confidence scores
- Post-session surveys on emotion tag accuracy

---

### Pitfall 4: Freemium Paywall Breaks Emotional Flow

**What goes wrong:** User is in the middle of a shared session. Server-side check discovers user's premium subscription expired. Session is paused/blocked. User is confused/frustrated (mid-conversation can't continue).

**Why it happens:**
- Paywall enforcement done at prompt load time (too late)
- No pre-session entitlement check
- Premium feature discovered mid-session, not at entry
- User didn't know they had premium (or subscription lapsed)

**Consequences:**
- Session killed mid-conversation
- User frustration (emotional moment interrupted)
- Support escalations
- Churn (users feel tricked)

**Prevention:**
1. Entitlement checks at session start: Check subscription before creating session
2. Grace period: Allow session to complete even if subscription just expired
3. Visible entitlements: Show "free deck" vs "premium deck" labels before session start
4. Pricing transparency: Clear freemium feature list (what's free vs paid)
5. Subscription status in app: Show when subscription expires, allow easy renewal
6. Offline-first paywall: Cache entitlements locally so sessions work if RevenueCat API down

**Detection:**
- Monitor session creation failures due to entitlement
- User complaints: "Session was blocked"
- Analytics: Users with expired subscriptions attempting to create sessions

---

### Pitfall 5: LLM Cost Explosion on Session Summaries (Phase 2+)

**What goes wrong:** Every session triggers LLM API call to generate summary. At $0.01-0.05 per call, 1000 active users = $30-150/day in LLM costs. Margins evaporate. Budget explodes.

**Why it happens:**
- No rate limiting on LLM calls
- Summary generated immediately after session (synchronous)
- No caching or deduplication
- Premium users get summaries, freemium get basic summaries (cost per tier not monitored)

**Consequences:**
- LLM costs exceed revenue
- Business model doesn't work
- Forced to disable summaries or add paywall (bad UX)
- Company burns cash

**Prevention:**
1. Async summary generation: Queue summaries, batch process during off-peak hours
2. Rate limiting: Max 1 summary per user per day (or charge for summaries)
3. Cost monitoring: Alert if daily LLM spend > $X
4. Caching: Cache identical session responses → identical summaries (dedup)
5. Template-based summaries (MVP): Rule-based summaries (no LLM) until profitability proven
6. Premium gating: Only premium tier gets LLM summaries (freemium gets template summaries)
7. Sampling: Generate summaries for only 10% of sessions until cost model validated

**Detection:**
- Monitor LLM API costs weekly
- Calculate cost per session
- Compare LLM cost to freemium revenue
- Set budget alerts in OpenAI/Anthropic console

---

## Moderate Pitfalls

### Pitfall 1: Offline Queue Accumulation

**What goes wrong:** User goes offline, submits 10 responses over 1 hour. App queues them all. When network returns, all 10 are sent at once, overwhelming server or causing duplicate processing.

**Prevention:**
- TanStack Query automatically deduplicates mutations by key
- Implement rate limiting: Queue max 5 mutations at a time
- Manual retry logic: Show "syncing (5 pending)" to user
- Batch mutation: Combine responses into single Firebase write

### Pitfall 2: Firebase Security Rules Too Permissive

**What goes wrong:** Security rules allow users to read other users' sessions. Privacy breach. GDPR violation.

**Prevention:**
- Default deny: Allow only authenticated users to read their own data
- Implement: `allow read/write if request.auth.uid == resource.data.userId`
- Test rules: Use Firebase Emulator to test permission boundaries
- Regular audit: Review rules quarterly

### Pitfall 3: No Rate Limiting on Session Creation

**What goes wrong:** Bot or spammy user creates 10,000 sessions. Firestore quota exceeded. App stops working for real users.

**Prevention:**
- Cloud Function: Validate user can create max 100 sessions/day
- Implement: Check `lastSessionCreatedAt` + time delta
- Alert on unusual activity: Monitor session creation spike
- Firestore quota alerts

### Pitfall 4: Session Expiration Not Implemented

**What goes wrong:** Old sessions are never deleted. Firestore storage grows unbounded. Costs exceed projections.

**Prevention:**
- Archive policy: Move sessions >30 days old to Cloud Archive Storage
- TTL (Time-To-Live): Set Firestore documents to auto-delete after 1 year
- Cloud Function: Scheduled job to clean up old sessions monthly
- Cost monitoring: Track Firestore storage size

### Pitfall 5: Notification Spam in Phase 2

**What goes wrong:** Reminder feature sends 5 notifications/day. Users mute app. Feature becomes useless.

**Prevention:**
- User controls: Allow users to set reminder frequency (default: 1x/week)
- Smart timing: Send reminders during evening hours, not morning
- Opt-in by default: Reminders are disabled until user enables
- Monitor opt-out rate: If >50% disable, feature is poorly designed

---

## Minor Pitfalls

### Pitfall 1: Sentiment Analysis Library Not Updated

**What goes wrong:** App ships with old version of `sentiment` npm package. Known vulnerability (XSS, prototype pollution). Security issue.

**Prevention:**
- Dependency audits: Run `npm audit` before every release
- Automated updates: Use Dependabot to get security alerts
- Version pinning: Lock non-security updates, auto-patch security

### Pitfall 2: Poor Navigation State Management

**What goes wrong:** User is deep in navigation stack (Journal → Entry → Edit). Network error. User taps back. Navigation state is corrupted. App crashes.

**Prevention:**
- Use React Navigation's state persistence
- Test navigation error boundaries
- Implement error recovery screen

### Pitfall 3: Accessibility Overlooked

**What goes wrong:** App is unusable with screen readers. Blind users complain. App excluded from community.

**Prevention:**
- Test with TalkBack (Android) + VoiceOver (iOS) early
- Use React Native `accessible` + `accessibilityLabel` props
- Regular accessibility audits (Phase 2+)

### Pitfall 4: No Session Timeout

**What goes wrong:** User logs in, doesn't interact with app for 24 hours. Session token expires. User navigates back, app crashes (token invalid).

**Prevention:**
- Implement token refresh: Before token expires, refresh silently
- Session timeout UI: Warn user before logout ("Your session expires in 5 mins")
- Error boundary: Gracefully show login screen if token invalid

### Pitfall 5: Unhandled Firebase Quota Errors

**What goes wrong:** App hit Firestore read quota. Firebase returns 429 error. App doesn't handle it. UI breaks silently.

**Prevention:**
- Error handling: TanStack Query retries with exponential backoff
- User feedback: Show "Service busy, please try again in 30s"
- Monitoring: Alert if quota errors spike

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| **Phase 1: Real-time sync** | Conflicting writes in shared sessions | Implement version tracking + custom conflict resolution from day 1 |
| **Phase 1: Offline** | Data loss if app crashes during sync | Use TanStack Query persist middleware + Firestore offline persistence |
| **Phase 1: Authentication** | Token expiry mid-session | Implement silent token refresh before expiry |
| **Phase 2: Group sessions** | Prompt ordering divergence with 3+ users | Move prompt logic to Cloud Functions (server-side source of truth) |
| **Phase 2: LLM summaries** | Cost explosion | Start with rule-based summaries, add LLM in Phase 3 after profitability validated |
| **Phase 2: Paywall** | Freemium feature discovery mid-session | Pre-session entitlement check, grace period for expired subscriptions |
| **Phase 3: Analytics** | Privacy violations via emotion data | Anonymize + aggregate before storing, implement data retention policy |
| **Phase 3: Integrations** | Third-party API rate limits | Implement queue + backoff, monitor for API quota issues |

---

## Root Cause Analysis Framework

When bugs occur, ask:

1. **Data Loss?** → Version tracking? Conflict resolution strategy? Offline queue?
2. **Sync issues?** → Real-time listeners unsubscribed? TanStack Query cache invalidated?
3. **UX broken?** → Navigation state persisted? Error boundaries in place?
4. **Cost spike?** → LLM calls? Storage growth? Quota limits?
5. **Security?** → Firebase rules too open? Tokens managed securely? PII encrypted?

---

## Sources

- [Firebase Security & Best Practices](https://firebase.google.com/docs/database/security)
- [Offline-First Sync Patterns](https://medium.com/@therahulpahuja/5-critical-components-for-implementing-a-successful-offline-first-strategy-in-mobile-applications-849a6e1c5d57)
- [Conflict Resolution Strategies](https://www.adalo.com/posts/offline-vs-real-time-sync-managing-data-conflicts)
- [TanStack Query Error Handling](https://tanstack.com/query/latest/docs/react/guides/important-defaults)
- [React Native Error Boundaries](https://reactnative.dev/docs/error-boundaries)
