"use client";
import Checkbox from "@/components/Checkbox";
import InputField from "@/components/InputField";
import React from "react";
import { useForm } from "react-hook-form";

interface UserValues {
  email: string;
  password: string;
  remember: boolean;
}

const SignIn = () => {
  const { handleSubmit, register } = useForm<UserValues>({
    mode: "onChange",
  });
  const onSubmit = (data: UserValues) => {
    return data;
  };

  return (
    <>
      <input type="radio" name="my_tabs_3" className="tab" aria-label="Log In" defaultChecked />
      <div className="tab-content bg-base-100 border-base-300 p-6 shadow-md ">
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
            <InputField
              name="password"
              title="Password"
              type="password"
              placeholder="Password"
              inputClassName="w-full"
              register={register}
            />

            <Checkbox name="remember" title="Remember me" register={register} />
            <button type="submit" className="btn btn-neutral bg-purple-primary">
              Login
            </button>
          </fieldset>
        </form>
      </div>
    </>
  );
};

export default SignIn;
