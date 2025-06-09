import { createListCollection } from "@chakra-ui/react";
import type { ValueChangeDetails } from "node_modules/@chakra-ui/react/dist/types/components/select/namespace"; // Verify this path
import { useCallback, useMemo } from "react";
import { useEditorContext } from "../contexts/EditorContext";

type LanguageItem = {
  value: string;
  label: string;
  monacoLanguage: string;
};
type Langs = {
  id: number;
  name: string;
  version: string | null;
  monacoCodeLanguage: string | null;
}[];
export function useLanguageSelection(initialLanguages: Langs) {
  const {
    editor: editorRef,
    monaco: monacoRef,
    language: selectedLanguage,
    setLanguage: setSelectedLanguage,
  } = useEditorContext();
  const languageCollection = useMemo(
    () =>
      createListCollection<LanguageItem>({
        items: initialLanguages.map((lang) => ({
          value: lang.id.toString(),
          label: lang.name,
          monacoLanguage: lang.monacoCodeLanguage || "plaintext",
        })),
      }),
    [initialLanguages],
  );

  const setInitialEditorLanguage = useCallback(() => {
    const initialLangItem = languageCollection.items.find(
      (item) =>
        item.value.toString() === (initialLanguages?.[0]?.id?.toString() || ""),
    );
    if (initialLangItem) {
      setSelectedLanguage(initialLangItem.value);
      if (monacoRef.current && editorRef.current?.getModel()) {
        monacoRef.current.editor.setModelLanguage(
          editorRef.current.getModel()!,
          initialLangItem.monacoLanguage,
        );
      }
    }
  }, [
    languageCollection.items,
    initialLanguages,
    setSelectedLanguage,
    monacoRef,
    editorRef,
  ]);

  const handleLanguageChange = useCallback(
    (details: ValueChangeDetails<LanguageItem>) => {
      const langValue = Array.isArray(details.value)
        ? details.value[0]
        : details.value;
      if (langValue === undefined) return;

      const selectedItem = languageCollection.items.find(
        (item) => item.value.toString() === langValue.toString(),
      );
      if (!selectedItem) return;

      setSelectedLanguage(selectedItem.value);

      if (
        monacoRef.current &&
        editorRef.current?.getModel() &&
        selectedItem.monacoLanguage
      ) {
        monacoRef.current.editor.setModelLanguage(
          editorRef.current.getModel()!,
          selectedItem.monacoLanguage,
        );
      }
    },
    [languageCollection.items, setSelectedLanguage, monacoRef, editorRef],
  );

  return {
    languageCollection,
    selectedLanguage,
    handleLanguageChange,
    setInitialEditorLanguage,
  };
}
