# Prompt Library

Prompt Library is a full-stack prompt management service which is built with Next.js 15, Drizzle ORM and SQLite.

---

## Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **ORM**: Drizzle ORM
- **Database**: SQLite
- **AI**: Vercel AI SDK

---

## Design Document

[DESIGN.md](DESIGN.md)

---

## Setup

### 1. Setup up the node version

```bash
nvm use
```

### 2. Install dependencies

```bash
npm i
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and set your OpenAI API key

### 4. Run database migrations

```bash
npm run db:migrate
```

This creates a local database file with three tables: `prompts`, `internal_prompts` and `internal_prompt_versions`.

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Populating test data

The sidebar contains two utility buttons:

- **Populate Mock Data** — seeds 4 user prompts and 2 internal prompts
- **Reset Data** — deletes all rows from all tables

---

## Example Scenarios

### Scenario 1: Create a prompt manually and render it

1. Click **Create Prompt** in the sidebar.
2. On the **Manual** tab, fill the form:
   - **Title**: `Prompt 1`
   - **Description**: `This is prompt 1`
   - **Template**:
     ```
     This is prompt template with three variables: {{variable_1}} and {{variable_2}}

     {{variable_3}}
     ```
   - **Tags**: `tag1, tag2`
3. Click **Save Prompt**. You will be redirected to the prompt details page.
4. In the **Render** section on the details page, you will see the extracted variables (`variable_1`, `variable_2` and `variable_3`) appear as input fields.
5. Enter values — e.g. `variable_1: A`, `variable_2: B`, `variable_3: C` — and click **Render**.
6. The rendered prompt appears below the inputs. The render count is incremented by 1 after each render.

---

### Scenario 2: Create a prompt with AI Assist

1. Click **Create Prompt** in the sidebar.
2. Select the **AI Assist** tab.
3. In the description field, enter:
   ```
   A prompt that summarises tax return
   ```
4. Click **Generate**. The AI will populate the title, description, template, and tags.
5. Review and edit the generated fields as needed.
6. Click **Save Prompt**.

---

### Scenario 3: Fork an internal prompt, receive an update, review and merge

This scenario demonstrates the core Question 2 workflow — an internal team managing prompt versioning for customers.

**Step 1 — Create an internal prompt**

1. Click **Internal Library** in the sidebar, then click **New Internal Prompt**.
2. Create a prompt:
   - **Title**: `Support Ticket Classifier`
   - **Template**:
     ```
     Classify this support ticket:

     Ticket: {{ticket}}

     Return: category and urgency.
     ```
3. Save. This will create version 1.

**Step 2 — Fork to the customer library**

1. On the internal prompt details page, click **Fork to my library**.
2. You will be redirected to the new customer prompt forked from the internal prompt.

**Step 3 — Customer modifies their copy**

1. On the customer prompt details page, click **Edit**.
2. Change the template to:
   ```
   Classify this support ticket carefully:

   Ticket: {{ticket}}

   Return: category and urgency.
   ```
3. Save.

**Step 4 — Internal team publishes an update**

1. Return to **Internal Library** and open the `Support Ticket Classifier`.
2. Click **Publish New Version** and update the template to:
   ```
   Classify this support ticket:

   Ticket: {{ticket}}

   Return: category, urgency, and suggested resolution.
   ```
3. Publish. The internal prompt is now at version 2.

**Step 5 — Customer reviews and merges**

1. Navigate back to the customer's copy of the prompt.
2. A banner appears: _"Internal template updated (v1 -> v2). Review changes."_
3. Click **Review Update**.
4. The review page shows:
   - **Fields table**: title, description, tags are unchanged — no action needed.
   - **Template**: the customer added "carefully" on line 1; the internal team added a new return field on the last line. These edits are on different lines, so they **auto-merge** with no conflict.
5. Click **Apply Update**. The customer prompt now contains both changes and is synced to version 2.

---

### Scenario 4: Customer ignores an update; internal team publishes again; customer reviews a multi-version jump

**Step 1** — Repeat Scenario 3 steps 1–4 (fork and publish v2), but do **not** click Review Update on the customer prompt.

**Step 2 — Internal team publishes v3**

1. Open the internal prompt and click **Publish New Version**.
2. Change the template to add an explicit output format:
   ```
   Classify this support ticket:

   Ticket: {{ticket}}

   Return category.
   ```
3. Publish. The prompt is now at version 3.

**Step 3 — Customer reviews the jump from v1 -> v3**

1. The banner on the customer prompt now reads _"Internal template updated (v1 -> v3)"_.
2. Click **Review Update**. The diff is computed between the customer's base (v1) and the latest upstream (v3).
3. Both sides changed the last line — the customer's edit and the upstream's change conflict on that line.
4. The template section shows a **conflict block**. The customer picks either the upstream version or their own for that block.
5. Check if you want to make further changes in the Edit Final Result section.
5. Click **Apply Update**. The prompt is synced to v3 with the chosen resolution.
