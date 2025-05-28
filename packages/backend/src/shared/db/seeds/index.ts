import { db } from ".."; // Drizzle instance
import { languages, problems, tags } from "../schema";

async function main() {
	// Xoá dữ liệu cũ
	await db.delete(problems);
	await db.delete(tags);
	await db.delete(languages);

	// Danh sách ngôn ngữ
	const listLanguage = [
		{
			name: "Python",
			sourceFile: "main.py",
			binaryFile: null,
			compileCommand: null,
			runCommand: "python3 main.py",
			version: "3.8",
			canDelete: false,
			isActive: true,
			monacoCodeLanguage: "python",
			templateCode: "# Write your code here",
			createdAt: new Date(),
			createdBy: "system",
		},
		{
			name: "Go",
			sourceFile: "main.go",
			binaryFile: "main.out",
			compileCommand: "go build -o main.out main.go",
			runCommand: "./main.out",
			version: "1.16",
			canDelete: false,
			isActive: true,
			monacoCodeLanguage: "go",
			templateCode: "package main",
			createdAt: new Date(),
			createdBy: "system",
		},
		{
			name: "Node.js",
			sourceFile: "main.js",
			binaryFile: null,
			compileCommand: null,
			runCommand: "node main.js",
			version: "14",
			canDelete: false,
			isActive: true,
			monacoCodeLanguage: "javascript",
			templateCode: "// Write your code here",
			createdAt: new Date(),
			createdBy: "system",
		},
		{
			name: "Shell",
			sourceFile: "main.sh",
			binaryFile: null,
			compileCommand: null,
			runCommand: "/bin/bash main.sh",
			version: "5",
			canDelete: false,
			isActive: true,
			monacoCodeLanguage: "shell",
			templateCode: "# Write your code here",
			createdAt: new Date(),
			createdBy: "system",
		},
		{
			name: "C++",
			sourceFile: "main.cpp",
			binaryFile: "main.out",
			compileCommand: "g++ -o main.out main.cpp",
			runCommand: "./main.out",
			version: "11",
			canDelete: false,
			isActive: true,
			monacoCodeLanguage: "cpp",
			templateCode: "#include <iostream>",
			createdAt: new Date(),
			createdBy: "system",
		},
	];

	// Insert
	await db.insert(languages).values(listLanguage).onConflictDoNothing();
}

main()
	.catch(console.error)
	.finally(() => process.exit(0));
