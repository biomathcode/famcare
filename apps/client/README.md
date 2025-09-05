## 
Organize your Family Health using AI 


## Chat Session Flow-> 
Click Create Chat -> db chat session in created -> incremental save the chat_message with session id -> fetch chat message by session id -> display chat message in the chat window


### TODOS
-[] Add File Records
-[] Add File Upload
-[] Create Vector embeddings and use ai
-[] Add Feature using tidb
-[] Add User Profile
-[] Add User Settings
-[] Create Exercise plan 
-[] Create Diet plan
-[] Add Calendar View 
-[] Add validation in forms
-[] Add loading states
-[] Add error handling
-[] Add Support for input files in the chat system- https://ai-sdk.dev/cookbook/guides/multi-modal-chatbot
-[] Refactor and save the data in the chat system backend and not on the frontend
- [] Add Q/A system using the uploaded Files

- Take inspiration from https://github.com/vercel-labs/ai-sdk-preview-internal-knowledge-base/blob/main/app/(chat)/api/files/upload/route.ts

Use This to persist chat history and other data into the database 

- [] https://github.com/vercel-labs/ai-sdk-persistence-db


TODO: Work Vector Search 
TODO: Add ai tools for medicine search, side effects, interactions, save medicines and create a schedule for the medicines
TODO: Save previous chat history and show in the previous chat section
TODO: Improve the UI/UX
TODO: Create the landing page

### Vector Search 
file upload on the media schema
Creating chunks of the data
Creating vector embeddings for the chunks
Saving the vector embeddings in the vector db
Searching the vector db using the query


```ts
import { mysqlTable, varchar, text, float, int } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const pdfChunks = mysqlTable("pdf_chunks", {
  id: int("id").primaryKey().autoincrement(),
  docId: varchar("doc_id", { length: 36 }).notNull(),
  chunk: text("chunk").notNull(),
  embedding: text("embedding").notNull(), // store JSON.stringify([...])
  order: int("order").notNull(),
});
```


api 


```ts
// routes/api/upload.ts
import { createServerFn } from "@tanstack/start";
import { db } from "@/db/client";
import { pdfChunks } from "@/db/schema";
import pdf from "pdf-parse";
import { CohereClient } from "cohere-ai";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

const cohere = new CohereClient({ apiKey: process.env.COHERE_API_KEY! });

export const uploadPDF = createServerFn("POST", async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) throw new Error("No file uploaded");

  const buffer = Buffer.from(await file.arrayBuffer());
  const data = await pdf(buffer);

  // chunk text
  const words = data.text.split(/\s+/);
  const chunkSize = 200;
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(" "));
  }

  // embed with Cohere
  const embeddings = await cohere.embed({
    texts: chunks,
    model: "embed-multilingual-v3.0",
  });

  const docId = randomUUID();

  await db.insert(pdfChunks).values(
    chunks.map((c, i) => ({
      docId,
      chunk: c,
      order: i,
      embedding: JSON.stringify(embeddings.embeddings[i]),
    }))
  );

  return { docId, chunks: chunks.length };
});

```


### Retrieval Generation Using the AI SDK 

```ts
export const findRelevantContent = async (userQuery: string) => {
  const userQueryEmbedded = await generateEmbedding(userQuery);
  const similarity = sql<number>`1 - (${cosineDistance(
    embeddings.embedding,
    userQueryEmbedded,
  )})`;
  const similarGuides = await db
    .select({ name: embeddings.content, similarity })
    .from(embeddings)
    .where(gt(similarity, 0.5))
    .orderBy(t => desc(t.similarity))
    .limit(4);
  return similarGuides;
};

```



```ts
  const result = streamText({
    model: openai('gpt-4o'),
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
     tools: {
        getInformation: tool({
        description: `get information from your knowledge base to answer questions.`,
        inputSchema: z.object({
          question: z.string().describe('the users question'),
        }),
        execute: async ({ question }) => findRelevantContent(question),
      }),
    },

```



### AI tools
- Search Medicine information
- Search Side effects of the medicine using OpenFDA api
- Create Members Diet, Medicines, Exercise plan
- Create Member Medical Schedule 

Saving Chat can be p3 or p4 priority


## Adding Event to google Calendar
https://calendar.google.com/calendar/r?cid=https://example.com/events.ics




### Onboarding Flow -> 
User -> Logs in -> Add Family Members -> Add Medical Records for the members -> Can generate chat, exercise, diet plan for the members -> Can create medical schedule for the members -> Can create google calendar event for the medical schedule for the members

