import { relations } from "drizzle-orm";


export * from "./enum";
export * from "./auth-schema";
export * from "./profile";
export * from "./rbac";
export * from "./languages";
export * from "./tags";
export * from "./problems";
export * from "./submissions";
export * from "./contests";
export * from "./discussions";
export * from "./problemRatings";
export * from "./notifications";
export * from "./auditLogs";
export * from "./gen-ai-prompts";
export * from "./posts";

import { auditLogs } from "./auditLogs";
import { users } from "./auth-schema";
import {
  contestParticipants,
  contests,
  leaderboards,
  problemContests,
} from "./contests";
import { comments, discussions } from "./discussions";
import { languages } from "./languages";
import { notifications } from "./notifications";
import { problemRatings } from "./problemRatings";
import { problemLanguages, problemTags, problems, testcases } from "./problems";
import { profiles } from "./profile";

import { roles, userToRoles } from "./rbac";
import { submissionTestcases, submissions } from "./submissions";
import { tags } from "./tags";
import { postComments, postLikes, posts, topics } from "./posts";





export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.userId],
  }),

  userToRoles: many(userToRoles),
  participantContests: many(contestParticipants),
  discussions: many(discussions),
  comments: many(comments),
  problemRatings: many(problemRatings),
  notifications: many(notifications),
  leaderboards: many(leaderboards), 
  auditLogs: many(auditLogs, { relationName: "auditLogsByUser" }), 
  posts: many(posts),
  postLikes: many(postLikes),
  postComments: many(postComments),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, { fields: [posts.authorId], references: [users.id] }),
  comments: many(postComments),
  likes: many(postLikes),
}));

export const postLikesRelations = relations(postLikes, ({ one }) => ({
  user: one(users, { fields: [postLikes.userId], references: [users.id] }),
  post: one(posts, { fields: [postLikes.postId], references: [posts.id] }),
}));

export const postCommentsRelations = relations(postComments, ({ one }) => ({
  user: one(users, { fields: [postComments.userId], references: [users.id] }),
  post: one(posts, { fields: [postComments.postId], references: [posts.id] }),
}));

export const topicsRelations = relations(topics, ({ many }) => ({
  posts: many(posts),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, { fields: [profiles.userId], references: [users.id] }),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  userToRoles: many(userToRoles),
}));

export const userToRolesRelations = relations(userToRoles, ({ one }) => ({
  user: one(users, { fields: [userToRoles.userId], references: [users.id] }), 
  role: one(roles, { fields: [userToRoles.roleId], references: [roles.id] }), 
}));



export const languagesRelations = relations(languages, ({ many }) => ({
  problemLanguages: many(problemLanguages),
  submissions: many(submissions),
}));


export const tagsRelations = relations(tags, ({ many }) => ({
  problemTags: many(problemTags),
}));


export const problemsRelations = relations(problems, ({ many }) => ({
  problemLanguages: many(problemLanguages),
  problemTags: many(problemTags),
  submissions: many(submissions),
  submissionTestcasesViaProblem: many(submissionTestcases), 
  testcases: many(testcases),
  problemContests: many(problemContests),
  discussions: many(discussions),
  problemRatings: many(problemRatings),
}));

export const problemLanguagesRelations = relations(
  problemLanguages,
  ({ one }) => ({
    problem: one(problems, {
      fields: [problemLanguages.problemId],
      references: [problems.id],
    }),
    language: one(languages, {
      fields: [problemLanguages.languageId],
      references: [languages.id],
    }),
  }),
);

export const problemTagsRelations = relations(problemTags, ({ one }) => ({
  problem: one(problems, {
    fields: [problemTags.problemId],
    references: [problems.id],
  }),
  tag: one(tags, { fields: [problemTags.tagId], references: [tags.id] }),
}));

export const testcasesRelations = relations(testcases, ({ one, many }) => ({
  problem: one(problems, {
    fields: [testcases.problemId],
    references: [problems.id],
  }),
  submissionTestcases: many(submissionTestcases),
}));


export const submissionsRelations = relations(submissions, ({ one, many }) => ({
  user: one(users, {
    fields: [submissions.userId],
    references: [users.id],
  }),
  problem: one(problems, {
    fields: [submissions.problemId],
    references: [problems.id],
  }),
  language: one(languages, {
    fields: [submissions.languageId],
    references: [languages.id],
  }),
  problemContest: one(problemContests, {
    fields: [submissions.problemContestId],
    references: [problemContests.id],
  }),
  submissionTestcases: many(submissionTestcases),
}));

export const submissionTestcasesRelations = relations(
  submissionTestcases,
  ({ one }) => ({
    submission: one(submissions, {
      fields: [submissionTestcases.submissionId],
      references: [submissions.id],
    }),
    testcase: one(testcases, {
      fields: [submissionTestcases.testcaseId],
      references: [testcases.id],
    }),
    problem: one(problems, {
      fields: [submissionTestcases.problemId],
      references: [problems.id],
    }),
  }),
);


export const contestsRelations = relations(contests, ({ many }) => ({
  problemContests: many(problemContests),
  leaderboards: many(leaderboards),
  contestParticipants: many(contestParticipants),
}));

export const problemContestsRelations = relations(
  problemContests,
  ({ one, many }) => ({
    contest: one(contests, {
      fields: [problemContests.contestId],
      references: [contests.id],
    }),
    problem: one(problems, {
      fields: [problemContests.problemId],
      references: [problems.id],
    }),
    submissions: many(submissions), 
  }),
);

export const leaderboardsRelations = relations(leaderboards, ({ one }) => ({
  contest: one(contests, {
    fields: [leaderboards.contestId],
    references: [contests.id],
  }),
  user: one(users, { fields: [leaderboards.userId], references: [users.id] }),
}));

export const contestParticipantsRelations = relations(
  contestParticipants,
  ({ one }) => ({
    contest: one(contests, {
      fields: [contestParticipants.contestId],
      references: [contests.id],
    }),
    user: one(users, {
      fields: [contestParticipants.userId],
      references: [users.id],
    }),
  }),
);


export const discussionsRelations = relations(discussions, ({ one, many }) => ({
  problem: one(problems, {
    fields: [discussions.problemId],
    references: [problems.id],
  }),
  user: one(users, { fields: [discussions.userId], references: [users.id] }),
  comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  discussion: one(discussions, {
    fields: [comments.discussionId],
    references: [discussions.id],
  }),
  user: one(users, { fields: [comments.userId], references: [users.id] }),
}));


export const problemRatingsRelations = relations(problemRatings, ({ one }) => ({
  problem: one(problems, {
    fields: [problemRatings.problemId],
    references: [problems.id],
  }),
  user: one(users, {
    fields: [problemRatings.userId],
    references: [users.id],
  }),
}));


export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));


export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
    relationName: "auditLogsByUser",
  }), 
}));




