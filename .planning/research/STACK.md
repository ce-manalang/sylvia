# Technology Stack: WNRS Companion

**Project:** WNRS Companion — conversation/reflection mobile app with real-time shared sessions
**Researched:** 2026-02-18
**Confidence:** HIGH

---

## Recommended Stack

### Core Mobile Framework

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **React Native** | 0.84.0+ | Cross-platform iOS & Android development | As of Feb 2026, React Native 0.76+ ships with New Architecture as default, delivering near-native performance with Fabric Renderer. Ecosystem dominates ~35% of cross-platform market share (vs Flutter 46%). Better tooling maturity for Web-first teams leveraging existing Next.js codebase. Existing JavaScript/TypeScript expertise reduces ramp-up. Hermes engine (default) reduces startup time & memory usage. |
| **TypeScript** | 5.x+ | Type-safe JavaScript development | Industry standard for React Native 2026. First-class integration in React Native 0.76+. Prevents runtime errors common in conversational UI with complex state. Essential for team onboarding and long-term maintainability with shared sessions feature. |
| **Expo** | SDK 52+ | Development framework & build tooling | While React Native works standalone, Expo 52+ handles iOS/Android SDK management, EAS Build (cloud builds), and fast development iteration. Not required but dramatically reduces setup complexity. Use if speed to MVP is prioritized; skip if full native control needed. |

### Backend & Real-Time

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Firebase Realtime Database** OR **Supabase** | Latest | Sync engine for shared sessions | **Choice: Firebase Realtime Database** for MVP. Firebase's offline-first capabilities are superior—critical for a journaling app that must work unreliably. Native real-time sync via Firestore/Realtime DB. Generous free tier (50k MAUs) suits early freemium adoption. Supabase is alternative if you prefer SQL/PostgreSQL and self-hosting. |
| **Firebase Authentication** | Latest | User auth & session management | Built-in to Firebase ecosystem. Free tier supports email/password, Google, Apple, anonymous auth—sufficient for launch. 50k MAU free tier covers freemium growth phase. No migration needed if staying Firebase. |
| **Socket.IO** OR **Native WebSockets** | 4.7.2+ | Real-time event sync for shared sessions | Use **Socket.IO** if building custom backend. Use **native Firebase Realtime listeners** if fully Firebase-based. Socket.IO adds ~41kB but provides automatic reconnection, fallback to HTTP polling (important for mobile networks), and acknowledgement callbacks. Skip if Firebase Realtime DB fully covers sync patterns. |

### Database & State

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Firebase Realtime Database** OR **Cloud Firestore** | Latest | Persistent user data (journeys, prompts, reflections) | **Recommendation: Cloud Firestore** over Realtime Database—better for structured data, superior offline support via offline persistence mode, query flexibility for emotion-tagged entries. NoSQL is appropriate for conversation flow variations. Real-time listeners sync across devices. |
| **Zustand** | 5.x+ | Local state management (UI, session state) | Lightweight alternative to Redux for this project scale. Hook-based API eliminates boilerplate. Built-in persist middleware for offline state. Better DX for real-time UI updates on shared sessions than Redux. Minimal bundle impact (~2.8kB). |

### UI & Styling

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **React Native Paper** OR **Tamagui** | Latest | Cross-platform UI components | **Choice: Tamagui 1.50+** for production quality. Performance-focused compiler extracts styles at build time (near-zero runtime). Single codebase UI for iOS/Android. If sharing web code from Next.js, Tamagui's unified styling across React/React Native is advantage. Alternative: React Native Paper (more conservative, mature ecosystem). Avoid NativeBase (deprecated 2023, succeeded by Gluestack). |
| **NativeWind** | 5.x+ | Tailwind CSS for React Native | Brings Tailwind utility classes to mobile. Compiles to native StyleSheet at build time. Consistent with existing Next.js codebase's Tailwind usage. Allows developers to use same mental model web→mobile. Optional: use with Tamagui or standalone. |
| **Lucide React Native** | Latest | Icon library | Already in Next.js stack, works in React Native via lucide-react/native. Consistent design language across platforms. |

