"use client";
import React from "react";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";

import Checkbox from "@/components/Checkbox";
import ErrorMessage from "@/components/ErrorMessage";
import InputField from "@/components/InputField";
import { useAuthStore } from "@/store/authStore";

const signUpSchema = z.object({
  name: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["customer", "admin"], {
    errorMap: () => ({ message: "Please select a role" }),
  }),
});

type AccountValues = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const { signup, error } = useAuthStore((state) => state);
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<AccountValues>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: AccountValues) => {
    try {
      await signup(data.name, data.email, data.password, data.role);
      Swal.fire({
        text: "You created account successfully!!",
        position: "top-end",
      });
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  return (
    <>
      <input
        type="radio"
        name="my_tabs_3"
        className="tab text-xl font-bold text-heading-primary"
        aria-label="Register"
      />
      <div className="tab-content bg-base-100 border-base-300 p-6 shadow-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset w-full bg-white border border-base-300 p-4 rounded-box">
            <InputField
              name="name"
              title="Username"
              type="text"
              placeholder="Username"
              inputClassName="input w-full"
              register={register}
              error={errors.name}
            />

            <InputField
              name="email"
              title="Email"
              type="email"
              placeholder="Email"
              inputClassName="input w-full"
              register={register}
              error={errors.email}
            />

            <InputField
              name="password"
              title="Password"
              type="password"
              placeholder="Password"
              inputClassName="input w-full"
              register={register}
              error={errors.password}
            />

            <div className="mt-4">
              <Checkbox
                name="role"
                title="I am a customer"
                type="radio"
                inputClassName="radio"
                value={"customer"}
                register={register}
              />
              <Checkbox
                name="role"
                title="I am a vendor"
                type="radio"
                inputClassName="radio"
                value={"admin"}
                register={register}
              />
            </div>

            <ErrorMessage error={errors.role} />
            <ErrorMessage error={error ? { message: error } : undefined} />

            <button disabled={isSubmitting} type="submit" className="btn btn-neutral bg-purple-primary mt-4">
              {isSubmitting ? <span className="loading loading-dots loading-sm"></span> : "Register"}
            </button>
          </fieldset>
        </form>

        <div className="flex justify-center items-center text-xs">
          <p className="text-text-primary mt-4 text-center max-w-2xs">
            Your personal data helps enhance your website experience, manage your account access, and fulfill the
            purposes in{" "}
            <Link href={"/"} className="text-[#1D4ED8] hover:text-blue-400">
              our privacy policy
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUp;
