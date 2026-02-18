# Architecture Patterns: WNRS Companion

**Domain:** Real-time conversation/reflection mobile app with journaling
**Researched:** 2026-02-18
**Confidence:** MEDIUM-HIGH

---

## Recommended Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     React Native App (iOS/Android)           │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │             UI Layer (Tamagui Components)             │   │
│  │  - Solo Mode Screen                                 │   │
│  │  - Shared Session Screen                            │   │
│  │  - Journal / History                                │   │
│  │  - Settings / Profile                               │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↕                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         State Management (Zustand Stores)            │   │
│  │  - SessionStore (solo/shared)                       │   │
│  │  - UserStore (auth, preferences)                    │   │
│  │  - JournalStore (cached entries)                    │   │
│  │  - UIStore (navigation, theme)                      │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↕                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │      Data Layer (TanStack Query + Firebase SDK)      │   │
│  │  - Query: Fetch prompts, journals, past sessions   │   │
│  │  - Mutation: Submit responses, create sessions      │   │
│  │  - Subscription: Firebase Realtime listeners        │   │
│  │  - Cache: TanStack Query deduplication & sync       │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↕                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │      Local Storage (Zustand + AsyncStorage)          │   │
│  │  - Offline prompt queue                             │   │
│  │  - User session state (if network down)             │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
           ↕                                      ↕
      Firebase SDK                        Sentiment Analysis
      (Realtime DB                         (Offline JavaScript)
       + Firestore                         npm: sentiment 5.0)
       + Auth)                                    
           ↕                                      
┌─────────────────────────────────────────────────────────────┐
│                        Firebase Backend                      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │  Authentication  │  │  Firestore    │  │  Realtime DB   │  │
│  │  (email/social)  │  │  (user data,  │  │  (live sessions)  │  │
│  │                  │  │   journals)   │  │  (presence)    │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │     Cloud Functions (Phase 2+)                       │  │
│  │  - Generate end-of-session summaries (LLM calls)    │  │
│  │  - Compute emotion statistics                       │  │
│  │  - Send scheduled reminders                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │     Storage (Phase 2+)                              │  │
│  │  - Voice memos (if implemented)                     │  │
│  │  - Media files                                      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Boundaries

| Component | Responsibility | Communicates With | Data Flow |
|-----------|---------------|-------------------|-----------|
| **UI Layer (Screens)** | Render UI, handle user input, navigate between screens | Zustand stores, React Navigation | Reads state from Zustand, dispatches actions |
| **Zustand Stores** | Manage app state: sessions, user data, cache, UI state | TanStack Query, UI screens, local storage | Receives data from Query layer, triggers mutations |
| **TanStack Query** | Fetch remote data, manage cache, deduplication, sync | Firebase SDK, Zustand stores | Provides data to Zustand, triggers Firebase calls |
| **Firebase SDK** | Real-time listeners, auth tokens, offline persistence | Firestore, Realtime DB, Auth | Syncs with backend, handles offline queueing |
| **Local Storage** | Persist app state (user tokens, offline queue) | Zustand, AsyncStorage | Loaded on app boot, updated on state changes |
| **Sentiment Analysis** | Suggest emotion tags from text responses | UI screens, Zustand | Client-side only, no network |

---

## Data Flow

### Solo Session Flow

```
1. User taps "Start Solo Session"
2. UI calls SessionStore.createSession(userId, deckId)
3. SessionStore dispatches TanStack Query mutation
4. Query calls Firebase.createSession(docPath)
5. Firebase writes to Firestore, returns sessionId
6. SessionStore stores sessionId in Zustand
7. UI navigates to SessionScreen
8. UI displays prompt for Level 1
9. User types response, taps "Continue"
10. UI calls SessionStore.submitResponse(response)
11. SessionStore dispatches mutation to Firebase
12. Firebase persists response, returns next prompt
13. Sentiment analysis suggests emotion tag (client-side)
14. UI displays emotion tag picker
15. User selects emotion, taps "Next Prompt"
16. Repeat steps 10-15 for Levels 2 & 3
17. After Level 3 response, UI calls SessionStore.endSession()
18. Firebase generates summary (Phase 2+), updates session status
19. UI displays summary, option to save to journal
20. User can swipe to journal view, see this session saved
```

### 1-on-1 Shared Session Flow

```
1. User A taps "Start Shared Session", generates invite link
2. UI calls SessionStore.createSharedSession(userId, deckId)
3. Firebase creates session document, enables real-time listeners
4. SessionStore subscribes to Firebase Realtime listener
5. Zustand store updates with sessionId + join code
6. User B opens app, enters join code
7. UI calls SessionStore.joinSharedSession(joinCode)
8. Firebase adds User B to session.participants array
9. Firebase Realtime listener fires on both clients
10. Both UIs display "Waiting for participant" → "Ready to start"
11. User A taps "Start Conversation"
12. Firebase Realtime updates session.status = "active", publishes prompt
13. Both clients' listeners fire, update UI with same prompt
14. User A submits response first
15. Firebase updates session.responses[userId] = response
16. User B's listener fires, shows "User A has answered" (real-time presence)
17. User B submits response
18. Firebase updates session.responses[userId] = response
19. User A's listener fires, shows "User B has answered"
20. When both submitted, prompt advances (Level 1 → Level 2)
21. Repeat for all 3 levels
22. After Level 3, Firebase triggers Cloud Function for summary (Phase 2+)
23. Summary appears in real-time to both users
24. Session auto-saves to both journals
```

