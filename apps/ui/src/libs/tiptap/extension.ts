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
