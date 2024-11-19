"use client";

import * as React from "react";
import {
  AudioWaveform,
  Book,
  BookOpen,
  Command,
  GalleryVerticalEnd,
  Users,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { TeamSwitcher } from "./team-switcher";
import useFetchData from "@/hooks/use-fetch-data";
import { Skeleton } from "./ui/skeleton";

// This is sample data.
const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Books",
      url: "/dashboard/books",
      icon: Book,
    },
    {
      title: "User",
      url: "/dashboard/users",
      icon: Users,
    },
  ],
};

export function AppSidebar({
  id,
  ...props
}: React.ComponentProps<typeof Sidebar> & { id: string }) {
  const {
    data: user,
    error,
    isPending,
    isError,
    isSuccess,
  } = useFetchData({ tags: "profile", endpointOptions: `/users/${id}` });
  

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex gap-2 items-center"><BookOpen className="size-6" /> <p className="text-lg font-bold">Literasi</p></div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        {(isPending && (
          <div className="p-3 flex gap-2 items-center">
            <Skeleton className="h-8 rounded-full w-8 bg-muted-foreground/50" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-32 bg-muted-foreground/50" />
              <Skeleton className="h-2 w-24 bg-muted-foreground/50" />
            </div>
          </div>
        )) ||
          (isError && (
            <div className="p-3 text-destructive text-lg">{error?.message}</div>
          ))}{" "}
        {isSuccess && <NavUser user={user?.data} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
