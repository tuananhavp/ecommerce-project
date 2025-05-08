import React from "react";

import { UseFormReturn } from "react-hook-form";
import { FiUser, FiLock } from "react-icons/fi";

import Checkbox from "@/components/Checkbox";
import InputField from "@/components/InputField";
import { EnhancedUser, ProfileFormData } from "@/types/auth.types";

interface ProfileFormProps {
  form: UseFormReturn<ProfileFormData>;
  user: EnhancedUser | null;
  isEmailChange: boolean;
  isPasswordChange: boolean;
  isLoading: boolean;
  togglePasswordChange: () => void;
  onSubmit: (data: ProfileFormData) => Promise<void>;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  form,
  user,
  isEmailChange,
  isPasswordChange,
  isLoading,
  togglePasswordChange,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
                register={register}
                name="username"
                title="Username"
                placeholder="Enter your username"
                type="text"
                inputClassName={errors.username ? "input-error" : ""}
              />
              {errors.username && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.username.message?.toString()}</span>
                </label>
              )}
            </div>

            {/* Email Field */}
            <div className="form-control">
              <InputField<ProfileFormData>
                register={register}
                name="email"
                title="Email"
                placeholder="your.email@example.com"
                type="email"
                inputClassName={errors.email ? "input-error" : ""}
              />
              {errors.email && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.email.message?.toString()}</span>
                </label>
              )}
            </div>

            {/* Phone Number Field */}
            <div className="form-control">
              <InputField<ProfileFormData>
                register={register}
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
                  register={register}
                  name="togglePassword"
                  title=""
                  inputClassName=""
                  checked={isPasswordChange}
                  onChange={togglePasswordChange}
                />
              </label>
            </div>
          </div>

          {(isPasswordChange || isEmailChange) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 p-4 bg-gray-50 rounded-lg">
              {/* Current Password */}
              <div className="form-control">
                <InputField<ProfileFormData>
                  register={register}
                  name="currentPassword"
                  title={
                    isEmailChange && !isPasswordChange
                      ? "Current Password (required for email change)"
                      : "Current Password"
                  }
                  placeholder="••••••••"
                  type="password"
                  inputClassName={errors.currentPassword ? "input-error" : ""}
                />
                {errors.currentPassword && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.currentPassword.message?.toString()}</span>
                  </label>
                )}
              </div>

              {isPasswordChange && (
                <>
                  {/* New Password */}
                  <div className="form-control">
                    <InputField<ProfileFormData>
                      register={register}
                      name="newPassword"
                      title="New Password"
                      placeholder="••••••••"
                      type="password"
                      inputClassName={errors.newPassword ? "input-error" : ""}
                    />
                    {errors.newPassword && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.newPassword.message?.toString()}</span>
                      </label>
                    )}
                  </div>

                  {/* Confirm New Password */}
                  <div className="form-control md:col-start-2">
                    <InputField<ProfileFormData>
                      register={register}
                      name="confirmPassword"
                      title="Confirm New Password"
                      placeholder="••••••••"
                      type="password"
                      inputClassName={errors.confirmPassword ? "input-error" : ""}
                    />
                    {errors.confirmPassword && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.confirmPassword.message?.toString()}</span>
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
  );
};

export default React.memo(ProfileForm);
