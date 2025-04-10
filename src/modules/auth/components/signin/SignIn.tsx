"use client";
import Checkbox from "@/components/Checkbox";
import InputField from "@/components/InputField";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/authStore";
import { redirect, useRouter } from "next/navigation";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  remember: z.boolean(),
});
type UserValues = z.infer<typeof signInSchema>;

const SignIn = () => {
  const router = useRouter();
  const { login, error } = useAuthStore();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: UserValues) => {
    try {
      await login(data.email, data.password);
      redirect("/");
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
        aria-label="Log In"
        defaultChecked
      />

      <div className="tab-content bg-base-100 border-base-300 p-6 shadow-md ">
        <div className="flex justify-center items-center text-xs">
          <p className=" text-text-primary mt-4  text-center max-w-2xs">
            If you have an account, sign in with your username or email address.
          </p>
        </div>
        <form className="" onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset w-full bg-white border border-base-300 p-4 rounded-box">
            <InputField
              name="email"
              title="Email"
              type="email"
              placeholder="Email"
              inputClassName="w-full"
              register={register}
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}

            <InputField
              name="password"
              title="Password"
              type="password"
              placeholder="Password"
              inputClassName="w-full"
              register={register}
            />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}

            <div className="mt-3 flex justify-between items-center text-sm">
              <Checkbox name="remember" title="Remember me" register={register} />
              <div>
                <Link href={"/"} className="text-[#1D4ED8] font-medium hover:text-blue-400">
                  Lost your password?
                </Link>
              </div>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <button disabled={isSubmitting} type="submit" className="btn btn-neutral bg-purple-primary mt-4">
              {isSubmitting ? <span className="loading loading-dots loading-sm"></span> : "Login"}
            </button>
          </fieldset>
        </form>
      </div>
    </>
  );
};

export default SignIn;
