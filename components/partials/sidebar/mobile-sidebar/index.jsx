"use client";
import React, { useState } from "react";
import { cn, isLocationMatch } from "@/lib/utils";
import { useSidebar, useThemeStore } from "@/store";
import SidebarLogo from "../common/logo";
import {
  menusConfig,
  menusCompanyConfig,
  menusAdminConfig,
} from "@/config/menus";
import MenuLabel from "../common/menu-label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePathname } from "next/navigation";
import SingleMenuItem from "./single-menu-item";
import SubMenuHandler from "./sub-menu-handler";
import NestedSubMenu from "../common/nested-menus";
import { useSession } from "next-auth/react";
const MobileSidebar = ({ collapsed, className }) => {
  const { sidebarBg, mobileMenu, setMobileMenu } = useSidebar();
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [activeMultiMenu, setMultiMenu] = useState(null);
  // const menus = menusConfig?.sidebarNav?.classic || [];

  const { data: session } = useSession();
  const userRole = session?.role;
  // const menus =
  //   userRole === "company"
  //     ? menusCompanyConfig?.sidebarNav?.company
  //     : userRole === "superAdmin"
  //     ? menusAdminConfig?.sidebarNav?.admin
  //     : menusConfig?.sidebarNav?.classic || [];

  const menus = menusConfig?.sidebarNav?.classic || [];

  const toggleSubmenu = (i) => {
    if (activeSubmenu === i) {
      setActiveSubmenu(null);
    } else {
      setActiveSubmenu(i);
    }
  };

  const toggleMultiMenu = (subIndex) => {
    if (activeMultiMenu === subIndex) {
      setMultiMenu(null);
    } else {
      setMultiMenu(subIndex);
    }
  };

  return (
    <>
      <div
        className={cn(
          "fixed top-0  bg-card h-full w-[248px] z-[9999] ",
          className,
          {
            " -left-[300px] invisible opacity-0  ": !mobileMenu,
            " left-0 visible opacity-100  ": mobileMenu,
          }
        )}
      >
        {sidebarBg !== "none" && (
          <div
            className=" absolute left-0 top-0   z-[-1] w-full h-full bg-cover bg-center opacity-[0.07]"
            style={{ backgroundImage: `url(${sidebarBg})` }}
          ></div>
        )}
        <SidebarLogo collapsed={collapsed} />
        <ScrollArea
          className={cn("sidebar-menu  h-[calc(100%-80px)] ", {
            "px-4": !collapsed,
          })}
        >
          <ul
            className={cn("", {
              " space-y-2 text-center": collapsed,
            })}
          >
            {/* {menus.map((item, i) => (
              <li key={`menu_key_${i}`}>

                {!item.child && !item.isHeader && (
                  <SingleMenuItem item={item} collapsed={collapsed} />
                )}

                {item.isHeader && !item.child && !collapsed && (
                  <MenuLabel item={item} />
                )}

                {item.child && (
                  <>
                    <SubMenuHandler
                      item={item}
                      toggleSubmenu={toggleSubmenu}
                      index={i}
                      activeSubmenu={activeSubmenu}
                      collapsed={collapsed}
                    />

                    {!collapsed && (
                      <NestedSubMenu
                        toggleMultiMenu={toggleMultiMenu}
                        activeMultiMenu={activeMultiMenu}
                        activeSubmenu={activeSubmenu}
                        item={item}
                        index={i}
                        collapsed={collapsed}
                      />
                    )}
                  </>
                )}
              </li>
            ))} */}
            {menus?.map((item, i) => {
              if (
                item.role &&
                item.role.length > 0 &&
                !item.role.includes(userRole)
              ) {
                return null; // Hide the menu item if user role is not in item.role
              }

              return (
                <li key={`menu_key_${i}`}>
                  {/* single menu  */}

                  {!item.child && !item.isHeader && (
                    <SingleMenuItem
                      item={item}
                      collapsed={collapsed}
                      // trans={trans}
                    />
                  )}

                  {/* menu label */}
                  {item.isHeader && !item.child && !collapsed && (
                    <MenuLabel
                      item={item}
                      // trans={trans}
                    />
                  )}

                  {/* sub menu */}
                  {item.child && (
                    <>
                      <SubMenuHandler
                        item={item}
                        toggleSubmenu={toggleSubmenu}
                        index={i}
                        activeSubmenu={activeSubmenu}
                        collapsed={collapsed}
                        menuTitle={item.title}
                        // trans={trans}
                      />
                      {!collapsed && (
                        <NestedSubMenu
                          toggleMultiMenu={toggleMultiMenu}
                          activeMultiMenu={activeMultiMenu}
                          activeSubmenu={activeSubmenu}
                          item={item}
                          index={i}
                          collapsed={collapsed}
                          // trans={trans}
                        />
                      )}
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </ScrollArea>
      </div>
      {mobileMenu && (
        <div
          onClick={() => setMobileMenu(false)}
          className="overlay bg-black/60 backdrop-filter backdrop-blur-sm opacity-100 fixed inset-0 z-[999]"
        ></div>
      )}
    </>
  );
};

export default MobileSidebar;