### Offline Sync Flow

```
1. User is in session, network drops
2. User continues typing responses
3. UI still shows prompts (cached from Zustand)
4. User submits response
5. TanStack Query fails to send to Firebase
6. Query stores mutation in offline queue (TanStack persistence)
7. Zustand updates local state optimistically
8. UI shows checkmark (submitted locally)
9. User navigates back, app is fully functional
10. Network reconnects
11. TanStack Query automatically retries queued mutations
12. Firebase receives & processes responses
13. Zustand syncs with Firebase via Realtime listeners
14. UI reflects any conflicts (rare in solo mode, handled by Last-Write-Wins)
15. All responses saved to journal
```

---

## Patterns to Follow

### Pattern 1: Zustand Store Architecture

**What:** Split state into feature-based stores, not monolithic global store.

**When:** Every feature (sessions, journal, user, UI).

**Example:**

```typescript
// src/store/sessionStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SessionState {
  currentSessionId: string | null;
  sessionStatus: 'idle' | 'active' | 'completed';
  currentPromptIndex: number;
  responses: Record<string, string>; // promptId → response
  participants: string[];
  emotions: Record<string, string>; // promptId → emotion
  
  // Actions
  createSession: (userId: string, deckId: string) => Promise<void>;
  submitResponse: (promptId: string, response: string) => Promise<void>;
  setEmotion: (promptId: string, emotion: string) => void;
  endSession: () => Promise<void>;
  reset: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentSessionId: null,
      sessionStatus: 'idle',
      currentPromptIndex: 0,
      responses: {},
      participants: [],
      emotions: {},

      // Actions with Firebase integration
      createSession: async (userId, deckId) => {
        const docRef = await firebase.createSessionDoc({
          userId,
          deckId,
          createdAt: new Date(),
        });
        set({ 
          currentSessionId: docRef.id,
          sessionStatus: 'active',
        });
      },

      submitResponse: async (promptId, response) => {
        const { currentSessionId } = get();
        await firebase.updateResponse(currentSessionId, promptId, response);
        set((state) => ({
          responses: { ...state.responses, [promptId]: response },
        }));
      },

      setEmotion: (promptId, emotion) => {
        set((state) => ({
          emotions: { ...state.emotions, [promptId]: emotion },
        }));
      },

      endSession: async () => {
        const { currentSessionId, responses, emotions } = get();
        await firebase.endSession(currentSessionId, { responses, emotions });
        set({ sessionStatus: 'completed' });
      },

      reset: () => {
        set({
          currentSessionId: null,
          sessionStatus: 'idle',
          currentPromptIndex: 0,
          responses: {},
          participants: [],
          emotions: {},
        });
      },
    }),
    {
      name: 'session-storage',
      partialize: (state) => ({
        responses: state.responses,
        emotions: state.emotions,
      }),
    }
  )
);
```

### Pattern 2: Firebase Real-time Listeners in React

**What:** Subscribe to Firestore/Realtime DB in useEffect, unsubscribe on cleanup.

**When:** Displaying live data (shared sessions, presence, journal updates).

**Example:**

```typescript
// src/hooks/useSharedSession.ts
import { useEffect, useState } from 'react';
import { useSessionStore } from '../store/sessionStore';
import { firebase } from '../services/firebase';

export const useSharedSession = (sessionId: string) => {
  const [sessionData, setSessionData] = useState(null);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    if (!sessionId) return;

    // Subscribe to session changes
    const unsubscribeSession = firebase.db
      .ref(`sessions/${sessionId}`)
      .on('value', (snapshot) => {
        if (snapshot.exists()) {
          setSessionData(snapshot.val());
        }
      });

    // Subscribe to participant presence
    const unsubscribePresence = firebase.db
      .ref(`sessions/${sessionId}/presence`)
      .on('child_changed', (snapshot) => {
        setParticipants((prev) => {
          const updated = [...prev];
          const idx = updated.findIndex((p) => p.userId === snapshot.key);
          if (idx >= 0) {
            updated[idx] = { ...updated[idx], ...snapshot.val() };
          }
          return updated;
        });
      });

    return () => {
      unsubscribeSession();
      unsubscribePresence();
    };
  }, [sessionId]);

  return { sessionData, participants };
};
```

### Pattern 3: TanStack Query for Server State

**What:** Use Query for fetching, Mutation for updates, automatic cache invalidation.

