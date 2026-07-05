import { PersonaProvider } from "@/context/PersonaContext";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { MobileNav } from "@/components/sidebar/MobileNav";
import { DashboardNavbar } from "@/components/navbar/DashboardNavbar";
import { PersonaSwitcher } from "@/components/persona/PersonaSwitcher";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PersonaProvider>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardNavbar />
          <div className="border-b border-white/5 px-4 py-2 sm:hidden">
            <PersonaSwitcher compact />
          </div>
          <main className="min-h-0 flex-1 pb-16 lg:pb-0">{children}</main>
        </div>
        <MobileNav />
      </div>
    </PersonaProvider>
  );
}
