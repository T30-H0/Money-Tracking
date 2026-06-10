import type { UserProfile } from "@/types/profile";

export const mockUserProfile: UserProfile = {
  name: "Tao Ho",
  role: "Personal finance member",
  avatarUrl: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80",
  info: [
    {
      label: "Email",
      value: "tao.ho@example.com",
      icon: "email",
    },
    {
      label: "Phone",
      value: "+1 (555) 014-9021",
      icon: "phone",
    },
    {
      label: "Location",
      value: "San Francisco, CA",
      icon: "location",
    },
    {
      label: "Member since",
      value: "January 2025",
      icon: "calendar",
    },
  ],
};
