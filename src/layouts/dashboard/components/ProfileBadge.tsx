import React from "react";

import Image from "next/image";

interface ProfileBadgeProps {
  isCompact?: boolean;
  name?: string;
  role?: string;
  avatarSrc?: string;
}

const ProfileBadge = ({
  isCompact = false,
  name = "Ngô Tuấn Anh",
  role = "Sales Manager",
  avatarSrc = "/avatar.png",
}: ProfileBadgeProps) => {
  if (isCompact) {
    return (
      <div className="avatar mb-6">
        <div className="ring-primary ring-offset-base-100 w-10 rounded-full ring ring-offset-2">
          <Image src={avatarSrc} alt="User Avatar" width={50} height={50} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 p-2 overflow-hidden">
      <div className="avatar">
        <div className="ring-primary ring-offset-base-100 w-10 rounded-full ring ring-offset-2 h-10">
          <Image src={avatarSrc} alt="User Avatar" width={50} height={50} />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-purple-primary font-bold text-md overflow-hidden">{name}</span>
        <span className="text-gray-primary text-xs mt-1 overflow-hidden">{role}</span>
      </div>
    </div>
  );
};

export default ProfileBadge;
