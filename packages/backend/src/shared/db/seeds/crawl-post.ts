


import axios from "axios";
export interface Root {
  code: number
  message: any
  errors: any[]
  data: Data
  meta: any
  isValid: boolean
  success: boolean
  deleted: boolean
}

export interface Data {
  relatedPosts: RelatedPost[]
  isEdit: boolean
  isReview: boolean
  sameOwnerBlogs: SameOwnerBlog[]
  topReadBlogs: TopReadBlog[]
  ownerName: string
  ownerAvatar: string
  ownerExpLevel: OwnerExpLevel2
  commentCount: number
  rateSummary: RateSummary2
  userId: number
  contextId: number
  contextType: number
  finalTotalViews: number
  finalTotalShares: number
  isTopTrending: boolean
  isHot: boolean
  isLatest: boolean
  isTrending: boolean
  id: number
  title: string
  permalink: string
  description: string
  imageUrl: string
  content: string
  ownerId: number
  tags: string[]
  isPublish: boolean
  publishTime: string
  isDraft: boolean
  externalId: number
  totalViews: number
  totalShares: number
  newTotalViews: number
  newTotalShares: number
  updatedAt: string
  createdAt: string
  deleted: boolean
}

export interface RelatedPost {
  ownerName: string
  ownerAvatar: string
  ownerExpLevel: OwnerExpLevel
  commentCount: number
  rateSummary: RateSummary
  userId: number
  contextId: number
  contextType: number
  finalTotalViews: number
  finalTotalShares: number
  isTopTrending: boolean
  isHot: boolean
  isLatest: boolean
  isTrending: boolean
  id: number
  title: string
  permalink: string
  description: string
  imageUrl: string
  content: any
  ownerId: number
  tags: string[]
  isPublish: boolean
  publishTime: string
  isDraft: boolean
  externalId: any
  totalViews: number
  totalShares: number
  newTotalViews: number
  newTotalShares: number
  updatedAt: string
  createdAt: string
  deleted: boolean
}

export interface OwnerExpLevel {
  userLevelId: number
  name: string
  iconUrl: string
  levelNo: number
  absoluteExperiencePoint: number
  currentUserExperiencePoint: number
  relativeExperiencePoint: number
  nextLevelExp: number
  nextLevelIconUrl: string
  defaultUserAvatarUrl: string
}

export interface RateSummary {
  id: number
  isVote: number
  totalPoint: number
  totalNegativePoint: number
  totalUser: number
  contextId: number
  contextType: number
  userRate: number
  avgRate: number
}

export interface SameOwnerBlog {
  ownerName: any
  ownerAvatar: any
  ownerExpLevel: any
  commentCount: number
  rateSummary: any
  userId: number
  contextId: number
  contextType: number
  finalTotalViews: number
  finalTotalShares: number
  isTopTrending: boolean
  isHot: boolean
  isLatest: boolean
  isTrending: boolean
  id: number
  title: string
  permalink: string
  description: any
  imageUrl: string
  content: any
  ownerId: number
  tags: any
  isPublish: boolean
  publishTime: any
  isDraft: boolean
  externalId: any
  totalViews: number
  totalShares: number
  newTotalViews: number
  newTotalShares: number
  updatedAt: any
  createdAt: any
  deleted: boolean
}

export interface TopReadBlog {
  ownerName: any
  ownerAvatar: any
  ownerExpLevel: any
  commentCount: number
  rateSummary: any
  userId: number
  contextId: number
  contextType: number
  finalTotalViews: number
  finalTotalShares: number
  isTopTrending: boolean
  isHot: boolean
  isLatest: boolean
  isTrending: boolean
  id: number
  title: string
  permalink: string
  description: any
  imageUrl: any
  content: any
  ownerId: number
  tags: any
  isPublish: boolean
  publishTime: any
  isDraft: boolean
  externalId: any
  totalViews: number
  totalShares: number
  newTotalViews: number
  newTotalShares: number
  updatedAt: any
  createdAt: any
  deleted: boolean
}

export interface OwnerExpLevel2 {
  userLevelId: number
  name: string
  iconUrl: string
  levelNo: number
  absoluteExperiencePoint: number
  currentUserExperiencePoint: number
  relativeExperiencePoint: number
  nextLevelExp: number
  nextLevelIconUrl: string
  defaultUserAvatarUrl: string
}

export interface RateSummary2 {
  id: number
  isVote: number
  totalPoint: number
  totalNegativePoint: number
  totalUser: number
  contextId: number
  contextType: number
  userRate: number
  avgRate: number
}

const response = await axios.get<Root>("https://api.codelearn.io/sharing/blog/detail?permalink=huong-dan-code-game-ran-san-moi")
const data = response.data.data;
const title = data.title;
const content = data.content;
const tags = data.tags;
console.log(title,tags, content);


