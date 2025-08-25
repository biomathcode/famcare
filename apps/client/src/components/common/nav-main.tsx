import {
  IconCirclePlusFilled,
  IconDashboard,
  IconFileText,
  IconSearch,
  IconReport,
  IconUsers,
  IconSettings,
} from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { useNavigate } from "@tanstack/react-router";

export function NavMain() {
  const nav = useNavigate();

  const items = [
    {
      title: "Dashboard",
      navigate: () => nav({ to: "/app" }),
      icon: IconDashboard,
    },
    {
      title: "My Records",
      navigate: () => nav({ to: "/app/records" }),
      icon: IconFileText,
    },
    {
      title: "Family Members",
      navigate: () => nav({ to: "/app/family" }),
      icon: IconUsers,
    },
    {
      title: "Search",
      navigate: () => nav({ to: "/app/search" }),
      icon: IconSearch,
    },
    {
      title: "Evaluations",
      navigate: () => nav({ to: "/app/evaluations" }),
      icon: IconReport,
    },
    {
      title: "Settings",
      navigate: () => nav({ to: "/app/settings" }),
      icon: IconSettings,
    },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              onClick={() => nav({ to: "/app/create" })}
              tooltip="Quick Upload"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <IconCirclePlusFilled />
              <span>Upload Record</span>
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
