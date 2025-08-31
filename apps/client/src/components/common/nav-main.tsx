import {
  IconCirclePlusFilled,
  IconDashboard,
  IconFileText,
  IconUsers,
  IconSettings,
  IconMessage,
  IconCalendarWeek,
  IconSalad,
  IconTreadmill,
  IconPill,
  IconBed,
} from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { useNavigate, useRouteContext, Link } from "@tanstack/react-router";

import { createChatSession } from '@/lib/api/chatSession';


const navItems = [
  {
    title: "Previous Chats",
    path: "/app/chats",
    icon: IconMessage,
  },
  {
    title: "Dashboard",
    path: "/app/home",
    icon: IconDashboard,
  },
  {
    title: "Health Records",
    path: "/app/records",
    icon: IconFileText,
  },
  {
    title: "Family Members",
    path: "/app/members",
    icon: IconUsers,
  },

  {
    title: "Diet",
    path: "/app/diet",
    icon: IconSalad,
  },
  {
    title: "Exercise",
    path: "/app/exercise",
    icon: IconTreadmill,
  },
  {
    title: "Calendar",
    path: "/app/calendar",

    icon: IconCalendarWeek,
  },

  {
    title: "Settings",
    path: "/app/settings",

    icon: IconSettings,
  },

  {
    title: "Medicines",
    path: "/app/medicines",
    icon: IconPill,
  },
  {
    title: "Sleep",
    path: "/app/sleep",
    icon: IconBed,

  }
];

export function NavMain() {
  const nav = useNavigate();
  const { user } = useRouteContext({ from: '/app' });



  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            {/* TODO: Add Create Session here and Router to that page */}
            <SidebarMenuButton
              onClick={async () => {
                const chatSession = await createChatSession({
                  data: {
                    userId: user?.id || ''
                  }
                })

                console.log(chatSession);
                nav({ to: `/app/chat/${chatSession.id}` })

              }}
              tooltip="Quick Upload"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <IconCirclePlusFilled />
              <span>Create Chat</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {navItems.map(({ title, path, icon: Icon }) => (
            <SidebarMenuItem key={title}>
              <SidebarMenuButton asChild tooltip={title}>
                <Link
                  to={path}
                  activeProps={{
                    className: "bg-muted text-foreground font-medium",
                  }}
                  inactiveProps={{
                    className: "hover:bg-muted/50",
                  }}
                >
                  <Icon />
                  <span>{title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
