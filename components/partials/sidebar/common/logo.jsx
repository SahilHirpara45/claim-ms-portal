import Image from "next/image";
import Link from "next/link";
import { useSidebar } from "@/store";
import React from "react";
import { SiteLogo } from "@/components/svg";

const SidebarLogo = ({ hovered }) => {
  const { sidebarType, setCollapsed, collapsed } = useSidebar();
  return (
    <div className={`px-4 ${collapsed ? 'py-[1.6rem]' : 'py-4'} flex`}>
      <div className="flex items-center">
        <div className="flex flex-1 items-center gap-x-3">
          <Link href="/dashboard" passHref>
            <Image src="/lgm.png" alt="logo" width={150} height={200} />
          </Link>
          {/* <SiteLogo className="h-8 w-8" /> */}
          {(!collapsed || hovered) && (
            <div className="flex-1 text-xl text-primary font-semibold"></div>
          )}
        </div>
        {sidebarType === "classic" && (!collapsed || hovered) && (
          <div className="flex-none lg:block hidden">
            <div
              onClick={() => setCollapsed(!collapsed)}
              className={`h-4 w-4 border-[1.5px] border-default-900 dark:border-default-200 rounded-full transition-all duration-150
                ${
                  collapsed
                    ? ""
                    : "ring-2 ring-inset ring-offset-4 ring-default-900 bg-default-900 dark:ring-offset-default-300"
                }
              `}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarLogo;
