import {
  IconCirclePlusFilled,
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
import { navItems } from './nav-items'

export function NavMain() {
  const nav = useNavigate();
  const { user } = useRouteContext({ from: '/app' });
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
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
              className="bg-primary cursor-pointer text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
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
