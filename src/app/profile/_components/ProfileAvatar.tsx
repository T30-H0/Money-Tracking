import { Camera } from "lucide-react";

interface ProfileAvatarProps {
  avatarUrl: string;
  name: string;
}

export function ProfileAvatar({ avatarUrl, name }: ProfileAvatarProps) {
  return (
    <div className="relative">
      <img
        src={avatarUrl}
        alt={`${name} avatar`}
        className="size-32 rounded-full border-4 border-white object-cover shadow-md"
      />
      <button
        type="button"
        aria-label="Edit profile avatar"
        className="absolute bottom-1 right-1 grid size-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-100"
      >
        <Camera className="size-4" />
      </button>
    </div>
  );
}
