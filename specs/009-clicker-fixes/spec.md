# Feature Specification: Clicker Game — Account & Leaderboard Fixes

**Feature Branch**: `009-clicker-fixes` | **Created**: 2026-06-19 | **Status**: Draft

**Input**: Reverse-spec the account/login/leaderboard logic of the standalone clicker game (`clicker/script.js`)
and fix three confirmed defects. Scope is limited to these defects; the rest of the game is documented behavior.

> Behavior-anchored spec (Constitution Principle II) with three documented deviations (FR-001..FR-003) per the
> bug-fix policy. Corrected behavior is the oracle.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Player logs into an account (Priority: P1)

A player loads a saved account. Their progress loads, and they are considered logged in. Their stored
credentials are not destroyed, so the accounts remain valid for later use.

**Acceptance Scenarios**:

1. **Given** a logged-out session, **When** the player loads account A, **Then** the account loads and the
   stored passwords of **all** accounts remain intact — *previously first login deleted every account's
   password* (FR-002).
2. **Given** the player is already logged in, **When** another load is attempted, **Then** it is blocked
   ("already logged in") without corrupting account data.

### User Story 2 - Player creates an account (Priority: P1)

Creating an account rejects a name that is empty, already taken, or the reserved name "User".

**Acceptance Scenarios**:

1. **Given** the create form, **When** the requested name is "User" (reserved), **Then** creation is rejected
   with "Username unavailable" — *previously the guard compared a DOM node to the string and never fired*
   (FR-001).

### User Story 3 - Leaderboard is ranked correctly (Priority: P2)

The leaderboard lists players from most to fewest Cubanos, correctly handling zero, negative, and malformed
scores.

**Acceptance Scenarios**:

1. **Given** a set of players with mixed scores (including negative and non-numeric), **When** the leaderboard
   sorts, **Then** they appear in strict descending order with non-numeric treated as 0 — *previously a `max=0`
   sentinel and `maxIdx=0` mis-ranked non-positive/malformed scores* (FR-003).

### Edge Cases

- Non-numeric `cubanoCt` is treated as 0 in ranking.
- Loading is allowed only when logged out (`accName == "User"`), the existing logged-out sentinel.

## Requirements *(mandatory)*

- **FR-001** *(fix)*: Account creation MUST reject the reserved name "User" (compare the input's value, not the
  input element).
- **FR-002** *(fix)*: Loading an account MUST NOT delete any account's stored password; the "already logged in"
  guard MUST use the existing `accName` sentinel instead of destroying credentials.
- **FR-003** *(fix)*: The leaderboard sort MUST rank strictly descending and handle zero/negative/non-numeric
  scores correctly (`-Infinity` sentinel, `maxIdx` initialized to the outer index, numeric coercion with a
  NaN→0 fallback).

## Success Criteria *(mandatory)*

- **SC-001**: After loading an account, every account still has its password (verified: `p1`/`k1` intact),
  `accName` is updated, and a second load is blocked.
- **SC-002**: Creating an account named "User" yields "Username unavailable".
- **SC-003**: Sorting `[5, 100, -3, "abc", 42]` yields order `100, 42, 5, 0(abc), -3`.
- **SC-004**: Other game behavior is unchanged (only these three functions touched).

## Assumptions

- `clicker/` is a standalone game (its own vendored jQuery + Papa Parse). Verification overrides the in-memory
  `data` array to exercise the logic deterministically. Out of scope: the game loop, shop, and the
  accounts-sheet sync beyond the three fixed functions.
