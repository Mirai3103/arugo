import { Toaster } from "@/components/ui/toaster";
import { ChakraProvider } from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";
import { system } from "./theme";
export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider>
        <>
          <Toaster />
          {props.children}
        </>
      </ColorModeProvider>
    </ChakraProvider>
  );
}
