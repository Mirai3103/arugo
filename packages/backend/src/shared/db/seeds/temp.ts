import { db } from "#/shared/db";
import { problemLanguages } from "#/shared/db/schema";

const allLang = await db.query.languages.findMany({})

const allProblem = await db.query.problems.findMany({})
await db.delete(problemLanguages);
// add all languages to all problems
type ProblemLanguageInsert = typeof problemLanguages.$inferInsert;
const insertData = allProblem.flatMap((problem) => {
  return allLang.map<ProblemLanguageInsert>((lang) => {
    return {
      problemId: problem.id,
      languageId: lang.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      
    };
  });
});

await db.insert(problemLanguages).values(insertData).onConflictDoNothing();