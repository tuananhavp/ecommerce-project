"use client";
import { useState, useEffect, useCallback } from "react";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

import Loading from "@/components/Loading";
import { useAuthStore } from "@/store/authStore";
import { ProfileFormData, UserProfile } from "@/types/auth.types";
import { Address } from "@/types/order.types";

import AddressManager from "./components/AddressManager";
import ProfileAlert from "./components/ProfileAlert";
import ProfileForm from "./components/ProfileForm";
import ProfileHeader from "./components/ProfileHeader";

const ProfilePage = () => {
  const router = useRouter();
  const { user, isLoading, error, updateProfile, setPrimaryAddress } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"profile" | "addresses">("profile");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [isPasswordChange, setIsPasswordChange] = useState(false);
  const [isEmailChange, setIsEmailChange] = useState(false);
  const [primaryAddressIndex, setPrimaryAddressIndex] = useState<number | undefined>(undefined);

  // Profile form setup
  const profileForm = useForm<ProfileFormData>({
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Load user data when component mounts
  useEffect(() => {
    if (!user && !isLoading) {
      router.push("/login");
      return;
    }

    if (user) {
      profileForm.setValue("username", user.username || "");
      profileForm.setValue("email", user.email || "");
      profileForm.setValue("phone", user.phone || "");

      // Initialize addresses array
      if (user.addresses && user.addresses.length > 0) {
        setAddresses(user.addresses);
      }

      // Set primary address index if it exists
      if (typeof user.primaryAddressIndex !== "undefined") {
        setPrimaryAddressIndex(user.primaryAddressIndex);
      }
    }
  }, [user, isLoading, router, profileForm]);

  // Check if email is changed
  useEffect(() => {
    const email = profileForm.watch("email");
    if (user && email && email !== user.email) {
      setIsEmailChange(true);
    } else {
      setIsEmailChange(false);
    }
  }, [profileForm, user]);

  const togglePasswordChange = useCallback(() => {
    setIsPasswordChange(!isPasswordChange);

    if (!isPasswordChange) {
      const currentValues = profileForm.getValues();
      profileForm.reset({
        ...currentValues,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [isPasswordChange, profileForm]);

  // Handle setting an address as primary
  const handleSetPrimaryAddress = useCallback(
    async (index: number) => {
      // Update local state
      setPrimaryAddressIndex(index);

      // Update in Firebase via our store method
      try {
        await setPrimaryAddress(index);
        setSuccessMessage("Primary address updated");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        console.error("Failed to set primary address:", error);
      }
    },
    [setPrimaryAddress]
  );

  // Handle form submission
  const onSubmit = useCallback(
    async (data: ProfileFormData) => {
      setSuccessMessage("");

      const updateData: Partial<UserProfile> = {
        username: data.username,
        phone: data.phone,
        addresses: addresses,
        primaryAddressIndex: primaryAddressIndex,
      };

      // Add email and password only if they're being changed
      if (isEmailChange) {
        updateData.email = data.email;
      }

      if (isPasswordChange && data.newPassword) {
        updateData.password = data.newPassword;
      }

      // Only send password if email or password is changing
      const needsReauth = isEmailChange || isPasswordChange;

      try {
        const success = await updateProfile(updateData, needsReauth ? data.currentPassword : null);

        if (success) {
          setSuccessMessage("Profile updated successfully");

          // Reset password fields and flags
          setIsPasswordChange(false);
          setIsEmailChange(false);
          profileForm.reset({
            ...data,
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        }
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    },
    [updateProfile, addresses, primaryAddressIndex, isEmailChange, isPasswordChange, profileForm]
  );

  // Handle address updates from the address manager
  const handleAddressesUpdate = useCallback((newAddresses: Address[], newPrimaryIndex?: number) => {
    setAddresses(newAddresses);
    if (typeof newPrimaryIndex !== "undefined") {
      setPrimaryAddressIndex(newPrimaryIndex);
    }
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-4 py-8 md:w-3/4 lg:w-2/3 xl:w-11/12">
      {/* Profile Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Account</h1>
        <p className="text-gray-600">Manage your personal information and preferences</p>
      </div>

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        {/* Hero Section with Tabs */}
        <ProfileHeader user={user} activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="p-8 pt-16">
          {/* Alerts */}
          <ProfileAlert error={error} successMessage={successMessage} />

          {/* Profile Information Tab */}
          {activeTab === "profile" && (
            <ProfileForm
              form={profileForm}
              user={user}
              isEmailChange={isEmailChange}
              isPasswordChange={isPasswordChange}
              isLoading={isLoading}
              togglePasswordChange={togglePasswordChange}
              onSubmit={onSubmit}
            />
          )}

          {/* Addresses Tab */}
          {activeTab === "addresses" && (
            <AddressManager
              addresses={addresses}
              primaryAddressIndex={primaryAddressIndex}
              onAddressesUpdate={handleAddressesUpdate}
              onSetPrimaryAddress={handleSetPrimaryAddress}
              onSubmit={() => profileForm.handleSubmit(onSubmit)()}
              isLoading={isLoading}
              setActiveTab={setActiveTab}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
