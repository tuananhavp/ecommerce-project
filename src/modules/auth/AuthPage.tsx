"use client";
import React, { useEffect, useState } from "react";
import SignUp from "./components/SignUp/SignUp";
import SignIn from "./components/SignIn/SignIn";
import { useAuthStore } from "@/store/authStore";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";

const AuthPage = () => {
  const [hasStoredUser, setHasStoredUser] = useState(false);
  const { loading, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setHasStoredUser(!!storedUser);
  }, []);
  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, router, loading]);

  if (loading || hasStoredUser || user) {
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
