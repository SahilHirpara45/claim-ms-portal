"use client";
import { useSession, signOut, getSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import AvtarImg from "../../../public/images/avatar/avatar-4.jpg";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getUserMeAction } from "@/action/auth-action";
import { useQuery } from "@tanstack/react-query";

const ProfileInfo = () => {
  // console.log(session, "data");
  const { data: session, status } = useSession();
  const router = useRouter();

  const {
    data: userData,
    error: userError,
    isLoading: userLoading,
  } = useQuery({
    queryKey: ["userMe"],
    queryFn: () => getUserMeAction(session.jwt),
    enabled: !!session?.jwt, // Only run the query if the token is available
  });

  const companyName = userData?.data?.userId?.companyName;
  const role = userData?.data?.userId?.role;
  const avatar = userData?.data?.userId?.avatar;
  const userEmail = userData?.data?.userId?.email;


  const getRedirectPathProfile = () => {
    if (status === "authenticated" && session) {
      switch (session.role) {
        case "superAdmin":
          return "/company-profile";
        case "company":
          return "/company-profile";
        case "employee":
          return "/employee-profile";
        default:
          return "/";
      }
    }
    return "/";
  };

  const getRedirectPathSettings = () => {
    if (status === "authenticated" && session) {
      switch (session.role) {
        case "superAdmin":
          return "/user-profile/settings";
        case "company":
          return "/company-profile/settings";
        case "employee":
          return "/employee-profile/settings";
        default:
          return "/";
      }
    }
    return "/";
  };

  const redirectPath = getRedirectPathProfile();
  const redirectSettingPath = getRedirectPathSettings();

  // const handleLogout = async () => {
  //   try {
  //     await signOut({ callbackUrl: "/" });
  //     localStorage.removeItem("token");
  //     router.push("/");
  //   } catch (error) {
  //     console.error("Error during logout:", error);
  //   }
  // };

  const handleLogout = async () => {
    try {
      signOut({ redirect: false });
      // localStorage.removeItem("token");
      toast.success("Logout Successful");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // console.log(session?.userAvatar, "session");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className=" cursor-pointer">
        <div className=" flex items-center  ">
          {session?.userAvatar ? (
            <Image
              src={avatar}
              alt={avatar ?? ""}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <Image
              src={AvtarImg}
              alt={""}
              width={40}
              height={40}
              className="rounded-full"
            />
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-0" align="end">
        <DropdownMenuLabel className="flex gap-2 items-center mb-1 p-3">
          {session?.user?.image && (
            <Image
              src={session?.user?.image}
              alt={session?.user?.name ?? ""}
              width={36}
              height={36}
              className="rounded-full"
            />
          )}
          <div className="flex flex-col gap-1 ">
            <div className="text-sm font-medium text-default-800 capitalize flex gap-2">
              {session?.userFirstName && session?.userLastName
                ? `${session.userFirstName} ${session.userLastName}`
                : companyName || "-"}

              <Badge
                variant="outline"
                color={"success"}
                className="capitalize  text-xm text-success font-medium m-auto"
              >
                {session?.role || "-"}
              </Badge>
            </div>

            {/* <div className="text-xs text-default-600 hover:text-primary">
              Role : {session?.role || "-"}
            </div> */}

            <Link
              href=""
              className="text-xs text-default-600 hover:text-primary"
            >
              {userEmail ?? "-"}
            </Link>
          </div>
        </DropdownMenuLabel>
        {role !== "superAdmin" && (
          <>
            <DropdownMenuSeparator className="dark:bg-background" />
            <DropdownMenuGroup>
              {[
                {
                  name: "profile",
                  icon: "heroicons:user",
                  href: redirectPath,
                },
                {
                  name: "Settings",
                  icon: "heroicons:paper-airplane",
                  // href: "/user-profile/settings",
                  href: redirectSettingPath,
                },
              ].map((item, index) => (
                <Link
                  href={item.href}
                  key={`info-menu-${index}`}
                  className="cursor-pointer"
                >
                  <DropdownMenuItem className="flex items-center gap-2 text-sm font-medium text-default-600 capitalize px-3 py-1.5 dark:hover:bg-background cursor-pointer">
                    <Icon icon={item.icon} className="w-4 h-4" />
                    {item.name}
                  </DropdownMenuItem>
                </Link>
              ))}
            </DropdownMenuGroup>
          </>
        )}

        <DropdownMenuSeparator className="mb-0 dark:bg-background" />
        <DropdownMenuItem
          onClick={() => handleLogout()}
          className="flex items-center gap-2 text-sm font-medium text-default-600 capitalize my-1 px-3 dark:hover:bg-background cursor-pointer"
        >
          <Icon icon="heroicons:power" className="w-4 h-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default ProfileInfo;
