"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Command } from "lucide-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [activeUrl, setActiveUrl] = React.useState<string>();

  React.useEffect(() => {
    // Inisialisasi activeUrl dengan URL saat ini
    setActiveUrl(window.location.pathname);
  }, []); // Efek ini hanya dijalankan sekali ketika komponen pertama kali dirender

  const data = {
    versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
    navMain: [
      {
        title: "table",
        url: "",
        items: [
          {
            title: "project",
            url: "/admin/project",
          },
          {
            title: "blog",
            url: "/admin/blog",
          },
        ],
      },
    ],
  };
  const handleIsActive = (url: string) => {
    setActiveUrl(url);
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenuButton size="lg" asChild>
          <a href="#">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Command className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Acme Inc</span>
              <span className="truncate text-xs">Enterprise</span>
            </div>
          </a>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            {/* <SidebarGroupLabel>{item.title}</SidebarGroupLabel> */}
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={activeUrl === item.url ? true : false} // Cek apakah URL yang diklik aktif
                      onClick={() => handleIsActive(item.url)}
                    >
                      <Link href={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