### Health Care Information 
- Search for the medicine online 
- Search for real life side effects experienced by other users
- Search for the medicine interaction with other medicines api  


### Flow b/w user and AI
user -> uploaded image -> then we ask for member -> create a new member or update the existing member -> then we create a medical record for the member -> then we create medical schedule -> then we create a google ice calendar event for the medical schedule for the member/ 


## Search read more 
https://docs.pingcap.com/tidbcloud/vector-search-hybrid-search/




what are vector embeddings -> ?  
https://www.pinecone.io/learn/vector-database/

For file upload we can go in two directions one using kimi ai image upload

use uploadthings for files uploads -> 
[text](https://docs.uploadthing.com/getting-started/tanstack-start)

Create Calendar Events for timely medicine taking Using AI

For creating the calendar event we would require trigger/ queue system to create the event after knowing the chat,exercise and diet plan 

# [React TanStarter](https://github.com/dotnize/react-tanstarter)

A minimal starter template for 🏝️ TanStack Start. [→ Preview here](https://tanstarter.nize.ph/)

- [React 19](https://react.dev) + [React Compiler](https://react.dev/learn/react-compiler)
- TanStack [Start](https://tanstack.com/start/latest) + [Router](https://tanstack.com/router/latest) + [Query](https://tanstack.com/query/latest)
- [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Drizzle ORM](https://orm.drizzle.team/) + PostgreSQL
- [Better Auth](https://www.better-auth.com/)

## Getting Started

We use **pnpm** by default, but you can modify the scripts in [package.json](./package.json) to use your preferred package manager.

1. [Use this template](https://github.com/new?template_name=react-tanstarter&template_owner=dotnize) or clone this repository with gitpick:

   ```bash
   npx gitpick dotnize/react-tanstarter myapp
   cd myapp
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Create a `.env` file based on [`.env.example`](./.env.example).

4. Push the schema to your database with drizzle-kit:

   ```bash
   pnpm db push
   ```

   https://orm.drizzle.team/docs/migrations

5. Run the development server:

   ```bash
   pnpm dev
   ```

   The development server should now be running at [http://localhost:3000](http://localhost:3000).

## Issue watchlist

- [React Compiler docs](https://react.dev/learn/react-compiler), [Working Group](https://github.com/reactwg/react-compiler/discussions) - React Compiler is in RC.
- [Start BETA Tracking](https://github.com/TanStack/router/discussions/2863) - TanStack Start is in beta and may still undergo major changes.
- [TanStack/react-devtools/CHANGELOG.md](https://github.com/TanStack/devtools/blob/main/packages/react-devtools/CHANGELOG.md) - TanStack Devtools is in alpha and may still have breaking changes.

## Goodies

#### Scripts

These scripts in [package.json](./package.json#L5) use **pnpm** by default, but you can modify them to use your preferred package manager.

- **`auth:generate`** - Regenerate the [auth db schema](./src/lib/db/schema/auth.schema.ts) if you've made changes to your Better Auth [config](./src/lib/auth/auth.ts).
- **`db`** - Run drizzle-kit commands. (e.g. `pnpm db generate` to generate a migration)
- **`ui`** - The shadcn/ui CLI. (e.g. `pnpm ui add button` to add the button component)
- **`format`**, **`lint`**, **`check-types`** - Run Prettier, ESLint, and check TypeScript types respectively.
  - **`check`** - Run all three above. (e.g. `pnpm check`)
- **`deps`** - Selectively upgrade dependencies via taze.

#### Utilities

- [`auth/middleware.ts`](./src/lib/auth/middleware.ts) - Sample middleware for forcing authentication on server functions. (see [#5](https://github.com/dotnize/react-tanstarter/issues/5#issuecomment-2615905686) and [#17](https://github.com/dotnize/react-tanstarter/issues/17#issuecomment-2853482062))
- [`theme-toggle.tsx`](./src/components/theme-toggle.tsx), [`theme-provider.tsx`](./src/components/theme-provider.tsx) - A theme toggle and provider for toggling between light and dark mode. ([#7](https://github.com/dotnize/react-tanstarter/issues/7#issuecomment-3141530412))

## License

Code in this template is public domain via [Unlicense](./LICENSE). Feel free to remove or replace for your own project.

## Also check out

- [create-tsrouter-app](https://github.com/TanStack/create-tsrouter-app/tree/main/cli/create-tsrouter-app) - The official CLI tool from the TanStack team to create Router/Start applications.
- [CarlosZiegler/fullstack-start-template](https://github.com/CarlosZiegler/fullstack-start-template) - A more batteries-included boilerplate that provides a solid foundation for building modern web apps.
