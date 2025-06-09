import githubDark from "@/libs/themes/monaco/gitHub-dark.json";
import githubLight from "@/libs/themes/monaco/gitHub-light.json";
import Editor, { type Monaco } from "@monaco-editor/react";
import { useEffect, useState } from "react";

interface CodeEditorWrapperProps extends React.ComponentProps<typeof Editor> {
  mode?: string;
}

export default function CodeEditor({
  mode = "light",
  ...props
}: CodeEditorWrapperProps) {
  const [resolvedTheme, setResolvedTheme] = useState<
    "github-light" | "github-dark"
  >("github-light");

  // Determine actual theme based on mode
  useEffect(() => {
    const systemIsDark = window.matchMedia?.(
      "(prefers-color-scheme: dark)",
    ).matches;
    if (mode === "dark") setResolvedTheme("github-dark");
    else if (mode === "light") setResolvedTheme("github-light");
    else setResolvedTheme(systemIsDark ? "github-dark" : "github-light");
  }, [mode]);

  // Init theme
  const handleEditorWillMount = (monaco: Monaco) => {
    monaco.editor.defineTheme("github-light", githubLight as never);
    monaco.editor.defineTheme("github-dark", githubDark as never);
    props.beforeMount?.(monaco);
  };

  return (
    <Editor
      theme={resolvedTheme}
      beforeMount={handleEditorWillMount}
      {...props}
    />
  );
}
