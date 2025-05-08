import React from "react";

import Image from "next/image";

import { FiUser, FiMapPin } from "react-icons/fi";

import { EnhancedUser } from "@/types/auth.types";

const defaultAvatar = "/avatar.png";

interface ProfileHeaderProps {
  user: EnhancedUser | null;
  activeTab: "profile" | "addresses";
  setActiveTab: React.Dispatch<React.SetStateAction<"profile" | "addresses">>;
}

const ProfileHeader = ({ user, activeTab, setActiveTab }: ProfileHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-purple-500 to-purple-900 text-white p-8 relative">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="avatar">
          <div className="w-28 h-28 rounded-full ring-4 ring-white ring-offset-base-100 ring-offset-2 overflow-hidden bg-white">
            <Image
              src={user?.avatar || defaultAvatar}
              alt="Profile"
              width={128}
              height={128}
              className="object-cover"
            />
          </div>
        </div>
        <div className="text-center md:text-left flex-1">
          <h2 className="text-2xl font-bold mb-1">{user?.username || "Your Profile"}</h2>
          <p className="opacity-90 mb-3">{user?.email}</p>
          <div className="badge badge-outline badge-lg text-white border-white uppercase">
            {user?.role || "Customer"}
          </div>
        </div>
      </div>

      {/* Custom Tabs */}
      <div className="absolute bottom-0 left-8 transform translate-y-1/2 flex gap-2">
        <button
          onClick={() => setActiveTab("profile")}
          className={`btn shadow-md ${
            activeTab === "profile" ? "btn-neutral text-white" : "btn-ghost bg-white/90 text-gray-800 hover:bg-white"
          } px-6 rounded-full`}
          type="button"
        >
          <FiUser className="mr-2" /> Profile
        </button>
        <button
          onClick={() => setActiveTab("addresses")}
          className={`btn shadow-md ${
            activeTab === "addresses" ? "btn-neutral text-white" : "btn-ghost bg-white/90 text-gray-800 hover:bg-white"
          } px-6 rounded-full`}
          type="button"
        >
          <FiMapPin className="mr-2" /> Addresses
        </button>
      </div>
    </div>
  );
};

export default React.memo(ProfileHeader);
