import { ProfileScreen } from "@/app/profile/_components/ProfileScreen";
import { mockUserProfile } from "@/themes/profile-data";

export default function ProfilePage() {
  return <ProfileScreen profile={mockUserProfile} />;
}
