import React, { useState } from "react";
import { useSidebar, useThemeStore } from "@/store";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useMediaQuery } from "@/hooks/use-media-query";
import Image from "next/image";

const MenuBar = ({ collapsed, setCollapsed }) => {
  return (
    <div className="flex">
      <button
        className="relative group "
        onClick={() => setCollapsed(!collapsed)}
      >
        <div>
          <div
            className={cn(
              "flex flex-col justify-between w-[20px] h-[16px] transform transition-all duration-300 origin-center overflow-hidden",
              {
                "-translate-x-1.5 rotate-180": collapsed,
                "-translate-x-1.5 rotate-180": !collapsed,
              }
            )}
          >
            <div
              className={cn(
                "bg-card-foreground h-[2px] transform transition-all duration-300 origin-left delay-150",
                {
                  "rotate-[42deg] w-[11px]": !collapsed,
                  "w-7": collapsed,
                }
              )}
            ></div>
            <div
              className={cn(
                "bg-card-foreground h-[2px] w-7 rounded transform transition-all duration-300",
                {
                  "translate-x-10": collapsed,
                  "translate-x-10": !collapsed,
                }
              )}
            ></div>
            <div
              className={cn(
                "bg-card-foreground h-[2px] transform transition-all duration-300 origin-left delay-150",
                {
                  "-rotate-[43deg] w-[11px]": !collapsed,
                  "w-11": collapsed,
                }
              )}
            ></div>
          </div>
        </div>
      </button>
    </div>
  );
};

const VerticalHeader = ({ handleOpenSearch }) => {
  const { collapsed, setCollapsed, subMenu, sidebarType } = useSidebar();
  const { layout } = useThemeStore();
  const isDesktop = useMediaQuery("(min-width: 1280px)");
  const isTablet = useMediaQuery("(max-width: 1279px) and (min-width: 769px)");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [showMenuBar, setShowMenuBar] = useState(false);

  let LogoContent = null;
  let menuBarContent = null;

  const MainLogo = (
    <Link href="/dashboard">
      <Image src={"/lgm.png"} alt="logo" width={100} height={100} />
    </Link>
  );

  if (layout === "semibox" && !isDesktop) {
    LogoContent = MainLogo;
  }
  if (
    layout === "vertical" &&
    !isDesktop &&
    isMobile &&
    sidebarType === "module"
  ) {
    LogoContent = MainLogo;
  }
  if (
    layout === "vertical" &&
    !isDesktop &&
    isTablet &&
    sidebarType !== "module"
  ) {
    LogoContent = MainLogo;
  }

  if (
    layout === "vertical" &&
    !isDesktop &&
    isTablet &&
    sidebarType !== "module"
  ) {
    LogoContent = MainLogo;
  }

  if (isDesktop && sidebarType !== "module") {
    menuBarContent = (
      <MenuBar collapsed={collapsed} setCollapsed={setCollapsed} />
    );
  }
  if (sidebarType === "module") {
    menuBarContent = (
      <MenuBar collapsed={collapsed} setCollapsed={setCollapsed} />
    );
  }

  if (sidebarType === "classic") {
    menuBarContent = null;
  }
  if (subMenu && isDesktop) {
    menuBarContent = null;
  }

  return (
    <>
      <div className="flex items-center justify-between w-full md:gap-6 gap-3 px-4 ">
        {LogoContent}

        <div className="flex-1 md:hidden" />
        {(isDesktop || (isTablet && showMenuBar)) && menuBarContent}
        {isTablet && (
          <button
            className="md:hidden"
            onClick={() => setShowMenuBar(!showMenuBar)}
          ></button>
        )}
        {isTablet && (
          <button className="" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </button>
        )}
      </div>
      {isMobile && (
        <button className="" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
        </button>
      )}
    </>
  );
};

export default VerticalHeader;
