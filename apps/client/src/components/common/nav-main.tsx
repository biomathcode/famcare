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
} from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { useNavigate, useRouter } from "@tanstack/react-router";

import { createChatSession } from '@/lib/api/chatSession';
import { useRouteContext } from "@tanstack/react-router";

export function NavMain() {
  const nav = useNavigate();
  const { user } = useRouteContext({ from: '/app' });

  const items = [
    {
      title: "Previous Chats",
      navigate: () => nav({ to: "/app/chats" }),
      icon: IconMessage,
    },
    {
      title: "Dashboard",
      navigate: () => nav({ to: "/app" }),
      icon: IconDashboard,
    },
    {
      title: "Health Records",
      navigate: () => nav({ to: "/app/records" }),
      icon: IconFileText,
    },
    {
      title: "Family Members",
      navigate: () => nav({ to: "/app/members" }),
      icon: IconUsers,
    },

    {
      title: "Settings",
      navigate: () => nav({ to: "/app/settings" }),
      icon: IconSettings,
    },
    {
      title: "Diet",
      navigate: () => nav({ to: "/app/diet" }),
      icon: IconSalad,
    },
    {
      title: "Exercise",
      navigate: () => nav({ to: "/app/exercise" }),
      icon: IconTreadmill,
    },
    {
      title: "Calendar",
      navigate: () => nav({ to: "/app/calendar" }),
      icon: IconCalendarWeek,
    }
  ];

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
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton onClick={item.navigate} tooltip={item.title}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