### Networking & HTTP

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Axios** | 1.7.x+ | HTTP client for REST APIs | Superior error handling & interceptors vs Fetch API. Auto-retry on network timeouts (critical for mobile). Automatic JSON parsing. Platform-specific handling (cookies, headers) works reliably on iOS/Android. Alternative: Use built-in Fetch + custom error wrapper if bundle size critical. |
| **TanStack Query (React Query)** | 5.x+ | Server state management & caching | Handles offline/online sync elegantly. Automatic request deduplication & cache invalidation. Background refetching during reconnection. Pairs well with Zustand for UI state. Optional but highly recommended for reliability. |

### Navigation

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **React Navigation** | 7.1.x+ | Screen routing & stack management | De facto standard for React Native. Latest version (7.1.28) uses static configuration API (better TypeScript support). Supports stack, tab, drawer navigation patterns. Deep linking support for shared sessions links. |

### Real-Time Sync & Conflict Resolution

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Firebase Realtime Listeners** | Latest | Bidirectional sync | Native Firebase listeners handle real-time updates for shared sessions. Offline persistence via `keepSynced()` queues writes locally, syncs on reconnect. Handles "Last Write Wins" conflict resolution by default. |
| **Custom Conflict Resolution** | — | Multi-user session conflicts | Implement Last-Write-Wins for simple cases (emotion tags, journal entries). Custom merge logic for complex shared prompts—Firebase Transactions can enforce consistency. Consider document-level versioning if conflicts frequent. |

### Authentication & Payments

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Firebase Auth** | Latest | User identity | Covered above. Integrates seamlessly with Firestore. |
| **RevenueCat** | Latest | Freemium paywall & subscription management | Abstracts Apple/Google IAP complexity. Handles subscription entitlements (which decks user can access). Free tier supports basic entitlements. Alternative: Raw Stripe Billing + custom entitlement logic (more work, more control). |

### Emotion & Sentiment Analysis

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Sentiment** (npm) | 5.0.0+ | Lightweight text sentiment scoring | AFINN-based sentiment analysis (does not require ML backend). Works offline on-device. Sufficient for emotion tag suggestions (happy/sad/thoughtful detection). ~10kB library. |
| **Natural** (npm) | 6.x+ | Advanced NLP (optional) | If implementing more sophisticated emotion pattern detection later. Supports tokenization, stemming, classification. Heavier (~2MB) but entirely client-side. Skip for MVP. |

### Development Tools

| Tool | Version | Purpose | Notes |
|------|---------|---------|-------|
| **Metro** | 0.80.11+ | React Native bundler | React Native 0.76+ ships with Metro 0.80.11—15x faster build performance. No additional config needed. |
| **Jest** | 29.7.0+ | Unit testing | Configured in existing Next.js setup. Works for React Native logic tests. Pair with `@testing-library/react-native` for component testing. |
| **Detox** | 20.x+ | E2E testing for React Native | Optional. Enables testing shared session real-time sync end-to-end. Skip for MVP, add in Phase 2. |
| **Xcode** | 15.x+ | iOS build & simulator | Required for iOS development. Xcode 15+ required for iOS 17+ support. |
| **Android Studio** | Latest | Android build & emulator | Required for Android development. Ensure SDK 35+ installed for latest Android version support. |

---

## Installation

```bash
# Core React Native with TypeScript
npx create-expo-app@latest wnrs-companion --template
cd wnrs-companion

# Or use bare React Native
# npx react-native@latest init WNRSCompanion --template

# Firebase & real-time
npm install firebase@latest

# State management
npm install zustand

# UI framework & styling
npm install tamagui @react-native-async-storage/async-storage
npm install nativewind tailwindcss

# Navigation
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack
npm install react-native-screens react-native-safe-area-context

# HTTP & data fetching
npm install axios @tanstack/react-query

# Sentiment analysis (optional for MVP)
npm install sentiment

# Payments
npm install @react-native-iap/react-native-iap

# Icons & UI components
npm install lucide-react-native react-native-svg

# Forms & validation
npm install react-hook-form zod @hookform/resolvers

# Dev dependencies
npm install -D typescript @types/react @types/react-native jest @testing-library/react-native
```

### For Existing Next.js Codebase Sharing

If sharing code between web (Next.js) and mobile, add Monorepo structure:

