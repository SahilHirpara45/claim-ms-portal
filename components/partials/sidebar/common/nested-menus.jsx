"use client";
import React, { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import MultiMenuHandler from "./multi-menu-handler";
import MultiNestedMenu from "./multi-nested-menu";
import SubMenuItem from "./sub-menu-item";
import { usePathname } from "next/navigation";
import { isLocationMatch, cn, getDynamicPath } from "@/lib/utils";
import { getUserMeAction } from "@/action/auth-action";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

const NestedSubMenu = ({
  activeSubmenu,
  item,
  index,
  activeMultiMenu,
  toggleMultiMenu,
  title,
  trans,
}) => {


  const pathname = usePathname();
  const locationName = getDynamicPath(pathname);
  const { data: session } = useSession();

  const {
    data: userData,
    error: userError,
    isLoading: userLoading,
  } = useQuery({
    queryKey: ["userMee"],
    queryFn: () => getUserMeAction(session.jwt),
    enabled: !!session?.jwt, // Only run the query if the token is available
  });



  const designation = userData?.data?.userId?.designation;

  // Filter child items based on the condition
  // const filteredChildren = item.child?.filter(subItem => {
  //   if (item.title === "My Task" && designation === "Technician") {
  //     return !["New Claims", "New Quotations"].includes(subItem.title);
  //   }
  //   return true;
  // });

  const filteredChildren = item.child?.filter(subItem => {
    if (item.title === "My Task" && designation === "Technician") {
      return !["New Claims", "New Quotations"].includes(subItem.title);
    } else if (item.title === "My Task" && designation === "Surveyor") {
      return subItem.title !== "New Claims";
    }
    return true;
  });

  return (
    <Collapsible open={activeSubmenu === index}>
      <CollapsibleContent className="CollapsibleContent">
        <ul className="sub-menu  space-y-4 relative before:absolute before:left-4 before:top-0  before:h-[calc(100%-5px)]  before:w-[3px] before:bg-primary/10 before:rounded">
          {filteredChildren?.map((subItem, j) => (
            <li
              className={cn(
                "block pl-9 first:pt-4 last:pb-4 relative before:absolute first:before:top-4 before:top-0 before:left-4 before:w-[3px]",
                {
                  "before:bg-primary first:before:h-[calc(100%-16px)] before:h-full":
                    isLocationMatch(subItem.href, locationName),
                  " ": activeSubmenu === index,
                }
              )}
              key={`sub_menu_${j}`}
            >
              {subItem?.multi_menu ? (
                <div>
                  <MultiMenuHandler
                    subItem={subItem}
                    subIndex={j}
                    activeMultiMenu={activeMultiMenu}
                    toggleMultiMenu={toggleMultiMenu}
                    trans={trans}
                  />
                  <MultiNestedMenu
                    subItem={subItem}
                    subIndex={j}
                    activeMultiMenu={activeMultiMenu}
                    trans={trans}
                  />
                </div>
              ) : (
                <SubMenuItem subItem={subItem} subIndex={j} trans={trans} />
              )}
            </li>
          ))}
          {/* {item.child?.map((subItem, j) => (
            <li
              className={cn(
                "block pl-9   first:pt-4 last:pb-4  relative before:absolute first:before:top-4 before:top-0 before:left-4  before:w-[3px]",
                {
                  "before:bg-primary first:before:h-[calc(100%-16px)]  before:h-full":
                    isLocationMatch(subItem.href, locationName),
                  " ": activeSubmenu === index,
                }
              )}
              key={`sub_menu_${j}`}
            >
              {subItem?.multi_menu ? (
                <div>
                  <MultiMenuHandler
                    subItem={subItem}
                    subIndex={j}
                    activeMultiMenu={activeMultiMenu}
                    toggleMultiMenu={toggleMultiMenu}
                    trans={trans}
                  />
                  <MultiNestedMenu
                    subItem={subItem}
                    subIndex={j}
                    activeMultiMenu={activeMultiMenu}
                    trans={trans}
                  />
                </div>
              ) : (
                <SubMenuItem subItem={subItem} subIndex={j} trans={trans} />
              )}
            </li>
          ))} */}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default NestedSubMenu;
