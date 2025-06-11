import React from "react";

import Image from "next/image";

import { EnhancedUser } from "@/types/auth.types";

interface ProfileBadgeProps {
  user: EnhancedUser | null;
  isCompact?: boolean;
}

const ProfileBadge = ({ user, isCompact }: ProfileBadgeProps) => {
  if (isCompact) {
    return (
      <div className="avatar mb-6">
        <div className="ring-primary ring-offset-base-100 w-10 rounded-full ring ring-offset-2">
          <Image src={"/avatar.png"} alt="User Avatar" width={50} height={50} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 p-2 overflow-hidden">
      <div className="avatar">
        <div className="ring-primary ring-offset-base-100 w-10 rounded-full ring ring-offset-2 h-10">
          <Image src={"/avatar.png"} alt="User Avatar" width={50} height={50} />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-purple-primary font-bold text-md overflow-hidden">{user?.username}</span>
        <span className="text-gray-primary text-xs mt-1 overflow-hidden">{user?.role}</span>
      </div>
    </div>
  );
};

export default ProfileBadge;
