import { QueryClientProvider } from "@/components/QueryClientProvider";
import type { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return <QueryClientProvider>{children}</QueryClientProvider>;
}
