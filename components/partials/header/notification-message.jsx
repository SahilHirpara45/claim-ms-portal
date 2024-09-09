"use client";
import React, { useContext, useEffect, useState } from "react";
import { Bell } from "@/components/svg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { getNotificationAction, getUnReadNotificationAction } from "../../../action/notificationAction/notification-action";
import { useQuery } from "@tanstack/react-query";
import { SocketContext } from "../../scoket/SocketConnection";
import { useRouter } from "next/navigation";
import { toast as reToast } from "react-hot-toast";

const NotificationMessage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { socket } = useContext(SocketContext);
  const {
    data: notificationData,
    error: notificationError,
    isLoading: notiLoading,
    refetch,
  } = useQuery({
    queryKey: ["NotificationData"],
    queryFn: () => getUnReadNotificationAction(session.jwt),
    enabled: !!session?.jwt, // Only run the query if the token is available
  });


  const [isNotificationReceived, setIsNotificationReceived] = useState(false);


  const customJsx = (messageInfo) => {
    reToast((t) => (
      <span className="space-x-4 w-full flex justify-between gap-1">
        {messageInfo}
        <Button
          size="sm"
          color="destructive"
          onClick={() => {
            reToast.dismiss(t.id);
            setIsNotificationReceived(false);
          }}
        >
          Dismiss
        </Button>
      </span>
    ), { duration: Infinity });
  };


  useEffect(() => {
    const handleNotification = (data) => {

      const audio = new Audio("/sound/notify-sound.mp3");
      audio.play();
      customJsx(data?.message);
      refetch();
      setIsNotificationReceived(true);
      // setTimeout(() => setIsNotificationReceived(false), 9000);

    };

    socket.on("notification", handleNotification);
    socket.on("job-card:delayed", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
      socket.off("job-card:delayed", handleNotification);
    };
  }, [socket]);

  //

  const handleReadAllNotification = () => {

    socket.emit("notification:read-all", {}, (data) => {
      //console.log("read all noti :-", data)
    });
    refetch();

  }

  const notificationMoveRouteHnadler = (jobCardId) => {
    if (jobCardId) {
      router.push(`/jobcard-list/view_jobcard/${jobCardId}`);
    }

  }
  const handleReadNotification = (notificationId, jobcardId) => {

    socket.emit("notification:read", {
      notificationIds: [notificationId]
    }, (data) => {
      if (data) {
        let data2 = JSON.parse(data);
        if (data2.success) {
          notificationMoveRouteHnadler(jobcardId);
        }

      }
    });
    refetch();
  }

  const timeAgo = (timestamp) => {
    const currentTime = new Date();
    const notificationTime = new Date(timestamp);
    const timeDifference = currentTime - notificationTime;
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    }
    const minutes = Math.floor(timeDifference / (1000 * 60));
    if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    }
    return "Just now";
  };

  const totalNotificationUnRead = notificationData?.data?.filter(item => !item?.read)?.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`${isNotificationReceived ? "animate-bounce" : "relative md:h-9 md:w-9 h-8 w-8 transition-transform duration-300 hover:scale-110 hover:bg-default-100 dark:hover:bg-default-200 data-[state=open]:bg-default-100 dark:data-[state=open]:bg-default-200 hover:text-primary text-default-500 dark:text-default-800 rounded-full"}`}

        >
          <Bell className={`${isNotificationReceived ? "text-red-600 h-8 w-8" : "h-5 w-5 "}`} />
          {totalNotificationUnRead > 0 && (
            <Badge className="w-4 h-4 p-0 text-xs font-medium items-center justify-center absolute left-[calc(100%-18px)] bottom-[calc(100%-16px)] ring-2 ring-primary-foreground">
              {totalNotificationUnRead}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-[999] mx-4 lg:w-[412px] p-0 rounded-lg shadow-lg">
        <DropdownMenuLabel className="w-full h-full bg-cover bg-no-repeat p-4 flex items-center bg-primary rounded-t-lg">
          <span className="text-base font-semibold text-white flex-1">
            Notification
          </span>
          <span onClick={() => {
            handleReadAllNotification()
          }} className="text-xs font-medium text-white flex-0 cursor-pointer hover:underline hover:decoration-default-100 dark:decoration-default-900">
            Mark all as read
          </span>
        </DropdownMenuLabel>
        <div className="h-[300px] xl:h-[350px]">
          <ScrollArea className="h-full">
            {notiLoading && <p>Loading notifications...</p>}
            {notificationError && <p>Error loading notifications.</p>}
            {notificationData?.data.length === 0 && (
              <p className="flex justify-center items-center mt-10 font-bold">
                No notifications
              </p>
            )}
            {notificationData?.data.map((item, index) => (
              <DropdownMenuItem
                key={`inbox-${index}`}
                onClick={() => handleReadNotification(item._id, item.jobCardId)}
                className="flex gap-9 py-2 px-4 cursor-pointer transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <div className="flex-1 flex items-center gap-2">
                  {/* <Avatar className="h-10 w-10 rounded">
                    <AvatarImage src={item.avatar.src} />
                    <AvatarFallback>SN</AvatarFallback>
                  </Avatar> */}
                  <div className="w-full">
                    <div className="text-sm font-medium text-default-900 mb-[2px] whitespace-nowrap">
                      {item.type}
                    </div>
                    <div className="text-xs text-default-900 max-w-[200px] lg:max-w-full w-full">
                      {item.message}
                    </div>
                  </div>
                </div>
                <div className={cn("text-xs font-medium text-default-900 whitespace-nowrap", { "text-default-600": !item.unreadmessage })}>
                  {timeAgo(item.createdAt)}
                </div>
                {/* <div
                  className={cn("w-2 h-2 rounded-full mr-2", {
                    "bg-primary": !item.unreadmessage,
                  })}
                ></div> */}
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        </div>
        <DropdownMenuSeparator />
        <div className="m-4 mt-5">
          <Button asChild type="text" className="w-full transition-colors duration-200 hover:bg-primary hover:text-white">
            <Link href="/dashboard">View All</Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationMessage;
