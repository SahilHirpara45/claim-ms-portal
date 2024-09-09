"use client";
import React, { useContext, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn, isLocationMatch, translate, getDynamicPath } from "@/lib/utils";
import * as Tooltip from "@radix-ui/react-tooltip";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SocketContext } from "../../../scoket/SocketConnection";
import { useSession } from "next-auth/react";
import { getNotificationAction, getUnReadNotificationAction } from "../../../../action/notificationAction/notification-action";

const SingleMenuItem = ({ item, collapsed, trans }) => {
  // const queryClient = useQueryClient();
  const { badge, href, title, icon: IconComponent } = item;
  const pathname = usePathname();
  const locationName = getDynamicPath(pathname);
  const isActive = isLocationMatch(href, locationName) ||
    (title === 'Job Cards' && (
      pathname === '/jobcard-list' ||
      pathname === '/job-card/create' ||
      pathname.startsWith('/job-card/update_Jobcard/')
    )) || (title === 'Quotations' && (
      pathname === '/quotations-list' ||
      pathname.startsWith('/quotations')
    ));


  // const { data: selectedRecordId } = useQuery({
  //   queryKey: 'selectedRecord',
  //   queryFn: () => queryClient.getQueryData('selectedRecord'),
  //   // You can provide other options here as needed
  // });
  // console.log('Selected Record ID:', selectedRecordId);  


  ///



  const { data: session } = useSession();
  const { socket } = useContext(SocketContext);

  const [totalTask, setTotalTask] = useState(0)

  const handleTaskCount = () => {
    socket.emit("my-task:count", {}, (data) => {
      let newData = JSON.parse(data);
      setTotalTask(newData?.totalTask);
    });
  };

  useEffect(() => {
    handleTaskCount();

    const handleNotification = () => {
      handleTaskCount();
    };

    const handleTaskUpdate = () => {
      handleTaskCount();
    };

    socket.on("notification", handleNotification);
    socket.on("task-updated", handleTaskUpdate);

    return () => {
      socket.off("notification", handleNotification);
      socket.off("task-updated", handleTaskUpdate);
    };
  }, [socket]);



  return (
    <Link href={href} >
      {collapsed ? (
        <div>
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <span
                  className={cn(
                    "h-12 w-12 mx-auto rounded-md transition-all duration-300 inline-flex flex-col items-center justify-center relative",
                    {
                      "bg-primary text-primary-foreground data-[state=delayed-open]:bg-primary": isActive,
                      "text-default-600 data-[state=delayed-open]:bg-primary-100 data-[state=delayed-open]:text-primary": !isActive,
                    }
                  )}
                >
                  <IconComponent className="w-6 h-6" />
                </span>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="right"
                  className="bg-primary text-primary-foreground data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-violet11 select-none rounded-[4px] px-[15px] py-[10px] text-[15px] leading-none shadow-sm will-change-[transform,opacity]"
                  sideOffset={5}
                >
                  {translate(title, trans)}
                  <Tooltip.Arrow className="fill-primary" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>
      ) : (
        <div
          className={cn(
            "flex gap-3 text-default-700 text-sm capitalize px-[10px] font-medium py-3 rounded cursor-pointer hover:bg-primary hover:text-primary-foreground",
            {
              "bg-primary text-primary-foreground": isActive,
            }
          )}
        >
          <span className="flex-grow-0">
            <IconComponent className="w-5 h-5" />
          </span>
          <div className="text-box flex-grow">{translate(title, trans)}</div>
          {title && title === "My Task" && totalTask > 0 && (
            <Badge
              color="destructive"
              className="w-5 h-5 p-0 items-center justify-center ml-6"
            >
              {totalTask}
            </Badge>
          )}
        </div>
      )}
    </Link>
  );
};

export default SingleMenuItem;
