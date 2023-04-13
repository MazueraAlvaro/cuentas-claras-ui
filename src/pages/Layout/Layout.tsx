import React from "react";
import { TopNav } from "./TopNav";
import { SideNav } from "./SideNav";
import { Footer } from "./Footer";
import { Outlet } from "react-router-dom";

export const Layout: React.FC = () => {
  return (
    <>
      <TopNav />
      <div id="layoutSidenav">
        <SideNav />
        <div id="layoutSidenav_content">
          <main>
            <div className="container-fluid px-4">
              <Outlet />
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
};
