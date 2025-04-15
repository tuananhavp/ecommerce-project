"use client";
import { useEffect } from "react";

import { useAuthStore } from "@/store/authStore";

import Countdown from "./Countdown";
import HeaderAction from "./HeaderAction";
import HeaderOption from "./HeaderOption";
import Navigation from "./Navigation";

const Header = () => {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);
  return (
    <header>
      <Countdown />
      <HeaderOption />
      <HeaderAction />
      <Navigation />
    </header>
  );
};

export default Header;
