import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import type { ReactNode } from "react";

interface ThemeWrapperProps {
  children: ReactNode;
}

export function ThemeWrapper({ children }: ThemeWrapperProps) {
  return (
    <ThemeProvider>
      <Header />
      {children}
    </ThemeProvider>
  );
}