**When:** Fetch journal history, past sessions, user profile.

**Example:**

```typescript
// src/hooks/useJournalEntries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { firebase } from '../services/firebase';

export const useJournalEntries = (userId: string) => {
  return useQuery({
    queryKey: ['journal', userId],
    queryFn: async () => {
      const snapshot = await firebase.db
        .collection('journals')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(50)
        .get();

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAddJournalEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry) => {
      const docRef = await firebase.db.collection('journals').add({
        ...entry,
        createdAt: new Date(),
      });
      return docRef.id;
    },
    onSuccess: (entryId, entry) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['journal'] });
    },
  });
};
```

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Redux for Simple Apps

**What:** Using Redux with dozens of boilerplate files for app state.

**Why bad:** Overkill. Boilerplate > business logic. Debugging is slow.

**Instead:** Use Zustand + TanStack Query. Store handles UI state, Query handles server state. Minimal boilerplate.

### Anti-Pattern 2: Raw Firebase Calls Everywhere

**What:** Calling Firebase SDK directly in components.

**Why bad:** Hard to test. Duplicate logic. Cache misses. No deduplication.

**Instead:** Wrap Firebase in services (firebase.ts), use TanStack Query to manage requests.

### Anti-Pattern 3: Storing Server State in Zustand

**What:** Fetching user data and storing it in Zustand store directly.

**Why bad:** Out-of-sync issues. Manual cache invalidation. Race conditions.

**Instead:** Use TanStack Query for server data, Zustand for UI state only.

### Anti-Pattern 4: Real-time Listeners Without Cleanup

**What:** Subscribing to Firebase Realtime without unsubscribing.

**Why bad:** Memory leaks. Multiple listeners accumulate. App crashes over time.

**Instead:** Use useEffect cleanup function. Always call unsubscribe().

### Anti-Pattern 5: No Offline Queue

**What:** Assuming network is always available.

**Why bad:** User experience breaks on flaky mobile networks.

**Instead:** TanStack Query + persist middleware automatically queues mutations offline.

---

## Scalability Considerations

| Concern | At 100 Users | At 10K Users | At 1M Users |
|---------|--------------|--------------|-------------|
| **Session concurrency** | Single session server load ~1MB memory. | Scale Firebase to 50+ concurrent sessions. Realtime listeners stable. | Implement session sharding by geography. Firebase auto-scales if security rules permit. |
| **Journal storage** | ~100 * 50 entries = 5K documents. Firestore free tier sufficient. | ~500K documents. Firestore efficient with indexes. | ~50M documents. Archive old sessions to Coldline storage. Implement pagination. |
| **Authentication** | Firebase free tier (50K MAU) is fine. | Firebase paid tier (~$125/mo for 100K MAU). | Implement custom auth server if costs exceed business model ROI. |
| **Real-time listeners** | TanStack Query deduplication prevents listener spam. | Load test with 100+ concurrent listeners. Firebase connection pooling should handle it. | Implement listener sampling. Only subscribe to current session, not all history. |
| **Emotion tagging (sentiment analysis)** | Sentiment library 10ms per response. No issues. | Still client-side, no server cost. | Keep it client-side. No scaling needed. |
| **Session summaries (LLM)** | ~$0.01 per summary (if using OpenAI). 100 sessions = $1/day. | ~$100/day for 10K active sessions. Implement rate limiting, batch summarization. | Implement async summary generation. Queue summaries during off-peak hours. Use cached summaries for historical views. |
| **Emoji/emotion tagging** | No backend needed. Client-side library. | Still client-side. | No change. |
| **Freemium paywall** | RevenueCat free tier (unlimited). | RevenueCat $99/mo tier. Handles entitlements at scale. | RevenueCat Enterprise plan. Implement custom entitlement logic if needed. |

---

## Security & Privacy

### MVP Phase 1

- Firebase Security Rules: Users can only read/write their own sessions
- Auth tokens in secure storage (React Native Keychain)
- HTTPS only (Firebase default)
- No PII in logs
- User deletion = soft delete (data retained for analytics, not accessed)

### Phase 2+

- End-to-end encryption for shared sessions (TweetNaCl.js or similar)
- GDPR compliance: export user data, right to deletion
- Privacy policy & consent flows
- Third-party audit of data handling
- Implement rate limiting (prevent abuse of LLM summaries)

---

## Sources

- [Firebase Realtime Database Design Patterns](https://firebase.google.com/docs/database/usage/best-practices)
- [TanStack Query Documentation](https://tanstack.com/query/latest/docs/react/overview)
- [Zustand GitHub + Examples](https://github.com/pmndrs/zustand)
- [React Native Architecture Best Practices](https://reactnative.dev/docs/architecture)
- [Offline-First Mobile Apps 2026](https://medium.com/@therahulpahuja/5-critical-components-for-implementing-a-successful-offline-first-strategy-in-mobile-applications-849a6e1c5d57)
