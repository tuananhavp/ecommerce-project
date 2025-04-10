"use client";
import Countdown from "./Countdown";
import HeaderOption from "./HeaderOption";
import HeaderAction from "./HeaderAction";
import Navigation from "./Navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

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