```bash
# Root monorepo
npm install -D turbo

# Directory structure:
# ├── apps/web (Next.js 15.2.4)
# ├── apps/mobile (React Native 0.84+)
# └── packages/shared (TypeScript utilities, types, schemas)
```

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| **React Native** | **Flutter** | If team has Dart expertise or needs maximum performance (Flutter 46% market share, slightly faster). Switch if iOS build times become critical bottleneck. Flutter also offers desktop (Web/Windows/macOS) in one codebase—useful if expanding. |
| **React Native** | **Native iOS+Android** | Only if needing: (1) maximum native performance, (2) access to unstable platform APIs, (3) team with native expertise. Not recommended for MVP timeline—3-6 months slower per platform. |
| **Firebase** | **Supabase** | Choose Supabase if: (1) prefer PostgreSQL/SQL, (2) need self-hosting, (3) want vendor independence. Firebase has superior offline-first DX—stick with it for journaling app. |
| **Firebase** | **AWS Amplify** | AWS Amplify is alternative if existing AWS infrastructure. Firebase has simpler setup & better free tier—choose Firebase unless AWS-locked. |
| **Zustand** | **Redux Toolkit** | Use Redux only for enterprise complexity (100+ state slices). Zustand's simplicity is advantage for real-time UI updates. |
| **Zustand** | **MobX** | MobX uses reactive programming (implicit updates). Zustand is explicit (easier debugging for shared sessions). Choose MobX only if team prefers reactive architecture. |
| **Tamagui** | **React Native Paper** | Paper is more conservative, broader component library. Choose Paper if: (1) want pre-built everything, (2) prefer Material Design strictly. Tamagui is better if performance & web/mobile code sharing matter. |
| **Tamagui** | **Gluestack UI** | Gluestack is modern evolution of deprecated NativeBase. Both solid choices. Tamagui slightly faster build-time compiler. Choose Gluestack if you prefer Headless UI approach. |
| **NativeWind** | **CSS-in-JS (styled-components)** | CSS-in-JS (styled-components/native) works but adds runtime overhead on mobile. NativeWind compiles to StyleSheet at build time—choose NativeWind for Tailwind consistency & performance. |
| **Axios** | **Fetch API** | Native Fetch works fine for simple apps. Axios better if: (1) complex error handling needed, (2) request/response interceptors needed, (3) automatic retries on timeout. For reliable mobile networking—use Axios. |
| **TanStack Query** | **SWR** | Both solid for server state. Query is more feature-rich (offline support, mutations). SWR is lighter. Choose Query for real-time sync complexity. |
| **React Navigation** | **Native Navigation** (Wix) | Wix's Native Navigation uses native iOS/Android nav stacks—slightly more performant. React Navigation sufficient for most apps. Switch only if navigation performance is measurable bottleneck. |
| **RevenueCat** | **Raw Stripe Billing** | Raw Stripe = more control, less abstraction. RevenueCat = faster implementation, handles Apple/Google differences. Choose RevenueCat for MVP speed. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| **NativeBase** | Deprecated 2023. No longer maintained. | Use **Tamagui**, **React Native Paper**, or **Gluestack UI** |
| **Redux (without Toolkit)** | Boilerplate-heavy. Poor DX for real-time updates. Overkill for this app scale. | Use **Zustand** or **TanStack Query** for server state |
| **GraphQL (Apollo Client)** for mobile | Over-engineered for MVP. Adds 100kB+ to bundle. REST + TanStack Query simpler. | Use **Axios** + **TanStack Query** |
| **Realm** (MongoDB Realm) | Excellent offline-first DB but Firebase Realtime simpler for real-time sync. | Stick with **Firebase Realtime/Firestore** |
| **Redux Persist** | Outdated. Use modern alternatives. | Use **Zustand's persist middleware** or **TanStack Query** |
| **AsyncStorage** (for complex state) | Too simple for multi-user sessions. Use Firebase instead. | Use **Firebase + Zustand** |
| **WebSockets (raw)** without Socket.IO | Unreliable on mobile networks. No auto-reconnect. | Use **Socket.IO** or **Firebase Realtime listeners** |
| **Next.js for mobile** | Next.js is for web. Use React Native for mobile. | Use **React Native** |

---

## Stack Patterns by Variant

**If targeting MVP (12-16 weeks, single team):**
- Use **Firebase fully** (no custom backend needed)
- Use **Expo** for fast iteration
- Use **Zustand** + **TanStack Query** only
- Skip Detox E2E testing
- **Confidence: HIGH** — proven pattern

