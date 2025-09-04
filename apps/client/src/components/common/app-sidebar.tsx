import * as React from "react";
import { IconMessage } from "@tabler/icons-react";

import { NavMain } from "@/components/common/nav-main";
import { NavUser } from "@/components/common/nav-user";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,

} from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { getChatSessions } from "~/lib/db/queries";
import LogoIcon from "../logo";


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: chatSessions } = useQuery({
    queryKey: ['chatSessions'],
    queryFn: getChatSessions
  });

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <LogoIcon />
                {/* <IconInnerShadowTop className="!size-5" /> */}
                <span className="text-base font-semibold">FamCare</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <Collapsible
          defaultOpen
          className="group/collapsible"
        >
          <SidebarGroup>
            <SidebarGroupLabel
              asChild
              className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
            >
              <CollapsibleTrigger>
                <div className="flex gap-2 items-center ">
                  <IconMessage size={16} />
                  Previous Chat
                </div>


                <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {chatSessions?.map((chat) => (
                    <SidebarMenuItem key={chat.title}>
                      <SidebarMenuButton asChild isActive={chat.isActive}>
                        <a href={"/app/chat/" + chat.id}>{chat.title}</a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>


      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
