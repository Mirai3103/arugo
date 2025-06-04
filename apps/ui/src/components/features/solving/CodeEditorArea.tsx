import CodeEditor from "@/components/common/CodeEditor";
import useUuid from "@/hooks/useUuid";
import {
	Box,
	Button,
	Flex,
	HStack,
	Icon,
	IconButton,
	Select,
} from "@chakra-ui/react";
import type { Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useTheme } from "next-themes";
import { FiCheckSquare, FiPlay } from "react-icons/fi";
import { IoRefresh } from "react-icons/io5";
import { LuMaximize2 } from "react-icons/lu";
import { MdFormatAlignJustify } from "react-icons/md";
import { useIsClient } from "usehooks-ts";

import type { FullProblem } from "@repo/backend/problems/problemService";
import { useCodeTesting } from "./hooks/useCodeTesting";
import { useLanguageSelection } from "./hooks/useLanguageSelection";
import { useSubmissionPolling } from "./hooks/useSubmissionPolling";
import { useEditorContext } from "./contexts/EditorContext";
import { useNavigate } from "@tanstack/react-router";
interface CodeEditorAreaProps {
	problem: FullProblem;
	allowTest?: boolean;
}
const CodeEditorArea = ({ problem, allowTest = true }: CodeEditorAreaProps) => {
	const isClient = useIsClient();
	const { theme } = useTheme();
	const { editor: editorRef, monaco: monacoRef } = useEditorContext();
	console.log({ editorRef, monacoRef, theme });
	const { uuid, renewUuid, clearUuid } = useUuid("");

	const {
		languageCollection,
		selectedLanguage,
		handleLanguageChange,
		setInitialEditorLanguage,
	} = useLanguageSelection(problem.languages);

	const getEditorCode = () => editorRef.current?.getModel()?.getValue() || "";

	const { handleTestCode, isRunningCode, handleSubmitCode } = useCodeTesting(
		problem,
		selectedLanguage,
		getEditorCode,
		renewUuid
	);

	// isPolling can be used to disable buttons or show loading indicators if needed
	const { isPolling } = useSubmissionPolling(uuid, clearUuid);

	function handleEditorDidMount(
		editorInstance: editor.IStandaloneCodeEditor,
		monacoInstance: Monaco
	) {
		if (!editorRef || !monacoRef) {
			console.error("Editor or Monaco instance is not available");
			return;
		}
		editorRef.current = editorInstance;
		monacoRef.current = monacoInstance;
		setInitialEditorLanguage();
	}
	const borderColor = { base: "gray.200", _dark: "gray.700" };
	const navigate = useNavigate();

	if (!isClient || !editorRef || !monacoRef) {
		return null;
	}
	const submitCode = () => {
		handleSubmitCode()
		.then((newId) => {
			navigate({
				to:"/problems/$slug/submissions/$id",
				params:{
					slug: problem.slug!,
					id: newId,
				}
			})
		}
		);
	}

	return (
		<Flex
			direction="column"
			h="100%"
			overflow="hidden"
			position={"relative"}
		>
			<Box position="absolute" bottom={"10px"} right={"10px"} zIndex={1}>
				<HStack mt={4} justifyContent="flex-end" gap={3}>
					<Button
						colorPalette="gray"
						variant="subtle"
						size="sm"
						onClick={handleTestCode}
						loading={isRunningCode || isPolling}
						disabled={
							!selectedLanguage ||
							isRunningCode ||
							isPolling ||
							!allowTest
						}
					>
						Chạy thử
						<Icon as={FiPlay} />
					</Button>
					<Button
						colorPalette="green"
						size="sm"
						loading={isRunningCode || isPolling}
						onClick={submitCode}
						disabled={
							!selectedLanguage || isRunningCode || isPolling
						}
					>
						Nộp bài
						<Icon as={FiCheckSquare} />
					</Button>
				</HStack>
			</Box>
			<HStack
				p={1}
				borderBottomWidth="1px"
				borderColor={borderColor}
				flexShrink={0}
			>
				<Select.Root
					collection={languageCollection}
					value={selectedLanguage ? [selectedLanguage] : []}
					onValueChange={handleLanguageChange}
					width="150px"
					size="xs"
				>
					<Select.Control>
						<Select.Trigger>
							<Select.ValueText placeholder="Chọn ngôn ngữ" />
						</Select.Trigger>
						<Select.IndicatorGroup>
							<Select.Indicator />
						</Select.IndicatorGroup>
					</Select.Control>
					<Select.Positioner>
						<Select.Content>
							{languageCollection.items.map((lang) => (
								<Select.Item item={lang} key={lang.value}>
									<Select.ItemText>
										{lang.label}
									</Select.ItemText>
								</Select.Item>
							))}
						</Select.Content>
					</Select.Positioner>
				</Select.Root>
				<HStack gap={1} ml="auto">
					<IconButton
						aria-label="Format code"
						size="sm"
						variant="ghost"
					>
						<MdFormatAlignJustify />
					</IconButton>
					<IconButton
						aria-label="Reset code"
						size="sm"
						variant="ghost"
					>
						<IoRefresh />
					</IconButton>
					<IconButton
						aria-label="Maximize editor"
						size="sm"
						variant="ghost"
					>
						<LuMaximize2 />
					</IconButton>
				</HStack>
			</HStack>
			<Box flexGrow={1} p={0.5} position="relative" overflow="hidden">
				<CodeEditor
					height="100%"
					options={{
						minimap: { enabled: false },
					}}
					onMount={handleEditorDidMount}
					mode={theme} // theme from next-themes
				/>
			</Box>
		</Flex>
	);
};

export default CodeEditorArea;
