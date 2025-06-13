import Blockquote from "@tiptap/extension-blockquote";
import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import Color from "@tiptap/extension-color";
import Document from "@tiptap/extension-document";
import HardBreak from "@tiptap/extension-hard-break";
import Heading from "@tiptap/extension-heading";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Italic from "@tiptap/extension-italic";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Strike from "@tiptap/extension-strike";
import Text from "@tiptap/extension-text";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Typography from "@tiptap/extension-typography";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";

import { generateHTML, generateJSON } from "@tiptap/html";
import TurndownService from "turndown";
import MarkdownIt from "markdown-it";
import { createLowlight } from "lowlight";

const md = new MarkdownIt({
  html: true, // Cho phép HTML inline nếu OpenAI trả về
  linkify: true, // Tự link hóa URL
  breaks: true, // Giữ xuống dòng
});

const turndownService = new TurndownService();
export const DEFAULT_EXTENSIONS = [
  Blockquote.configure({ HTMLAttributes: { class: "blockquote" } }),
  Bold,
  BulletList,
  Code,
  CodeBlock.configure({ HTMLAttributes: { class: "code-block" } }),
  Color,
  Document,
  HardBreak,
  Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
  HorizontalRule,
  Italic,
  ListItem,
  OrderedList,
  Paragraph,
  Strike,
  Text,
  TextAlign,
  TextStyle,
  Typography,
];

export function generateHTMLFromJSON(
  json: any,
  extensions = DEFAULT_EXTENSIONS,
) {
  return generateHTML(json, extensions);
}
export function generateMarkdownFromJSON(
  json: any,
  extensions = DEFAULT_EXTENSIONS,
) {
  const html = generateHTML(json, extensions);
  return turndownService.turndown(html);
}

export function generateHTMLFromMarkdown(markdown: string) {
  return md.render(markdown);
}

export function generateJSONFromMarkdown(markdown: string) {
  const html = generateHTMLFromMarkdown(markdown);
  return generateJSON(html, DEFAULT_EXTENSIONS) as any;
}

export function generateJSONFromHTML(html: string) {
  return generateJSON(html, DEFAULT_EXTENSIONS) as any;
}
