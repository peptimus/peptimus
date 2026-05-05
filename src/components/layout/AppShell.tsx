import { TopNavbar } from "./TopNavbar";
import { LeftSidebar } from "./LeftSidebar";
import { RightInsightsPanel } from "./RightInsightsPanel";
import { BottomBar } from "./BottomBar";
import { SearchDropdown } from "./SearchDropdown";
import { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden relative">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2h2v2h20v2H22v2.5h18v2H22v18h-2v-18H0v-2h20z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}
      />

      <TopNavbar />

      <div className="flex flex-1 overflow-hidden z-10">
        <LeftSidebar />

        <main className="flex-1 overflow-y-auto bg-background/50 relative">
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-background/0 to-background/50" />
          <div className="relative z-10 min-h-full p-4 pb-32 lg:pb-8 lg:p-8">
            <div className="md:hidden mb-4">
              <SearchDropdown />
            </div>
            {children}
          </div>
        </main>

        <div className="hidden lg:flex">
          <RightInsightsPanel />
        </div>
      </div>

      <BottomBar />
    </div>
  );
}
