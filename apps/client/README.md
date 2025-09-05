## 
Organize your Family Health using AI 


### Story behind building this app
i moved back my parents house, and i have become responsible for managing family health, medicines, diet and exercise plans. I wanted to build an app which can help me manage all these things in one place. I also wanted to use AI to help me with the same. AI can be a great organizing tool as well as a research tool to find information about medicines, side effects, interactions etc. Also to save medical history, records and their medicine Schedules. 


## Chat Session Flow-> 
Click Create Chat -> db chat session in created -> incremental save the chat_message with session id -> fetch chat message by session id -> display chat message in the chat window


### TODOS
-[x] Add File Records
-[x] Add File Upload
-[x] Create Vector embeddings and use ai
-[x] Add Feature using tidb
-[x] Add User Profile
-[x] Add User Settings
-[x] Create Exercise plan 
-[x] Create Diet plan
-[] Add Calendar View 
-[] Add validation in forms
-[] Add loading states
-[] Add error handling
-[] Add Support for input files in the chat system- https://ai-sdk.dev/cookbook/guides/multi-modal-chatbot
-[] Refactor and save the data in the chat system backend and not on the frontend
-[] Add Q/A system using the uploaded Files

- Take inspiration from https://github.com/vercel-labs/ai-sdk-preview-internal-knowledge-base/blob/main/app/(chat)/api/files/upload/route.ts

Use This to persist chat history and other data into the database 

- [x] https://github.com/vercel-labs/ai-sdk-persistence-db


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


