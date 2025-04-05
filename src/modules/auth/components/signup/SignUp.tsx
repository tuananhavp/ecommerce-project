"use client";
import Checkbox from "@/components/Checkbox";
import InputField from "@/components/InputField";
import React from "react";
import { useForm } from "react-hook-form";

interface AccountProps {
  name: string;
  email: string;
  password: string;
  role: "customer" | "admin";
}

const SignUp = () => {
  const { handleSubmit, register } = useForm<AccountProps>();
  const onSubmit = (data: AccountProps) => console.log(data);
  return (
    <>
      <input type="radio" name="my_tabs_3" className="tab" aria-label="Register" />
      <div className="tab-content bg-base-100 border-base-300 p-6 shadow-md">
        <form className="" onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset w-full bg-white border border-base-300 p-4 rounded-box">
            <InputField
              name="name"
              title="Username"
              type="text"
              placeholder="Username"
              inputClassName="input w-full"
              register={register}
            />
            <InputField
              name="email"
              title="Email"
              type="email"
              placeholder="Email"
              inputClassName="input w-full"
              register={register}
            />
            <InputField
              name="password"
              title="Password"
              type="password"
              placeholder="Password"
              inputClassName="input w-full"
              register={register}
            />

            <Checkbox name="role" title="I am a customer" register={register} />
            <Checkbox name="role" title="I am a vendor" register={register} />
            <button type="submit" className="btn btn-neutral bg-purple-primary">
              Login
            </button>
          </fieldset>
        </form>
      </div>
    </>
  );
};

export default SignUp;
