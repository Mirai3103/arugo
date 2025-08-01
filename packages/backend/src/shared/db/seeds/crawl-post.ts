import axios from "axios";
export interface Root {
  code: number;
  message: any;
  errors: any[];
  data: Data;
  meta: any;
  isValid: boolean;
  success: boolean;
  deleted: boolean;
}

export interface Data {
  relatedPosts: RelatedPost[];
  isEdit: boolean;
  isReview: boolean;
  sameOwnerBlogs: SameOwnerBlog[];
  topReadBlogs: TopReadBlog[];
  ownerName: string;
  ownerAvatar: string;
  ownerExpLevel: OwnerExpLevel2;
  commentCount: number;
  rateSummary: RateSummary2;
  userId: number;
  contextId: number;
  contextType: number;
  finalTotalViews: number;
  finalTotalShares: number;
  isTopTrending: boolean;
  isHot: boolean;
  isLatest: boolean;
  isTrending: boolean;
  id: number;
  title: string;
  permalink: string;
  description: string;
  imageUrl: string;
  content: string;
  ownerId: number;
  tags: string[];
  isPublish: boolean;
  publishTime: string;
  isDraft: boolean;
  externalId: number;
  totalViews: number;
  totalShares: number;
  newTotalViews: number;
  newTotalShares: number;
  updatedAt: string;
  createdAt: string;
  deleted: boolean;
}

export interface RelatedPost {
  ownerName: string;
  ownerAvatar: string;
  ownerExpLevel: OwnerExpLevel;
  commentCount: number;
  rateSummary: RateSummary;
  userId: number;
  contextId: number;
  contextType: number;
  finalTotalViews: number;
  finalTotalShares: number;
  isTopTrending: boolean;
  isHot: boolean;
  isLatest: boolean;
  isTrending: boolean;
  id: number;
  title: string;
  permalink: string;
  description: string;
  imageUrl: string;
  content: any;
  ownerId: number;
  tags: string[];
  isPublish: boolean;
  publishTime: string;
  isDraft: boolean;
  externalId: any;
  totalViews: number;
  totalShares: number;
  newTotalViews: number;
  newTotalShares: number;
  updatedAt: string;
  createdAt: string;
  deleted: boolean;
}

export interface OwnerExpLevel {
  userLevelId: number;
  name: string;
  iconUrl: string;
  levelNo: number;
  absoluteExperiencePoint: number;
  currentUserExperiencePoint: number;
  relativeExperiencePoint: number;
  nextLevelExp: number;
  nextLevelIconUrl: string;
  defaultUserAvatarUrl: string;
}

export interface RateSummary {
  id: number;
  isVote: number;
  totalPoint: number;
  totalNegativePoint: number;
  totalUser: number;
  contextId: number;
  contextType: number;
  userRate: number;
  avgRate: number;
}

export interface SameOwnerBlog {
  ownerName: any;
  ownerAvatar: any;
  ownerExpLevel: any;
  commentCount: number;
  rateSummary: any;
  userId: number;
  contextId: number;
  contextType: number;
  finalTotalViews: number;
  finalTotalShares: number;
  isTopTrending: boolean;
  isHot: boolean;
  isLatest: boolean;
  isTrending: boolean;
  id: number;
  title: string;
  permalink: string;
  description: any;
  imageUrl: string;
  content: any;
  ownerId: number;
  tags: any;
  isPublish: boolean;
  publishTime: any;
  isDraft: boolean;
  externalId: any;
  totalViews: number;
  totalShares: number;
  newTotalViews: number;
  newTotalShares: number;
  updatedAt: any;
  createdAt: any;
  deleted: boolean;
}

export interface TopReadBlog {
  ownerName: any;
  ownerAvatar: any;
  ownerExpLevel: any;
  commentCount: number;
  rateSummary: any;
  userId: number;
  contextId: number;
  contextType: number;
  finalTotalViews: number;
  finalTotalShares: number;
  isTopTrending: boolean;
  isHot: boolean;
  isLatest: boolean;
  isTrending: boolean;
  id: number;
  title: string;
  permalink: string;
  description: any;
  imageUrl: any;
  content: any;
  ownerId: number;
  tags: any;
  isPublish: boolean;
  publishTime: any;
  isDraft: boolean;
  externalId: any;
  totalViews: number;
  totalShares: number;
  newTotalViews: number;
  newTotalShares: number;
  updatedAt: any;
  createdAt: any;
  deleted: boolean;
}

