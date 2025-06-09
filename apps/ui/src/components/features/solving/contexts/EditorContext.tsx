import { Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import React, { createContext, useContext, useRef } from "react";

interface EditorContextProps {
  monaco: React.RefObject<Monaco | null>;
  editor: React.RefObject<editor.IStandaloneCodeEditor | null>;
  language: string;
  setLanguage: (lang: string) => void; // Optional: function to set the current language
}
export const EditorContext = createContext<EditorContextProps | undefined>(
  undefined,
);
export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const monaco = useRef<Monaco | null>(null);
  const editor = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [language, setLanguage] = React.useState<string>("plaintext"); // Default language can be set here

  return (
    <EditorContext.Provider value={{ monaco, editor, language, setLanguage }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditorContext = (): EditorContextProps => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditorContext must be used within an EditorProvider");
  }
  return context;
};
