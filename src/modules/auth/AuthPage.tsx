"use client";
import React, { useEffect } from "react";
import SignUp from "./components/signup/SignUp";
import SignIn from "./components/signin/SignIn";
import { useAuthStore } from "@/store/authStore";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";

const AuthPage = () => {
  const user = localStorage.getItem("user") !== null ? localStorage.getItem("user") : null;
  const { loading } = useAuthStore((state) => state);
  const router = useRouter();
  useEffect(() => {
    if (loading && user) {
      router.push("/");
    }
  }, [loading, user, router]);

  if (loading && user) {
    return (
      <div className="min-h-lvh flex justify-center items-">
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
