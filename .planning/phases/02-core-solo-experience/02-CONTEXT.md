# Phase 2: Core Solo Experience - Context

**Gathered:** 2026-02-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver the complete solo conversation experience: starting a session, progressing through 3-level prompt hierarchy (Perception → Connection → Reflection), writing journal reflections, tagging emotions, and seeing an end-of-session summary. This phase proves the core emotional value of "feeling seen" before any multiplayer complexity.

</domain>

<decisions>
## Implementation Decisions

### Conversation flow
- **Session start:** Pick a deck from a list, tap "Start", first question appears immediately. No pre-session setup screens.
- **Question reveal:** One card at a time, full-screen. User cannot see what's ahead. Tap or swipe to advance.
- **3-level progression:** Visible level indicator showing which level the user is on (e.g., "Level 2: Connection") with a progress element. User should know they're going deeper.
- **Sensitive question skip:** Quiet skip — small "skip" button on the card, tap it, next question appears. No replacement question, no acknowledgment message, no fuss.
- **Timer:** Optional, set before or during session (per CONV-06 requirement). Not discussed in detail — Claude's discretion on placement.

### Visual feel & transitions
- **Card style:** Physical card feel — visible card edges, slight shadow, rounded corners. Should feel like holding an actual card from the game. Tactile and grounded.
- **Transitions:** Swipe the card off-screen (left or up), next card slides in from the opposite side. Gestural and physical feel.
- **Level colors:** Distinct card color per level from the warm palette:
  - Perception: sand (#e8dcc8)
  - Connection: terracotta (#d4a574)
  - Reflection: sage (#a8b5a0)
- **Onboarding:** Learn by doing — first session IS the onboarding. Gentle tooltip hints on the first few cards ("swipe to continue", "tap to skip") that disappear after first use.

### Claude's Discretion
- Journaling UI: when/how the reflection writing area appears (inline on card, slide-up panel, separate screen)
- Emotion tag presentation and selection UX
- End-of-session summary layout and content ordering (favorite answer, mood check-in, "one thing I learned")
- Timer placement and UI
- Settings screen layout
- Session history list design
- Empty states for journal and session history

</decisions>

<specifics>
## Specific Ideas

- The physical card metaphor is central — the app should feel like a digital version of the actual WNRS card game
- Swipe gestures should feel natural and responsive, not sluggish
- Level progression should give a sense of going deeper, not just "more questions"
- The overall tone is calm and intentional — no gamification, no urgency, no streaks

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-core-solo-experience*
*Context gathered: 2026-02-19*
