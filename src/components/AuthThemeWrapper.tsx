import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import type { ReactNode } from "react";

interface AuthThemeWrapperProps {
  children: ReactNode;
}

export function AuthThemeWrapper({ children }: AuthThemeWrapperProps) {
  return (
    <ThemeProvider>
      <Header />
      {children}
    </ThemeProvider>
  );
}
