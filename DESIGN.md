# Design Document

## Important Design Decisions

### 1. Tags are stored as a JSON string column

Tags are stored as a JSON-serialised array in a `text` column in both `prompts` and `internal_prompts` tables rather than having a `tags` table, an `internal_prompt_version_tags` table and a `prompt_tags` table.

The trade-off: simpler schema and zero join overhead for the common case (read a prompt with its tags), at the cost of not being able to query or index by individual tag with a simple `WHERE`. The current `LIKE '%tag%'` search is sufficient for the scope of this assignment. In production, a proper tags table with an index would be the right choice.

### 2. All internal prompt content lives in `internal_prompt_versions` table

`internal_prompts` contains only metadata (`id`, `current_version`, timestamps). All content fields — `title`, `description`, `template`, `tags` — only live in `internal_prompt_versions`.

The alternative would be to also have the current content in `internal_prompts` table itself. But this will create a two-source-of-truth problem: every publish would need to update both tables atomically, and a failed transaction mid-write could leave them inconsistent. By keeping content only in the versions table and joining on `version = current_version` to read current state, there is exactly one place where the content lives.

### 3. There is no pagination when displaying prompts in prompts library and internal prompts library

For simplicity in this assignment, I chose not to implement pagination for either the Prompt Library or Internal Prompts, given the small scale of the current dataset. However, for a production environment, implementing pagination would be a necessary optimisation to ensure high performance as the data scales.

### 4. Timestamps as Unix milliseconds (integer)

Timestamps are stored as integers (Unix ms) rather than database-native timestamp columns. This works identically across SQLite and PostgreSQL and avoids timezone handling at the ORM layer. The downside is losing database-level date functions and type safety. In production, native timestamp columns with UTC enforcement are preferable.

### 5. Choose SQLite for this assignment

SQLite was chosen over PostgreSQL because it requires zero infrastructure — no server process, just a local local.db file. The trade-off is a single file-level write lock, which blocks concurrent mutations. For a single-user assignment this is irrelevant; in production, PostgreSQL would be the right choice.

### 6. No repository pattern for database abstraction

Drizzle queries are written directly in the API route handlers rather than behind a repository interface. A repository layer would add testability (swap real DB for a fake in unit tests) and decouple business logic from the ORM. For this assignment, with thin handlers and no complex domain logic, the extra indirection adds boilerplate without meaningful benefit. In production, a repository layer would be worthwhile once the query logic grows or unit-testing the handlers becomes a priority.

### 7. Diff is computed at review time

When a customer opens the review page, the diff is computed on demand from `base`, `upstream`, and `customer` values fetched live. Nothing about the diff is persisted.

The alternative — pre-computing and storing the diff when an upstream update is published — would be faster to render but would require re-computing diffs for every affected customer prompt on every publish, and would add storage complexity. Since diffs are cheap to compute and the review page is low-traffic, on-demand computation is the right trade-off here.

### 8. The Review Update button only exists in the prompt details page, not in the prompt card in the prompt library

Showing the "Review Update" button only on the prompt details page avoids fetching update information for every internal-source prompt on the library page. If the button appeared on each card, one API call per internal-source prompt would fire on page load, hurting performance as the library grows. On the details page, exactly one call is made when the user navigates there. This is also natural UX: a user always visits the details page before rendering a prompt, so they will never miss an update.

### 9. There is no version tracking for user prompts

User prompts store content directly in the `prompts` table and overwrite it on each edit. Internal prompts get a new row in `internal_prompt_versions` on every publish because customers need to compare their current version against the upstream version and decide whether to accept. User prompts have no such workflow — they are edited freely by a single user with no downstream dependents — so the added complexity of a versions table brings no benefit.

### 10. Instead of maintaining a separate backend service, the API endpoints are integrated using the Next.js App Router

