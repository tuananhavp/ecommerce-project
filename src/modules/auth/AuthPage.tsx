"use client";
import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import Loading from "@/components/Loading";
import { useAuthStore } from "@/store/authStore";

import SignIn from "./components/SignIn/SignIn";
import SignUp from "./components/SignUp/SignUp";

const AuthPage = () => {
  const [hasStoredUser, setHasStoredUser] = useState(false);
  const { isLoading, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setHasStoredUser(!!storedUser);
  }, []);
  useEffect(() => {
    if (!isLoading && user) {
      router.push("/");
    }
  }, [user, router, isLoading]);

  if (isLoading || hasStoredUser || user) {
    return (
      <div className="min-h-lvh flex justify-center items-center">
        <Loading />
      </div>
    );
  }
  return (
    <section className="min-h-8/12">
      <div className="flex justify-center my-28 ">
        <div className="tabs tabs-lift justify-center shadow-xl">
          <SignIn />
          <SignUp />
        </div>
      </div>
    </section>
  );
};

export default AuthPage;
