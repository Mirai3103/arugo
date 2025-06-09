// src/types/problem.ts (Ví dụ)
export enum ProblemDifficulty {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard",
}

export enum ProblemStatus {
  Unsolved = "Unsolved",
  Attempted = "Attempted", // Đã thử nhưng chưa AC
  Solved = "Solved", // Accepted
}

export interface Problem {
  id: string; // Hoặc number, dùng string để giống LeetCode ID
  title: string;
  difficulty: ProblemDifficulty;
  tags: string[];
  status: ProblemStatus; // Trạng thái của người dùng hiện tại với bài này
  acceptance?: string; // Tỷ lệ chấp nhận (ví dụ: '45.6%') - Optional
  // Thêm các trường khác nếu cần: frequency, isPremium, etc.
}

export const mockProblems: Problem[] = [
  {
    id: "1",
    title: "Two Sum",
    difficulty: ProblemDifficulty.Easy,
    tags: ["Array", "Hash Table"],
    status: ProblemStatus.Solved,
    acceptance: "48.2%",
  },
  {
    id: "2",
    title: "Add Two Numbers",
    difficulty: ProblemDifficulty.Medium,
    tags: ["Linked List", "Math", "Recursion"],
    status: ProblemStatus.Attempted,
    acceptance: "39.5%",
  },
  {
    id: "3",
    title: "Longest Substring Without Repeating Characters",
    difficulty: ProblemDifficulty.Medium,
    tags: ["Hash Table", "String", "Sliding Window"],
    status: ProblemStatus.Solved,
    acceptance: "33.1%",
  },
  {
    id: "4",
    title: "Median of Two Sorted Arrays",
    difficulty: ProblemDifficulty.Hard,
    tags: ["Array", "Binary Search", "Divide and Conquer"],
    status: ProblemStatus.Unsolved,
    acceptance: "35.8%",
  },
  {
    id: "7",
    title: "Reverse Integer",
    difficulty: ProblemDifficulty.Easy,
    tags: ["Math"],
    status: ProblemStatus.Unsolved,
    acceptance: "27.0%",
  },
  {
    id: "9",
    title: "Palindrome Number",
    difficulty: ProblemDifficulty.Easy,
    tags: ["Math"],
    status: ProblemStatus.Solved,
    acceptance: "52.3%",
  },
  {
    id: "13",
    title: "Roman to Integer",
    difficulty: ProblemDifficulty.Easy,
    tags: ["Hash Table", "Math", "String"],
    status: ProblemStatus.Attempted,
    acceptance: "57.9%",
  },
  {
    id: "14",
    title: "Longest Common Prefix",
    difficulty: ProblemDifficulty.Easy,
    tags: ["String"],
    status: ProblemStatus.Unsolved,
    acceptance: "40.1%",
  },
  {
    id: "20",
    title: "Valid Parentheses",
    difficulty: ProblemDifficulty.Easy,
    tags: ["String", "Stack"],
    status: ProblemStatus.Solved,
    acceptance: "44.5%",
  },
  {
    id: "21",
    title: "Merge Two Sorted Lists",
    difficulty: ProblemDifficulty.Easy,
    tags: ["Linked List", "Recursion"],
    status: ProblemStatus.Unsolved,
    acceptance: "60.0%",
  },
  {
    id: "53",
    title: "Maximum Subarray",
    difficulty: ProblemDifficulty.Easy,
    tags: ["Array", "Divide and Conquer", "Dynamic Programming"],
    status: ProblemStatus.Solved,
    acceptance: "50.1%",
  },
  {
    id: "70",
    title: "Climbing Stairs",
    difficulty: ProblemDifficulty.Easy,
    tags: ["Math", "Dynamic Programming", "Memoization"],
    status: ProblemStatus.Attempted,
    acceptance: "51.5%",
  },
  {
    id: "101",
    title: "Symmetric Tree",
    difficulty: ProblemDifficulty.Easy,
    tags: ["Tree", "Depth-First Search", "Breadth-First Search"],
    status: ProblemStatus.Unsolved,
    acceptance: "52.8%",
  },
  {
    id: "121",
    title: "Best Time to Buy and Sell Stock",
    difficulty: ProblemDifficulty.Easy,
    tags: ["Array", "Dynamic Programming"],
    status: ProblemStatus.Solved,
    acceptance: "53.2%",
  },
  {
    id: "206",
    title: "Reverse Linked List",
    difficulty: ProblemDifficulty.Easy,
    tags: ["Linked List", "Recursion"],
    status: ProblemStatus.Unsolved,
    acceptance: "70.5%",
  },
  {
    id: "226",
    title: "Invert Binary Tree",
    difficulty: ProblemDifficulty.Easy,
    tags: ["Tree", "Depth-First Search", "Breadth-First Search", "Recursion"],
    status: ProblemStatus.Solved,
    acceptance: "73.1%",
  },
  // Thêm nhiều bài nữa để test phân trang và filter...
  {
    id: "15",
    title: "3Sum",
    difficulty: ProblemDifficulty.Medium,
    tags: ["Array", "Two Pointers", "Sorting"],
    status: ProblemStatus.Attempted,
    acceptance: "31.0%",
  },
  {
    id: "49",
    title: "Group Anagrams",
    difficulty: ProblemDifficulty.Medium,
    tags: ["Array", "Hash Table", "String", "Sorting"],
    status: ProblemStatus.Unsolved,
    acceptance: "65.0%",
  },
  {
    id: "5",
    title: "Longest Palindromic Substring",
    difficulty: ProblemDifficulty.Medium,
    tags: ["String", "Dynamic Programming"],
    status: ProblemStatus.Solved,
    acceptance: "32.1%",
  },
  {
    id: "10",
    title: "Regular Expression Matching",
    difficulty: ProblemDifficulty.Hard,
    tags: ["String", "Dynamic Programming", "Recursion"],
    status: ProblemStatus.Unsolved,
    acceptance: "28.0%",
  },
];

// Lấy tất cả các tag duy nhất từ mock data
export const allTags = Array.from(
  new Set(mockProblems.flatMap((p) => p.tags)),
).sort();