Next.js App Router API routes (/app/api/**) serve as the backend instead of a separate NestJS or Fastify service. This keeps the project as a single deployable unit with zero inter-service networking, shared TypeScript types between frontend and backend, and no extra infrastructure to run locally. The trade-off is that API routes are coupled to the Next.js runtime, which makes it harder to scale the backend independently or reuse it outside a Next.js context. For this assignment, the simplicity benefit outweighs those constraints.

### 11. Limited unit test coverage

Unit tests cover two pure helpers — diff.ts (line-level diffing) and template.ts (variable interpolation) — because getting either wrong silently corrupts the core output. API routes and React components are untested; both require environmental setup (database or DOM) that's hard to justify for an assignment. In production, the priority would be integration tests for the API routes against a real test database, and component tests for the review and render workflows.

### 12. Currently there are no delete functionality

Neither user prompts nor internal prompts expose a delete operation. Delete adds cascading complexity — what happens to all versions of an internal prompt, or to a user prompt forked from one — without contributing to the core workflows being assessed. In production, soft-delete via an `archived_at` timestamp would be the right approach: it preserves audit history, allows recovery, and avoids foreign-key orphan issues.

---

## Question 2 Problem Analysis

### The core problem

A customer forks a copy of an internal prompt. If the user changes his copy while the internal prompt also gets updates. After some time, the user's copy and the internal prompt will diverge.

- The customer may customise their copy to suit their use case.
- The internal team may publish improvements to the original.

If we overwrite the customer's copy with the latest upstream version, it will silently discard their changes, but if we do nothing, it will leave the customer on a stale version forever. My goal is to streamline how users accept upstream changes while preserving their local modifications. The primary technical challenge lies in executing a three-way merge to reconcile two independent lines of changes sharing a common ancestor.

The same problem has been solved by version control systems.

- Base — the version of the internal prompt the customer forked from (or last synced to)
- Upstream — the current version of an internal prompt
- Customer — the customer's current prompt

A 3-way merge can determine, for any given line of the content:
- If only upstream changed -> it is safe to auto-accept
- If only the customer changed -> it is safe to keep as-is
- If both changed -> a conflict which requires human resolution

This approach ensures users are explicitly notified when their changes risk being overwritten, giving them full control over version selection. When no conflicts exist, the auto-merge system seamlessly integrates the updates with zero user intervention required.

Since it is important to give the users full control over the changes, after all merges are applied, they can still make changes to the merged version before applying the changes.

### Field-level diff vs line-level merge — different strategies per field type

Short string fields (title, description, tags) are compared with a simple 3-way status check: diffField(base, upstream, customer) returns one of four statuses. There is no concept of a "partial" change to a title — it either changed or it didn't. Trying to do character-level merging on a title would be meaningless.

template is multi-line and multi-paragraph, so it uses a proper diff3 line-level merge via node-diff3. This allows upstream and customer changes to different lines to be auto-merged silently, surfacing only the hunks where both sides touched the same lines. This matches how developers reason about text conflicts (as in git merge), which is the right mental model for prompt editing.

### Why `base_version` rather than a full snapshot to be saved for forked prompts

An alternative design would store a full snapshot of the prompt at fork time rather than just the version number. This would allow the 3-way diff to work even if internal prompt version history were ever pruned.

I use `base_version` (an integer pointer into `internal_prompt_versions`) instead because:
- Version history in this system is immutable and append-only — there is no mechanism to delete old versions.
- The integer is cheaper to store and simpler to update on `accept-update`.
- A snapshot approach would duplicate data that already exists in the versions table.

If version pruning were ever introduced, `base_version` could be replaced with a full snapshot at that point.

### Multi-version jumps

If a customer ignores an update notification and the internal team publishes again, the customer's base remains at version N while upstream is now at version N+2 (or more). The 3-way diff is computed between `base_version` and the latest `current_version` regardless of how many intermediate versions exist. Intermediate versions are not considered — the diff is always base vs. latest.

This is a deliberate simplification. A more complete system might walk the version history and compute a cumulative upstream diff, which would produce a cleaner merge in some cases. However, for the scope of this assignment, base-to-latest diffing is correct and sufficient: the customer gets the full picture of what changed relative to their last sync point.
