"use client";
import { useState, useEffect } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { useForm, FieldValues } from "react-hook-form";
import { FiEdit2, FiTrash2, FiPlus, FiUser, FiMapPin, FiLock, FiCheck } from "react-icons/fi";

import Checkbox from "@/components/Checkbox";
import InputField from "@/components/InputField";
import { useAuthStore } from "@/store/authStore";
import { UserProfile } from "@/types/auth.types";
import { Address } from "@/types/order.types";

const defaultAvatar = "/avatar.png";

interface ProfileFormData extends FieldValues {
  username: string;
  email: string;
  phone: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfilePage = () => {
  const router = useRouter();
  const { user, isLoading, error, updateProfile, setPrimaryAddress } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"profile" | "addresses">("profile");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isPasswordChange, setIsPasswordChange] = useState(false);
  const [isEmailChange, setIsEmailChange] = useState(false);
  const [primaryAddressIndex, setPrimaryAddressIndex] = useState<number | undefined>(undefined);

  // Profile form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    setValue: setProfileValue,
    formState: { errors: profileErrors },
    watch: watchProfile,
    reset: resetProfile,
  } = useForm<ProfileFormData>({
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

  // Address form
  const {
    register: registerAddress,
    handleSubmit: handleSubmitAddress,
    setValue: setAddressValue,
    formState: { errors: addressErrors },
    reset: resetAddress,
  } = useForm<Address>({
    mode: "onChange",
    defaultValues: {
      street: "",
      city: "",
      postalCode: "",
      country: "",
    },
  });

  // Watch email field
  const email = watchProfile("email");

  // Load user data when component mounts
  useEffect(() => {
    if (!user && !isLoading) {
      router.push("/login");
      return;
    }

    if (user) {
      setProfileValue("username", user.username || "");
      setProfileValue("email", user.email || "");
      setProfileValue("phone", user.phone || "");

      // Initialize addresses array
      if (user.addresses && user.addresses.length > 0) {
        setAddresses(user.addresses);
      }

      // Set primary address index if it exists
      if (typeof user.primaryAddressIndex !== "undefined") {
        setPrimaryAddressIndex(user.primaryAddressIndex);
      }
    }
  }, [user, isLoading, router, setProfileValue]);

  // Check if email is changed
  useEffect(() => {
    if (user && email && email !== user.email) {
      setIsEmailChange(true);
    } else {
      setIsEmailChange(false);
    }
  }, [email, user]);

  const togglePasswordChange = () => {
    setIsPasswordChange(!isPasswordChange);

    if (!isPasswordChange) {
      resetProfile({
        ...watchProfile(),
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  const handleAddAddress = handleSubmitAddress((data) => {
    const newAddress: Address = {
      street: data.street,
      city: data.city,
      postalCode: data.postalCode,
      country: data.country,
    };

    if (editingAddressIndex !== null) {
      // Update existing address
      const updatedAddresses = [...addresses];
      updatedAddresses[editingAddressIndex] = newAddress;
      setAddresses(updatedAddresses);
      setEditingAddressIndex(null);
    } else {
      // Add new address
      setAddresses((prev) => [...prev, newAddress]);

      // If this is the first address, automatically set it as primary
      if (addresses.length === 0) {
        setPrimaryAddressIndex(0);
      }
    }

    // Reset form
    resetAddress();
    setShowAddressForm(false);
  });

  const handleEditAddress = (index: number) => {
    const address = addresses[index];
    setAddressValue("street", address.street);
    setAddressValue("city", address.city);
    setAddressValue("postalCode", address.postalCode);
    setAddressValue("country", address.country);

    setEditingAddressIndex(index);
    setShowAddressForm(true);
  };

  const handleRemoveAddress = (index: number) => {
    // Check if the deleted address is the primary address
    if (primaryAddressIndex === index) {
      // Reset primary address or set the next available address as primary
      if (addresses.length > 1) {
        const newPrimaryIndex = index === addresses.length - 1 ? index - 1 : index;
        setPrimaryAddressIndex(newPrimaryIndex);
      } else {
        setPrimaryAddressIndex(undefined);
      }
    } else if (primaryAddressIndex !== undefined && primaryAddressIndex > index) {
      // If we're removing an address before the primary, we need to decrement the index
      setPrimaryAddressIndex(primaryAddressIndex - 1);
    }

    setAddresses(addresses.filter((_, i) => i !== index));
  };

  const handleCancelAddressEdit = () => {
    resetAddress();
    setEditingAddressIndex(null);
    setShowAddressForm(false);
  };

  // Handle setting an address as primary
  const handleSetPrimaryAddress = async (index: number) => {
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
  };

  const onSubmit = handleSubmitProfile(async (data) => {
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
        resetProfile({
          ...data,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 py-8  md:w-3/4 lg:w-2/3 xl:w-11/12">
      {/* Profile Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Account</h1>
        <p className="text-gray-600">Manage your personal information and preferences</p>
      </div>

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        {/* Hero Section */}
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
                activeTab === "profile"
                  ? "btn-neutral text-white"
                  : "btn-ghost bg-white/90 text-gray-800 hover:bg-white"
              } px-6 rounded-full`}
              type="button"
            >
              <FiUser className="mr-2" /> Profile
            </button>
            <button
              onClick={() => setActiveTab("addresses")}
              className={`btn shadow-md ${
                activeTab === "addresses"
                  ? "btn-neutral text-white"
                  : "btn-ghost bg-white/90 text-gray-800 hover:bg-white"
              } px-6 rounded-full`}
              type="button"
            >
              <FiMapPin className="mr-2" /> Addresses
            </button>
          </div>
        </div>

        <div className="p-8 pt-16">
          {/* Alerts */}
          {error && (
            <div className="alert alert-error mb-6 shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="font-bold">Error</h3>
                <div className="text-sm">{error}</div>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="alert alert-success mb-6 shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="font-bold">Success</h3>
                <div className="text-sm">{successMessage}</div>
              </div>
            </div>
          )}

          {/* Profile Information Tab */}
          {activeTab === "profile" && (
            <form onSubmit={onSubmit} className="space-y-8">
              {/* Personal Information Section */}
              <div className="card bg-base-100 shadow-sm border border-gray-100">
                <div className="card-body">
                  <h3 className="text-xl font-semibold flex items-center gap-3 mb-4">
                    <FiUser className="text-primary" /> Personal Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Username Field */}
                    <div className="form-control">
                      <InputField<ProfileFormData>
                        register={registerProfile}
                        name="username"
                        title="Username"
                        placeholder="Enter your username"
                        type="text"
                        inputClassName={profileErrors.username ? "input-error" : ""}
                      />
                      {profileErrors.username && (
                        <label className="label">
                          <span className="label-text-alt text-error">
                            {profileErrors.username.message?.toString()}
                          </span>
                        </label>
                      )}
                    </div>

                    {/* Email Field */}
                    <div className="form-control">
                      <InputField<ProfileFormData>
                        register={registerProfile}
                        name="email"
                        title="Email"
                        placeholder="your.email@example.com"
                        type="email"
                        inputClassName={profileErrors.email ? "input-error" : ""}
                      />
                      {profileErrors.email && (
                        <label className="label">
                          <span className="label-text-alt text-error">{profileErrors.email.message?.toString()}</span>
                        </label>
                      )}
                    </div>

                    {/* Phone Number Field */}
                    <div className="form-control">
                      <InputField<ProfileFormData>
                        register={registerProfile}
                        name="phone"
                        title="Phone Number"
                        placeholder="+1 (123) 456-7890"
                        type="tel"
                      />
                    </div>

                    {/* Role Display */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Account Type</span>
                      </label>
                      <div className="input input-bordered flex items-center bg-gray-50 text-gray-600 cursor-not-allowed">
                        <span className="capitalize">{user?.role || "Customer"}</span>
                      </div>
                      <label className="label">
                        <span className="label-text-alt text-gray-500">Account type cannot be changed</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Password Section */}
              <div className="card bg-base-100 shadow-sm border border-gray-100">
                <div className="card-body">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold flex items-center gap-3">
                      <FiLock className="text-primary" /> Security
                    </h3>
                    <div className="form-control">
                      <label className="cursor-pointer label flex gap-2">
                        <span className="label-text">Change Password</span>
                        <Checkbox<ProfileFormData>
                          register={registerProfile}
                          name="togglePassword"
                          title=""
                          inputClassName=""
                          checked={isPasswordChange}
                          onChange={() => {
                            togglePasswordChange();
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {(isPasswordChange || isEmailChange) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 p-4 bg-gray-50 rounded-lg">
                      {/* Current Password */}
                      <div className="form-control">
                        <InputField<ProfileFormData>
                          register={registerProfile}
                          name="currentPassword"
                          title={
                            isEmailChange && !isPasswordChange
                              ? "Current Password (required for email change)"
                              : "Current Password"
                          }
                          placeholder="••••••••"
                          type="password"
                          inputClassName={profileErrors.currentPassword ? "input-error" : ""}
                        />
                        {profileErrors.currentPassword && (
                          <label className="label">
                            <span className="label-text-alt text-error">
                              {profileErrors.currentPassword.message?.toString()}
                            </span>
                          </label>
                        )}
                      </div>

                      {isPasswordChange && (
                        <>
                          {/* New Password */}
                          <div className="form-control">
                            <InputField<ProfileFormData>
                              register={registerProfile}
                              name="newPassword"
                              title="New Password"
                              placeholder="••••••••"
                              type="password"
                              inputClassName={profileErrors.newPassword ? "input-error" : ""}
                            />
                            {profileErrors.newPassword && (
                              <label className="label">
                                <span className="label-text-alt text-error">
                                  {profileErrors.newPassword.message?.toString()}
                                </span>
                              </label>
                            )}
                          </div>

                          {/* Confirm New Password */}
                          <div className="form-control md:col-start-2">
                            <InputField<ProfileFormData>
                              register={registerProfile}
                              name="confirmPassword"
                              title="Confirm New Password"
                              placeholder="••••••••"
                              type="password"
                              inputClassName={profileErrors.confirmPassword ? "input-error" : ""}
                            />
                            {profileErrors.confirmPassword && (
                              <label className="label">
                                <span className="label-text-alt text-error">
                                  {profileErrors.confirmPassword.message?.toString()}
                                </span>
                              </label>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-8 mt-6 border-t">
                <button type="reset" className="btn btn-outline btn-lg px-8">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-lg px-8">
                  {isLoading ? <span className="loading loading-spinner loading-sm"></span> : "Save Changes"}
                </button>
              </div>
            </form>
          )}

          {/* Addresses Tab */}
          {activeTab === "addresses" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold flex items-center gap-3">
                  <FiMapPin className="text-primary" /> Shipping Addresses
                </h3>
                {!showAddressForm && (
                  <button type="button" className="btn btn-primary gap-2" onClick={() => setShowAddressForm(true)}>
                    <FiPlus /> Add New Address
                  </button>
                )}
              </div>

              {/* Address List */}
              {addresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {addresses.map((address, index) => (
                    <div
                      key={index}
                      className={`card bg-base-100 border transition-all ${
                        primaryAddressIndex === index
                          ? "border-primary shadow-md"
                          : "border-gray-200 hover:border-primary/30 hover:shadow-md"
                      }`}
                    >
                      <div className="card-body">
                        <div className="flex justify-between items-start">
                          <div className="flex gap-2 items-center">
                            <div className="badge badge-primary">Address {index + 1}</div>
                            {primaryAddressIndex === index && (
                              <div className="badge badge-accent gap-1">
                                <FiCheck className="h-3 w-3" /> Primary
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {primaryAddressIndex !== index && (
                              <button
                                type="button"
                                className="btn btn-ghost btn-sm"
                                onClick={() => handleSetPrimaryAddress(index)}
                                title="Set as primary address"
                              >
                                Set as Primary
                              </button>
                            )}
                            <button
                              type="button"
                              className="btn btn-ghost btn-sm btn-circle"
                              onClick={() => handleEditAddress(index)}
                              title="Edit address"
                            >
                              <FiEdit2 className="text-primary" />
                            </button>
                            <button
                              type="button"
                              className="btn btn-ghost btn-sm btn-circle"
                              onClick={() => handleRemoveAddress(index)}
                              title="Delete address"
                            >
                              <FiTrash2 className="text-error" />
                            </button>
                          </div>
                        </div>
                        <div className="space-y-1 mt-2 text-gray-700">
                          <p className="font-medium">{address.street}</p>
                          <p>
                            {address.city}, {address.postalCode}
                          </p>
                          <p>{address.country}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-center">
                  <FiMapPin className="w-12 h-12 text-gray-400 mb-3" />
                  <p className="text-gray-600 mb-4">No addresses have been added yet.</p>
                  {!showAddressForm && (
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => setShowAddressForm(true)}>
                      <FiPlus className="mr-2" /> Add Your First Address
                    </button>
                  )}
                </div>
              )}

              {/*Address Form */}
              {showAddressForm && (
                <form onSubmit={handleAddAddress} className="card bg-base-100 border shadow-md mt-6">
                  <div className="card-body">
                    <h3 className="card-title text-primary text-lg">
                      {editingAddressIndex !== null ? "Edit Address" : "Add New Address"}
                    </h3>
                    <div className="divider my-1"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="form-control md:col-span-2">
                        <InputField<Address>
                          register={registerAddress}
                          name="street"
                          title="Street Address"
                          placeholder="Enter street address"
                          type="text"
                          inputClassName={addressErrors.street ? "input-error" : ""}
                        />
                        {addressErrors.street && (
                          <label className="label">
                            <span className="label-text-alt text-error">
                              {addressErrors.street.message?.toString()}
                            </span>
                          </label>
                        )}
                      </div>

                      {/* City Field */}
                      <div className="form-control">
                        <InputField<Address>
                          register={registerAddress}
                          name="city"
                          title="City"
                          placeholder="Enter city"
                          type="text"
                          inputClassName={addressErrors.city ? "input-error" : ""}
                        />
                        {addressErrors.city && (
                          <label className="label">
                            <span className="label-text-alt text-error">{addressErrors.city.message?.toString()}</span>
                          </label>
                        )}
                      </div>

                      {/* Postal Code Field */}
                      <div className="form-control">
                        <InputField<Address>
                          register={registerAddress}
                          name="postalCode"
                          title="Postal Code"
                          placeholder="Enter postal code"
                          type="text"
                          inputClassName={addressErrors.postalCode ? "input-error" : ""}
                        />
                        {addressErrors.postalCode && (
                          <label className="label">
                            <span className="label-text-alt text-error">
                              {addressErrors.postalCode.message?.toString()}
                            </span>
                          </label>
                        )}
                      </div>

                      {/* Country Field */}
                      <div className="form-control md:col-span-2">
                        <InputField<Address>
                          register={registerAddress}
                          name="country"
                          title="Country"
                          placeholder="Enter country"
                          type="text"
                          inputClassName={addressErrors.country ? "input-error" : ""}
                        />
                        {addressErrors.country && (
                          <label className="label">
                            <span className="label-text-alt text-error">
                              {addressErrors.country.message?.toString()}
                            </span>
                          </label>
                        )}
                      </div>

                      {/* If this is a new address and we have no other addresses, let user set as primary */}
                      {editingAddressIndex === null && addresses.length === 0 && (
                        <div className="form-control md:col-span-2">
                          <label className="cursor-pointer label flex gap-2 justify-start">
                            <input
                              type="checkbox"
                              className="checkbox checkbox-primary"
                              checked={true}
                              disabled={true}
                            />
                            <span className="label-text">Set as primary address (automatic for first address)</span>
                          </label>
                        </div>
                      )}
                    </div>

                    <div className="card-actions justify-end mt-4">
                      <button type="button" className="btn btn-outline" onClick={handleCancelAddressEdit}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        {editingAddressIndex !== null ? "Update Address" : "Save Address"}
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Save All Changes Button for Addresses Tab */}
              <form onSubmit={onSubmit}>
                <div className="flex justify-end gap-4 pt-8 mt-6 border-t">
                  <button type="button" onClick={() => setActiveTab("profile")} className="btn btn-outline btn-lg px-8">
                    Back to Profile
                  </button>
                  <button type="submit" className="btn btn-primary btn-lg px-8">
                    {isLoading ? <span className="loading loading-spinner loading-sm"></span> : "Save All Changes"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
