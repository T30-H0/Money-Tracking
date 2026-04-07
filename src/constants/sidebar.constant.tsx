import { NavItem } from "@/types/sidebar";
import {
  HomeIcon,
  UserIcon,
  CogIcon,
  DocumentTextIcon,
} from "@heroicons/react/16/solid";

export const navItems: NavItem[] = [
  {
    icon: <HomeIcon />,
    label: "Home",
    href: "/home",
  },
  {
    icon: <DocumentTextIcon />,
    label: "Posts",
    href: "/posts",
  },
  {
    icon: <UserIcon />,
    label: "Profile",
    href: "/profile",
  },
  {
    icon: <CogIcon />,
    label: "Settings",
    href: "/settings",
  },
];
