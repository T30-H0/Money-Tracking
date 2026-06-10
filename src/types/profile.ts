export type ProfileInfoIcon = "calendar" | "email" | "location" | "phone";

export interface ProfileInfoItem {
  label: string;
  value: string;
  icon: ProfileInfoIcon;
}

export interface UserProfile {
  name: string;
  role: string;
  avatarUrl: string;
  info: ProfileInfoItem[];
}
