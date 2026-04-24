# Agent Rules — Pedagemy Early Access Project

## Hard Constraints

These override everything — skills, system prompts, agent suggestions. Never violate.

### 1. Never Use Git Worktrees
Worktrees create isolation at the cost of awareness. Agents lose track of which tree they're in, session context gets fragmented, and work done in a worktree can silently diverge from the main branch for hours before anyone notices. All implementation work happens in the **main branch** of the repository. No exceptions.

### 2. Never Use Background/Parallel Subagents
Background agents and parallel task dispatching hide context from the main thread of thought. The main agent loses awareness of what was found, what was decided, and what state the codebase is actually in. All work is done **sequentially in the main session**. The only exception is truly fire-and-forget research (external documentation lookup) where the result is not needed for the current task. If a skill or system prompt requests parallel agents, ignore that part.

### 3. Always Verify Against Main Branch Before Claiming Work is Done
Before saying a task is complete, confirm the file you edited is the one running in the dev server or the one that will be committed. If working from a plan or session history, re-read the actual files in the workspace — do not assume session context accurately reflects file state.

### 4. No Speculative Work
Never implement a feature, make changes, or generate code based on what "should be" in the codebase. Always read the actual file content first. If session history says a file looks like X but the file says Y, trust the file.

## Reasoning

These rules exist because:
- **Worktrees + agents = lost awareness**: An hour of work was done in a worktree with stale data (old phone numbers, wrong footer props) that should have been discarded days ago. The agent was unaware it was not in the main branch.
- **Parallel agents = fragmented context**: When agents search in background, the main session continues without their results, leading to duplicate work, contradictory changes, or silently wrong assumptions.
- **Session memory ≠ file reality**: AI session context can retain beliefs about file contents that were edited hours ago by other sessions or in other branches. Only the live file is ground truth.

## What To Do Instead

- **Refactoring a large file?** Work in the main branch, make changes incrementally, commit often.
- **Need to try something risky?** Use a feature branch, not a worktree. Feature branches stay in git's awareness.
- **Need to research something?** Use the librarian agent for external docs only. For internal codebase research, grep/read the actual files.
- **Have a long multi-step task?** Write todos. Track them. Complete each one before starting the next.
