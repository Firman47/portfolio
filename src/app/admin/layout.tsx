import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "./header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full">
        <Header />
        <main className=" h-screen w-full">{children}</main>
      </div>
    </SidebarProvider>
  );
}