export interface OwnerExpLevel2 {
  userLevelId: number;
  name: string;
  iconUrl: string;
  levelNo: number;
  absoluteExperiencePoint: number;
  currentUserExperiencePoint: number;
  relativeExperiencePoint: number;
  nextLevelExp: number;
  nextLevelIconUrl: string;
  defaultUserAvatarUrl: string;
}

export interface RateSummary2 {
  id: number;
  isVote: number;
  totalPoint: number;
  totalNegativePoint: number;
  totalUser: number;
  contextId: number;
  contextType: number;
  userRate: number;
  avgRate: number;
}

// const response = await axios.get<Root>("https://api.codelearn.io/sharing/blog/detail?permalink=huong-dan-code-game-ran-san-moi")
// const data = response.data.data;
// const title = data.title;
// const content = data.content;
// const tags = data.tags;
import { generateJSONFromHTML, generateHTMLFromJSON } from "@repo/tiptap";
import postService from "#/posts/postService";
import db from "..";
import { posts, topics, users } from "../schema";
import { eq } from "drizzle-orm";
// const json = generateJSONFromHTML(content);
const isAdminExist = await db
  .select()
  .from(users)
  .where(eq(users.id, "admin"))
  .then((res) => res.length > 0);
if (!isAdminExist) {
  await db.insert(users).values({
    id: "admin",
    email: "admin@gmail.com",
    name: "Admin",
    createdAt: new Date(),
    emailVerified: true,
    updatedAt: new Date(),
  });
}
const isSeededTopic = await db
  .select()
  .from(topics)
  .then((res) => res.length > 0);
if (!isSeededTopic) {
  await db.insert(topics).values([
    {
      name: "Chia sẻ",
      description:
        "Chia sẻ về các vấn đề liên quan đến lập trình, công nghệ, và các giải pháp giải quyết thực tế.",
    },
    {
      name: "Hỏi đáp",
      description:
        "Hỏi đáp về các vấn đề liên quan đến lập trình, công nghệ, và các giải pháp giải quyết thực tế.",
    },
    {
      name: "Tin tức",
      description:
        "Tin tức về các vấn đề liên quan đến lập trình, công nghệ, và các giải pháp giải quyết thực tế.",
    },
    {
      name: "Thảo luận",
    },
  ]);
}

// await postService.createPost({
//   title,
//   content: json,
//   topicId: await db.select().from(topics).where(eq(topics.name, "Chia sẻ")).then(res => res[0]!.id),
//   tags: tags
// }, "admin")

const listSlug = [
  "huong-dan-code-game-ran-san-moi",
  "5-thuat-toan-tim-kiem-moi-ltv-nen-biet",
  "4-ngon-ngu-khong-nen-hoc-nam-2021",
  "solid-nguyen-tac-co-ban-trong-coding",
  "toi-uu-hoa-lambda-function-voi-nodejs",
  "cryptography-co-dien-ma-thay-the-phan-1",
  "thuat-toan-la-gi-hoc-thuat-toan-lam-quai-gi",
  "cau-truc-du-lieu-than-thanh-mang-ten-map",
  "cau-truc-du-lieu-kieu-tap-hop-va-ung-dung",
];

// delete all posts
await db.delete(posts);
for await (const slug of listSlug) {
  const response = await axios.get<Root>(
    `https://api.codelearn.io/sharing/blog/detail?permalink=${slug}`,
  );
  const data = response.data.data;
  const title = data.title;
  const content = data.content;
  const tags = data.tags;
  await postService.createPost(
    {
      title,
      content: generateJSONFromHTML(content),
      topicId: await db
        .select()
        .from(topics)
        .where(eq(topics.name, "Chia sẻ"))
        .then((res) => res[0]!.id),
      tags: tags,
      shortDescription: data.description,
    },
    "admin",
  );
}
