import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "./header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="w-full px-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
