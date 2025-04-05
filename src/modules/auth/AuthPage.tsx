import React from "react";
import SignUp from "./components/signup/SignUp";
import SignIn from "./components/signin/SignIn";

const AuthPage = () => {
  return (
    <section className="min-h-8/12">
      <div className="flex justify-center my-28 ">
        <div className="tabs tabs-lift shadow-xl">
          <SignIn />
          <SignUp />
        </div>
      </div>
    </section>
  );
};

export default AuthPage;
