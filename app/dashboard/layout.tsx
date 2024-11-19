import { AppSidebar } from "@/components/app-sidebar"
import DynamicBreadcrumbs from "@/components/dynamic-breadcrumbs";
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import * as jose from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export default async function DashboardLayout({children}:{children: React.ReactNode}) {
  const token = await cookies().get("token")?.value;

  if (!token) redirect("/login");

  const { payload } = await jose.jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
  const userId = payload.id as string;

  if (!userId) {
    console.error("User ID is missing from token payload.");
    redirect("/login");
  }
  return (
    <SidebarProvider>
      <AppSidebar id={payload.id as string} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DynamicBreadcrumbs/>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
