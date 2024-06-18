import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <LanguageSwitcher />
    </>
  );
}
