import {
    IconDashboard,
    IconFileText,
    IconUsers,
    IconSettings,
    IconCalendarWeek,
    IconSalad,
    IconTreadmill,
    IconPill,
    IconBed,
} from "@tabler/icons-react";

export const navItems = [

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
        title: "Medicines",
        path: "/app/medicines",
        icon: IconPill,
    },
    {
        title: "Sleep",
        path: "/app/sleep",
        icon: IconBed,

    },

    {
        title: "Settings",
        path: "/app/settings",

        icon: IconSettings,
    },
];