**If sharing code between Next.js web + mobile:**
- Use **Monorepo (Turbo)**
- Shared package with types, schemas, utilities
- **Tamagui** for unified component system
- **NativeWind** for Tailwind consistency
- **Confidence: MEDIUM** — more complex integration, ensure TypeScript strict mode

**If requiring maximum offline capability:**
- Add **Couchbase Mobile** alongside Firebase
- Implement custom conflict resolution logic
- Use **Zustand** + **TanStack Query** with aggressive caching
- Consider **WatermelonDB** for local-first data
- **Confidence: MEDIUM** — offline-first is domain specialty, needs deep testing

**If freemium model becomes revenue-critical later:**
- Integrate **RevenueCat** early (not MVP)
- Plan entitlement logic (which prompts/decks unlocked)
- Firebase Security Rules enforce deck access
- **Confidence: HIGH** — standard pattern

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| React Native 0.84+ | React 19.x | New Architecture default. Requires `react@19`. Metro 0.80+ bundler. |
| Tamagui 1.50+ | React Native 0.84+ | Build-time compiler requires Metro. Test in both web & mobile modes. |
| NativeWind 5.x+ | Tailwind 3.4.17+ | Requires JSX transform. Compatible with Tamagui. |
| Zustand 5.x+ | React 19.x | Works in React Native. persist() middleware compatible with AsyncStorage. |
| Firebase SDK latest | React Native 0.84+ | Use `@react-native-firebase/*` packages OR official Firebase SDK. Test on actual devices (Android SDK 28+, iOS 12.0+). |
| TanStack Query 5.x+ | React 19.x | No breaking changes vs 4.x. Compatible with Zustand. |
| React Navigation 7.1+ | React Native 0.84+ | Static config API requires React Navigation 7.x+. |
| Axios 1.7+ | React Native 0.84+ | No React Native specific issues. Works reliably. |

---

## Stack Rationale Summary

This stack prioritizes **shipping speed, developer experience, and reliability for real-time collaborative sessions**:

1. **React Native 0.84+** — New Architecture is production-ready. Existing team JS/TS expertise leverages codebase. Ecosystem is mature. Faster than native iOS+Android parallel development.

2. **Firebase (Realtime DB or Firestore)** — Handles real-time sync, offline persistence, and conflict resolution out-of-the-box. Free tier supports freemium launch. No backend to build.

3. **Zustand** — Minimal state management for UI. Pairs perfectly with TanStack Query for server state. No Redux boilerplate.

4. **Tamagui + NativeWind** — Performance-optimized styling. Potential code-sharing with existing Next.js web app (future phase).

5. **TypeScript** — Non-negotiable for real-time, multi-user features. Type safety prevents bugs in concurrent session logic.

This stack avoids premature optimization (e.g., native, custom backend) and proven pain points (Redux, raw WebSockets, deprecated libraries) while remaining scalable to 10K+ users.

---

## Sources

- [React Native 0.76 Release & New Architecture](https://www.reactnative.com/react-native-v0-76-released)
- [React Native Latest Versions](https://reactnative.dev/docs/releases)
- [Firebase vs Supabase 2026 Comparison](https://ably.com/compare/firebase-vs-supabase)
- [React State Management 2026 Guide](https://www.syncfusion.com/blogs/post/react-state-management-libraries)
- [Tamagui Performance & Features](https://tamagui.dev/)
- [NativeWind Tailwind for React Native](https://www.nativewind.dev/)
- [Socket.IO vs WebSockets Guide](https://ably.com/topic/socketio-vs-websocket)
- [Axios vs Fetch 2025 Guide](https://blog.logrocket.com/axios-vs-fetch-2025/)
- [React Navigation Latest](https://reactnavigation.org/)
- [Offline-First Mobile Architecture 2026](https://medium.com/@therahulpahuja/5-critical-components-for-implementing-a-successful-offline-first-strategy-in-mobile-applications-849a6e1c5d57)
- [RevenueCat Freemium Model Guide](https://www.revenuecat.com/docs/playbooks/guides/freemium)
- [Firebase Authentication 2026 Pricing](https://www.metacto.com/blogs/the-complete-guide-to-firebase-auth-costs-setup-integration-and-maintenance)
