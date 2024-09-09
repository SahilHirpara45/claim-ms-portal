"use client";
import React, { useState } from "react";

import { cn, isLocationMatch, getDynamicPath } from "@/lib/utils";
import SidebarLogo from "../common/logo";
import { menusConfig } from "@/config/menus";
import MenuLabel from "../common/menu-label";
import SingleMenuItem from "./single-menu-item";
import SubMenuHandler from "./sub-menu-handler";
import NestedSubMenu from "../common/nested-menus";
import { useSidebar, useThemeStore } from "@/store";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const PopoverSidebar = ({ trans }) => {
  const { collapsed, setCollapsed, sidebarBg } = useSidebar();
  const { layout, isRtl } = useThemeStore();
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [activeMultiMenu, setMultiMenu] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const { data: session } = useSession();
  const userRole = session?.role;
  const menus = menusConfig?.sidebarNav?.classic || [];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1270);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Set the initial state

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSubmenu = (i) => {
    setActiveSubmenu((prev) => (prev === i ? null : i));
  };

  const toggleMultiMenu = (subIndex) => {
    setMultiMenu((prev) => (prev === subIndex ? null : subIndex));
  };

  const handleMenuClick = () => {
    if (isMobile) {
      setCollapsed(true);
    }
  };

  const pathname = usePathname();
  const locationName = getDynamicPath(pathname);

  useEffect(() => {
    let subMenuIndex = null;
    let multiMenuIndex = null;
    menus?.map((item, i) => {
      if (item?.child) {
        item.child.map((childItem, j) => {
          if (isLocationMatch(childItem.href, locationName)) {
            subMenuIndex = i;
          }
          if (childItem?.multi_menu) {
            childItem.multi_menu.map((multiItem, k) => {
              if (isLocationMatch(multiItem.href, locationName)) {
                subMenuIndex = i;
                multiMenuIndex = j;
              }
            });
          }
        });
      }
    });
    setActiveSubmenu(subMenuIndex);
    setMultiMenu(multiMenuIndex);
  }, [locationName]);

  // menu title

  return (
    <>
      <div>
        {isMobile && !collapsed && (
          <div
            className="overlay bg-black/60 backdrop-filter backdrop-blur-sm opacity-100 fixed inset-0 z-[30]" // Increased z-index
            onClick={() => setCollapsed(true)}
          ></div>
        )}
        <div
          className={cn("fixed top-0  border-r h-full bg-card z-[40]", {
            // Increased z-index
            "w-[248px]": !collapsed,
            "w-[72px] hidden xl:block": collapsed,
            "m-6 bottom-0 max-w-full bg-card rounded-md": layout === "semibox",
            "h-full bg-card": collapsed && layout !== "semibox",
          })}
        >
          {sidebarBg !== "none" && (
            <div
              className="absolute left-0 top-0 z-[-1] w-full h-full bg-cover bg-center opacity-[0.07]"
              style={{ backgroundImage: `url(${sidebarBg})` }}
            ></div>
          )}

          <SidebarLogo collapsed={collapsed} />
          <Separator />

          <ScrollArea
            className={cn(
              "sidebar-menu overflow-hidden mt-4 h-[calc(100%-80px)]",
              {
                "px-4": !collapsed,
              }
            )}
          >
            <div>
              <ul
                dir={isRtl ? "rtl" : "ltr"}
                className={cn("space-y-1", {
                  "space-y-2 text-center": collapsed,
                })}
              >
                {menus?.map((item, i) => {
                  if (
                    item.role &&
                    item.role.length > 0 &&
                    !item.role.includes(userRole)
                  ) {
                    return null; // Hide the menu item if user role is not in item.role
                  }

                  return (
                    <li key={`menu_key_${i}`} onClick={handleMenuClick}>
                      {!item.child && !item.isHeader && (
                        <SingleMenuItem
                          item={item}
                          collapsed={collapsed}
                          trans={trans}
                        />
                      )}

                      {item.isHeader && !item.child && !collapsed && (
                        <MenuLabel item={item} trans={trans} />
                      )}

                      {item.child && (
                        <>
                          <SubMenuHandler
                            item={item}
                            toggleSubmenu={() => toggleSubmenu(i)}
                            index={i}
                            activeSubmenu={activeSubmenu}
                            collapsed={collapsed}
                            menuTitle={item.title}
                            trans={trans}
                          />
                          {!collapsed && (
                            <NestedSubMenu
                              toggleMultiMenu={toggleMultiMenu}
                              activeMultiMenu={activeMultiMenu}
                              activeSubmenu={activeSubmenu}
                              item={item}
                              index={i}
                              collapsed={collapsed}
                              trans={trans}
                            />
                          )}
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
};

export default PopoverSidebar;
