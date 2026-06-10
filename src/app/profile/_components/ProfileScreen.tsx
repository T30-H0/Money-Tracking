"use client";

import { LogIn, LogOut } from "lucide-react";

import { ProfileAvatar } from "@/app/profile/_components/ProfileAvatar";
import { ProfileInfoList } from "@/app/profile/_components/ProfileInfoList";
import { Button } from "@/components/ui/button";
import { useProfileSession } from "@/hooks/useProfileSession";
import type { UserProfile } from "@/types/profile";

interface ProfileScreenProps {
  profile: UserProfile;
}

export function ProfileScreen({ profile }: ProfileScreenProps) {
  const { isLoggedIn, toggleSession } = useProfileSession();
  const AuthIcon = isLoggedIn ? LogOut : LogIn;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex items-center justify-end">
        <Button
          type="button"
          variant={isLoggedIn ? "outline" : "default"}
          onClick={toggleSession}
          className="gap-2"
        >
          <AuthIcon className="size-4" />
          {isLoggedIn ? "Logout" : "Login"}
        </Button>
      </div>

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col items-center text-center">
          <ProfileAvatar avatarUrl={profile.avatarUrl} name={profile.name} />
          <div className="mt-5">
            <h1 className="text-2xl font-semibold text-gray-900">
              {profile.name}
            </h1>
            <p className="mt-1 text-sm text-gray-500">{profile.role}</p>
            <span className="mt-3 inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
              {isLoggedIn ? "Logged in" : "Logged out"}
            </span>
          </div>
        </div>

        <div className="mt-8">
          <ProfileInfoList items={profile.info} />
        </div>
      </section>
    </div>
  );
}
